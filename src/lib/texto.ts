import type { Lang } from '@/i18n/tipos'

/** Lee el campo bilingüe de un objeto del mock: campo(o,'nombre',lang) → nombreEs | nombreEn */
export function campo(o: object, base: string, lang: Lang): string {
  const registro = o as Record<string, unknown>
  const v = registro[base + (lang === 'en' ? 'En' : 'Es')]
  if (typeof v === 'string') return v
  const fallback = registro[base + 'Es']
  return typeof fallback === 'string' ? fallback : ''
}

export function recortar(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s
}
