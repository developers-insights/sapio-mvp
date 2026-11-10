/**
 * Ubica un fragmento de texto dentro del editor y devuelve sus rectángulos
 * relativos al contenedor. Se usa para dibujar, por encima del documento,
 * los cursores remotos y el resaltado de los comentarios anclados.
 * Todo esto es decoración SIMULADA (ver el DevNotice de la vista).
 */
export interface Rect {
  top: number
  left: number
  width: number
  height: number
}

function nodosDeTexto(raiz: HTMLElement): Text[] {
  const salida: Text[] = []
  const it = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT)
  let n = it.nextNode()
  while (n) {
    if (n.nodeValue && n.nodeValue.trim()) salida.push(n as Text)
    n = it.nextNode()
  }
  return salida
}

/** Busca el fragmento aunque esté partido entre varios nodos de texto. */
export function rangoDeTexto(raiz: HTMLElement, fragmento: string): Range | null {
  if (!fragmento) return null
  const nodos = nodosDeTexto(raiz)
  const plano = nodos.map((n) => n.nodeValue ?? '').join('')
  const normalizado = plano.replace(/\s+/g, ' ')
  const buscado = fragmento.replace(/\s+/g, ' ').trim()
  const indice = normalizado.toLowerCase().indexOf(buscado.toLowerCase())
  if (indice < 0) return null

  // Mapeamos el índice del texto normalizado al nodo/offset real.
  let visto = 0
  let inicioNodo: Text | null = null
  let inicioOff = 0
  let finNodo: Text | null = null
  let finOff = 0
  const fin = indice + buscado.length

  for (const nodo of nodos) {
    const valor = nodo.nodeValue ?? ''
    for (let i = 0; i < valor.length; i++) {
      if (visto === indice && !inicioNodo) {
        inicioNodo = nodo
        inicioOff = i
      }
      visto++
      if (visto === fin) {
        finNodo = nodo
        finOff = i + 1
      }
    }
    if (finNodo) break
  }
  if (!inicioNodo) return null
  if (!finNodo) {
    finNodo = nodos[nodos.length - 1]
    finOff = finNodo.nodeValue?.length ?? 0
  }
  const r = document.createRange()
  try {
    r.setStart(inicioNodo, Math.min(inicioOff, inicioNodo.nodeValue?.length ?? 0))
    r.setEnd(finNodo, Math.min(finOff, finNodo.nodeValue?.length ?? 0))
  } catch {
    return null
  }
  return r
}

export function rectsRelativos(raiz: HTMLElement, fragmento: string): Rect[] {
  const r = rangoDeTexto(raiz, fragmento)
  if (!r) return []
  const base = raiz.getBoundingClientRect()
  return [...r.getClientRects()]
    .filter((x) => x.width > 1 && x.height > 1)
    .map((x) => ({
      top: x.top - base.top,
      left: x.left - base.left,
      width: x.width,
      height: x.height,
    }))
}

/** Punto final del fragmento: donde se dibuja el cursor remoto. */
export function puntoFinal(raiz: HTMLElement, fragmento: string): Rect | null {
  const rects = rectsRelativos(raiz, fragmento)
  if (!rects.length) return null
  const ultimo = rects[rects.length - 1]
  return { top: ultimo.top, left: ultimo.left + ultimo.width, width: 2, height: ultimo.height }
}
