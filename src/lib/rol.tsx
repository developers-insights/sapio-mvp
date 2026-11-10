import type { Role } from '@/data/tipos'
import type { Lang } from '@/i18n/tipos'
import { tr } from '@/i18n'

/** Cada rol se ve DISTINTO: kicker, saludo y contenido propios. */
export function kickerRol(rol: Role, lang: Lang): string {
  return tr(`wp.kicker.${rol}`, lang)
}

export function saludoRol(rol: Role, lang: Lang): string {
  return tr(`wp.saludo.${rol}`, lang)
}

export function bajadaRol(rol: Role, lang: Lang): string {
  return tr(`wp.bajada.${rol}`, lang)
}
