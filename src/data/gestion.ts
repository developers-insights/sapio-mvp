import type {
  EventoAuditoria,
  Factura,
  FilaCSV,
  InvitacionEstudiante,
  Notificacion,
  Plan,
  SolicitudProfesor,
} from './tipos'
import { P } from './personas'
import { UNI_ADMIN } from './universidades'
import { dia } from '@/lib/fechas'

/** 3 profesores pendientes de aprobación (edge case visible). */
export const SOLICITUDES_PROFESOR: SolicitudProfesor[] = [
  {
    id: 's-1',
    nombre: 'Dra. Helena Marchetti',
    email: 'h.marchetti@northwood.sapio.example',
    facultad: 'Finanzas',
    areaEs: 'Riesgo financiero y cumplimiento',
    areaEn: 'Financial risk and compliance',
    universidadId: UNI_ADMIN,
    estado: 'pendiente',
    enviada: dia(-1, 9),
    venceEnDias: 6,
    perfil: { grado: 'PhD in Finance', anios: 12, orcid: '0000-0002-1825-0097' },
  },
  {
    id: 's-2',
    nombre: 'Dr. Aaron Whitlock',
    email: 'a.whitlock@northwood.sapio.example',
    facultad: 'Derecho',
    areaEs: 'Derecho administrativo y regulación',
    areaEn: 'Administrative law and regulation',
    universidadId: UNI_ADMIN,
    estado: 'pendiente',
    enviada: dia(-2, 14),
    venceEnDias: 5,
    perfil: { grado: 'JSD', anios: 9, orcid: '0000-0001-5109-3700' },
  },
  {
    id: 's-3',
    nombre: 'Dra. Imani Sato',
    email: 'i.sato@northwood.sapio.example',
    facultad: 'Salud Pública',
    areaEs: 'Métodos cuantitativos aplicados',
    areaEn: 'Applied quantitative methods',
    universidadId: UNI_ADMIN,
    estado: 'pendiente',
    enviada: dia(-3, 11),
    venceEnDias: 4,
    perfil: { grado: 'PhD in Biostatistics', anios: 7, orcid: '0000-0003-4312-8871' },
  },
  {
    id: 's-4',
    nombre: 'Dr. Gregory Palmer',
    email: 'g.palmer@northwood.sapio.example',
    facultad: 'Administración',
    areaEs: 'Gestión pública',
    areaEn: 'Public management',
    universidadId: UNI_ADMIN,
    estado: 'aprobado',
    enviada: dia(-9, 10),
    venceEnDias: 0,
    perfil: { grado: 'PhD in Public Policy', anios: 15, orcid: '0000-0002-7712-4410' },
  },
  {
    id: 's-5',
    nombre: 'Dr. Luis Ferreira',
    email: 'l.ferreira@northwood.sapio.example',
    facultad: 'Ingeniería',
    areaEs: 'Infraestructura crítica',
    areaEn: 'Critical infrastructure',
    universidadId: UNI_ADMIN,
    estado: 'rechazado',
    enviada: dia(-12, 16),
    venceEnDias: 0,
    perfil: { grado: 'MSc', anios: 4, orcid: '—' },
    motivoRechazoEs: 'La credencial presentada no corresponde a un cargo docente del campus.',
    motivoRechazoEn: 'The credential submitted does not match a teaching post at the campus.',
  },
]

