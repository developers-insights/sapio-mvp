import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Firma } from '@/assets/brand/Isotipo'
import { BRAND } from '@/lib/brand'
import type { Modo, Role } from '@/data/tipos'

interface Escena {
  id: string
  /** Duración en ms (5.5–9 s). */
  dur: number
  rol?: Role
  modo?: Modo
  ruta?: string
  /** Selector al que viaja el cursor virtual; dispara un click() real. */
  objetivo?: string
  clave: string
}

/** NINGUNA escena aprieta el ojito de la inversión. */
const ESCENAS: Escena[] = [
  { id: 'propuesta', dur: 6500, rol: 'estudiante', modo: 'app', ruta: '/propuesta', clave: 'trailer.1' },
  { id: 'campus', dur: 7000, rol: 'universidad', modo: 'campus', ruta: '/campus/northwood', objetivo: '[data-trailer="campus-portada"]', clave: 'trailer.2' },
  { id: 'uni-panel', dur: 6500, rol: 'universidad', modo: 'app', ruta: '/universidad/panel', clave: 'trailer.3' },
  { id: 'aprobar', dur: 7500, rol: 'universidad', modo: 'app', ruta: '/universidad/invitaciones?tab=profesores', objetivo: '[data-trailer="aprobar-profesor"]', clave: 'trailer.4' },
  { id: 'workplace', dur: 6500, rol: 'estudiante', modo: 'app', ruta: '/workplace/calendario', clave: 'trailer.5' },
  { id: 'mesa', dur: 7000, rol: 'estudiante', modo: 'app', ruta: '/mesa/tesis-metodologia', objetivo: '[data-trailer="mesa-documento"]', clave: 'trailer.6' },
  { id: 'mesa-comentario', dur: 9000, clave: 'trailer.7' },
  { id: 'asistente', dur: 7500, rol: 'estudiante', modo: 'app', ruta: '/workplace/asistente', clave: 'trailer.8' },
  { id: 'chat', dur: 6500, rol: 'estudiante', modo: 'app', ruta: '/chat/proyecto-tesis', clave: 'trailer.9' },
  { id: 'plataforma', dur: 7000, rol: 'super', modo: 'app', ruta: '/plataforma/universidades', objetivo: '[data-trailer="probar-aislamiento"]', clave: 'trailer.10' },
  { id: 'auditoria', dur: 6500, rol: 'super', modo: 'app', ruta: '/plataforma/auditoria', clave: 'trailer.11' },
  { id: 'cta', dur: 7000, rol: 'estudiante', modo: 'app', ruta: '/propuesta', objetivo: '[data-tour="whatsapp-cta"]', clave: 'trailer.12' },
]

