import type { ComentarioMesa, PermisoMesa, Presencia } from './tipos'
import { P } from './personas'
import { dia } from '@/lib/fechas'
import { MESA_TESIS } from './proyecto'

export interface ParticipanteMesa {
  personaId: string
  permiso: PermisoMesa
  presencia: Presencia
  /** Color del cursor remoto simulado. */
  cursor: string
}

export interface Mesa {
  id: string
  tituloEs: string
  tituloEn: string
  documentoId: string
  proyectoId: string
  participantes: ParticipanteMesa[]
  interuniversitario: boolean
  universidades: string[]
  actualizada: Date
}

export const MESAS: Mesa[] = [
  {
    id: MESA_TESIS,
    tituloEs: 'Capítulo 3 — Metodología de la investigación',
    tituloEn: 'Chapter 3 — Research methodology',
    documentoId: 'd-cap3',
    proyectoId: 'pr-tesis',
    interuniversitario: true,
    universidades: ['u-kestrel', 'u-northwood', 'u-valmira'],
    actualizada: dia(0, 9, 40),
    participantes: [
      { personaId: P.ale, permiso: 'edicion', presencia: 'conectado', cursor: '#527D79' },
      { personaId: P.grant, permiso: 'edicion', presencia: 'conectado', cursor: '#25465C' },
      { personaId: P.whitfield, permiso: 'edicion', presencia: 'conectado', cursor: '#9C5B4E' },
      { personaId: P.ortega, permiso: 'edicion', presencia: 'ausente', cursor: '#8A6B38' },
      { personaId: P.rivas, permiso: 'lectura', presencia: 'ausente', cursor: '#456A66' },
    ],
  },
  {
    id: 'anexo-protocolos',
    tituloEs: 'Anexo técnico — Protocolos de respuesta',
    tituloEn: 'Technical annex — Response protocols',
    documentoId: 'd-protocolos',
    proyectoId: 'pr-auditoria',
    interuniversitario: false,
    universidades: ['u-kestrel'],
    actualizada: dia(-2, 19),
    participantes: [
      { personaId: P.ale, permiso: 'edicion', presencia: 'conectado', cursor: '#527D79' },
      { personaId: P.rivas, permiso: 'edicion', presencia: 'ausente', cursor: '#456A66' },
      { personaId: P.grant, permiso: 'lectura', presencia: 'conectado', cursor: '#25465C' },
    ],
  },
  {
    id: 'marco-teorico',
    tituloEs: 'Capítulo 2 — Marco teórico',
    tituloEn: 'Chapter 2 — Theoretical framework',
    documentoId: 'd-cap2',
    proyectoId: 'pr-tesis',
    interuniversitario: true,
    universidades: ['u-kestrel', 'u-valmira'],
    actualizada: dia(-11, 15),
    participantes: [
      { personaId: P.ale, permiso: 'edicion', presencia: 'conectado', cursor: '#527D79' },
      { personaId: P.ortega, permiso: 'edicion', presencia: 'desconectado', cursor: '#8A6B38' },
    ],
  },
]

export const MESA_POR_ID = Object.fromEntries(MESAS.map((m) => [m.id, m])) as Record<string, Mesa>

