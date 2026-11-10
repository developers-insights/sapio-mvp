/**
 * Placeholders visuales. Nunca hay fotos de personas en esta demo.
 * Las composiciones son abstractas y editoriales (manual pág. 9):
 * bloques de color con grano sutil. Se reemplazan por fotos reales
 * de arquitectura académica cambiando SOLO este archivo.
 */
export interface Placeholder {
  id: string
  /** Capas de color para la composición editorial. */
  capas: string[]
  altEs: string
  altEn: string
}

export const PLACEHOLDERS: Record<string, Placeholder> = {
  campusPortada: {
    id: 'campus-portada',
    capas: ['#101D2B', '#25465C', '#527D79'],
    altEs: 'Composición abstracta de la portada del campus',
    altEn: 'Abstract composition for the campus cover',
  },
  campusFacultades: {
    id: 'campus-facultades',
    capas: ['#25465C', '#527D79', '#C9A974'],
    altEs: 'Columnas de color que representan las facultades',
    altEn: 'Colour columns representing the faculties',
  },
  campusPrograma: {
    id: 'campus-programa',
    capas: ['#527D79', '#101D2B', '#C9A974'],
    altEs: 'Bloque editorial de programas de posgrado',
    altEn: 'Editorial block for graduate programmes',
  },
  campusContacto: {
    id: 'campus-contacto',
    capas: ['#101D2B', '#1D3245'],
    altEs: 'Bloque editorial de contacto institucional',
    altEn: 'Editorial block for institutional contact',
  },
}

/** Grano sutil en SVG, sin degradados (lo prohíbe el manual). */
export const GRANO_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.055'/%3E%3C/svg%3E\")"
