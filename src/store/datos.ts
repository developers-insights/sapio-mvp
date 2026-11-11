import { create } from 'zustand'
import type { EstadoSolicitud, EstadoTarea, InvitacionEstudiante, SolicitudProfesor, Tarea, Universidad } from '@/data/tipos'
import { TAREAS_BASE } from '@/data/proyecto'
import { SOLICITUDES_PROFESOR, INVITACIONES_ESTUDIANTE, CSV_ESTUDIANTES, CSV_NOMBRE_ARCHIVO, PLAN_ACTUAL } from '@/data/gestion'
import type { FilaCSV } from '@/data/tipos'
import { COMENTARIOS_MESA } from '@/data/mesa'
import type { ComentarioMesa } from '@/data/tipos'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { dia } from '@/lib/fechas'

export interface ConfigCampus {
  nombre: string
  lemaEs: string
  lemaEn: string
  colorPrimario: string
  colorAcento: string
  iniciales: string
  secciones: { institucional: boolean; facultades: boolean; programas: boolean; contacto: boolean }
  textoInstitucionalEs: string
  textoInstitucionalEn: string
  emailContacto: string
  telefono: string
  publicado: boolean
  cambiosSinPublicar: boolean
}

interface DatosState {
  tareas: Tarea[]
  solicitudes: SolicitudProfesor[]
  invitaciones: InvitacionEstudiante[]
  csv: FilaCSV[]
  csvNombre: string
  csvImportado: boolean
  comentarios: Record<string, ComentarioMesa[]>
  notificacionesLeidas: string[]
  campus: ConfigCampus
  planActual: string
  cicloPlan: 'mensual' | 'anual'
  usoIA: number
  documentoMesaEditado: Record<string, string>
  versionRestaurada: string | null
  participantesExtra: Record<string, Array<{ personaId: string; permiso: 'lectura' | 'edicion' }>>
  /** Universidades dadas de alta en la demo. Viven acá para que su ficha
   *  también se pueda abrir: si solo estuvieran en la pantalla del listado,
   *  el botón "Ver" de la recién creada caería en el estado vacío. */
  universidadesNuevas: Universidad[]

  agregarTareas: (nuevas: Tarea[]) => void
  cambiarEstadoTarea: (id: string, estado: EstadoTarea) => void
  resolverSolicitud: (id: string, estado: EstadoSolicitud, motivo?: string) => void
  reenviarInvitacion: (id: string) => void
  cancelarInvitacion: (id: string) => void
  agregarInvitacion: (inv: InvitacionEstudiante) => void
  importarCSV: (filas: FilaCSV[], nombre: string) => void
  marcarCSVImportado: () => void
  agregarComentario: (mesaId: string, c: ComentarioMesa) => void
  responderComentario: (mesaId: string, comentarioId: string, texto: string, autorId: string) => void
  alternarResuelto: (mesaId: string, comentarioId: string) => void
  marcarLeida: (id: string) => void
  marcarTodasLeidas: (ids: string[]) => void
  setCampus: (parcial: Partial<ConfigCampus>) => void
  publicarCampus: () => void
  setPlan: (id: string, ciclo: 'mensual' | 'anual') => void
  consumirIA: (n?: number) => void
  setDocumentoMesa: (mesaId: string, html: string) => void
  restaurarVersion: (id: string) => void
  invitarAMesa: (mesaId: string, personaId: string, permiso: 'lectura' | 'edicion') => void
  altaUniversidad: (u: Universidad) => void
  reiniciar: () => void
  /** Siembra el estado para una previsualización desde la Propuesta. */
  sembrar: (modulo: number) => void
}

const uni = UNI_POR_ID[UNI_ADMIN]

const CAMPUS_INICIAL: ConfigCampus = {
  nombre: uni.nombre,
  lemaEs: 'Investigación pública con impacto medible.',
  lemaEn: 'Public research with measurable impact.',
  colorPrimario: uni.colorPrimario,
  colorAcento: uni.colorAcento,
  iniciales: uni.iniciales,
  secciones: { institucional: true, facultades: true, programas: true, contacto: true },
  textoInstitucionalEs:
    'Northwood State University forma investigadores en derecho, administración, finanzas, ingeniería y salud pública. Su programa de posgrado trabaja en red con universidades de tres continentes.',
  textoInstitucionalEn:
    'Northwood State University trains researchers in law, administration, finance, engineering and public health. Its graduate programme works in a network with universities across three continents.',
  emailContacto: 'posgrado@northwood.sapio.example',
  telefono: '+1 555 0100',
  publicado: true,
  cambiosSinPublicar: false,
}

const ESTADO_INICIAL = {
  tareas: TAREAS_BASE,
  solicitudes: SOLICITUDES_PROFESOR,
  invitaciones: INVITACIONES_ESTUDIANTE,
  csv: CSV_ESTUDIANTES,
  csvNombre: CSV_NOMBRE_ARCHIVO,
  csvImportado: false,
  comentarios: COMENTARIOS_MESA,
  notificacionesLeidas: [] as string[],
  campus: CAMPUS_INICIAL,
  planActual: PLAN_ACTUAL,
  cicloPlan: 'anual' as const,
  usoIA: 412,
  documentoMesaEditado: {} as Record<string, string>,
  versionRestaurada: null as string | null,
  participantesExtra: {} as Record<string, Array<{ personaId: string; permiso: 'lectura' | 'edicion' }>>,
  universidadesNuevas: [] as Universidad[],
}

