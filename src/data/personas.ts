import type { Persona, Role } from './tipos'
import { UNIVERSIDADES, UNI_POR_ID } from './universidades'

/** Paleta de avatares: solo colores de marca (nunca fotos de personas). */
export const COLORES_AVATAR = ['#25465C', '#527D79', '#101D2B', '#8A6B38', '#456A66', '#1D3245']

export function iniciales(nombre: string) {
  const limpio = nombre.replace(/^(Dr\.|Dra\.|Ing\.|Lic\.|Mg\.)\s*/i, '').trim()
  const partes = limpio.split(/\s+/)
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase()
}

function hashColor(semilla: string) {
  let h = 0
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) >>> 0
  return COLORES_AVATAR[h % COLORES_AVATAR.length]
}

function p(
  id: string,
  nombre: string,
  email: string,
  rol: Role,
  cargoEs: string,
  cargoEn: string,
  universidadId: string,
  departamento: string,
  presencia: Persona['presencia'] = 'desconectado',
): Persona {
  return {
    id,
    nombre,
    iniciales: iniciales(nombre),
    email,
    rol,
    cargoEs,
    cargoEn,
    universidadId,
    departamento,
    presencia,
    color: hashColor(id),
  }
}

/** Protagonistas del caso de Ale. */
export const P = {
  ale: 'p-ale',
  grant: 'p-grant',
  whitfield: 'p-whitfield',
  ortega: 'p-ortega',
  rivas: 'p-rivas',
  laura: 'p-laura',
  super: 'p-super',
} as const

const PRINCIPALES: Persona[] = [
  p(
    P.super,
    'Ale Hernández',
    'ale@sapio.example',
    'super',
    'Súper usuario · Sapio',
    'Super user · Sapio',
    'u-kestrel',
    'Plataforma',
    'conectado',
  ),
  p(
    P.ale,
    'Ale Hernández',
    'ale.hernandez@kestrelbay.sapio.example',
    'estudiante',
    'Doctoranda en Derecho · programa interuniversitario',
    'Law PhD candidate · inter-university programme',
    'u-kestrel',
    'Derecho',
    'conectado',
  ),
  p(
    P.grant,
    'Dr. Michael Grant',
    'm.grant@kestrelbay.sapio.example',
    'profesor',
    'Director de tesis · Derecho',
    'Thesis supervisor · Law',
    'u-kestrel',
    'Derecho',
    'conectado',
  ),
  p(
    P.whitfield,
    'Dra. Sarah Whitfield',
    's.whitfield@northwood.sapio.example',
    'profesor',
    'Codirectora · metodología cuantitativa',
    'Co-supervisor · quantitative methodology',
    'u-northwood',
    'Salud Pública',
    'conectado',
  ),
  p(
    P.ortega,
    'Dr. Javier Ortega',
    'j.ortega@valmira.sapio.example',
    'profesor',
    'Codirector · derecho comparado',
    'Co-supervisor · comparative law',
    'u-valmira',
    'Derecho',
    'ausente',
  ),
  p(
    P.rivas,
    'Ing. Tomás Rivas',
    't.rivas@externo.sapio.example',
    'colaborador',
    'Especialista en ciberseguridad',
    'Cybersecurity specialist',
    'u-kestrel',
    'Ingeniería',
    'ausente',
  ),
  p(
    P.laura,
    'Laura Bennett',
    'l.bennett@northwood.sapio.example',
    'universidad',
    'Coordinadora de posgrado',
    'Graduate programmes coordinator',
    'u-northwood',
    'Administración',
    'conectado',
  ),
]

// ── Plantel adicional: profesores por departamento, estudiantes y colaboradores
const DEPARTAMENTOS = ['Derecho', 'Administración', 'Finanzas', 'Ingeniería']
/** El cargo en inglés no puede llevar el departamento en castellano. */
const DEPARTAMENTO_EN: Record<string, string> = {
  Derecho: 'Law',
  Administración: 'Administration',
  Finanzas: 'Finance',
  Ingeniería: 'Engineering',
}

