import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Firma } from '@/assets/brand/Isotipo'
import { BRAND } from '@/lib/brand'
import { useEsMobile } from '@/lib/hooks'
import { getTourSteps } from './pasos'

interface Caja {
  top: number
  left: number
  width: number
  height: number
}

const PADDING = 8
const RADIO = 12
const ANCHO_TOOLTIP = 360

/** Recorte del overlay: rectángulo completo + agujero redondeado, con evenodd. */
function clipConAgujero(w: number, h: number, c: Caja | null) {
  const base = `M0 0H${w}V${h}H0Z`
  if (!c) return `path(evenodd, "${base}")`
  const x = Math.max(0, c.left - PADDING)
  const y = Math.max(0, c.top - PADDING)
  const an = Math.min(w - x, c.width + PADDING * 2)
  const al = Math.min(h - y, c.height + PADDING * 2)
  const r = Math.min(RADIO, an / 2, al / 2)
  const agujero =
    `M${x + r} ${y}H${x + an - r}A${r} ${r} 0 0 1 ${x + an} ${y + r}` +
    `V${y + al - r}A${r} ${r} 0 0 1 ${x + an - r} ${y + al}` +
    `H${x + r}A${r} ${r} 0 0 1 ${x} ${y + al - r}` +
    `V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  return `path(evenodd, "${base} ${agujero}")`
}

export function Tour() {
  const abierto = useUI((s) => s.tourAbierto)
  const setTour = useUI((s) => s.setTour)
  const trailer = useUI((s) => s.trailerAbierto)
  const rol = useUI((s) => s.rol)
  const lang = useUI((s) => s.lang)
  const setSheetMas = useUI((s) => s.setSheetMas)
  const { t } = useT()
  const esMobile = useEsMobile()

  const [indice, setIndice] = useState(0)
  const [caja, setCaja] = useState<Caja | null>(null)
  const [vp, setVp] = useState({ w: 0, h: 0 })
  const [final, setFinal] = useState(false)
  const temporizadores = useRef<number[]>([])

  const pasos = useMemo(() => getTourSteps(rol, lang, esMobile), [rol, lang, esMobile])
  const paso = pasos[indice]

  /** teardown(): limpia timers, estado y bloqueo de scroll. */
  const teardown = useCallback(() => {
    temporizadores.current.forEach((x) => window.clearTimeout(x))
    temporizadores.current = []
    setIndice(0)
    setCaja(null)
    document.body.style.overflow = ''
  }, [])

  const cerrar = useCallback(
    (mostrarFinal: boolean) => {
      teardown()
      setTour(false)
      if (mostrarFinal) setFinal(true)
    },
    [setTour, teardown],
  )

  const medir = useCallback(() => {
    if (!paso) return
    setVp({ w: window.innerWidth, h: window.innerHeight })
    if (!paso.selector) {
      setCaja(null)
      return
    }
    const el = document.querySelector(paso.selector) as HTMLElement | null
    if (!el) {
      setCaja(null)
      return
    }
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) {
      setCaja(null)
      return
    }
    setCaja({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [paso])

  // Antes de medir: scrollIntoView del target, medición a ~260ms y reintento a ~220ms.
  useEffect(() => {
    if (!abierto || !paso) return
    temporizadores.current.forEach((x) => window.clearTimeout(x))
    temporizadores.current = []
    setCaja(null)

    if (paso.selector) {
      const el = document.querySelector(paso.selector) as HTMLElement | null
      el?.scrollIntoView({ block: 'center' })
    }
    const a = window.setTimeout(medir, 260)
    const b = window.setTimeout(medir, 260 + 220)
    temporizadores.current.push(a, b)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [abierto, paso, medir])

  // Re-medir en resize y scroll.
  useEffect(() => {
    if (!abierto) return
    window.addEventListener('resize', medir)
    window.addEventListener('scroll', medir, true)
    return () => {
      window.removeEventListener('resize', medir)
      window.removeEventListener('scroll', medir, true)
    }
  }, [abierto, medir])

  useEffect(() => {
    if (!abierto) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // El sheet "Más" se cierra: el tour apunta a la bottom-nav, no al sheet.
    setSheetMas(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar(false)
      if (e.key === 'ArrowRight') setIndice((i) => Math.min(i + 1, pasos.length - 1))
      if (e.key === 'ArrowLeft') setIndice((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [abierto, cerrar, pasos.length, setSheetMas])

  useEffect(() => {
    return () => teardown()
  }, [teardown])

  if (trailer) return null

  if (!abierto) {
    return (
      <Modal
        abierto={final}
        onCerrar={() => setFinal(false)}
        ancho={520}
        zIndex={9600}
        etiqueta={t('tour.final.titulo')}
      >
        <div className="text-center">
          <span className="inline-flex">
            <Firma size={22} colorIsotipo="#C9A974" />
          </span>
          <h2 className="mt-5 text-[clamp(24px,5vw,32px)] font-black leading-tight">
            {t('tour.final.titulo')}
          </h2>
          <span className="filete mx-auto mt-3" />
          <p className="mt-4 text-[14.5px] leading-relaxed text-tinta-sec dark:text-marfil/70">
            {t('tour.final.cuerpo')}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Boton variante="secundario" onClick={() => setFinal(false)}>
              {t('tour.final.explorar')}
            </Boton>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-noche px-4 text-sm font-bold text-marfil transition-colors hover:bg-[#1b3147] dark:bg-marfil dark:text-noche"
            >
              {t('app.ctaTour')}
            </a>
          </div>
        </div>
      </Modal>
    )
  }

  const anchoTooltip = esMobile ? Math.min(ANCHO_TOOLTIP, vp.w - 24) : ANCHO_TOOLTIP
  const ALTO_TOOLTIP = 230
  const estiloTooltip: React.CSSProperties = caja
    ? (() => {
        const margen = 14
        // Objetivo alto (el sidebar, por ejemplo): el tooltip va al costado,
        // centrado verticalmente, para no quedar fuera de la pantalla.
        const esAlto = caja.height > vp.h * 0.42
        if (esAlto) {
          const derecha = caja.left + caja.width + margen
          const cabeDerecha = derecha + anchoTooltip + 12 <= vp.w
          const left = cabeDerecha
            ? derecha
            : Math.max(12, caja.left - anchoTooltip - margen)
          const top = Math.max(
            12,
            Math.min(caja.top + caja.height / 2 - ALTO_TOOLTIP / 2, vp.h - ALTO_TOOLTIP - 12),
          )
          return { top, left, width: anchoTooltip }
        }
        const abajo = caja.top + caja.height + margen
        const cabeAbajo = abajo + ALTO_TOOLTIP <= vp.h - 12
        const top = cabeAbajo
          ? abajo
          : Math.max(12, Math.min(caja.top - ALTO_TOOLTIP - margen, vp.h - ALTO_TOOLTIP - 12))
        let left = caja.left + caja.width / 2 - anchoTooltip / 2
        left = Math.max(12, Math.min(left, vp.w - anchoTooltip - 12))
        return { top, left, width: anchoTooltip }
      })()
    : { left: '50%', top: '50%', translate: '-50% -50%', width: anchoTooltip }

  return (
    <div className="fixed inset-0 z-[9400]" role="dialog" aria-modal="true" aria-label={t('app.tour')}>
      {/* Overlay con agujero por clip-path (nunca box-shadow 9999px) */}
      <div
        className="absolute inset-0 bg-[rgba(16,29,43,.55)]"
        style={{ clipPath: clipConAgujero(vp.w, vp.h, caja), WebkitClipPath: clipConAgujero(vp.w, vp.h, caja) }}
        onClick={() => cerrar(false)}
        aria-hidden="true"
      />

      {/* Recuadro + dot azul pulsante en la esquina */}
      {caja ? (
        <>
          <div
            className="pointer-events-none absolute rounded-xl border-2 border-mineral"
            style={{
              top: caja.top - PADDING,
              left: caja.left - PADDING,
              width: caja.width + PADDING * 2,
              height: caja.height + PADDING * 2,
            }}
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute h-3 w-3 animate-pulso rounded-full bg-pizarra ring-2 ring-marfil"
            style={{ top: caja.top - PADDING - 6, left: caja.left + caja.width + PADDING - 6 }}
            aria-hidden="true"
          />
        </>
      ) : null}

      {/* Tooltip */}
      <div
        className="absolute rounded-2xl border border-borde bg-white p-4 shadow-sapio-lg animate-tip-in dark:border-[#27425a] dark:bg-noche-800"
        style={estiloTooltip}
      >
        <div className="flex items-start gap-2">
          <p className="num min-w-0 flex-1 text-[11px] font-bold uppercase tracking-[0.12em] text-mineral-texto">
            {t('tour.paso', { n: indice + 1, total: pasos.length })}
          </p>
          <button
            type="button"
            onClick={() => cerrar(false)}
            aria-label={t('app.cerrar')}
            className="-m-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-tinta-sec hover:bg-marfil-200 dark:hover:bg-noche-700"
          >
            <X size={15} />
          </button>
        </div>
        <h3 className="mt-1.5 text-[16px] font-black leading-snug">{paso.titulo}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/70">{paso.cuerpo}</p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => cerrar(false)}
            className="min-h-[40px] text-[12.5px] font-bold text-tinta-sec hover:text-noche dark:text-marfil/55 dark:hover:text-marfil"
          >
            {t('tour.saltar')}
          </button>
          <div className="ml-auto flex gap-2">
            {indice > 0 ? (
              <Boton tam="sm" variante="secundario" onClick={() => setIndice((i) => i - 1)}>
                {t('tour.anterior')}
              </Boton>
            ) : null}
            {indice < pasos.length - 1 ? (
              <Boton tam="sm" onClick={() => setIndice((i) => i + 1)}>
                {t('tour.siguiente')}
              </Boton>
            ) : (
              <Boton tam="sm" variante="mineral" onClick={() => cerrar(true)}>
                {t('tour.terminar')}
              </Boton>
            )}
          </div>
        </div>

        {/* Progreso */}
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {pasos.map((x, i) => (
            <span
              key={x.id}
              className={
                i <= indice
                  ? 'h-1 flex-1 rounded-full bg-mineral'
                  : 'h-1 flex-1 rounded-full bg-borde dark:bg-[#27425a]'
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
