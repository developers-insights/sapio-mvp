import { useCallback } from 'react'
import type { Dic, Entrada, Lang } from './tipos'
import { comun } from './dic/comun'
import { datos } from './dic/datos'
import { estados } from './dic/estados'
import { nav } from './dic/nav'
import { login } from './dic/login'
import { propuesta } from './dic/propuesta'
import { workplace } from './dic/workplace'
import { mesa } from './dic/mesa'
import { chat } from './dic/chat'
import { asistente } from './dic/asistente'
import { alta } from './dic/alta'
import { universidad } from './dic/universidad'
import { plataforma } from './dic/plataforma'
import { campus } from './dic/campus'
import { tour } from './dic/tour'
import { useUI } from '@/store/ui'

export type { Lang } from './tipos'

/** Cada clave vive en UN solo archivo. Acá se controla que así sea. */
const archivos: Array<[string, Dic]> = [
  ['comun', comun],
  ['datos', datos],
  ['estados', estados],
  ['nav', nav],
  ['login', login],
  ['propuesta', propuesta],
  ['workplace', workplace],
  ['mesa', mesa],
  ['chat', chat],
  ['asistente', asistente],
  ['universidad', universidad],
  ['plataforma', plataforma],
  ['alta', alta],
  ['campus', campus],
  ['tour', tour],
]

function construir() {
  const dic: Dic = {}
  const origen: Record<string, string> = {}
  const duplicadas: string[] = []
  for (const [archivo, entradas] of archivos) {
    for (const clave of Object.keys(entradas)) {
      if (origen[clave] && origen[clave] !== archivo) {
        duplicadas.push(`${clave} (${origen[clave]} + ${archivo})`)
      }
      origen[clave] = archivo
      dic[clave] = entradas[clave]
    }
  }
  if (import.meta.env.DEV && duplicadas.length) {
    console.warn('[i18n] claves duplicadas en distintos archivos:', duplicadas)
  }
  return { dic, origen, duplicadas }
}

const { dic: DIC, origen: ORIGEN, duplicadas: DUPLICADAS } = construir()

/** Para los scripts de QA: expuesto en window en desarrollo y en el build. */
export const diccionario = DIC
export const origenDeClave = ORIGEN
export const clavesDuplicadas = DUPLICADAS

const avisadas = new Set<string>()

/**
 * Función PURA de traducción. Usar siempre dentro de useEffect
 * (la `t` del hook nunca va en el array de dependencias).
 */
export function tr(clave: string, lang: Lang, vars?: Record<string, string | number>): string {
  const entrada: Entrada | undefined = DIC[clave]
  if (!entrada) {
    if (import.meta.env.DEV && !avisadas.has(clave)) {
      avisadas.add(clave)
      console.warn(`[i18n] clave inexistente: "${clave}"`)
    }
    return clave
  }
  let texto = entrada[lang] ?? entrada.es
  if (!texto) {
    if (import.meta.env.DEV && !avisadas.has(clave + ':' + lang)) {
      avisadas.add(clave + ':' + lang)
      console.warn(`[i18n] clave sin traducción (${lang}): "${clave}"`)
    }
    texto = entrada.es
  }
  if (vars) {
    for (const [k, v] of Object.entries(vars)) texto = texto.split(`{${k}}`).join(String(v))
  }
  return texto
}

/**
 * Traduce un VALOR de dato del mock (facultad, país, carpeta, grupo).
 * Si no está en el diccionario devuelve el valor tal cual, sin avisar:
 * son datos, no claves de interfaz.
 */
export function dato(valor: string, lang: Lang): string {
  const entrada = DIC[`dato.${valor}`]
  if (!entrada) return valor
  return entrada[lang] ?? valor
}

export function useT() {
  const lang = useUI((s) => s.lang)
  const t = useCallback(
    (clave: string, vars?: Record<string, string | number>) => tr(clave, lang, vars),
    [lang],
  )
  return { t, lang }
}

if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).__SAPIO_I18N__ = {
    claves: Object.keys(DIC),
    origen: ORIGEN,
    duplicadas: DUPLICADAS,
  }
}
