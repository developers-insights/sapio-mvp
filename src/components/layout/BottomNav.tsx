import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Ellipsis, LogOut, ExternalLink } from 'lucide-react'
import { BOTTOM_NAV, itemPorId, MENU_POR_ROL } from '@/lib/navegacion'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Icono } from './Icono'
import { Hoja } from '@/components/ui/Modal'
import { RoleSwitcher } from './RoleSwitcher'
import { CtaWhatsapp } from './CtaWhatsapp'
import { Avatar } from '@/components/ui/Piezas'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { cn } from '@/lib/cn'

export function BottomNav() {
  const rol = useUI((s) => s.rol)
  const abierto = useUI((s) => s.sheetMasAbierto)
  const setSheet = useUI((s) => s.setSheetMas)
  const setModo = useUI((s) => s.setModo)
  const salir = useUI((s) => s.salir)
  const { t, lang } = useT()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const yo = persona(USUARIO_POR_ROL[rol])
  const uni = UNI_POR_ID[UNI_ADMIN]

  const items = BOTTOM_NAV[rol]
    .map((id) => itemPorId(rol, id))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  const enMas = !items.some(
    (i) => pathname === i.ruta || (i.ruta !== '/' && pathname.startsWith(i.ruta + '/')),
  )

  return (
    <>
      <nav
        data-tour="bottom-nav"
        aria-label={t('app.menu')}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-borde bg-marfil/96 backdrop-blur-md lg:hidden dark:border-[#27425a] dark:bg-noche/96"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="grid grid-cols-5">
          {items.map((item) => {
            const activo =
              pathname === item.ruta || (item.ruta !== '/' && pathname.startsWith(item.ruta + '/'))
            return (
              <li key={item.id}>
                <NavLink
                  to={item.ruta}
                  data-tour={`tab-${item.id}`}
                  className={cn(
                    'flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[10px] font-bold leading-none transition-colors',
                    activo ? 'text-mineral' : 'text-tinta-sec dark:text-marfil/55',
                  )}
                >
                  <Icono nombre={item.icono} size={19} />
                  <span className="w-full truncate text-center">{t(item.claveLabel)}</span>
                </NavLink>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={() => setSheet(true)}
              data-tour="tab-mas"
              className={cn(
                'flex w-full min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[10px] font-bold leading-none transition-colors',
                enMas ? 'text-mineral' : 'text-tinta-sec dark:text-marfil/55',
              )}
            >
              <Ellipsis size={19} />
              <span>{t('app.mas')}</span>
            </button>
          </li>
        </ul>
      </nav>

      <Hoja abierto={abierto} onCerrar={() => setSheet(false)} titulo={t('app.menu')} zIndex={75}>
        <div className="space-y-5">
          {MENU_POR_ROL[rol].map((cat) => (
            <div key={cat.id}>
              <p className="pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-tinta-sec/80 dark:text-marfil/40">
                {t(cat.claveKicker)}
              </p>
              <ul className="grid grid-cols-2 gap-1.5">
                {cat.items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.ruta}
                      onClick={() => setSheet(false)}
                      className="flex min-h-[48px] items-center gap-2.5 rounded-xl border border-borde bg-white px-3 text-[13px] font-bold dark:border-[#27425a] dark:bg-noche-800"
                    >
                      <Icono nombre={item.icono} size={16} className="shrink-0 text-mineral" />
                      <span className="truncate">{t(item.claveLabel)}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {rol === 'universidad' ? (
            <button
              type="button"
              onClick={() => {
                setSheet(false)
                setModo('campus')
                navigate(`/campus/${uni.slug}`)
              }}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border border-borde bg-white px-3 text-[13px] font-bold dark:border-[#27425a] dark:bg-noche-800"
            >
              <ExternalLink size={14} />
              {t('nav.verCampusPublico')}
            </button>
          ) : null}

          <RoleSwitcher compacto />
          <CtaWhatsapp variante="mineral" className="w-full" dataTour={false} />

          <div className="flex items-center gap-2.5 border-t border-borde pt-3.5 dark:border-[#27425a]">
            <Avatar personaId={yo.id} size={34} presencia />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold leading-tight">{yo.nombre}</p>
              <p className="truncate text-[11px] leading-tight text-tinta-sec dark:text-marfil/50">
                {lang === 'en' ? yo.cargoEn : yo.cargoEs}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSheet(false)
                salir()
                navigate('/login')
              }}
              aria-label={t('app.salir')}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-tinta-sec"
            >
              <LogOut size={16} />
            </button>
          </div>
          <p className="text-[10px] text-tinta-sec/80 dark:text-marfil/40">{t('app.poweredBy')}</p>
        </div>
      </Hoja>
    </>
  )
}
