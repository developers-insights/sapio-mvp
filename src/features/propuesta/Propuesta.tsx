import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Check, Eye, EyeOff, Lock, Printer, ShieldCheck } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { BRAND } from '@/lib/brand'
import { Anillos, Isotipo } from '@/assets/brand/Isotipo'
import { Pildora, TarjetaBloqueada } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { CtaWhatsapp } from '@/components/layout/CtaWhatsapp'
import { EXTENSION, MODULOS, MONTOS, PASO_DESTACADO, usd, type ModuloPropuesta } from '@/lib/propuesta-data'
import { useEsMobile, useMenosMovimiento } from '@/lib/hooks'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger)

export function Propuesta() {
  const { t, lang } = useT()
  const abrirPreview = useUI((s) => s.abrirPreview)
  const rol = useUI((s) => s.rol)
  const modo = useUI((s) => s.modo)
  const moduloDestacado = useUI((s) => s.moduloDestacado)
  const limpiarDestacado = useUI((s) => s.limpiarDestacado)
  const sembrar = useDatos((s) => s.sembrar)
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const menosMovimiento = useMenosMovimiento()

  const raizRef = useRef<HTMLDivElement>(null)

  /** "Ver en el demo": siembra SIEMPRE el estado antes de navegar. */
  function verEnDemo(m: ModuloPropuesta) {
    sembrar(m.n)
    abrirPreview(
      {
        modulo: m.n,
        view: m.destino.ruta,
        rolePrevio: rol,
        modoPrevio: modo,
        titulo: t(m.claveNombre),
      },
      { rol: m.destino.rol, modo: m.destino.modo },
    )
    navigate(m.destino.ruta)
  }

  // Al volver de una previsualización: scroll a la tarjeta y resalte ~4s.
  useEffect(() => {
    if (moduloDestacado === null) return
    const el = document.getElementById(`modulo-${moduloDestacado}`)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    const id = window.setTimeout(() => limpiarDestacado(), 4000)
    return () => window.clearTimeout(id)
  }, [moduloDestacado, limpiarDestacado])

  // Reveal del encabezado y scrub suave del circuito (solo desktop con movimiento).
  useLayoutEffect(() => {
    if (menosMovimiento || esMobile) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-anim="cabecera"] > *',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power2.out' },
      )
      gsap.utils.toArray<HTMLElement>('[data-anim="paso"]').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0.25, y: 26 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-anim="circuito"]',
              start: `top+=${i * 12}% 78%`,
              end: `top+=${(i + 1) * 12}% 62%`,
              scrub: 0.6,
            },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('[data-anim="rev"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
          },
        )
      })
    }, raizRef)
    return () => ctx.revert()
  }, [menosMovimiento, esMobile, lang])

  return (
    <div ref={raizRef}>
      {/* 1 · ENCABEZADO */}
      <header className="relative overflow-hidden pb-10" data-anim="cabecera-wrap">
        <Anillos
          className="pointer-events-none absolute -right-20 -top-40 h-[520px] w-[520px] opacity-80 sm:-right-10"
          color="rgba(201,169,116,.22)"
          animado={!menosMovimiento}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0" data-anim="cabecera">
            <div className="mb-5 inline-flex items-center gap-3">
              <Isotipo size={26} color={BRAND.color.champan} />
              <p className="kicker">{t('prop.kicker')}</p>
            </div>
            <h1 className="font-black leading-[1.03]" style={{ fontSize: 'clamp(30px,6vw,60px)' }}>
              {t('prop.titulo')}
            </h1>
            <span className="filete mt-4" />
            <p className="mt-5 max-w-2xl text-[clamp(16px,2.2vw,20px)] leading-relaxed text-tinta-sec dark:text-marfil/70">
              {t('prop.bajada')}
            </p>
            <p className="serif-it mt-5 text-[clamp(18px,2.6vw,24px)] leading-snug">
              {lang === 'en' ? BRAND.claim.en : BRAND.claim.es}
            </p>
          </div>
          <div className="no-print flex shrink-0 flex-wrap gap-2">
            <Boton variante="secundario" onClick={() => window.print()}>
              <Printer size={15} />
              {t('prop.imprimir')}
            </Boton>
            <CtaWhatsapp variante="primario" />
          </div>
        </div>
      </header>

      {/* 2 · EL CIRCUITO */}
      <section className="border-t border-borde py-12 dark:border-[#27425a]" data-anim="circuito">
        <p className="kicker">{t('prop.circuito.kicker')}</p>
        <h2 className="mt-2.5 font-black leading-tight" style={{ fontSize: 'clamp(24px,4.4vw,38px)' }}>
          {t('prop.circuito.titulo')}
        </h2>
        <span className="filete mt-3" />

        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((n) => {
            const destacado = n === PASO_DESTACADO
            return (
              <li
                key={n}
                data-anim="paso"
                className={cn(
                  'min-w-0 rounded-2xl border p-4 sm:p-5',
                  // El paso 4 (la mesa redonda) es el que cierra la venta: ocupa el doble.
                  destacado
                    ? 'border-mineral bg-mineral/[.07] shadow-sapio lg:col-span-2'
                    : 'border-borde bg-white shadow-sapio dark:border-[#27425a] dark:bg-noche-800',
                )}
              >
                <p className="num text-[11px] font-black tracking-[0.14em] text-champan-700 dark:text-champan">
                  {t('prop.paso', { n })}
                </p>
                <h3 className="mt-2.5 text-[15.5px] font-black leading-snug">{t(`prop.paso${n}`)}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
                  {t(`prop.paso${n}.det`)}
                </p>
                {destacado ? (
                  <span className="mt-3 inline-flex">
                    <Pildora tono="mineral">{t('nav.mesas')}</Pildora>
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>

        <p className="serif-it mt-7 text-[clamp(16px,2.2vw,20px)] text-tinta-sec dark:text-marfil/60">
          {t('prop.circuito.cierre')}
        </p>
      </section>

      {/* 3 · QUÉ INCLUYE — FASE 1 */}
      <section className="border-t border-borde py-12 dark:border-[#27425a]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="kicker">{t('prop.incluye.kicker')}</p>
            <h2 className="mt-2.5 font-black leading-tight" style={{ fontSize: 'clamp(24px,4.4vw,38px)' }}>
              {t('prop.incluye.titulo')}
            </h2>
            <span className="filete mt-3" />
          </div>
          <Pildora tono="noche" className="num shrink-0 text-[12px]">
            {t('prop.incluye.contador')}
          </Pildora>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODULOS.map((m) => (
            <li key={m.n} className="min-w-0">
              <article
                id={`modulo-${m.n}`}
                data-anim="rev"
                className={cn(
                  'card-sapio flex h-full flex-col p-4 transition-[border-color,box-shadow,translate] duration-300 sm:p-5',
                  moduloDestacado === m.n &&
                    'border-mineral shadow-sapio-lg ring-2 ring-mineral/30 -translate-y-1',
                )}
              >
                <p className="num text-[12px] font-black tracking-[0.14em] text-champan-700 dark:text-champan">
                  {String(m.n).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-[16px] font-black leading-snug">{t(m.claveNombre)}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
                  {t(m.claveResumen)}
                </p>
                <ul className="mt-3.5 space-y-1.5">
                  {m.clavesBullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[12.5px] leading-snug">
                      <Check size={14} className="mt-[2px] shrink-0 text-mineral" />
                      <span>{t(b)}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => verEnDemo(m)}
                  className="no-print mt-auto inline-flex min-h-[44px] items-center gap-1.5 pt-4 text-[13px] font-black text-mineral transition-colors hover:text-mineral-700"
                >
                  {t('prop.verEnDemo')}
                  <ArrowUpRight size={15} />
                </button>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 · EXTENSIÓN (solo tarjetas bloqueadas) */}
      <section className="border-t border-borde py-12 dark:border-[#27425a]">
        <p className="kicker">{t('prop.extension.kicker')}</p>
        <h2 className="mt-2.5 font-black leading-tight" style={{ fontSize: 'clamp(24px,4.4vw,38px)' }}>
          {t('prop.extension.titulo')}
        </h2>
        <span className="filete mt-3" />
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-tinta-sec dark:text-marfil/65">
          {t('prop.extension.bajada')}
        </p>

        <div className="mt-7 space-y-6">
          {(['fase2', 'fase3'] as const).map((f) => (
            <div key={f}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
                  {t(`prop.${f}`)}
                </h3>
                <Pildora tono="champan">
                  {EXTENSION[f].semanas} {t('prop.semanas')}
                </Pildora>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {EXTENSION[f].items.map((clave) => (
                  <li key={clave} data-anim="rev" className="min-w-0">
                    <TarjetaBloqueada fase={t(`prop.${f}`)} nombre={t(clave)} linea={t(`${clave}.det`)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5 · INVERSIÓN (al final, oculta por defecto) */}
      <BloqueInversion />

      {/* 6 · CIERRE */}
      <section className="border-t border-borde py-12 text-center dark:border-[#27425a]">
        <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(24px,4.4vw,36px)' }}>
          {t('prop.cierre.titulo')}
        </h2>
        <span className="filete mx-auto mt-4" />
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-tinta-sec dark:text-marfil/65">
          {t('prop.cierre.bajada')}
        </p>
        <div className="no-print mt-7">
          <CtaWhatsapp variante="primario" tam="lg" className="w-full" dataTour={false} />
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-tinta-sec/70 dark:text-marfil/40">
          {t('app.poweredBy')}
        </p>
      </section>
    </div>
  )
}

/**
 * El monto NO se persiste: cada carga arranca oculto.
 * Se revela con transición de ALTURA; los montos se renderizan recién al
 * revelar (nunca con blur ni opacity).
 */
function BloqueInversion() {
  const { t } = useT()
  const [visible, setVisible] = useState(false)
  const [alto, setAlto] = useState(0)
  const contenidoRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!visible) {
      setAlto(0)
      return
    }
    const medir = () => setAlto(contenidoRef.current?.scrollHeight ?? 0)
    medir()
    const id = window.setTimeout(medir, 60)
    window.addEventListener('resize', medir)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('resize', medir)
    }
  }, [visible])

  return (
    <section className="border-t border-borde py-12 dark:border-[#27425a]" id="inversion">
      <p className="kicker">{t('prop.inv.kicker')}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {!visible ? (
          <span
            className="num select-none text-[clamp(30px,7vw,46px)] font-black leading-none tracking-[0.12em] text-tinta-sec/45 dark:text-marfil/25"
            aria-hidden="true"
          >
            ••••••
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-expanded={visible}
          data-ojito-inversion="1"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-noche bg-noche px-4 text-[14px] font-black text-marfil transition-colors hover:bg-[#1b3147] dark:border-marfil dark:bg-marfil dark:text-noche"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          {visible ? t('prop.inv.verOcultar') : t('prop.inv.verMostrar')}
        </button>
      </div>

      <div
        className="overflow-hidden transition-[height] duration-[250ms] ease-out"
        style={{ height: visible ? alto : 0 }}
        aria-hidden={!visible}
      >
        {visible ? (
          <div ref={contenidoRef} className="pt-7">
            <p className="text-[clamp(17px,2.6vw,22px)] font-black">{t('prop.inv.soloFase1')}</p>

            {/* Fase 1 */}
            <div className="card-sapio mt-5 p-5 sm:p-7">
              <p className="kicker">{t('prop.inv.fase1')}</p>
              <p
                className="num mt-2 font-black leading-none"
                style={{ fontSize: 'clamp(40px, 8vw, 56px)' }}
              >
                {usd(MONTOS.fase1.total)}
              </p>
              <p className="num mt-3 text-[14px] font-bold text-tinta-sec dark:text-marfil/60">
                {t('prop.inv.plazo', { semanas: MONTOS.fase1.semanas })}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-borde p-3.5 dark:border-[#27425a]">
                  <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
                    {t('prop.inv.alIniciar')}
                  </p>
                  <p className="num mt-1.5 text-[22px] font-black">{usd(MONTOS.fase1.mitad)}</p>
                </div>
                <div className="rounded-xl border border-borde p-3.5 dark:border-[#27425a]">
                  <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
                    {t('prop.inv.alEntregar')}
                  </p>
                  <p className="num mt-1.5 text-[22px] font-black">{usd(MONTOS.fase1.mitad)}</p>
                  <p className="mt-1 text-[12px] leading-snug text-tinta-sec dark:text-marfil/50">
                    {t('prop.inv.alEntregarDet')}
                  </p>
                </div>
              </div>
            </div>

            {/* Descuento por pago adelantado */}
            <div className="mt-4 rounded-2xl border-2 border-mineral bg-mineral/[.06] p-5 sm:p-6">
              <span className="filete" />
              <p className="mt-3 text-[clamp(16px,2.4vw,20px)] font-black">
                {t('prop.inv.adelantado', { pct: MONTOS.descuentoPct })}
              </p>
              <p className="num mt-3 font-black leading-none text-mineral" style={{ fontSize: 'clamp(32px,6.5vw,46px)' }}>
                {usd(MONTOS.fase1.conDescuento)}
              </p>
              <p className="num mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-tinta-sec dark:text-marfil/60">
                <span className="line-through">{t('prop.inv.listaTachada', { monto: usd(MONTOS.fase1.total) })}</span>
                <span className="font-bold text-mineral">
                  {t('prop.inv.ahorro', { monto: usd(MONTOS.fase1.ahorro) })}
                </span>
              </p>
            </div>

            {/* Extensión */}
            <div className="card-sapio mt-4 p-5 sm:p-6">
              <p className="kicker">{t('prop.inv.extension')}</p>
              <p className="num mt-2 font-black leading-none" style={{ fontSize: 'clamp(30px,6vw,42px)' }}>
                {usd(MONTOS.extension.total)}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
                {t('prop.inv.extensionDet')}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(['fase2', 'fase3'] as const).map((f) => (
                  <div key={f} className="rounded-xl border border-borde p-3.5 dark:border-[#27425a]">
                    <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
                      {t(`prop.${f}`)} · {MONTOS[f].semanas} {t('prop.semanas')}
                    </p>
                    <p className="num mt-1.5 text-[24px] font-black">{usd(MONTOS[f].total)}</p>
                    <p className="num mt-1.5 text-[12.5px] text-tinta-sec dark:text-marfil/55">
                      {t('prop.inv.alIniciar')} {usd(MONTOS[f].mitad)} · {t('prop.inv.alEntregar')}{' '}
                      {usd(MONTOS[f].mitad)}
                    </p>
                  </div>
                ))}
              </div>
              <p className="num mt-4 text-[13.5px] font-bold">
                {t('prop.inv.conDescuentoFase', { pct: MONTOS.descuentoPct })}: {t('prop.fase2')}{' '}
                {usd(MONTOS.fase2.conDescuento)} · {t('prop.fase3')} {usd(MONTOS.fase3.conDescuento)} ·{' '}
                {t('prop.inv.totalExtension')} {usd(MONTOS.extension.conDescuento)}
              </p>
            </div>

            {/* Total y mantenimiento */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-noche p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mineral-300">
                  {t('prop.inv.totalProyecto')}
                </p>
                <p className="num mt-2 font-black leading-none text-marfil" style={{ fontSize: 'clamp(32px,6.5vw,46px)' }}>
                  {usd(MONTOS.totalProyecto)}
                </p>
              </div>
              <div className="card-sapio p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-tinta-sec dark:text-marfil/50">
                  {t('prop.inv.mantenimiento')}
                </p>
                <p className="num mt-2 font-black leading-none" style={{ fontSize: 'clamp(28px,5.5vw,38px)' }}>
                  {usd(MONTOS.mantenimientoMensual)}
                  <span className="ml-1 text-[14px] font-bold text-tinta-sec dark:text-marfil/50">
                    {t('prop.inv.porMes')}
                  </span>
                </p>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-tinta-sec dark:text-marfil/55">
                  {t('prop.inv.mantenimientoDet')}
                </p>
              </div>
            </div>

            {/* Garantía */}
            <div className="mt-4 rounded-2xl border border-borde p-5 dark:border-[#27425a]">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
                <ShieldCheck size={15} className="shrink-0 text-mineral" />
                {t('prop.inv.garantia')}
              </p>
              <ul className="mt-3 space-y-2">
                {['prop.inv.garantia1', 'prop.inv.garantia2', 'prop.inv.garantia3'].map((k) => (
                  <li key={k} className="flex gap-2 text-[13.5px] leading-relaxed">
                    <Check size={15} className="mt-[3px] shrink-0 text-mineral" />
                    {t(k)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
