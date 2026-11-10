import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns'
import { es as dfEs, enUS as dfEn } from 'date-fns/locale'
import type { Lang } from '@/i18n/tipos'

/** "Hoy" SIEMPRE desde las partes locales. Nunca toISOString(). */
export function hoy(): Date {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

export function ahora(): Date {
  return new Date()
}

/** Fecha local en formato YYYY-MM-DD, construida con getFullYear/getMonth/getDate. */
export function claveFecha(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

/** Día relativo a hoy, en local. */
export function dia(offset: number, hora = 0, minuto = 0): Date {
  const b = hoy()
  return new Date(b.getFullYear(), b.getMonth(), b.getDate() + offset, hora, minuto, 0, 0)
}

export function locale(lang: Lang) {
  return lang === 'en' ? dfEn : dfEs
}

export function fmt(d: Date, patron: string, lang: Lang) {
  return format(d, patron, { locale: locale(lang) })
}

export function fechaCorta(d: Date, lang: Lang) {
  return format(d, lang === 'en' ? 'MMM d' : "d 'de' MMM", { locale: locale(lang) })
}

export function fechaLarga(d: Date, lang: Lang) {
  return format(d, lang === 'en' ? 'EEEE, MMMM d' : "EEEE d 'de' MMMM", { locale: locale(lang) })
}

export function horaCorta(d: Date, lang: Lang) {
  return format(d, lang === 'en' ? 'h:mm a' : 'HH:mm', { locale: locale(lang) })
}

/** Diferencia en días calendario (local) entre d y hoy. */
export function diasDesdeHoy(d: Date): number {
  const a = hoy().getTime()
  const b = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return Math.round((b - a) / 86400000)
}

export { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay }
