import type { Lang } from '@/i18n/tipos'
import type { Role, Tarea } from '@/data/tipos'
import { dato, tr } from '@/i18n'
import { campo } from '@/lib/texto'
import { COMENTARIOS_MESA } from '@/data/mesa'
import { DOCUMENTOS, MESA_TESIS, PROYECTOS } from '@/data/proyecto'
import { persona } from '@/data/personas'
import { AUDITORIA, INTENTOS_BLOQUEADOS_HOY, INVITACIONES_ESTUDIANTE, PLANES, PLAN_ACTUAL, SOLICITUDES_PROFESOR } from '@/data/gestion'
import { TOTALES_PLATAFORMA, UNIVERSIDADES } from '@/data/universidades'
import { dia, diasDesdeHoy, fechaCorta } from '@/lib/fechas'

export interface Mensaje {
  id: string
  de: 'yo' | 'asistente'
  texto: string
  /** Acción colateral ya ejecutada (p. ej. tareas creadas). */
  nota?: string
}

export const CHIPS_POR_ROL: Record<Role, string[]> = {
  estudiante: ['asist.chip.est1', 'asist.chip.est2', 'asist.chip.est3', 'asist.chip.est4'],
  profesor: ['asist.chip.prof1', 'asist.chip.prof2', 'asist.chip.prof3', 'asist.chip.prof4'],
  universidad: ['asist.chip.uni1', 'asist.chip.uni2', 'asist.chip.uni3', 'asist.chip.uni4'],
  super: ['asist.chip.sup1', 'asist.chip.sup2', 'asist.chip.sup3', 'asist.chip.sup4'],
  colaborador: ['asist.chip.col1', 'asist.chip.col2', 'asist.chip.col3', 'asist.chip.col4'],
}

export function saludoInicial(rol: Role, lang: Lang) {
  return tr(`asist.hola.${rol}`, lang)
}

/** Tareas que el asistente crea a partir de un texto. */
export function tareasSugeridas(lang: Lang, responsableId: string): Tarea[] {
  const base = [
    {
      es: 'Redactar la sección de validación del instrumento',
      en: 'Draft the instrument validation section',
      d: 3,
    },
    { es: 'Pedir la base de 120 casos a la Dra. Whitfield', en: 'Request the 120-case dataset from Dr. Whitfield', d: 5 },
    { es: 'Revisar el muestreo estratificado con el Dr. Ortega', en: 'Review the stratified sampling with Dr. Ortega', d: 8 },
  ]
  return base.map((b, i) => ({
    id: `t-ia-${Date.now()}-${i}`,
    tituloEs: b.es,
    tituloEn: b.en,
    estado: 'por-hacer' as const,
    responsableId,
    vence: dia(b.d, 12),
    proyectoId: 'pr-tesis',
    prioridad: (i === 0 ? 'alta' : 'media') as Tarea['prioridad'],
    creadaPorAsistente: true,
  }))
}

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export interface Respuesta {
  texto: string
  crearTareas?: boolean
}