/** Invitaciones de estudiantes y colaboradores: 1 vencida y 1 cancelada. */
export const INVITACIONES_ESTUDIANTE: InvitacionEstudiante[] = [
  { id: 'i-1', email: 'm.oliveira@northwood.sapio.example', nombre: 'Mariana Oliveira', rol: 'estudiante', grupo: 'Posgrado · Derecho', estado: 'aceptada', enviada: dia(-8, 10), venceEnDias: 0 },
  { id: 'i-2', email: 'd.keane@northwood.sapio.example', nombre: 'Daniel Keane', rol: 'estudiante', grupo: 'Posgrado · Finanzas', estado: 'enviada', enviada: dia(-2, 9), venceEnDias: 5 },
  { id: 'i-3', email: 's.berenguer@northwood.sapio.example', nombre: 'Sofía Berenguer', rol: 'estudiante', grupo: 'Posgrado · Derecho', estado: 'enviada', enviada: dia(-1, 15), venceEnDias: 6 },
  { id: 'i-4', email: 'p.benitez@externo.sapio.example', nombre: 'Ing. Paula Benítez', rol: 'colaborador', grupo: 'Proyecto · Resiliencia', estado: 'vencida', enviada: dia(-16, 12), venceEnDias: -2 },
  { id: 'i-5', email: 'o.tamayo@externo.sapio.example', nombre: 'Lic. Óscar Tamayo', rol: 'colaborador', grupo: 'Proyecto · Resiliencia', estado: 'cancelada', enviada: dia(-11, 11), venceEnDias: 0 },
  { id: 'i-6', email: 't.ashby@northwood.sapio.example', nombre: 'Thomas Ashby', rol: 'estudiante', grupo: 'Posgrado · Administración', estado: 'aceptada', enviada: dia(-6, 14), venceEnDias: 0 },
  { id: 'i-7', email: 'v.ledesma@northwood.sapio.example', nombre: 'Valeria Ledesma', rol: 'estudiante', grupo: 'Posgrado · Salud Pública', estado: 'enviada', enviada: dia(-3, 8), venceEnDias: 4 },
]

/** CSV ya cargado: 24 filas, 2 con error (email inválido y rol desconocido). */
const CSV_NOMBRES: Array<[string, string, string, string]> = [
  ['Mariana Oliveira', 'm.oliveira@northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Daniel Keane', 'd.keane@northwood.sapio.example', 'estudiante', 'Posgrado · Finanzas'],
  ['Sofía Berenguer', 's.berenguer@northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Thomas Ashby', 't.ashby@northwood.sapio.example', 'estudiante', 'Posgrado · Administración'],
  ['Valeria Ledesma', 'v.ledesma@northwood.sapio.example', 'estudiante', 'Posgrado · Salud Pública'],
  ['Hugo Navarro', 'h.navarro@northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Emma Caldwell', 'e.caldwell@northwood.sapio.example', 'estudiante', 'Posgrado · Finanzas'],
  ['Joaquín Vidal', 'j.vidal(at)northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Priya Raghunathan', 'p.raghunathan@northwood.sapio.example', 'estudiante', 'Posgrado · Ingeniería'],
  ['Lucas Fernández', 'l.fernandez@northwood.sapio.example', 'estudiante', 'Posgrado · Administración'],
  ['Nina Hollis', 'n.hollis@northwood.sapio.example', 'colaborador', 'Proyecto · Resiliencia'],
  ['Mateo Aguirre', 'm.aguirre@northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Chloe Barrington', 'c.barrington@northwood.sapio.example', 'ayudante', 'Posgrado · Finanzas'],
  ['Ignacio Salgado', 'i.salgado@northwood.sapio.example', 'estudiante', 'Posgrado · Ingeniería'],
  ['Amara Nwosu', 'a.nwosu@northwood.sapio.example', 'estudiante', 'Posgrado · Salud Pública'],
  ['Pablo Esquivel', 'p.esquivel@northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Greta Lindholm', 'g.lindholm@northwood.sapio.example', 'colaborador', 'Proyecto · Datos'],
  ['Renata Vieira', 'r.vieira@northwood.sapio.example', 'estudiante', 'Posgrado · Administración'],
  ['Oliver Kent', 'o.kent@northwood.sapio.example', 'estudiante', 'Posgrado · Finanzas'],
  ['Camila Figueroa', 'c.figueroa@northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Sebastián Rueda', 's.rueda@northwood.sapio.example', 'estudiante', 'Posgrado · Ingeniería'],
  ['Hannah Pryce', 'h.pryce@northwood.sapio.example', 'estudiante', 'Posgrado · Salud Pública'],
  ['Diego Urzúa', 'd.urzua@northwood.sapio.example', 'estudiante', 'Posgrado · Derecho'],
  ['Elena Marchetti', 'e.marchetti@northwood.sapio.example', 'colaborador', 'Proyecto · Datos'],
]

