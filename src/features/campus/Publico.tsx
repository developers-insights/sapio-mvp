import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowLeft, ChevronDown, FileText, Mail, Phone } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { Anillos, Isotipo } from '@/assets/brand/Isotipo'
import { Pildora } from '@/components/ui/Piezas'
import { CtaWhatsapp } from '@/components/layout/CtaWhatsapp'
import { GRANO_SVG, PLACEHOLDERS } from '@/data/assets'
import { PROGRAMAS } from '@/data/campus'
import { UNI_ADMIN, UNI_POR_SLUG, UNI_POR_ID } from '@/data/universidades'
import { miembrosDe } from '@/data/personas'
import { useEsMobile, useMenosMovimiento } from '@/lib/hooks'

gsap.registerPlugin(ScrollTrigger)

export function CampusPublico() {
  const { slug } = useParams()
  const { t, lang } = useT()
  const setModo = useUI((s) => s.setModo)
  const rol = useUI((s) => s.rol)
  const tourAbierto = useUI((s) => s.tourAbierto)
  const trailer = useUI((s) => s.trailerAbierto)
  const campus = useDatos((s) => s.campus)
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const menosMovimiento = useMenosMovimiento()

  const raizRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)

  // Un enlace directo a /campus/... también entra en modo campus.
  useEffect(() => {
    setModo('campus')
  }, [setModo])

  const uni = (slug ? UNI_POR_SLUG[slug] : undefined) ?? UNI_POR_ID[UNI_ADMIN]
  const esElCampusEditado = uni.id === UNI_ADMIN
  const nombre = esElCampusEditado ? campus.nombre : uni.nombre
  const colorPrimario = esElCampusEditado ? campus.colorPrimario : uni.colorPrimario
  const colorAcento = esElCampusEditado ? campus.colorAcento : uni.colorAcento
  const iniciales = esElCampusEditado ? campus.iniciales : uni.iniciales
  const lema = esElCampusEditado ? (lang === 'en' ? campus.lemaEn : campus.lemaEs) : (lang === 'en' ? 'Public research with measurable impact.' : 'Investigación pública con impacto medible.')
  const textoInstitucional = esElCampusEditado
    ? lang === 'en'
      ? campus.textoInstitucionalEn
      : campus.textoInstitucionalEs
    : lang === 'en'
      ? `${uni.nombre} trains researchers across ${uni.facultades.length} faculties in ${uni.ciudad}, ${uni.pais}.`
      : `${uni.nombre} forma investigadores en ${uni.facultades.length} facultades en ${uni.ciudad}, ${uni.pais}.`
  const secciones = esElCampusEditado
    ? campus.secciones
    : { institucional: true, facultades: true, programas: true, contacto: true }

  const miembros = miembrosDe(uni.id).length

  // Scroll suave + scrub bidireccional. Nada de esto corre con
  // prefers-reduced-motion, en móvil, con el tour abierto o durante el trailer.
  useEffect(() => {
    const conMovimiento = !menosMovimiento && !esMobile && !tourAbierto && !trailer
    if (!conMovimiento) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenisRef.current = lenis
    let raf = 0
    const loop = (tiempo: number) => {
      lenis.raf(tiempo)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    lenis.on('scroll', ScrollTrigger.update)

    const ctx = gsap.context(() => {
      // Portada: los anillos se expanden al bajar.
      gsap.to('[data-anim="anillos"]', {
        scale: 1.35,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: '[data-anim="portada"]', start: 'top top', end: 'bottom top', scrub: 0.6 },
      })
      gsap.to('[data-anim="portada-texto"]', {
        y: -60,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: '[data-anim="portada"]', start: 'top top', end: 'bottom top', scrub: 0.6 },
      })

      // Manifiesto pinneado: se arma al bajar y se desarma al subir.
      const palabras = gsap.utils.toArray<HTMLElement>('[data-anim="palabra"]')
      palabras.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, yPercent: 40 },
          {
            opacity: 1,
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-anim="manifiesto"]',
              start: `top+=${i * 28}% top`,
              end: `top+=${(i + 1) * 28}% top`,
              scrub: 0.5,
            },
          },
        )
      })

      // Reveals de las secciones siguientes.
      gsap.utils.toArray<HTMLElement>('[data-anim="reveal"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
          },
        )
      })
    }, raizRef)

    return () => {
      ctx.revert()
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
      ScrollTrigger.getAll().forEach((x) => x.kill())
    }
  }, [menosMovimiento, esMobile, tourAbierto, trailer, lang, slug])

  // Lenis se detiene mientras el tour está abierto.
  useEffect(() => {
    if (!lenisRef.current) return
    if (tourAbierto || trailer) lenisRef.current.stop()
    else lenisRef.current.start()
  }, [tourAbierto, trailer])

  function volverAlPanel() {
    setModo('app')
    navigate(rol === 'universidad' ? '/universidad/panel' : '/propuesta')
  }

  return (
    <div ref={raizRef} className="min-h-[100dvh] bg-marfil text-noche">
      {/* Barra de demo */}
      <div className="sticky top-0 z-40 border-b border-borde bg-marfil/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-2 px-4 py-2 sm:px-6">
          <Pildora tono="neutro">{t('campus.barra.titulo')}</Pildora>
          <span className="num hidden text-[11.5px] text-tinta-sec sm:inline">
            {uni.slug}.sapio.example
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={volverAlPanel}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-borde bg-white px-2.5 text-[12px] font-bold transition-colors hover:border-mineral hover:text-mineral-texto"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">{t('campus.barra.volver')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setModo('app')
                navigate('/propuesta')
              }}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-borde bg-white px-2.5 text-[12px] font-bold transition-colors hover:border-mineral hover:text-mineral-texto"
            >
              <FileText size={13} />
              {t('nav.propuesta')}
            </button>
            <CtaWhatsapp variante="mineral" tam="sm" dataTour={false} className="text-[12px]" />
          </div>
        </div>
      </div>

      {/* Portada a pantalla completa */}
      <section
        data-anim="portada"
        data-trailer="campus-portada"
        className="relative flex min-h-[86dvh] items-center overflow-hidden px-4 py-16 sm:px-6"
        style={{ background: colorPrimario, backgroundImage: GRANO_SVG }}
      >
        <div data-anim="anillos" className="pointer-events-none absolute left-1/2 top-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2">
          <Anillos cantidad={8} color="rgba(255,255,255,.12)" animado={!menosMovimiento} className="h-full w-full" />
        </div>
        <div data-anim="portada-texto" className="relative mx-auto w-full max-w-[1180px]">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl text-[15px] font-black text-marfil"
              style={{ background: 'rgba(255,255,255,.18)' }}
              aria-hidden="true"
            >
              {iniciales}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-marfil/70">
              {t('campus.hero.kicker')}
            </span>
          </div>
          <h1
            className="mt-8 max-w-4xl font-black leading-[0.98] text-marfil"
            style={{ fontSize: 'clamp(36px,7vw,78px)' }}
          >
            {nombre}
          </h1>
          <span className="mt-6 block h-[3px] w-[88px]" style={{ background: colorAcento }} />
          <p className="serif-it mt-7 max-w-2xl text-[clamp(17px,2.4vw,24px)] leading-snug text-marfil/80">
            {lema}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-marfil/55">
            <span className="num">{miembros} {t('campus.estudiantes')}</span>
            <span aria-hidden="true">·</span>
            <span className="num">{t('campus.programasN', { n: PROGRAMAS.length })}</span>
            <span aria-hidden="true">·</span>
            <span>{uni.ciudad}, {uni.pais}</span>
          </div>
          <p className="mt-10 inline-flex items-center gap-2 text-[12px] text-marfil/50">
            <ChevronDown size={14} className="animate-pulso" />
            {t('campus.hero.bajar')}
          </p>
        </div>
      </section>

      {/* Manifiesto: pinneado con scrub en desktop, reveals simples en móvil */}
      <section
        data-anim="manifiesto"
        className="relative bg-noche"
        style={{ minHeight: esMobile || menosMovimiento ? undefined : '280vh' }}
      >
        <div
          className={
            esMobile || menosMovimiento
              ? 'px-4 py-20 sm:px-6'
              : 'sticky top-0 flex h-[100dvh] items-center px-4 sm:px-6'
          }
        >
          <div className="mx-auto w-full max-w-[1180px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-mineral-300">
              {t('campus.manifiesto.kicker')}
            </p>
            <div className="mt-8 space-y-1">
              {['campus.manifiesto1', 'campus.manifiesto2', 'campus.manifiesto3'].map((clave, i) => (
                <p
                  key={clave}
                  data-anim={esMobile || menosMovimiento ? 'reveal' : 'palabra'}
                  className="font-black leading-[0.95] text-marfil"
                  style={{ fontSize: 'clamp(40px,9vw,112px)', opacity: esMobile || menosMovimiento ? 1 : undefined }}
                >
                  {t(clave)}
                  {i === 2 ? (
                    <span className="mt-6 block h-[3px] w-[160px]" style={{ background: colorAcento }} />
                  ) : null}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {secciones.institucional ? (
        <section data-anim="reveal" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <p className="kicker">{t('campus.institucional.kicker')}</p>
            <h2 className="mt-3 font-black leading-tight" style={{ fontSize: 'clamp(26px,4.6vw,44px)' }}>
              {t('campus.institucional.titulo')}
            </h2>
            <span className="filete mt-4" />
            <p className="mt-6 max-w-3xl text-[clamp(16px,2vw,19px)] leading-relaxed text-tinta-sec">
              {textoInstitucional}
            </p>
          </div>
        </section>
      ) : null}

      {secciones.facultades ? (
        <section data-anim="reveal" className="border-t border-borde px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <p className="kicker">{t('campus.facultades.kicker')}</p>
            <h2 className="mt-3 font-black leading-tight" style={{ fontSize: 'clamp(26px,4.6vw,44px)' }}>
              {t('campus.facultades.titulo')}
            </h2>
            <span className="filete mt-4" />
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-tinta-sec">
              {t('campus.facultades.bajada')}
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {uni.facultades.map((f, i) => (
                <li key={f} className="card-sapio overflow-hidden p-0">
                  <span
                    className="block h-28"
                    style={{
                      background: PLACEHOLDERS.campusFacultades.capas[i % 3],
                      backgroundImage: GRANO_SVG,
                    }}
                    aria-label={lang === 'en' ? PLACEHOLDERS.campusFacultades.altEn : PLACEHOLDERS.campusFacultades.altEs}
                    role="img"
                  />
                  <span className="block p-4">
                    <span className="num block text-[11px] font-bold tracking-[0.1em] text-champan-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-1.5 block text-[16px] font-black leading-snug">{f}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {secciones.programas ? (
        <section data-anim="reveal" className="border-t border-borde bg-marfil-200/50 px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <p className="kicker">{t('campus.programas.kicker')}</p>
            <h2 className="mt-3 font-black leading-tight" style={{ fontSize: 'clamp(26px,4.6vw,44px)' }}>
              {t('campus.programas.titulo')}
            </h2>
            <span className="filete mt-4" />
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-tinta-sec">
              {t('campus.programas.bajada')}
            </p>
            <ul className="mt-8 grid gap-3 md:grid-cols-2">
              {PROGRAMAS.map((p) => (
                <li key={p.id} className="card-sapio p-4 sm:p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-mineral-texto">{p.facultad}</p>
                  <h3 className="mt-2 text-[17px] font-black leading-snug">
                    {lang === 'en' ? p.nombreEn : p.nombreEs}
                  </h3>
                  <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-tinta-sec">
                    <div className="flex gap-1.5">
                      <dt className="font-bold">{t('campus.duracion')}:</dt>
                      <dd className="num">{t('campus.semestres', { n: p.semestres })}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="font-bold">{t('campus.modalidad')}:</dt>
                      <dd>{p.modalidad === 'mixta' ? t('campus.mixta') : t('campus.presencial')}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {secciones.contacto ? (
        <section data-anim="reveal" className="border-t border-borde px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <p className="kicker">{t('campus.contacto.kicker')}</p>
            <h2 className="mt-3 font-black leading-tight" style={{ fontSize: 'clamp(26px,4.6vw,44px)' }}>
              {t('campus.contacto.titulo')}
            </h2>
            <span className="filete mt-4" />
            <ul className="mt-7 space-y-2.5">
              <li className="flex items-center gap-2.5 text-[15px]">
                <Mail size={16} className="shrink-0 text-mineral-texto" />
                <span className="num">{esElCampusEditado ? campus.emailContacto : `posgrado@${uni.slug}.sapio.example`}</span>
              </li>
              <li className="flex items-center gap-2.5 text-[15px]">
                <Phone size={16} className="shrink-0 text-mineral-texto" />
                <span className="num">{esElCampusEditado ? campus.telefono : '+1 555 0100'}</span>
              </li>
            </ul>
            <div className="mt-8">
              <CtaWhatsapp variante="primario" tam="lg" dataTour={false} />
            </div>
          </div>
        </section>
      ) : null}

      <footer className="border-t border-borde px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3">
          <Isotipo size={18} className="text-mineral-texto" />
          <p className="text-[12px] text-tinta-sec">{t('campus.footer')}</p>
          <p className="ml-auto text-[11px] text-tinta-sec/70">{t('app.demoPill')}</p>
        </div>
      </footer>
    </div>
  )
}
