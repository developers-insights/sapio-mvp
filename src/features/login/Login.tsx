import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Moon, Sun, PlayCircle, MessageCircle } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { BRAND } from '@/lib/brand'
import { Anillos, Firma, Isotipo, Wordmark } from '@/assets/brand/Isotipo'
import { Boton } from '@/components/ui/Boton'
import { Campo, Casilla, Input } from '@/components/ui/Campos'
import { Pildora } from '@/components/ui/Piezas'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import type { Role } from '@/data/tipos'
import { cn } from '@/lib/cn'

const ROLES: Role[] = ['super', 'universidad', 'profesor', 'estudiante', 'colaborador']

export function Login() {
  const { t } = useT()
  const navigate = useNavigate()
  const entrar = useUI((s) => s.entrar)
  const abrirWelcome = useUI((s) => s.abrirWelcomeSiCorresponde)
  const setTrailer = useUI((s) => s.setTrailer)
  const toast = useUI((s) => s.toast)
  const tema = useUI((s) => s.tema)
  const lang = useUI((s) => s.lang)
  const toggleTema = useUI((s) => s.toggleTema)
  const toggleLang = useUI((s) => s.toggleLang)

  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [recordar, setRecordar] = useState(true)
  const [rolElegido, setRolElegido] = useState<Role>('estudiante')
  const [revelar, setRevelar] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setRevelar(true), 80)
    return () => window.clearTimeout(id)
  }, [])

  function autorrellenar(rol: Role) {
    const p = persona(USUARIO_POR_ROL[rol])
    setRolElegido(rol)
    setEmail(p.email)
    setPass('demo-sapio-2026')
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      toast({ titulo: t('login.faltaEmail'), tono: 'alerta' })
      return
    }
    entrar(rolElegido)
    // El login redirige SIEMPRE a /propuesta, con cualquier rol.
    navigate('/propuesta')
    window.setTimeout(() => abrirWelcome(), 400)
  }

  return (
    <div className="min-h-[100dvh] bg-marfil dark:bg-noche">
      <div className="flex min-h-[100dvh] flex-col lg:flex-row">
        {/* HERO · solo ≥1024px */}
        <section className="relative hidden w-[55%] shrink-0 overflow-hidden bg-noche px-12 py-14 lg:flex lg:flex-col xl:px-16">
          <Anillos
            className="pointer-events-none absolute left-1/2 top-1/2 h-[1100px] w-[1100px] -translate-x-1/2 -translate-y-1/2 opacity-80"
            cantidad={9}
            color="rgba(201,169,116,.17)"
          />
          <div className="relative flex items-center gap-4">
            <Isotipo size={30} color={BRAND.color.champan} title="Sapio" />
            <Wordmark className="text-[34px] text-marfil" />
          </div>

          <div className="relative mt-auto max-w-2xl">
            <Pildora tono="champan" className="animate-pulso border-champan/50 bg-champan/15">
              {t('app.demoPreview')}
            </Pildora>

            <h1 className="mt-7 font-black leading-[0.98] text-marfil" style={{ fontSize: 'clamp(44px,4.6vw,64px)' }}>
              <span className="block">{t('login.headline1')}</span>
              <span className="block text-marfil">{t('login.headline2')}</span>
            </h1>
            <span className="filete mt-5" />

            <p className="serif-it mt-7 text-[22px] leading-snug text-marfil/80">{t('login.claim')}</p>

            <ul className="mt-10 space-y-3.5">
              {['login.b1', 'login.b2', 'login.b3', 'login.b4'].map((clave, i) => (
                <li
                  key={clave}
                  className={cn(
                    'flex items-start gap-3 text-[15px] leading-relaxed text-marfil/78 transition-[opacity,translate] duration-700',
                    revelar ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  )}
                  style={{ transitionDelay: `${260 + i * 150}ms` }}
                >
                  <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-champan" />
                  {t(clave)}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative mt-auto pt-12 text-[11px] font-bold uppercase tracking-[0.18em] text-marfil/45">
            {t('app.poweredBy')}
          </p>
        </section>

        {/* CARD DE LOGIN */}
        <section className="flex flex-1 flex-col px-4 py-5 sm:px-8 lg:px-10 lg:py-10">
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Firma size={19} colorIsotipo="#C9A974" />
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={toggleLang}
                aria-label={t('app.idioma')}
                className="min-h-[40px] rounded-lg px-2.5 text-[12px] font-black uppercase tracking-wider text-tinta-sec transition-colors hover:bg-white hover:text-noche dark:hover:bg-noche-800"
              >
                {lang === 'es' ? 'ES' : 'EN'}
              </button>
              <button
                type="button"
                onClick={toggleTema}
                aria-label={tema === 'light' ? t('app.temaOscuro') : t('app.temaClaro')}
                className="grid h-11 w-11 place-items-center rounded-lg text-tinta-sec transition-colors hover:bg-white hover:text-noche dark:hover:bg-noche-800"
              >
                {tema === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </button>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-6">
            <Pildora tono="neutro" className="mb-5 self-start">
              {t('app.demoPill')}
            </Pildora>

            <h2 className="text-[clamp(26px,6vw,32px)] font-black leading-tight">{t('login.titulo')}</h2>
            <span className="filete mt-3" />
            <p className="mt-4 text-sm leading-relaxed text-tinta-sec dark:text-marfil/65">
              {t('login.subtitulo')}
            </p>

            <form onSubmit={enviar} className="mt-6 space-y-4">
              <Campo label={t('login.email')}>
                <Input
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder={t('login.emailPh')}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Campo>
              <Campo label={t('login.password')}>
                <Input
                  type="password"
                  value={pass}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  onChange={(e) => setPass(e.target.value)}
                />
              </Campo>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Casilla activo={recordar} onChange={setRecordar} label={t('login.recordarme')} />
                <button
                  type="button"
                  onClick={() =>
                    toast({
                      titulo: t('login.recuperar'),
                      detalle: t('login.recuperarDetalle'),
                      tono: 'info',
                    })
                  }
                  className="min-h-[44px] text-[13px] font-bold text-mineral underline-offset-4 hover:underline"
                >
                  {t('login.olvide')}
                </button>
              </div>

              <Boton type="submit" tam="lg" className="w-full">
                {t('login.entrar')}
                <ArrowRight size={17} />
              </Boton>
            </form>

            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-tinta-sec dark:text-marfil/50">
                {t('login.autorrelleno')}
              </p>
              <p className="mt-1 text-[12px] text-tinta-sec/85 dark:text-marfil/45">
                {t('login.autorrellenoAyuda')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => autorrellenar(r)}
                    className={cn(
                      'min-h-[44px] rounded-full border px-3.5 text-[13px] font-bold transition-colors',
                      rolElegido === r
                        ? 'border-mineral bg-mineral text-white'
                        : 'border-borde bg-white text-tinta-sec hover:border-mineral hover:text-mineral dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil/70',
                    )}
                  >
                    {t(r === 'universidad' ? 'rol.universidad.corto' : `rol.${r}`)}
                  </button>
                ))}
              </div>
            </div>

            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex min-h-[44px] items-center gap-2 text-[13px] font-bold text-mineral underline-offset-4 hover:underline"
            >
              <MessageCircle size={15} />
              {t('app.whatsappLink')}
            </a>

            {/* Trailer: solo ≥1024px */}
            <button
              type="button"
              onClick={() => setTrailer(true)}
              className="mt-5 hidden min-h-[44px] items-center gap-2 self-start rounded-xl border border-borde bg-white px-4 text-[13px] font-bold text-noche transition-colors hover:border-mineral hover:text-mineral lg:inline-flex dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil"
            >
              <PlayCircle size={16} />
              {t('login.trailer')}
            </button>
          </div>

          <p className="mt-auto text-center text-[10px] text-tinta-sec/70 lg:hidden dark:text-marfil/35">
            {t('app.poweredBy')}
          </p>
        </section>
      </div>
    </div>
  )
}