const ROLES_CSV_VALIDOS = ['estudiante', 'colaborador']

export const CSV_ESTUDIANTES: FilaCSV[] = CSV_NOMBRES.map(([nombre, email, rol, grupo], i) => {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const rolValido = ROLES_CSV_VALIDOS.includes(rol)
  return {
    fila: i + 2,
    nombre,
    email,
    rol,
    grupo,
    error: !emailValido ? 'email' : !rolValido ? 'rol' : undefined,
  }
})

export const CSV_TOTALES = {
  filas: CSV_ESTUDIANTES.length,
  conError: CSV_ESTUDIANTES.filter((f) => f.error).length,
  validas: CSV_ESTUDIANTES.filter((f) => !f.error).length,
}

export const CSV_NOMBRE_ARCHIVO = 'posgrado-northwood-2026.csv'

/** Precios ILUSTRATIVOS de los planes de suscripción del mock. */
export const PLANES: Plan[] = [
  {
    id: 'plan-campus',
    nombreEs: 'Campus',
    nombreEn: 'Campus',
    precioMensual: 390,
    precioAnual: 3900,
    usuariosIncluidos: 1000,
    limiteIA: 500,
    incluyeEs: ['Página pública del campus', 'Workplace para cada miembro', 'Mesas redondas ilimitadas', 'Soporte por chat'],
    incluyeEn: ['Public campus page', 'Workplace for every member', 'Unlimited round tables', 'Chat support'],
  },
  {
    id: 'plan-posgrado',
    nombreEs: 'Posgrado',
    nombreEn: 'Graduate',
    precioMensual: 890,
    precioAnual: 8900,
    usuariosIncluidos: 5000,
    limiteIA: 2500,
    destacado: true,
    incluyeEs: ['Todo lo del plan Campus', 'Espacios interuniversitarios', 'Asistente de IA ampliado', 'Registro de auditoría exportable'],
    incluyeEn: ['Everything in Campus', 'Inter-university spaces', 'Extended AI assistant', 'Exportable audit log'],
  },
  {
    id: 'plan-institucional',
    nombreEs: 'Institucional',
    nombreEn: 'Institutional',
    precioMensual: 1890,
    precioAnual: 18900,
    usuariosIncluidos: 25000,
    limiteIA: 12000,
    incluyeEs: ['Todo lo del plan Posgrado', 'Subdominio propio', 'Copias de seguridad dedicadas', 'Acompañamiento de implementación'],
    incluyeEn: ['Everything in Graduate', 'Own subdomain', 'Dedicated backups', 'Implementation support'],
  },
]

export const PLAN_ACTUAL = 'plan-posgrado'

export const FACTURAS: Factura[] = [
  { id: 'f-1', numero: 'NS-2026-0041', fecha: dia(-12), monto: 8900, estado: 'pagada', periodoEs: 'Anual · 2026', periodoEn: 'Annual · 2026' },
  { id: 'f-2', numero: 'NS-2025-0038', fecha: dia(-377), monto: 8900, estado: 'pagada', periodoEs: 'Anual · 2025', periodoEn: 'Annual · 2025' },
  { id: 'f-3', numero: 'NS-2026-0052', fecha: dia(18), monto: 8900, estado: 'pendiente', periodoEs: 'Próxima factura', periodoEn: 'Next invoice' },
]