const NOMBRES_PROF = [
  'Dra. Helen Vasquez', 'Dr. Peter Kowalski', 'Dra. Camila Duarte', 'Dr. Owen Brightwater',
  'Dra. Ingrid Solberg', 'Dr. Rafael Montalvo', 'Dra. Noor Haddad', 'Dr. Liam O’Shea',
  'Dra. Beatriz Carvalho', 'Dr. Samuel Okonkwo', 'Dra. Pilar Arrieta', 'Dr. Theo Lindqvist',
  'Dra. Marta Guevara', 'Dr. Nathan Whitmore', 'Dra. Yuki Tanabe', 'Dr. Andrés Quiroga',
  'Dra. Claire Fontaine', 'Dr. Hugo Belmonte', 'Dra. Rosa Calderón', 'Dr. Felix Harlow',
  'Dra. Verónica Sandoval', 'Dr. Erik Thorsen', 'Dra. Lucía Peralta', 'Dr. Jonas Keller',
]
const NOMBRES_EST = [
  'Mariana Oliveira', 'Daniel Keane', 'Sofía Berenguer', 'Thomas Ashby', 'Valeria Ledesma',
  'Hugo Navarro', 'Emma Caldwell', 'Joaquín Vidal', 'Priya Raghunathan', 'Lucas Fernández',
  'Nina Hollis', 'Mateo Aguirre', 'Chloe Barrington', 'Ignacio Salgado', 'Amara Nwosu',
  'Pablo Esquivel', 'Greta Lindholm', 'Renata Vieira', 'Oliver Kent', 'Camila Figueroa',
  'Sebastián Rueda', 'Hannah Pryce', 'Diego Urzúa', 'Elena Marchetti', 'Noah Fairbanks',
  'Antonia Ríos', 'Martín Cabrera', 'Freya Nilsen',
]
const NOMBRES_COL = [
  'Ing. Paula Benítez', 'Lic. Marco Dellucci', 'Ing. Sara Lindgren', 'Lic. Óscar Tamayo',
  'Ing. Rebecca Doyle', 'Lic. Nadia Farouk',
]

const activas = UNIVERSIDADES.filter((u) => u.estado !== 'suspendida')

/**
 * Northwood State es el campus que se muestra en la demo (es el tenant de la
 * administradora), así que concentra una parte del plantel: 2 de cada 5.
 */
function uniDe(i: number) {
  if (i % 5 === 0 || i % 5 === 2) return UNI_POR_ID['u-northwood']
  return activas[i % activas.length]
}

function correo(nombre: string, slug: string) {
  const limpio = nombre
    .replace(/^(Dr\.|Dra\.|Ing\.|Lic\.|Mg\.)\s*/i, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .toLowerCase()
  const [n, a = 'x'] = limpio.split(/\s+/)
  return `${n[0]}.${a}@${slug}.sapio.example`
}

const GENERADAS: Persona[] = [
  ...NOMBRES_PROF.map((nombre, i) => {
    const uni = uniDe(i)
    const dep = DEPARTAMENTOS[i % DEPARTAMENTOS.length]
    return p(
      `p-prof-${i + 1}`,
      nombre,
      correo(nombre, uni.slug),
      'profesor',
      `Profesor/a titular · ${dep}`,
      `Faculty member · ${DEPARTAMENTO_EN[dep] ?? dep}`,
      uni.id,
      dep,
      i % 5 === 0 ? 'conectado' : i % 3 === 0 ? 'ausente' : 'desconectado',
    )
  }),
  ...NOMBRES_EST.map((nombre, i) => {
    const uni = uniDe(i + 1)
    const dep = DEPARTAMENTOS[(i + 1) % DEPARTAMENTOS.length]
    return p(
      `p-est-${i + 1}`,
      nombre,
      correo(nombre, uni.slug),
      'estudiante',
      `Estudiante de posgrado · ${dep}`,
      `Graduate student · ${DEPARTAMENTO_EN[dep] ?? dep}`,
      uni.id,
      dep,
      i % 4 === 0 ? 'conectado' : 'desconectado',
    )
  }),
  ...NOMBRES_COL.map((nombre, i) => {
    const uni = uniDe(i + 2)
    return p(
      `p-col-${i + 1}`,
      nombre,
      correo(nombre, 'externo'),
      'colaborador',
      'Colaborador externo · por invitación',
      'External collaborator · by invitation',
      uni.id,
      'Externos',
      i % 2 === 0 ? 'ausente' : 'desconectado',
    )
  }),
]

export const PERSONAS: Persona[] = [...PRINCIPALES, ...GENERADAS]

export const PERSONA_POR_ID = Object.fromEntries(PERSONAS.map((x) => [x.id, x])) as Record<
  string,
  Persona
>

export function persona(id: string): Persona {
  return PERSONA_POR_ID[id] ?? PERSONA_POR_ID[P.ale]
}

/** El usuario logueado según el rol activo. */
export const USUARIO_POR_ROL: Record<Role, string> = {
  super: P.super,
  universidad: P.laura,
  profesor: P.grant,
  estudiante: P.ale,
  colaborador: P.rivas,
}

export function miembrosDe(universidadId: string) {
  return PERSONAS.filter((x) => x.universidadId === universidadId && x.rol !== 'super')
}