/** Contenido del documento de la mesa, bilingüe (se traduce de verdad). */
export const CONTENIDO_MESA: Record<string, { es: string; en: string }> = {
  [MESA_TESIS]: {
    es: `<h2>3. Metodología de la investigación</h2>
<p>Este capítulo presenta el diseño metodológico adoptado para analizar la <strong>gobernanza de la ciberseguridad en contextos de crisis</strong>. La estrategia combina un componente cualitativo de estudio de casos con un componente cuantitativo de análisis de incidentes registrados entre 2019 y 2025.</p>
<h3>3.1 Enfoque y justificación</h3>
<p>Se adopta un diseño mixto secuencial explicativo. La fase cualitativa identifica los mecanismos de decisión durante incidentes críticos; la fase cuantitativa estima en qué medida esos mecanismos se asocian con tiempos de respuesta más cortos.</p>
<h3>3.2 Unidades de análisis</h3>
<ul><li>Organismos públicos con competencia en infraestructura crítica.</li><li>Universidades con programas de respuesta a incidentes.</li><li>Operadores privados de servicios esenciales.</li></ul>
<h3>3.3 Recolección de datos</h3>
<p>La recolección se apoya en tres fuentes: entrevistas semiestructuradas a responsables de respuesta, revisión documental de protocolos publicados y la base de incidentes 2019–2025 depurada para este trabajo.</p>
<p>El muestreo de la fase cualitativa es intencional por criterio de máxima variación. El muestreo de la fase cuantitativa es probabilístico estratificado por sector y tamaño de organización.</p>
<h3>3.4 Validez y limitaciones</h3>
<p>La triangulación entre fuentes reduce el sesgo de autoinforme. La principal limitación es la dependencia de registros declarados por las propias organizaciones.</p>`,
    en: `<h2>3. Research methodology</h2>
<p>This chapter sets out the methodological design adopted to analyse <strong>cybersecurity governance in crisis contexts</strong>. The strategy combines a qualitative case-study component with a quantitative analysis of incidents recorded between 2019 and 2025.</p>
<h3>3.1 Approach and rationale</h3>
<p>A sequential explanatory mixed design is adopted. The qualitative phase identifies decision mechanisms during critical incidents; the quantitative phase estimates how far those mechanisms are associated with shorter response times.</p>
<h3>3.2 Units of analysis</h3>
<ul><li>Public bodies with competence over critical infrastructure.</li><li>Universities running incident-response programmes.</li><li>Private operators of essential services.</li></ul>
<h3>3.3 Data collection</h3>
<p>Collection draws on three sources: semi-structured interviews with response leads, documentary review of published protocols, and the 2019–2025 incident dataset cleaned for this work.</p>
<p>Sampling in the qualitative phase is purposive on a maximum-variation criterion. Sampling in the quantitative phase is probabilistic, stratified by sector and organisation size.</p>
<h3>3.4 Validity and limitations</h3>
<p>Triangulation across sources reduces self-report bias. The main limitation is the reliance on records declared by the organisations themselves.</p>`,
  },
  'anexo-protocolos': {
    es: `<h2>Anexo técnico — Protocolos de respuesta</h2><p>Inventario de protocolos de respuesta a incidentes, clasificados por tiempo de activación y nivel de criticidad.</p><h3>A.1 Activación</h3><p>El protocolo de nivel 1 exige notificación al comité en menos de 30 minutos.</p>`,
    en: `<h2>Technical annex — Response protocols</h2><p>Inventory of incident-response protocols, classified by activation time and criticality level.</p><h3>A.1 Activation</h3><p>The level 1 protocol requires committee notification within 30 minutes.</p>`,
  },
  'marco-teorico': {
    es: `<h2>2. Marco teórico</h2><p>La literatura sobre gobernanza de riesgos distingue tres tradiciones que este trabajo pone en diálogo.</p>`,
    en: `<h2>2. Theoretical framework</h2><p>The risk-governance literature distinguishes three traditions that this work brings into dialogue.</p>`,
  },
}

/**
 * Comentarios anclados a fragmentos del texto, visibles para TODOS.
 * El de la Dra. Whitfield es el que el Dr. Grant responde: Ale ve los dos.
 */