/** 3 intentos de inicio de sesión bloqueados HOY. */
export const AUDITORIA: EventoAuditoria[] = [
  { id: 'a-1', fecha: dia(0, 9, 12), usuarioId: P.whitfield, usuarioNombre: 'Dra. Sarah Whitfield', universidadId: 'u-northwood', accionEs: 'Comentario en mesa redonda', accionEn: 'Round table comment', tipo: 'acceso', resultado: 'ok', ip: '198.51.100.24', detalleEs: 'Mesa "Capítulo 3 — Metodología" · espacio interuniversitario.', detalleEn: 'Round table "Chapter 3 — Methodology" · inter-university space.' },
  { id: 'a-2', fecha: dia(0, 8, 51), usuarioId: '—', usuarioNombre: 'desconocido', universidadId: 'u-northwood', accionEs: 'Intento de inicio de sesión', accionEn: 'Login attempt', tipo: 'bloqueo', resultado: 'bloqueado', ip: '203.0.113.77', detalleEs: 'Límite de intentos superado · 5 fallos en 2 minutos.', detalleEn: 'Attempt limit exceeded · 5 failures in 2 minutes.' },
  { id: 'a-3', fecha: dia(0, 8, 44), usuarioId: '—', usuarioNombre: 'desconocido', universidadId: 'u-valmira', accionEs: 'Intento de inicio de sesión', accionEn: 'Login attempt', tipo: 'bloqueo', resultado: 'bloqueado', ip: '203.0.113.90', detalleEs: 'Contraseña incorrecta · origen fuera de la región habitual.', detalleEn: 'Wrong password · origin outside the usual region.' },
  { id: 'a-4', fecha: dia(0, 7, 58), usuarioId: '—', usuarioNombre: 'desconocido', universidadId: 'u-kestrel', accionEs: 'Intento de inicio de sesión', accionEn: 'Login attempt', tipo: 'bloqueo', resultado: 'bloqueado', ip: '198.51.100.201', detalleEs: 'Credenciales de un usuario dado de baja.', detalleEn: 'Credentials of a deactivated user.' },
  { id: 'a-5', fecha: dia(0, 8, 15), usuarioId: P.laura, usuarioNombre: 'Laura Bennett', universidadId: 'u-northwood', accionEs: 'Reenvío de invitación', accionEn: 'Invitation resent', tipo: 'config', resultado: 'ok', ip: '198.51.100.12', detalleEs: 'Invitación vencida de Ing. Paula Benítez.', detalleEn: 'Expired invitation for Ing. Paula Benítez.' },
  { id: 'a-6', fecha: dia(0, 9, 40), usuarioId: P.ale, usuarioNombre: 'Ale Hernández', universidadId: 'u-kestrel', accionEs: 'Nueva versión de documento', accionEn: 'New document version', tipo: 'config', resultado: 'ok', ip: '198.51.100.31', detalleEs: 'Capítulo 3 — Metodología · v5.', detalleEn: 'Chapter 3 — Methodology · v5.' },
  { id: 'a-7', fecha: dia(-1, 16, 20), usuarioId: P.laura, usuarioNombre: 'Laura Bennett', universidadId: 'u-northwood', accionEs: 'Cambio de rol', accionEn: 'Role change', tipo: 'rol', resultado: 'ok', ip: '198.51.100.12', detalleEs: 'Dr. Gregory Palmer: invitado → profesor.', detalleEn: 'Dr. Gregory Palmer: invited → faculty.' },
  { id: 'a-8', fecha: dia(-1, 11, 5), usuarioId: 'p-prof-2', usuarioNombre: 'Dr. Peter Kowalski', universidadId: 'u-northwood', accionEs: 'Consulta a otro campus', accionEn: 'Cross-campus query', tipo: 'bloqueo', resultado: 'bloqueado', ip: '198.51.100.44', detalleEs: 'Northwood → Valmira · 0 registros · bloqueado por política de acceso por fila.', detalleEn: 'Northwood → Valmira · 0 records · blocked by row-level access policy.' },
  { id: 'a-9', fecha: dia(-2, 10, 30), usuarioId: P.super, usuarioNombre: 'Ale Hernández', universidadId: 'u-portenova', accionEs: 'Suspensión de universidad', accionEn: 'University suspended', tipo: 'config', resultado: 'ok', ip: '198.51.100.3', detalleEs: 'Universidade Porte Nova · falta de pago.', detalleEn: 'Universidade Porte Nova · non-payment.' },
  { id: 'a-10', fecha: dia(-2, 9, 15), usuarioId: P.super, usuarioNombre: 'Ale Hernández', universidadId: 'u-sierralta', accionEs: 'Aviso de vencimiento enviado', accionEn: 'Expiry notice sent', tipo: 'config', resultado: 'ok', ip: '198.51.100.3', detalleEs: 'Universidad Sierralta · suscripción vencida.', detalleEn: 'Universidad Sierralta · subscription expired.' },
  { id: 'a-11', fecha: dia(-3, 14, 2), usuarioId: P.grant, usuarioNombre: 'Dr. Michael Grant', universidadId: 'u-kestrel', accionEs: 'Eliminación de documento', accionEn: 'Document deleted', tipo: 'eliminacion', resultado: 'ok', ip: '198.51.100.88', detalleEs: 'Borrador duplicado del capítulo 2.', detalleEn: 'Duplicate draft of chapter 2.' },
  { id: 'a-12', fecha: dia(-4, 12, 45), usuarioId: P.laura, usuarioNombre: 'Laura Bennett', universidadId: 'u-northwood', accionEs: 'Exportación de registro', accionEn: 'Log export', tipo: 'exportacion', resultado: 'ok', ip: '198.51.100.12', detalleEs: 'CSV de auditoría del campus · 412 filas.', detalleEn: 'Campus audit CSV · 412 rows.' },
  { id: 'a-13', fecha: dia(-5, 9, 10), usuarioId: P.ortega, usuarioNombre: 'Dr. Javier Ortega', universidadId: 'u-valmira', accionEs: 'Acceso a espacio interuniversitario', accionEn: 'Inter-university space access', tipo: 'acceso', resultado: 'ok', ip: '192.0.2.55', detalleEs: 'Invitación explícita al proyecto de tesis.', detalleEn: 'Explicit invitation to the thesis project.' },
  { id: 'a-14', fecha: dia(-6, 17, 25), usuarioId: P.super, usuarioNombre: 'Ale Hernández', universidadId: 'u-brightmoor', accionEs: 'Alta de universidad', accionEn: 'University created', tipo: 'config', resultado: 'ok', ip: '198.51.100.3', detalleEs: 'Brightmoor Polytechnic · periodo de prueba.', detalleEn: 'Brightmoor Polytechnic · trial period.' },
]

