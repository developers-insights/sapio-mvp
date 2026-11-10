import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ExternalLink, LogOut } from 'lucide-react'
import { MENU_POR_ROL } from '@/lib/navegacion'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Firma } from '@/assets/brand/Isotipo'
import { Icono } from './Icono'
import { RoleSwitcher } from './RoleSwitcher'
import { CtaWhatsapp } from './CtaWhatsapp'
import { Avatar } from '@/components/ui/Piezas'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { cn } from '@/lib/cn'

export function Sidebar() {
  const rol = useUI((s) => s.rol)
  const setModo = useUI((s) => s.setModo)
  const salir = useUI((s) => s.salir)
  const { t, lang } = useT()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const yo = persona(USUARIO_POR_ROL[rol])
  const uni = UNI_POR_ID[UNI_ADMIN]

  return (
    <aside className="sticky top-0 hidden h-[100dvh] w-[268px] shrink-0 flex-col self-start border-r border-borde bg-marfil lg:flex dark:border-[#27425a] dark:bg-noche">
      <div className="px-5 pb-3 pt-5">
        <button
          type="button"
          onClick={() => navigate('/propuesta')}
          className="inline-flex min-h-[44px] items-center"
          aria-label="Sapio"
        >
          <Firma size={22} colorIsotipo="#C9A974" />
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-3 pb-4"
        data-tour="sidebar-nav"
        aria-label={t('app.menu')}
      >
        {MENU_POR_ROL[rol].map((cat) => (
          <div key={cat.id} className="mb-4">
            <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-tinta-sec/80 dark:text-marfil/40">
              {t(cat.claveKicker)}
            </p>
            <ul>
              {cat.items.map((item) => {
                const activo =
                  pathname === item.ruta ||
                  (item.ruta !== '/' && pathname.startsWith(item.ruta + '/'))
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.ruta}
                      data-tour={`nav-${item.id}`}
                      className={cn(
                        'relative flex min-h-[44px] items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-bold transition-colors',
                        activo
                          ? 'bg-white text-noche shadow-sapio dark:bg-noche-800 dark:text-marfil'
                          : 'text-tinta-sec hover:bg-white/70 hover:text-noche dark:text-marfil/65 dark:hover:bg-noche-800/70 dark:hover:text-marfil',
                      )}
                    >
                      {activo ? (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-mineral" />
                      ) : null}
                      <Icono nombre={item.icono} size={17} className={activo ? 'text-mineral' : ''} />
                      <span className="truncate">{t(item.claveLabel)}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bloque inferior pinneado: siempre visible */}
      <div className="shrink-0 space-y-2.5 border-t border-borde px-3.5 pb-4 pt-3.5 dark:border-[#27425a]">
        {rol === 'universidad' ? (
          <button
            type="button"
            onClick={() => {
              setModo('campus')
              navigate(`/campus/${uni.slug}`)
            }}
            className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-borde bg-white px-3 text-[13px] font-bold transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a] dark:bg-noche-800"
          >
            <ExternalLink size={14} />
            {t('nav.verCampusPublico')}
          </button>
        ) : null}

        <RoleSwitcher />
        <CtaWhatsapp variante="mineral" className="w-full" tam="sm" />

        <div className="flex items-center gap-2.5 pt-1">
          <Avatar personaId={yo.id} size={32} presencia />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-bold leading-tight">{yo.nombre}</p>
            <p className="truncate text-[11px] leading-tight text-tinta-sec dark:text-marfil/50">
              {lang === 'en' ? yo.cargoEn : yo.cargoEs}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              salir()
              navigate('/login')
            }}
            aria-label={t('app.salir')}
            title={t('app.salir')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-tinta-sec transition-colors hover:bg-white hover:text-noche dark:hover:bg-noche-800 dark:hover:text-marfil"
          >
            <LogOut size={15} />
          </button>
        </div>

        <p className="pt-0.5 text-[10px] text-tinta-sec/80 dark:text-marfil/40">
          {t('app.poweredBy')}
        </p>
      </div>
    </aside>
  )
}