export function Trailer() {
  const setTrailer = useUI((s) => s.setTrailer)
  const setRol = useUI((s) => s.setRol)
  const setModo = useUI((s) => s.setModo)
  const salir = useUI((s) => s.salir)
  const { t } = useT()
  const navigate = useNavigate()

  // `navigate` va en un ref: nunca en las dependencias del motor de escenas.
  const navRef = useRef(navigate)
  navRef.current = navigate
  const setRolRef = useRef(setRol)
  setRolRef.current = setRol
  const setModoRef = useRef(setModo)
  setModoRef.current = setModo

  const [indice, setIndice] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false })
  const [anillo, setAnillo] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const temporizadores = useRef<number[]>([])

  const limpiar = useCallback(() => {
    temporizadores.current.forEach((x) => window.clearTimeout(x))
    temporizadores.current = []
  }, [])

  const cerrar = useCallback(() => {
    limpiar()
    setTrailer(false)
    salir()
    navRef.current('/login')
  }, [limpiar, salir, setTrailer])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cerrar])

  useEffect(() => {
    return () => limpiar()
  }, [limpiar])

  // Motor de escenas: cada cambio de índice corre una escena y agenda la siguiente.
  useEffect(() => {
    const escena = ESCENAS[indice]
    if (!escena) return
    limpiar()

    const empujar = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms)
      temporizadores.current.push(id)
    }

    const cambiaContexto = Boolean(escena.rol || escena.modo)
    if (escena.rol) setRolRef.current(escena.rol)
    if (escena.modo) setModoRef.current(escena.modo)

    const navegar = () => {
      if (escena.ruta) navRef.current(escena.ruta)
      setAnillo(null)
      setCursor((c) => ({ ...c, visible: false }))

      if (escena.objetivo) {
        // El cursor virtual viaja al objetivo y dispara un click() real.
        empujar(() => {
          const el = document.querySelector(escena.objetivo!) as HTMLElement | null
          if (!el) return
          el.scrollIntoView({ block: 'center' })
          empujar(() => {
            const r = el.getBoundingClientRect()
            setCursor({ x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 60), visible: true })
            setAnillo({ top: r.top, left: r.left, width: r.width, height: Math.min(r.height, 260) })
            empujar(() => {
              el.click()
            }, 900)
          }, 320)
        }, 900)
      }
    }

    // Si la escena cambia de rol o de modo, esperamos ~90ms antes de navegar.
    if (cambiaContexto) empujar(navegar, 90)
    else navegar()

    // Loop infinito.
    empujar(() => setIndice((i) => (i + 1) % ESCENAS.length), escena.dur)
  }, [indice, limpiar])

  const escena = ESCENAS[indice]

  return (
    <>
      {/* Cursor virtual */}
      {cursor.visible ? (
        <span
          className="pointer-events-none fixed z-[9993] transition-[top,left] duration-700 ease-out"
          style={{ top: cursor.y, left: cursor.x }}
          aria-hidden="true"
        >
          <span className="block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pizarra ring-4 ring-pizarra/25" />
        </span>
      ) : null}

      {/* Anillo de highlight (doble box-shadow) */}
      {anillo ? (
        <span
          className="pointer-events-none fixed z-[9992] rounded-2xl transition-[top,left,width,height] duration-500"
          style={{
            top: anillo.top - 6,
            left: anillo.left - 6,
            width: anillo.width + 12,
            height: anillo.height + 12,
            boxShadow: '0 0 0 2px #25465C, 0 0 0 7px rgba(37,70,92,.22)',
          }}
          aria-hidden="true"
        />
      ) : null}

      {/* Caption de vidrio */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[9991] flex justify-center px-4 pb-6"
        aria-live="polite"
      >
        <div className="vidrio pointer-events-auto w-full max-w-[720px] rounded-2xl border border-borde px-5 py-4 shadow-sapio-lg dark:border-[#27425a]">
          <div className="flex items-center gap-3">
            <Firma size={16} colorIsotipo="#C9A974" />
            <p className="num ml-auto text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-sec dark:text-marfil/50">
              {t('trailer.escena', { n: indice + 1, total: ESCENAS.length })}
            </p>
          </div>
          <p className="mt-2.5 text-[clamp(15px,2vw,18px)] font-bold leading-snug">{t(escena.clave)}</p>
          <div className="mt-3 flex gap-1" aria-hidden="true">
            {ESCENAS.map((x, i) => (
              <span
                key={x.id}
                className={
                  i === indice
                    ? 'h-1 flex-1 rounded-full bg-mineral'
                    : 'h-1 flex-1 rounded-full bg-borde dark:bg-[#27425a]'
                }
              />
            ))}
          </div>
          {escena.id === 'cta' ? (
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-noche px-4 text-sm font-bold text-marfil dark:bg-marfil dark:text-noche"
            >
              {t('app.cta')}
            </a>
          ) : null}
        </div>
      </div>

      {/* Salida */}
      <button
        type="button"
        onClick={cerrar}
        aria-label={t('trailer.salir')}
        className="fixed right-4 top-4 z-[9994] grid h-11 w-11 place-items-center rounded-full border border-borde bg-white text-noche shadow-sapio-lg dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil"
      >
        <X size={18} />
      </button>
    </>
  )
}
