import type { Dic } from '../tipos'

/**
 * Valores de DATOS del mock que forman un conjunto cerrado y se muestran en
 * pantalla: facultades, departamentos, países, carpetas y grupos. Se traducen
 * con el helper `dato()` para que la versión en inglés no muestre castellano.
 */
export const datos: Dic = {
  // Facultades y departamentos
  'dato.Derecho': { es: 'Derecho', en: 'Law' },
  'dato.Administración': { es: 'Administración', en: 'Administration' },
  'dato.Finanzas': { es: 'Finanzas', en: 'Finance' },
  'dato.Ingeniería': { es: 'Ingeniería', en: 'Engineering' },
  'dato.Ciencias Sociales': { es: 'Ciencias Sociales', en: 'Social Sciences' },
  'dato.Salud Pública': { es: 'Salud Pública', en: 'Public Health' },
  'dato.Filosofía': { es: 'Filosofía', en: 'Philosophy' },
  'dato.Economía': { es: 'Economía', en: 'Economics' },
  'dato.Diseño': { es: 'Diseño', en: 'Design' },
  'dato.Ciencia de Datos': { es: 'Ciencia de Datos', en: 'Data Science' },
  'dato.Comunicación': { es: 'Comunicación', en: 'Communication' },
  'dato.Agronomía': { es: 'Agronomía', en: 'Agronomy' },
  'dato.Humanidades': { es: 'Humanidades', en: 'Humanities' },
  'dato.Medicina': { es: 'Medicina', en: 'Medicine' },
  'dato.Educación': { es: 'Educación', en: 'Education' },
  'dato.Energía': { es: 'Energía', en: 'Energy' },
  'dato.Externos': { es: 'Externos', en: 'External' },
  'dato.Plataforma': { es: 'Plataforma', en: 'Platform' },

  // Países
  'dato.Canadá': { es: 'Canadá', en: 'Canada' },
  'dato.Estados Unidos': { es: 'Estados Unidos', en: 'United States' },
  'dato.España': { es: 'España', en: 'Spain' },
  'dato.Argentina': { es: 'Argentina', en: 'Argentina' },
  'dato.Chile': { es: 'Chile', en: 'Chile' },
  'dato.Reino Unido': { es: 'Reino Unido', en: 'United Kingdom' },
  'dato.Brasil': { es: 'Brasil', en: 'Brazil' },
  'dato.México': { es: 'México', en: 'Mexico' },
  'dato.Noruega': { es: 'Noruega', en: 'Norway' },
  'dato.Colombia': { es: 'Colombia', en: 'Colombia' },

  // Carpetas de documentos
  'dato.Tesis': { es: 'Tesis', en: 'Thesis' },
  'dato.Instrumentos': { es: 'Instrumentos', en: 'Instruments' },
  'dato.Anexos': { es: 'Anexos', en: 'Annexes' },
  'dato.Datos': { es: 'Datos', en: 'Data' },
  'dato.Comité': { es: 'Comité', en: 'Committee' },
  'dato.Northwood · interno': { es: 'Northwood · interno', en: 'Northwood · internal' },

  // Grupos y materias de las invitaciones
  'dato.Posgrado · Derecho': { es: 'Posgrado · Derecho', en: 'Graduate · Law' },
  'dato.Posgrado · Finanzas': { es: 'Posgrado · Finanzas', en: 'Graduate · Finance' },
  'dato.Posgrado · Administración': { es: 'Posgrado · Administración', en: 'Graduate · Administration' },
  'dato.Posgrado · Salud Pública': { es: 'Posgrado · Salud Pública', en: 'Graduate · Public Health' },
  'dato.Posgrado · Ingeniería': { es: 'Posgrado · Ingeniería', en: 'Graduate · Engineering' },
  'dato.Proyecto · Resiliencia': { es: 'Proyecto · Resiliencia', en: 'Project · Resilience' },
  'dato.Proyecto · Datos': { es: 'Proyecto · Datos', en: 'Project · Data' },
}