/** Respuestas por palabras clave sobre los datos REALES del mock. */
export function responder(pregunta: string, rol: Role, lang: Lang): Respuesta {
  const q = normalizar(pregunta)
  const tiene = (...claves: string[]) => claves.some((k) => q.includes(normalizar(k)))
  const es = lang === 'es'

  // Nunca dice el monto de la propuesta.
  if (tiene('cuanto cuesta', 'precio de la propuesta', 'monto', 'inversion', 'presupuesto del proyecto', 'cuanto sale', 'how much', 'price', 'investment', 'cost')) {
    return { texto: tr('asist.resp.montoNo', lang) }
  }

  // Respeto de permisos: documento de otro campus.
  if (tiene('presupuesto interno', 'northwood internal budget', 'presupuesto de northwood')) {
    return { texto: tr('asist.resp.sinPermiso', lang) }
  }
  if (rol === 'colaborador' && tiene('capitulo 2', 'marco teorico', 'chapter 2', 'theoretical')) {
    return { texto: tr('asist.resp.sinPermiso', lang) }
  }

  // Resumen de los comentarios de la mesa.
  if (tiene('resumi los comentarios', 'resumen de los comentarios', 'comentarios de la mesa', 'summarise the methodology', 'summarize the methodology', 'round table comments', 'comentarios de la mesa de metodologia')) {
    const cs = COMENTARIOS_MESA[MESA_TESIS]
    const abiertos = cs.filter((c) => !c.resuelto)
    const lineas = abiertos.map(
      (c) => `· ${persona(c.autorId).nombre}: ${campo(c, 'texto', lang).split('.')[0]}.`,
    )
    return {
      texto: es
        ? `En la mesa "Capítulo 3 — Metodología" hay ${cs.length} comentarios, ${abiertos.length} sin resolver:\n${lineas.join('\n')}\n\nEl punto que bloquea el capítulo es el de la Dra. Whitfield: sin una encuesta de validación sobre 120 casos, el muestreo estratificado no sostiene la inferencia. El Dr. Grant ya respondió que lo quiere resuelto antes del comité de hoy a las 15:00.`
        : `The "Chapter 3 — Methodology" table has ${cs.length} comments, ${abiertos.length} unresolved:\n${lineas.join('\n')}\n\nThe blocking point is Dr. Whitfield’s: without a 120-case validation survey, the stratified sampling does not support the inference. Dr. Grant already replied that he wants it settled before today’s 3:00 pm committee.`,
    }
  }

  // Resumen del capítulo 3.
  if (tiene('capitulo 3', 'chapter 3', 'resumi el capitulo', 'summarise the chapter', 'metodologia de la investigacion')) {
    return {
      texto: es
        ? 'Capítulo 3 — Metodología de la investigación (v5, actualizado hoy 09:40):\n· Diseño mixto secuencial explicativo: fase cualitativa de casos y fase cuantitativa sobre la base de incidentes 2019–2025.\n· Tres unidades de análisis: organismos públicos de infraestructura crítica, universidades con programas de respuesta y operadores privados.\n· Muestreo intencional por máxima variación en lo cualitativo y probabilístico estratificado en lo cuantitativo.\n· Acaba de sumarse una encuesta de validación del instrumento sobre 120 casos, que era lo que faltaba para sostener la inferencia.\nLimitación declarada: depende de registros informados por las propias organizaciones.'
        : 'Chapter 3 — Research methodology (v5, updated today 09:40):\n· Sequential explanatory mixed design: a qualitative case phase and a quantitative phase over the 2019–2025 incident dataset.\n· Three units of analysis: public critical-infrastructure bodies, universities with response programmes and private operators.\n· Purposive maximum-variation sampling in the qualitative phase and stratified probabilistic sampling in the quantitative one.\n· A 120-case instrument validation survey has just been added, which was what the inference needed.\nStated limitation: it relies on records reported by the organisations themselves.',
    }
  }

  // Qué tengo que entregar esta semana.
  if (tiene('entregar esta semana', 'deliver this week', 'que tengo que entregar', 'entregas de la semana')) {
    return {
      texto: es
        ? `Esta semana tenés:\n· Hoy 15:00 — Comité de tesis con las tres universidades, sobre el capítulo 3.\n· Atrasada hace 2 días — "Incorporar la encuesta de validación al capítulo 3".\n· En 2 días — "Enviar el capítulo 3 revisado a los tres directores".\n· En 2 días — Seminario de Derecho digital, aula 4.\nLa atrasada es la que bloquea al resto.`
        : `This week you have:\n· Today 3:00 pm — Thesis committee with the three universities, on chapter 3.\n· Overdue by 2 days — "Add the validation survey to chapter 3".\n· In 2 days — "Send the revised chapter 3 to the three supervisors".\n· In 2 days — Digital law seminar, room 4.\nThe overdue one is what blocks the rest.`,
    }
  }

  // Redacción de correo / devolución.
  if (tiene('redactar un correo', 'draft an email', 'redactar una devolucion', 'devolucion del comite', 'committee feedback', 'correo de bienvenida', 'welcome email', 'ayudame a redactar', 'help me draft', 'seccion de activacion', 'activation section')) {
    return {
      texto: es
        ? 'Te dejo un borrador:\n\n«Estimados Dr. Grant, Dra. Whitfield y Dr. Ortega:\n\nSubí a la mesa redonda la versión v5 del capítulo 3. Incorporé la encuesta de validación del instrumento sobre 120 casos que pidió la Dra. Whitfield y dejé explícito por qué el diseño es secuencial y no convergente, como señaló el Dr. Grant.\n\nLes propongo revisarlo en el comité de hoy a las 15:00. Los comentarios quedan abiertos en la mesa para quien quiera dejar observaciones antes.\n\nGracias,\nAle»\n\nSi querés, lo ajusto en tono más formal o más breve.'
        : 'Here is a draft:\n\n“Dear Dr. Grant, Dr. Whitfield and Dr. Ortega,\n\nI uploaded version v5 of chapter 3 to the round table. I added the 120-case instrument validation survey Dr. Whitfield asked for and made explicit why the design is sequential rather than convergent, as Dr. Grant pointed out.\n\nI suggest we review it in today’s 3:00 pm committee. Comments stay open in the table for anyone who wants to add observations beforehand.\n\nThank you,\nAle”\n\nIf you like, I can make it more formal or shorter.',
    }
  }

  // Sugerir tareas.
  if (tiene('sugerime tareas', 'suggest tasks', 'tareas a partir', 'tasks from this text', 'crear las tareas')) {
    return {
      texto: es
        ? 'A partir de ese texto, las próximas tres tareas son: redactar la sección de validación del instrumento (en 3 días), pedirle la base de 120 casos a la Dra. Whitfield (en 5 días) y revisar el muestreo estratificado con el Dr. Ortega (en 8 días).'
        : 'From that text, the next three tasks are: draft the instrument validation section (in 3 days), request the 120-case dataset from Dr. Whitfield (in 5 days) and review the stratified sampling with Dr. Ortega (in 8 days).',
      crearTareas: true,
    }
  }

  // Profesor: doctorandos con entregas pendientes / comentarios sin resolver.
  if (tiene('doctorandos', 'candidates', 'entregas pendientes', 'pending deliverables')) {
    return {
      texto: es
        ? 'De tus tres doctorandos, Ale Hernández es la única con una entrega atrasada: "Incorporar la encuesta de validación al capítulo 3", vencida hace 2 días. Tenés además tu propia tarea "Leer el borrador del capítulo 3 de Ale" con vencimiento mañana, y la devolución del comité en 5 días.'
        : 'Of your three candidates, Ale Hernández is the only one with an overdue deliverable: "Add the validation survey to chapter 3", 2 days late. You also have your own task "Read Ale’s chapter 3 draft" due tomorrow, and the committee feedback in 5 days.',
    }
  }
  if (tiene('sin resolver', 'unresolved')) {
    const abiertos = COMENTARIOS_MESA[MESA_TESIS].filter((c) => !c.resuelto)
    return {
      texto: es
        ? `Quedan ${abiertos.length} comentarios sin resolver en la mesa del capítulo 3: el de la Dra. Whitfield sobre el muestreo, el del Dr. Ortega sobre protocolos vinculantes y el tuyo sobre el diseño secuencial.`
        : `There are ${abiertos.length} unresolved comments in the chapter 3 table: Dr. Whitfield’s on sampling, Dr. Ortega’s on binding protocols and your own on the sequential design.`,
    }
  }

  // Universidad: invitaciones vencidas, profesores pendientes, suscripción.
  if (tiene('invitaciones vencieron', 'invitaciones vencidas', 'invitations expired', 'expired invitations')) {
    const vencidas = INVITACIONES_ESTUDIANTE.filter((i) => i.estado === 'vencida')
    const canceladas = INVITACIONES_ESTUDIANTE.filter((i) => i.estado === 'cancelada')
    return {
      texto: es
        ? `Venció ${vencidas.length} invitación: la de ${vencidas[0]?.nombre}, enviada hace 16 días con enlace de un solo uso. Hay además ${canceladas.length} cancelada (${canceladas[0]?.nombre}). Las podés reenviar desde Invitaciones, pestaña de estudiantes y colaboradores.`
        : `${vencidas.length} invitation expired: ${vencidas[0]?.nombre}’s, sent 16 days ago with a single-use link. There is also ${canceladas.length} cancelled one (${canceladas[0]?.nombre}). You can resend them from Invitations, students and collaborators tab.`,
    }
  }
  if (tiene('esperan aprobacion', 'awaiting approval', 'profesores pendientes', 'faculty awaiting')) {
    const p = SOLICITUDES_PROFESOR.filter((s) => s.estado === 'pendiente')
    return {
      texto: es
        ? `Hay ${p.length} profesores esperando aprobación en Northwood State:\n${p.map((x) => `· ${x.nombre} — ${dato(x.facultad, lang)} — vence en ${x.venceEnDias} días`).join('\n')}\nSe aprueban o rechazan desde Invitaciones, pestaña de profesores.`
        : `${p.length} faculty members are awaiting approval at Northwood State:\n${p.map((x) => `· ${x.nombre} — ${dato(x.facultad, lang)} — expires in ${x.venceEnDias} days`).join('\n')}\nThey are approved or rejected from Invitations, faculty tab.`,
    }
  }
  if (tiene('suscripcion del campus', 'campus subscription', 'como esta la suscripcion')) {
    const plan = PLANES.find((p) => p.id === PLAN_ACTUAL)
    return {
      texto: es
        ? `El campus está en el plan ${plan?.nombreEs} anual, activo. La próxima factura cae en 18 días y el aviso por correo ya salió. Los precios de los planes del mock son ilustrativos.`
        : `The campus is on the annual ${plan?.nombreEn} plan, active. The next invoice is due in 18 days and the email notice has already gone out. The mock plan prices are illustrative.`,
    }
  }

  // Súper usuario: suscripciones vencidas, accesos bloqueados, usuarios activos, prueba.
  if (tiene('suscripcion vencida', 'suscripciones vencidas', 'expired subscription')) {
    const vencidas = UNIVERSIDADES.filter((u) => u.estado === 'vencida')
    const susp = UNIVERSIDADES.filter((u) => u.estado === 'suspendida')
    return {
      texto: es
        ? `${vencidas.length} universidad con la suscripción vencida: ${vencidas.map((u) => u.nombre).join(', ')} (aviso enviado hace 2 días). Y ${susp.length} suspendida por falta de pago: ${susp.map((u) => u.nombre).join(', ')}.`
        : `${vencidas.length} university with an expired subscription: ${vencidas.map((u) => u.nombre).join(', ')} (notice sent 2 days ago). And ${susp.length} suspended for non-payment: ${susp.map((u) => u.nombre).join(', ')}.`,
    }
  }
  if (tiene('bloqueados hoy', 'blocked today', 'intentos de acceso', 'access attempts')) {
    const hoy = AUDITORIA.filter((e) => e.tipo === 'bloqueo' && diasDesdeHoy(e.fecha) === 0)
    return {
      texto: es
        ? `Hubo ${INTENTOS_BLOQUEADOS_HOY} intentos de inicio de sesión bloqueados hoy:\n${hoy.map((e) => `· ${e.ip} — ${e.detalleEs}`).join('\n')}\nEl límite de intentos está configurado en 5 por ventana de 2 minutos.`
        : `There were ${INTENTOS_BLOQUEADOS_HOY} blocked login attempts today:\n${hoy.map((e) => `· ${e.ip} — ${e.detalleEn}`).join('\n')}\nThe attempt limit is set to 5 per 2-minute window.`,
    }
  }
  if (tiene('usuarios activos', 'active users')) {
    return {
      texto: es
        ? `La plataforma tiene ${TOTALES_PLATAFORMA.usuariosActivos.toLocaleString('es-AR')} usuarios activos repartidos en ${TOTALES_PLATAFORMA.universidades} universidades: ${TOTALES_PLATAFORMA.activas} activas, ${TOTALES_PLATAFORMA.prueba} en prueba, ${TOTALES_PLATAFORMA.vencidas} vencida y ${TOTALES_PLATAFORMA.suspendidas} suspendida.`
        : `The platform has ${TOTALES_PLATAFORMA.usuariosActivos.toLocaleString('en-US')} active users across ${TOTALES_PLATAFORMA.universidades} universities: ${TOTALES_PLATAFORMA.activas} active, ${TOTALES_PLATAFORMA.prueba} on trial, ${TOTALES_PLATAFORMA.vencidas} expired and ${TOTALES_PLATAFORMA.suspendidas} suspended.`,
    }
  }
  if (tiene('en prueba', 'on trial')) {
    const pr = UNIVERSIDADES.filter((u) => u.estado === 'prueba')
    return {
      texto: es
        ? `${pr.length} universidades en periodo de prueba: ${pr.map((u) => `${u.nombre} (${u.usuariosActivos} usuarios)`).join(' y ')}.`
        : `${pr.length} universities on trial: ${pr.map((u) => `${u.nombre} (${u.usuariosActivos} users)`).join(' and ')}.`,
    }
  }

  // Colaborador.
  if (tiene('anexo tecnico', 'technical annex', 'protocolos')) {
    const d = DOCUMENTOS.find((x) => x.id === 'd-protocolos')!
    return {
      texto: es
        ? `"${d.nombreEs}" (v1, ${fechaCorta(d.actualizado, lang)}): inventario de protocolos clasificados por tiempo de activación y nivel de criticidad. El protocolo de nivel 1 exige notificación al comité en menos de 30 minutos. Falta cerrar la sección de activación, que es tu tarea con vencimiento en 7 días.`
        : `"${d.nombreEn}" (v1, ${fechaCorta(d.actualizado, lang)}): an inventory of protocols classified by activation time and criticality level. The level 1 protocol requires committee notification within 30 minutes. The activation section still needs closing, which is your task due in 7 days.`,
    }
  }
  if (tiene('me invitaron', 'invited to', 'a que proyectos')) {
    const p = PROYECTOS.filter((x) => x.miembros.includes('p-rivas'))
    return {
      texto: es
        ? `Te invitaron a ${p.length} proyectos: ${p.map((x) => campo(x, 'nombre', lang)).join(' y ')}. Dentro de ellos ves solo lo que se compartió en el espacio: la mesa del capítulo 3 con permiso de lectura y el anexo técnico con permiso de edición.`
        : `You were invited to ${p.length} projects: ${p.map((x) => campo(x, 'nombre', lang)).join(' and ')}. Inside them you only see what was shared in the space: the chapter 3 table with read permission and the technical annex with edit permission.`,
    }
  }

  return { texto: tr('asist.resp.noSe', lang) }
}
