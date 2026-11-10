/**
 * FUENTE ÚNICA de los montos de la propuesta comercial.
 * Prohibido hardcodear estos montos en cualquier otro archivo.
 * Los precios de los planes de suscripción del mock (src/data/gestion.ts)
 * son otra cosa: van rotulados "Precios ilustrativos de planes".
 */
const FASE_1 = 16000
const FASE_2 = 14000
const FASE_3 = 10000
const DESCUENTO = 0.15

const mitad = (n: number) => n / 2
const conDescuento = (n: number) => Math.round(n * (1 - DESCUENTO))

export const MONTOS = {
  moneda: 'USD',
  descuento: DESCUENTO,
  descuentoPct: Math.round(DESCUENTO * 100),
  fase1: {
    total: FASE_1,
    mitad: mitad(FASE_1),
    conDescuento: conDescuento(FASE_1),
    ahorro: FASE_1 - conDescuento(FASE_1),
    semanas: '~12',
  },
  fase2: {
    total: FASE_2,
    mitad: mitad(FASE_2),
    conDescuento: conDescuento(FASE_2),
    semanas: '~10',
  },
  fase3: {
    total: FASE_3,
    mitad: mitad(FASE_3),
    conDescuento: conDescuento(FASE_3),
    semanas: '~8 a 10',
  },
  extension: {
    total: FASE_2 + FASE_3,
    conDescuento: conDescuento(FASE_2) + conDescuento(FASE_3),
  },
  totalProyecto: FASE_1 + FASE_2 + FASE_3,
  mantenimientoMensual: 97,
} as const

export function usd(n: number) {
  return `USD ${n.toLocaleString('en-US')}`
}

/** Los 13 módulos de la Fase 1 y su destino en la demo. */
export interface ModuloPropuesta {
  n: number
  claveNombre: string
  claveResumen: string
  clavesBullets: string[]
  destino: { rol: 'super' | 'universidad' | 'profesor' | 'estudiante' | 'colaborador'; modo: 'app' | 'campus'; ruta: string }
}

export const MODULOS: ModuloPropuesta[] = [
  { n: 1, claveNombre: 'prop.mod.01.nombre', claveResumen: 'prop.mod.01.resumen', clavesBullets: ['prop.mod.01.b1', 'prop.mod.01.b2', 'prop.mod.01.b3', 'prop.mod.01.b4'], destino: { rol: 'super', modo: 'app', ruta: '/plataforma/universidades' } },
  { n: 2, claveNombre: 'prop.mod.02.nombre', claveResumen: 'prop.mod.02.resumen', clavesBullets: ['prop.mod.02.b1', 'prop.mod.02.b2', 'prop.mod.02.b3', 'prop.mod.02.b4'], destino: { rol: 'super', modo: 'app', ruta: '/plataforma/roles' } },
  { n: 3, claveNombre: 'prop.mod.03.nombre', claveResumen: 'prop.mod.03.resumen', clavesBullets: ['prop.mod.03.b1', 'prop.mod.03.b2', 'prop.mod.03.b3', 'prop.mod.03.b4'], destino: { rol: 'universidad', modo: 'app', ruta: '/universidad/campus-editor' } },
  { n: 4, claveNombre: 'prop.mod.04.nombre', claveResumen: 'prop.mod.04.resumen', clavesBullets: ['prop.mod.04.b1', 'prop.mod.04.b2', 'prop.mod.04.b3', 'prop.mod.04.b4'], destino: { rol: 'universidad', modo: 'app', ruta: '/universidad/invitaciones?tab=profesores' } },
  { n: 5, claveNombre: 'prop.mod.05.nombre', claveResumen: 'prop.mod.05.resumen', clavesBullets: ['prop.mod.05.b1', 'prop.mod.05.b2', 'prop.mod.05.b3', 'prop.mod.05.b4'], destino: { rol: 'universidad', modo: 'app', ruta: '/universidad/invitaciones?tab=estudiantes' } },
  { n: 6, claveNombre: 'prop.mod.06.nombre', claveResumen: 'prop.mod.06.resumen', clavesBullets: ['prop.mod.06.b1', 'prop.mod.06.b2', 'prop.mod.06.b3', 'prop.mod.06.b4'], destino: { rol: 'estudiante', modo: 'app', ruta: '/workplace' } },
  { n: 7, claveNombre: 'prop.mod.07.nombre', claveResumen: 'prop.mod.07.resumen', clavesBullets: ['prop.mod.07.b1', 'prop.mod.07.b2', 'prop.mod.07.b3', 'prop.mod.07.b4'], destino: { rol: 'estudiante', modo: 'app', ruta: '/mesa/tesis-metodologia' } },
  { n: 8, claveNombre: 'prop.mod.08.nombre', claveResumen: 'prop.mod.08.resumen', clavesBullets: ['prop.mod.08.b1', 'prop.mod.08.b2', 'prop.mod.08.b3', 'prop.mod.08.b4'], destino: { rol: 'estudiante', modo: 'app', ruta: '/chat/proyecto-tesis' } },
  { n: 9, claveNombre: 'prop.mod.09.nombre', claveResumen: 'prop.mod.09.resumen', clavesBullets: ['prop.mod.09.b1', 'prop.mod.09.b2', 'prop.mod.09.b3', 'prop.mod.09.b4'], destino: { rol: 'estudiante', modo: 'app', ruta: '/workplace/asistente' } },
  { n: 10, claveNombre: 'prop.mod.10.nombre', claveResumen: 'prop.mod.10.resumen', clavesBullets: ['prop.mod.10.b1', 'prop.mod.10.b2', 'prop.mod.10.b3', 'prop.mod.10.b4'], destino: { rol: 'universidad', modo: 'app', ruta: '/universidad/suscripcion' } },
  { n: 11, claveNombre: 'prop.mod.11.nombre', claveResumen: 'prop.mod.11.resumen', clavesBullets: ['prop.mod.11.b1', 'prop.mod.11.b2', 'prop.mod.11.b3', 'prop.mod.11.b4'], destino: { rol: 'super', modo: 'app', ruta: '/plataforma/panel' } },
  { n: 12, claveNombre: 'prop.mod.12.nombre', claveResumen: 'prop.mod.12.resumen', clavesBullets: ['prop.mod.12.b1', 'prop.mod.12.b2', 'prop.mod.12.b3', 'prop.mod.12.b4'], destino: { rol: 'super', modo: 'app', ruta: '/plataforma/auditoria' } },
  { n: 13, claveNombre: 'prop.mod.13.nombre', claveResumen: 'prop.mod.13.resumen', clavesBullets: ['prop.mod.13.b1', 'prop.mod.13.b2', 'prop.mod.13.b3', 'prop.mod.13.b4'], destino: { rol: 'super', modo: 'app', ruta: '/plataforma/marca' } },
]

/** Fase 2 y Fase 3: SOLO tarjetas bloqueadas. Nunca se construyen sus funciones. */
export const EXTENSION = {
  fase2: {
    semanas: '~10',
    items: ['prop.f2.1', 'prop.f2.2', 'prop.f2.3', 'prop.f2.4', 'prop.f2.5', 'prop.f2.6', 'prop.f2.7'],
  },
  fase3: {
    semanas: '~8 a 10',
    items: ['prop.f3.1', 'prop.f3.2', 'prop.f3.3', 'prop.f3.4', 'prop.f3.5'],
  },
}

export const PASOS_CIRCUITO = [1, 2, 3, 4, 5] as const
export const PASO_DESTACADO = 4
