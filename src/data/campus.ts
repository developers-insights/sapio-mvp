/** Programas de posgrado del campus (solo listado: el buscador es Fase 2). */
export interface Programa {
  id: string
  nombreEs: string
  nombreEn: string
  facultad: string
  semestres: number
  modalidad: 'presencial' | 'mixta'
}

export const PROGRAMAS: Programa[] = [
  { id: 'pg-1', nombreEs: 'Doctorado en Derecho y Gobernanza Digital', nombreEn: 'PhD in Law and Digital Governance', facultad: 'Derecho', semestres: 8, modalidad: 'mixta' },
  { id: 'pg-2', nombreEs: 'Maestría en Políticas de Ciberseguridad', nombreEn: 'MSc in Cybersecurity Policy', facultad: 'Salud Pública', semestres: 4, modalidad: 'mixta' },
  { id: 'pg-3', nombreEs: 'Maestría en Administración Pública', nombreEn: 'Master in Public Administration', facultad: 'Administración', semestres: 4, modalidad: 'presencial' },
  { id: 'pg-4', nombreEs: 'Especialización en Riesgo Financiero', nombreEn: 'Specialisation in Financial Risk', facultad: 'Finanzas', semestres: 2, modalidad: 'mixta' },
  { id: 'pg-5', nombreEs: 'Maestría en Infraestructura Crítica', nombreEn: 'MSc in Critical Infrastructure', facultad: 'Ingeniería', semestres: 4, modalidad: 'presencial' },
  { id: 'pg-6', nombreEs: 'Doctorado en Métodos Cuantitativos Aplicados', nombreEn: 'PhD in Applied Quantitative Methods', facultad: 'Salud Pública', semestres: 8, modalidad: 'presencial' },
]
