/** Contraste WCAG real, calculado desde los hex de la paleta del manual. */
function canal(c: number) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}

export function luminancia(hex: string) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}

export function contraste(a: string, b: string) {
  const la = luminancia(a)
  const lb = luminancia(b)
  const claro = Math.max(la, lb)
  const oscuro = Math.min(la, lb)
  return (claro + 0.05) / (oscuro + 0.05)
}

export function ratio(a: string, b: string) {
  return Math.round(contraste(a, b) * 100) / 100
}

export const PASA_AA = (r: number) => r >= 4.5
export const PASA_AA_GRANDE = (r: number) => r >= 3
