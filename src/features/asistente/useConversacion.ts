import { useCallback, useEffect, useRef, useState } from 'react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { tr } from '@/i18n'
import { USUARIO_POR_ROL } from '@/data/personas'
import { PLANES } from '@/data/gestion'
import { responder, saludoInicial, tareasSugeridas, type Mensaje } from './motor'

/** Estado compartido por el panel flotante y la vista completa del asistente. */
export function useConversacion() {
  const rol = useUI((s) => s.rol)
  const lang = useUI((s) => s.lang)
  const toast = useUI((s) => s.toast)
  const agregarTareas = useDatos((s) => s.agregarTareas)
  const consumirIA = useDatos((s) => s.consumirIA)
  const usoIA = useDatos((s) => s.usoIA)
  const planActual = useDatos((s) => s.planActual)

  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [pensando, setPensando] = useState(false)
  const [escribiendo, setEscribiendo] = useState<string>('')
  const temporizadores = useRef<number[]>([])

  const plan = PLANES.find((p) => p.id === planActual) ?? PLANES[1]

  // El saludo depende del rol y del idioma: se reinicia al cambiar cualquiera.
  useEffect(() => {
    setMensajes([{ id: 'hola', de: 'asistente', texto: saludoInicial(rol, lang) }])
    setEscribiendo('')
    setPensando(false)
  }, [rol, lang])

  useEffect(() => {
    return () => {
      temporizadores.current.forEach((x) => window.clearTimeout(x))
      temporizadores.current = []
    }
  }, [])

  const preguntar = useCallback(
    (texto: string) => {
      const limpio = texto.trim()
      if (!limpio || pensando) return
      const idYo = 'm-' + Date.now()
      setMensajes((m) => [...m, { id: idYo, de: 'yo', texto: limpio }])
      setPensando(true)
      consumirIA(1)

      const empujar = (fn: () => void, ms: number) => {
        const id = window.setTimeout(fn, ms)
        temporizadores.current.push(id)
      }

      empujar(() => {
        const r = responder(limpio, rol, lang)
        setPensando(false)

        if (r.crearTareas) {
          agregarTareas(tareasSugeridas(lang, USUARIO_POR_ROL[rol]))
          toast({
            titulo: tr('asist.resp.tareasCreadas', lang),
            detalle: tr('toast.accionMockDetalle', lang),
            tono: 'ok',
          })
        }

        // Typewriter sobre la respuesta.
        const idResp = 'r-' + Date.now()
        setMensajes((m) => [
          ...m,
          { id: idResp, de: 'asistente', texto: '', nota: r.crearTareas ? tr('asist.resp.tareasCreadas', lang) : undefined },
        ])
        const paso = Math.max(6, Math.round(r.texto.length / 90))
        for (let i = paso; i <= r.texto.length + paso; i += paso) {
          empujar(() => {
            const trozo = r.texto.slice(0, Math.min(i, r.texto.length))
            setEscribiendo(trozo)
            setMensajes((m) => m.map((x) => (x.id === idResp ? { ...x, texto: trozo } : x)))
            if (i >= r.texto.length) setEscribiendo('')
          }, (i / paso) * 18)
        }
      }, 900)
    },
    [pensando, rol, lang, consumirIA, agregarTareas, toast],
  )

  const reiniciar = useCallback(() => {
    setMensajes([{ id: 'hola', de: 'asistente', texto: saludoInicial(rol, lang) }])
  }, [rol, lang])

  return {
    mensajes,
    pensando,
    escribiendo,
    preguntar,
    reiniciar,
    uso: { usadas: usoIA, limite: plan.limiteIA, pct: Math.min(100, Math.round((usoIA / plan.limiteIA) * 100)) },
  }
}