export const useDatos = create<DatosState>((set, get) => ({
  ...ESTADO_INICIAL,

  agregarTareas: (nuevas) => set({ tareas: [...nuevas, ...get().tareas] }),
  cambiarEstadoTarea: (id, estado) =>
    set({ tareas: get().tareas.map((t) => (t.id === id ? { ...t, estado } : t)) }),

  resolverSolicitud: (id, estado, motivo) =>
    set({
      solicitudes: get().solicitudes.map((s) =>
        s.id === id
          ? { ...s, estado, motivoRechazoEs: motivo ?? s.motivoRechazoEs, motivoRechazoEn: motivo ?? s.motivoRechazoEn }
          : s,
      ),
    }),

  reenviarInvitacion: (id) =>
    set({
      invitaciones: get().invitaciones.map((i) =>
        i.id === id ? { ...i, estado: 'enviada', enviada: dia(0, 9), venceEnDias: 6 } : i,
      ),
    }),
  cancelarInvitacion: (id) =>
    set({ invitaciones: get().invitaciones.map((i) => (i.id === id ? { ...i, estado: 'cancelada' } : i)) }),
  agregarInvitacion: (inv) => set({ invitaciones: [inv, ...get().invitaciones] }),

  importarCSV: (filas, nombre) => set({ csv: filas, csvNombre: nombre, csvImportado: false }),
  marcarCSVImportado: () => {
    const validas = get().csv.filter((f) => !f.error)
    set({
      csvImportado: true,
      invitaciones: [
        ...validas.map((f, i) => ({
          id: `i-csv-${f.fila}-${i}`,
          email: f.email,
          nombre: f.nombre,
          rol: (f.rol === 'colaborador' ? 'colaborador' : 'estudiante') as InvitacionEstudiante['rol'],
          grupo: f.grupo,
          estado: 'enviada' as const,
          enviada: dia(0, 9),
          venceEnDias: 6,
        })),
        ...get().invitaciones,
      ],
    })
  },

  agregarComentario: (mesaId, c) =>
    set({ comentarios: { ...get().comentarios, [mesaId]: [c, ...(get().comentarios[mesaId] ?? [])] } }),
  responderComentario: (mesaId, comentarioId, texto, autorId) =>
    set({
      comentarios: {
        ...get().comentarios,
        [mesaId]: (get().comentarios[mesaId] ?? []).map((c) =>
          c.id === comentarioId
            ? {
                ...c,
                respuestas: [
                  ...c.respuestas,
                  { id: `r-${Date.now()}`, autorId, fecha: new Date(), textoEs: texto, textoEn: texto },
                ],
              }
            : c,
        ),
      },
    }),
  alternarResuelto: (mesaId, comentarioId) =>
    set({
      comentarios: {
        ...get().comentarios,
        [mesaId]: (get().comentarios[mesaId] ?? []).map((c) =>
          c.id === comentarioId ? { ...c, resuelto: !c.resuelto } : c,
        ),
      },
    }),

  marcarLeida: (id) =>
    set({ notificacionesLeidas: Array.from(new Set([...get().notificacionesLeidas, id])) }),
  marcarTodasLeidas: (ids) =>
    set({ notificacionesLeidas: Array.from(new Set([...get().notificacionesLeidas, ...ids])) }),

  setCampus: (parcial) => set({ campus: { ...get().campus, ...parcial, cambiosSinPublicar: true } }),
  publicarCampus: () => set({ campus: { ...get().campus, publicado: true, cambiosSinPublicar: false } }),

  setPlan: (id, ciclo) => set({ planActual: id, cicloPlan: ciclo }),
  consumirIA: (n = 1) => set({ usoIA: get().usoIA + n }),

  setDocumentoMesa: (mesaId, html) =>
    set({ documentoMesaEditado: { ...get().documentoMesaEditado, [mesaId]: html } }),
  restaurarVersion: (id) => set({ versionRestaurada: id }),

  invitarAMesa: (mesaId, personaId, permiso) =>
    set({
      participantesExtra: {
        ...get().participantesExtra,
        [mesaId]: [...(get().participantesExtra[mesaId] ?? []), { personaId, permiso }],
      },
    }),

  altaUniversidad: (u) =>
    set({ universidadesNuevas: [u, ...get().universidadesNuevas.filter((x) => x.id !== u.id)] }),

  reiniciar: () => set({ ...ESTADO_INICIAL }),

  sembrar: (modulo) => {
    // Cada previsualización llega a una pantalla POBLADA.
    const s = get()
    switch (modulo) {
      case 4: // invitaciones de profesores: 3 pendientes
        set({ solicitudes: SOLICITUDES_PROFESOR })
        break
      case 5: // CSV ya cargado con 24 filas y 2 con error
        set({ csv: CSV_ESTUDIANTES, csvNombre: CSV_NOMBRE_ARCHIVO, csvImportado: false })
        break
      case 7: // mesa redonda: comentarios base, sin ediciones previas
        set({ comentarios: COMENTARIOS_MESA, documentoMesaEditado: {}, versionRestaurada: null })
        break
      case 9: // asistente con el resumen ya pedido
        set({ usoIA: Math.max(s.usoIA, 412) })
        break
      case 10: // suscripción con próxima factura y aviso
        set({ planActual: PLAN_ACTUAL, cicloPlan: 'anual' })
        break
      case 3: // editor del campus con cambios limpios
        set({ campus: { ...CAMPUS_INICIAL } })
        break
      default:
        break
    }
  },
}))
