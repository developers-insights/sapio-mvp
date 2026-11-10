export type Role = 'super' | 'universidad' | 'profesor' | 'estudiante' | 'colaborador'
export type Modo = 'app' | 'campus'

export type EstadoSuscripcion = 'activa' | 'prueba' | 'vencida' | 'suspendida'
export type EstadoInvitacion = 'enviada' | 'aceptada' | 'vencida' | 'cancelada'
export type EstadoSolicitud = 'pendiente' | 'aprobado' | 'rechazado'
export type EstadoTarea = 'por-hacer' | 'en-curso' | 'en-revision' | 'hecha'
export type Presencia = 'conectado' | 'ausente' | 'desconectado'
export type PermisoMesa = 'lectura' | 'edicion'

export interface Universidad {
  id: string
  nombre: string
  slug: string
  pais: string
  ciudad: string
  plan: 'mensual' | 'anual'
  estado: EstadoSuscripcion
  usuariosActivos: number
  iniciales: string
  colorPrimario: string
  colorAcento: string
  idioma: 'es' | 'en'
  zonaHoraria: string
  creada: Date
  facultades: string[]
  verificada: boolean
}

export interface Persona {
  id: string
  nombre: string
  iniciales: string
  email: string
  rol: Role
  cargoEs: string
  cargoEn: string
  universidadId: string
  departamento: string
  presencia: Presencia
  color: string
}

export interface Evento {
  id: string
  tituloEs: string
  tituloEn: string
  inicio: Date
  fin: Date
  lugarEs: string
  lugarEn: string
  participantes: string[]
  interuniversitario?: boolean
  proyectoId?: string
  tipo: 'comite' | 'tutoria' | 'seminario' | 'entrega' | 'interno'
}

export interface Tarea {
  id: string
  tituloEs: string
  tituloEn: string
  estado: EstadoTarea
  responsableId: string
  vence: Date
  proyectoId?: string
  prioridad: 'alta' | 'media' | 'baja'
  descripcionEs?: string
  descripcionEn?: string
  creadaPorAsistente?: boolean
}

export interface Version {
  id: string
  etiqueta: string
  autorId: string
  fecha: Date
  notaEs: string
  notaEn: string
}

export interface Documento {
  id: string
  nombreEs: string
  nombreEn: string
  carpeta: string
  tipo: 'doc' | 'pdf' | 'hoja' | 'dataset'
  tamano: string
  autorId: string
  actualizado: Date
  versiones: Version[]
  mesaId?: string
  restringido?: boolean
}

export interface Proyecto {
  id: string
  nombreEs: string
  nombreEn: string
  descripcionEs: string
  descripcionEn: string
  miembros: string[]
  universidades: string[]
  interuniversitario: boolean
  mesaId?: string
  canalChat?: string
  progreso: number
}

export interface ComentarioMesa {
  id: string
  autorId: string
  fecha: Date
  textoEs: string
  textoEn: string
  fragmentoEs: string
  fragmentoEn: string
  resuelto: boolean
  respuestas: Array<{
    id: string
    autorId: string
    fecha: Date
    textoEs: string
    textoEn: string
  }>
}

export interface Mensaje {
  id: string
  canal: string
  autorId: string
  fecha: Date
  textoEs: string
  textoEn: string
  adjuntoDocId?: string
}

export interface Canal {
  id: string
  nombre: string
  tipo: 'canal' | 'directo'
  descripcionEs: string
  descripcionEn: string
  miembros: string[]
  noLeidos: number
  proyectoId?: string
  interuniversitario?: boolean
}

export interface EventoAuditoria {
  id: string
  fecha: Date
  usuarioId: string
  usuarioNombre: string
  universidadId: string
  accionEs: string
  accionEn: string
  tipo: 'acceso' | 'rol' | 'eliminacion' | 'bloqueo' | 'config' | 'exportacion'
  resultado: 'ok' | 'bloqueado' | 'error'
  ip: string
  detalleEs: string
  detalleEn: string
}

export interface Notificacion {
  id: string
  fecha: Date
  tituloEs: string
  tituloEn: string
  cuerpoEs: string
  cuerpoEn: string
  tipo: 'mesa' | 'tarea' | 'chat' | 'invitacion' | 'sistema' | 'suscripcion'
  leida: boolean
  ruta?: string
  porCorreo: boolean
  paraRoles: Role[]
}

export interface SolicitudProfesor {
  id: string
  nombre: string
  email: string
  facultad: string
  areaEs: string
  areaEn: string
  universidadId: string
  estado: EstadoSolicitud
  enviada: Date
  venceEnDias: number
  perfil: { grado: string; anios: number; orcid: string }
  motivoRechazoEs?: string
  motivoRechazoEn?: string
}

export interface InvitacionEstudiante {
  id: string
  email: string
  nombre: string
  rol: Role
  grupo: string
  estado: EstadoInvitacion
  enviada: Date
  venceEnDias: number
}

export interface FilaCSV {
  fila: number
  nombre: string
  email: string
  rol: string
  grupo: string
  error?: 'email' | 'rol'
}

export interface Plan {
  id: string
  nombreEs: string
  nombreEn: string
  precioMensual: number
  precioAnual: number
  usuariosIncluidos: number
  limiteIA: number
  destacado?: boolean
  incluyeEs: string[]
  incluyeEn: string[]
}

export interface Factura {
  id: string
  numero: string
  fecha: Date
  monto: number
  estado: 'pagada' | 'pendiente' | 'vencida'
  periodoEs: string
  periodoEn: string
}
