import type { Canal, Mensaje } from './tipos'
import { P } from './personas'
import { dia } from '@/lib/fechas'
import { CANAL_TESIS, PROYECTO_TESIS } from './proyecto'

export const CANALES: Canal[] = [
  {
    id: CANAL_TESIS,
    nombre: '#tesis-ale-hernandez',
    tipo: 'canal',
    descripcionEs: 'Dirección de tesis · 3 universidades',
    descripcionEn: 'Thesis supervision · 3 universities',
    miembros: [P.ale, P.grant, P.whitfield, P.ortega, P.rivas],
    noLeidos: 3,
    proyectoId: PROYECTO_TESIS,
    interuniversitario: true,
  },
  {
    id: 'seminario-derecho',
    nombre: '#seminario-derecho-digital',
    tipo: 'canal',
    descripcionEs: 'Seminario de la facultad de Derecho',
    descripcionEn: 'Law faculty seminar',
    miembros: [P.ale, P.grant, 'p-est-3', 'p-est-7', 'p-prof-1'],
    noLeidos: 0,
    proyectoId: 'pr-seminario',
  },
  {
    id: 'informe-resiliencia',
    nombre: '#informe-resiliencia',
    tipo: 'canal',
    descripcionEs: 'Anexo técnico con el colaborador externo',
    descripcionEn: 'Technical annex with the external collaborator',
    miembros: [P.ale, P.rivas, P.grant],
    noLeidos: 1,
    proyectoId: 'pr-auditoria',
  },
  {
    id: 'd-grant',
    nombre: 'Dr. Michael Grant',
    tipo: 'directo',
    descripcionEs: 'Director principal',
    descripcionEn: 'Lead supervisor',
    miembros: [P.ale, P.grant],
    noLeidos: 0,
  },
  {
    id: 'd-whitfield',
    nombre: 'Dra. Sarah Whitfield',
    tipo: 'directo',
    descripcionEs: 'Codirectora · metodología',
    descripcionEn: 'Co-supervisor · methodology',
    miembros: [P.ale, P.whitfield],
    noLeidos: 2,
  },
  {
    id: 'd-rivas',
    nombre: 'Ing. Tomás Rivas',
    tipo: 'directo',
    descripcionEs: 'Colaborador · ciberseguridad',
    descripcionEn: 'Collaborator · cybersecurity',
    miembros: [P.ale, P.rivas],
    noLeidos: 0,
  },
  {
    id: 'posgrado-northwood',
    nombre: '#posgrado-northwood',
    tipo: 'canal',
    descripcionEs: 'Coordinación de posgrado del campus',
    descripcionEn: 'Campus graduate coordination',
    miembros: [P.laura, P.whitfield, 'p-prof-2', 'p-prof-6'],
    noLeidos: 4,
  },
]

export const CANAL_POR_ID = Object.fromEntries(CANALES.map((c) => [c.id, c])) as Record<string, Canal>

function m(
  id: string,
  canal: string,
  autorId: string,
  fecha: Date,
  textoEs: string,
  textoEn: string,
  adjuntoDocId?: string,
): Mensaje {
  return { id, canal, autorId, fecha, textoEs, textoEn, adjuntoDocId }
}