export const INTENTOS_BLOQUEADOS_HOY = AUDITORIA.filter(
  (e) => e.tipo === 'bloqueo' && e.resultado === 'bloqueado' && e.fecha >= dia(0) && e.accionEs === 'Intento de inicio de sesión',
).length

export const NOTIFICACIONES: Notificacion[] = [
  { id: 'n-1', fecha: dia(0, 9, 12), tituloEs: 'Nuevo comentario en la mesa redonda', tituloEn: 'New comment in the round table', cuerpoEs: 'La Dra. Whitfield comentó el muestreo del capítulo 3.', cuerpoEn: 'Dr. Whitfield commented on chapter 3 sampling.', tipo: 'mesa', leida: false, ruta: '/mesa/tesis-metodologia', porCorreo: true, paraRoles: ['estudiante', 'profesor', 'colaborador'] },
  { id: 'n-2', fecha: dia(0, 9, 26), tituloEs: 'El Dr. Grant respondió un comentario', tituloEn: 'Dr. Grant replied to a comment', cuerpoEs: 'Respondió el hilo de metodología. Lo ven los tres directores.', cuerpoEn: 'He replied in the methodology thread. All three supervisors can see it.', tipo: 'mesa', leida: false, ruta: '/mesa/tesis-metodologia', porCorreo: true, paraRoles: ['estudiante', 'profesor'] },
  { id: 'n-3', fecha: dia(-2, 18), tituloEs: 'Tarea atrasada', tituloEn: 'Overdue task', cuerpoEs: '"Incorporar la encuesta de validación al capítulo 3" venció hace 2 días.', cuerpoEn: '"Add the validation survey to chapter 3" was due 2 days ago.', tipo: 'tarea', leida: false, ruta: '/workplace/tareas', porCorreo: false, paraRoles: ['estudiante'] },
  { id: 'n-4', fecha: dia(0, 10, 11), tituloEs: '3 mensajes sin leer en #tesis-ale-hernandez', tituloEn: '3 unread messages in #tesis-ale-hernandez', cuerpoEs: 'Conversación del comité de hoy.', cuerpoEn: 'Today’s committee conversation.', tipo: 'chat', leida: false, ruta: '/chat/proyecto-tesis', porCorreo: false, paraRoles: ['estudiante', 'profesor', 'colaborador'] },
  { id: 'n-5', fecha: dia(-1, 9), tituloEs: '3 profesores esperan aprobación', tituloEn: '3 faculty members awaiting approval', cuerpoEs: 'Northwood State University · verificación por invitación.', cuerpoEn: 'Northwood State University · invitation-based verification.', tipo: 'invitacion', leida: false, ruta: '/universidad/invitaciones', porCorreo: true, paraRoles: ['universidad'] },
  { id: 'n-6', fecha: dia(-2, 12), tituloEs: 'Una invitación venció', tituloEn: 'An invitation expired', cuerpoEs: 'Ing. Paula Benítez · enlace de un solo uso vencido.', cuerpoEn: 'Ing. Paula Benítez · single-use link expired.', tipo: 'invitacion', leida: true, ruta: '/universidad/invitaciones', porCorreo: true, paraRoles: ['universidad'] },
  { id: 'n-7', fecha: dia(18), tituloEs: 'Próxima factura de la suscripción', tituloEn: 'Next subscription invoice', cuerpoEs: 'Plan Posgrado · anual. Aviso enviado por correo.', cuerpoEn: 'Graduate plan · annual. Notice sent by email.', tipo: 'suscripcion', leida: true, ruta: '/universidad/suscripcion', porCorreo: true, paraRoles: ['universidad'] },
  { id: 'n-8', fecha: dia(-2, 10, 30), tituloEs: 'Universidad suspendida por falta de pago', tituloEn: 'University suspended for non-payment', cuerpoEs: 'Universidade Porte Nova.', cuerpoEn: 'Universidade Porte Nova.', tipo: 'sistema', leida: false, ruta: '/plataforma/universidades', porCorreo: true, paraRoles: ['super'] },
  { id: 'n-9', fecha: dia(0, 8, 51), tituloEs: '3 intentos de acceso bloqueados hoy', tituloEn: '3 access attempts blocked today', cuerpoEs: 'Límite de intentos de inicio de sesión aplicado.', cuerpoEn: 'Login attempt limit enforced.', tipo: 'sistema', leida: false, ruta: '/plataforma/auditoria', porCorreo: false, paraRoles: ['super'] },
  { id: 'n-10', fecha: dia(-1, 12, 40), tituloEs: 'Ing. Rivas subió el anexo técnico', tituloEn: 'Ing. Rivas uploaded the technical annex', cuerpoEs: 'Protocolos de respuesta · v1.', cuerpoEn: 'Response protocols · v1.', tipo: 'mesa', leida: true, ruta: '/workplace/documentos', porCorreo: false, paraRoles: ['estudiante', 'colaborador', 'profesor'] },
  { id: 'n-11', fecha: dia(0, 15), tituloEs: 'Comité de tesis hoy a las 15:00', tituloEn: 'Thesis committee today at 3:00 pm', cuerpoEs: '3 universidades · mesa redonda del capítulo 3.', cuerpoEn: '3 universities · chapter 3 round table.', tipo: 'tarea', leida: false, ruta: '/workplace/calendario', porCorreo: true, paraRoles: ['estudiante', 'profesor'] },
  { id: 'n-12', fecha: dia(-4, 15), tituloEs: 'Te invitaron al proyecto de tesis', tituloEn: 'You were invited to the thesis project', cuerpoEs: 'Acceso de solo lectura a la mesa y al anexo técnico.', cuerpoEn: 'Read-only access to the round table and the technical annex.', tipo: 'invitacion', leida: true, ruta: '/workplace/proyectos', porCorreo: true, paraRoles: ['colaborador'] },
]
