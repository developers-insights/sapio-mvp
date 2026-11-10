import { useNavigate } from 'react-router-dom'
import { Bell, Menu, Search, Sparkles, Sun, Moon } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Firma } from '@/assets/brand/Isotipo'
import { Pildora, Avatar } from '@/components/ui/Piezas'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { NOTIFICACIONES } from '@/data/gestion'
import { useDatos } from '@/store/datos'

export function Topbar() {
  const { t } = useT()
  const navigate = useNavigate()
  const rol = useUI((s) => s.rol)
  const tema = useUI((s) => s.tema)
  const lang = useUI((s) => s.lang)
  const toggleTema = useUI((s) => s.toggleTema)
  const toggleLang = useUI((s) => s.toggleLang)
  const setBuscador = useUI((s) => s.setBuscador)
  const setTour = useUI((s) => s.setTour)
  const setSheetMas = useUI((s) => s.setSheetMas)
  const leidas = useDatos((s) => s.notificacionesLeidas)
  const yo = persona(USUARIO_POR_ROL[rol])

  const sinLeer = NOTIFICACIONES.filter(
    (n) => n.paraRoles.includes(rol) && !n.leida && !leidas.includes(n.id),
  ).length

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-marfil/92 backdrop-blur-md dark:border-[#27425a] dark:bg-noche/92">
      <div className="flex min-h-[60px] items-center gap-2 px-3 sm:px-5">
        {/* mobile: botón de menú + firma */}
        <button
          type="button"
          onClick={() => setSheetMas(true)}
          data-tour="mobile-menu"
          aria-label={t('app.menu')}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-tinta-sec transition-colors hover:bg-white hover:text-noche lg:hidden dark:hover:bg-noche-800"
        >
          <Menu size={19} />
        </button>
        <button
          type="button"
          onClick={() => navigate('/propuesta')}
          className="mr-1 inline-flex items-center lg:hidden"
          aria-label="Sapio"
        >
          <Firma size={18} colorIsotipo="#C9A974" />
        </button>

        {/* desktop: buscador global */}
        <button
          type="button"
          onClick={() => setBuscador(true)}
          className="hidden min-h-[40px] max-w-sm flex-1 items-center gap-2 rounded-xl border border-borde bg-white px-3 text-left text-[13px] text-tinta-sec transition-colors hover:border-mineral lg:flex dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil/55"
        >
          <Search size={15} className="shrink-0" />
          <span className="truncate">{t('app.buscar')}</span>
          <kbd className="ml-auto shrink-0 rounded border border-borde px-1.5 py-0.5 text-[10px] font-bold dark:border-[#27425a]">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <Pildora tono="neutro" className="hidden sm:inline-flex">
            {t('app.demoPill')}
          </Pildora>

          <button
            type="button"
            onClick={() => setBuscador(true)}
            aria-label={t('app.buscar')}
            className="grid h-11 w-11 place-items-center rounded-lg text-tinta-sec transition-colors hover:bg-white hover:text-noche lg:hidden dark:hover:bg-noche-800"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            onClick={() => setTour(true)}
            data-tour="boton-tour"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-bold text-mineral transition-colors hover:bg-mineral/10"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">{t('app.tour')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/workplace/notificaciones')}
            aria-label={t('app.notificaciones')}
            className="relative grid h-11 w-11 place-items-center rounded-lg text-tinta-sec transition-colors hover:bg-white hover:text-noche dark:hover:bg-noche-800"
          >
            <Bell size={18} />
            {sinLeer > 0 ? (
              <span className="num absolute right-1.5 top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-terroso px-1 text-[9px] font-black text-white">
                {sinLeer}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('app.idioma')}
            className="min-h-[40px] rounded-lg px-2 text-[12px] font-black uppercase tracking-wider text-tinta-sec transition-colors hover:bg-white hover:text-noche dark:hover:bg-noche-800"
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

          <span className="ml-1 hidden sm:inline-flex">
            <Avatar personaId={yo.id} size={32} presencia />
          </span>
        </div>
      </div>
    </header>
  )
}