export const COMENTARIOS_MESA: Record<string, ComentarioMesa[]> = {
  [MESA_TESIS]: [
    {
      id: 'c-whitfield',
      autorId: P.whitfield,
      fecha: dia(0, 9, 12),
      fragmentoEs: 'muestreo probabilístico estratificado por sector',
      fragmentoEn: 'probabilistic, stratified by sector',
      textoEs:
        'Sin una encuesta de validación del instrumento, la metodología queda débil: el estrato por sector no alcanza para sostener la inferencia. Propongo sumar una validación con 120 casos antes de cerrar el capítulo.',
      textoEn:
        'Without a validation survey for the instrument, the methodology stays weak: stratifying by sector is not enough to support the inference. I suggest adding a validation round with 120 cases before closing the chapter.',
      resuelto: false,
      respuestas: [
        {
          id: 'c-whitfield-r1',
          autorId: P.grant,
          fecha: dia(0, 9, 26),
          textoEs:
            'De acuerdo, Sarah. Ale: incorporá la encuesta en esta versión y la vemos en el comité de hoy. Prefiero resolverlo acá y no en la videollamada.',
          textoEn:
            'Agreed, Sarah. Ale: add the survey in this version and we will look at it in today’s committee. I would rather settle it here than in the call.',
        },
        {
          id: 'c-whitfield-r2',
          autorId: P.ale,
          fecha: dia(0, 9, 38),
          textoEs: 'Lo tomo. Ya creé la tarea y apunto a tenerlo para el comité.',
          textoEn: 'On it. I already created the task and I am aiming to have it for the committee.',
        },
      ],
    },
    {
      id: 'c-ortega',
      autorId: P.ortega,
      fecha: dia(-1, 18, 4),
      fragmentoEs: 'revisión documental de protocolos publicados',
      fragmentoEn: 'documentary review of published protocols',
      textoEs:
        'En el caso europeo conviene distinguir protocolos vinculantes de recomendaciones. Te paso dos referencias de Valmira.',
      textoEn:
        'For the European case it is worth separating binding protocols from recommendations. I will send you two references from Valmira.',
      resuelto: false,
      respuestas: [],
    },
    {
      id: 'c-rivas',
      autorId: P.rivas,
      fecha: dia(-1, 12, 40),
      fragmentoEs: 'base de incidentes 2019–2025',
      fragmentoEn: '2019–2025 incident dataset',
      textoEs:
        'La base tiene 14 registros duplicados por doble reporte. Los marqué en el anexo técnico.',
      textoEn: 'The dataset has 14 duplicate records from double reporting. I flagged them in the technical annex.',
      resuelto: true,
      respuestas: [
        {
          id: 'c-rivas-r1',
          autorId: P.ale,
          fecha: dia(-1, 13, 10),
          textoEs: 'Gracias Tomás, ya quedaron fuera del conteo.',
          textoEn: 'Thanks Tomás, they are already out of the count.',
        },
      ],
    },
    {
      id: 'c-grant',
      autorId: P.grant,
      fecha: dia(-2, 10, 15),
      fragmentoEs: 'diseño mixto secuencial explicativo',
      fragmentoEn: 'sequential explanatory mixed design',
      textoEs: 'Dejá explícito por qué secuencial y no convergente. Una línea alcanza.',
      textoEn: 'Make explicit why sequential and not convergent. One line is enough.',
      resuelto: false,
      respuestas: [],
    },
    {
      id: 'c-ale',
      autorId: P.ale,
      fecha: dia(-2, 9, 2),
      fragmentoEs: 'triangulación entre fuentes',
      fragmentoEn: 'Triangulation across sources',
      textoEs: '¿Sumo acá la matriz de triangulación o va como anexo?',
      textoEn: 'Should I add the triangulation matrix here or as an annex?',
      resuelto: true,
      respuestas: [
        {
          id: 'c-ale-r1',
          autorId: P.ortega,
          fecha: dia(-2, 11, 30),
          textoEs: 'Como anexo, el capítulo ya está largo.',
          textoEn: 'As an annex, the chapter is already long.',
        },
      ],
    },
  ],
  'anexo-protocolos': [],
  'marco-teorico': [],
}

/** Versiones de la mesa, con línea de tiempo y restauración. */
export const VERSIONES_MESA = [
  { id: 'v5', etiqueta: 'v5', autorId: P.ale, fecha: dia(0, 9, 40), notaEs: 'Ajustes tras los comentarios de la mesa.', notaEn: 'Adjustments after the round table comments.', actual: true },
  { id: 'v4', etiqueta: 'v4', autorId: P.grant, fecha: dia(-1, 17, 10), notaEs: 'Reordenamiento del marco analítico.', notaEn: 'Analytical framework reordered.', actual: false },
  { id: 'v3', etiqueta: 'v3', autorId: P.ale, fecha: dia(-4, 11, 25), notaEs: 'Primer borrador del diseño mixto.', notaEn: 'First draft of the mixed design.', actual: false },
  { id: 'v2', etiqueta: 'v2', autorId: P.ortega, fecha: dia(-8, 16, 5), notaEs: 'Notas de derecho comparado.', notaEn: 'Comparative law notes.', actual: false },
  { id: 'v1', etiqueta: 'v1', autorId: P.ale, fecha: dia(-14, 10, 0), notaEs: 'Esqueleto del capítulo.', notaEn: 'Chapter outline.', actual: false },
]

/**
 * Guion simulado que corre al entrar a la mesa: aparecen cursores remotos,
 * uno escribe una oración nueva y el otro deja un comentario sobre un fragmento.
 * Nada de esto es tiempo real: ver el DevNotice de la vista.
 */
export const FRASE_EN_VIVO = {
  es: ' Para sostener la inferencia, la fase cuantitativa incorpora una encuesta de validación del instrumento sobre 120 casos.',
  en: ' To support the inference, the quantitative phase incorporates a 120-case validation survey of the instrument.',
}

export const COMENTARIO_EN_VIVO: ComentarioMesa = {
  id: 'c-vivo',
  autorId: P.whitfield,
  fecha: dia(0, 9, 55),
  fragmentoEs: 'encuesta de validación del instrumento sobre 120 casos',
  fragmentoEn: '120-case validation survey of the instrument',
  textoEs: 'Así sí. Con esto la metodología se sostiene; lo doy por saldado de mi lado.',
  textoEn: 'That works. With this the methodology holds up; settled from my side.',
  resuelto: false,
  respuestas: [],
}