export const MENSAJES: Mensaje[] = [
  m('m1', CANAL_TESIS, P.grant, dia(-1, 16, 20), 'Leí el borrador. El marco analítico está mejor ordenado que la semana pasada.', 'I read the draft. The analytical framework is better ordered than last week.'),
  m('m2', CANAL_TESIS, P.whitfield, dia(-1, 17, 5), 'Coincido, pero dejé un comentario en la mesa sobre el muestreo. Lo quiero resuelto antes del comité.', 'Agreed, but I left a comment in the round table about sampling. I want it settled before the committee.'),
  m('m3', CANAL_TESIS, P.ale, dia(-1, 17, 22), 'Lo vi. Mañana a primera hora incorporo la encuesta de validación.', 'Saw it. First thing tomorrow I will add the validation survey.'),
  m('m4', CANAL_TESIS, P.ortega, dia(-1, 18, 10), 'Paso dos referencias europeas para la revisión documental.', 'Sending two European references for the documentary review.', 'd-cap2'),
  m('m5', CANAL_TESIS, P.rivas, dia(0, 8, 40), 'Subí el anexo con los duplicados marcados.', 'I uploaded the annex with the duplicates flagged.', 'd-protocolos'),
  m('m6', CANAL_TESIS, P.ale, dia(0, 9, 45), 'Listo: la oración nueva ya está en el capítulo 3 y la Dra. Whitfield la vio en vivo.', 'Done: the new sentence is in chapter 3 and Dr. Whitfield saw it live.', 'd-cap3'),
  m('m7', CANAL_TESIS, P.grant, dia(0, 10, 2), 'Perfecto. Nos vemos a las 15:00 en la mesa, con todo adentro.', 'Perfect. See you at 3pm in the round table, everything in one place.'),
  m('m8', CANAL_TESIS, P.whitfield, dia(0, 10, 11), 'Confirmo. Esta vez nadie se entera tarde de lo que dijo el otro.', 'Confirmed. This time nobody finds out late what the other one said.'),
  m('m9', 'seminario-derecho', P.grant, dia(-2, 11, 0), 'Confirmada el aula 4 para el seminario del jueves.', 'Room 4 confirmed for Thursday’s seminar.'),
  m('m10', 'seminario-derecho', 'p-est-3', dia(-2, 11, 30), '¿Se puede asistir de forma remota?', 'Can we attend remotely?'),
  m('m11', 'seminario-derecho', P.grant, dia(-2, 11, 44), 'Sí, dejo el enlace en el calendario del proyecto.', 'Yes, I will leave the link in the project calendar.'),
  m('m12', 'informe-resiliencia', P.rivas, dia(0, 8, 35), 'El anexo queda en v1. Falta cerrar la sección de activación.', 'The annex stays at v1. The activation section still needs closing.'),
  m('m13', 'informe-resiliencia', P.ale, dia(0, 8, 50), 'Lo revisamos mañana a las 10.', 'We will review it tomorrow at 10.'),
  m('m14', 'd-whitfield', P.whitfield, dia(0, 9, 10), 'Ale, ¿viste mi comentario sobre el muestreo?', 'Ale, did you see my comment on sampling?'),
  m('m15', 'd-whitfield', P.whitfield, dia(0, 9, 11), 'No hace falta que me contestes por correo, respondé en la mesa.', 'No need to email me back, answer in the round table.'),
  m('m16', 'd-grant', P.grant, dia(-3, 9, 0), 'Buen avance esta semana.', 'Good progress this week.'),
  m('m17', 'd-grant', P.ale, dia(-3, 9, 12), 'Gracias. Sigo con el capítulo 3.', 'Thanks. Still on chapter 3.'),
  m('m18', 'd-rivas', P.rivas, dia(-4, 15, 0), 'Te comparto el inventario de protocolos.', 'Sharing the protocol inventory with you.', 'd-protocolos'),
  m('m19', 'posgrado-northwood', P.laura, dia(0, 8, 15), 'Quedan 3 profesores esperando aprobación. Los reviso hoy.', '3 faculty members are still awaiting approval. I will review them today.'),
  m('m20', 'posgrado-northwood', P.whitfield, dia(0, 8, 40), 'Avisame cuando esté aprobado el de Finanzas.', 'Let me know when the Finance one is approved.'),
  m('m21', 'posgrado-northwood', P.laura, dia(0, 9, 5), 'También venció una invitación de estudiantes, la reenvío.', 'A student invitation also expired, I am resending it.'),
  m('m22', 'posgrado-northwood', 'p-prof-2', dia(0, 9, 20), 'Gracias Laura.', 'Thanks Laura.'),
]

/** Mensajes que "llegan en vivo" al abrir un canal (simulados, con guion). */
export const MENSAJES_EN_VIVO: Record<string, Mensaje[]> = {
  [CANAL_TESIS]: [
    m('mv1', CANAL_TESIS, P.ortega, dia(0, 10, 30), 'Acabo de abrir la mesa desde Valmira: veo el comentario de Sarah y la respuesta de Michael.', 'Just opened the round table from Valmira: I can see Sarah’s comment and Michael’s reply.'),
    m('mv2', CANAL_TESIS, P.ale, dia(0, 10, 32), 'Eso era exactamente lo que no pasaba antes.', 'That is exactly what did not happen before.'),
  ],
  'informe-resiliencia': [
    m('mv3', 'informe-resiliencia', P.rivas, dia(0, 10, 35), 'Subo la versión con la sección de activación cerrada.', 'Uploading the version with the activation section closed.', 'd-protocolos'),
  ],
}
