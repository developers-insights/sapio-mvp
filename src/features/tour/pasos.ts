import type { Lang } from '@/i18n/tipos'
import type { Role } from '@/data/tipos'
import { tr } from '@/i18n'
import { BOTTOM_NAV, itemPorId, itemsPlanos } from '@/lib/navegacion'

export interface PasoTour {
  id: string
  /** Sin selector: tooltip centrado (bienvenida y cierre). */
  selector: string | null
  titulo: string
  cuerpo: string
}

/** Descripción de cada ítem del menú, con datos del mock. */
function cuerpoItem(id: string, rol: Role, lang: Lang) {
  if (id === 'panel') return tr(`tour.item.panel.${rol === 'super' ? 'super' : 'universidad'}`, lang)
  return tr(`tour.item.${id}`, lang)
}

/**
 * Pasos del tour. Arranque MANUAL: solo desde el botón ✨ Tour del topbar.
 * En móvil los pasos apuntan a la bottom-nav, a las tabs y al botón de menú,
 * nunca a selectores del sidebar.
 */
export function getTourSteps(rol: Role, lang: Lang, esMobile: boolean): PasoTour[] {
  const pasos: PasoTour[] = []

  // 1 · bienvenida centrada por rol
  pasos.push({
    id: 'bienvenida',
    selector: null,
    titulo: tr(`tour.bienvenida.${rol}`, lang),
    cuerpo: tr(`tour.bienvenida.${rol}Cuerpo`, lang),
  })

  // 2 · overview de navegación
  pasos.push({
    id: 'navegacion',
    selector: esMobile ? '[data-tour="bottom-nav"]' : '[data-tour="sidebar-nav"]',
    titulo: tr('tour.navegacion', lang),
    cuerpo: esMobile ? tr('tour.navegacionMobile', lang) : tr('tour.navegacionDesktop', lang),
  })

  // 3 · un paso por CADA ítem del menú del rol, en orden visual y numerado
  if (esMobile) {
    const ids = BOTTOM_NAV[rol]
    ids.forEach((id, i) => {
      const item = itemPorId(rol, id)
      if (!item) return
      pasos.push({
        id: `tab-${id}`,
        selector: `[data-tour="tab-${id}"]`,
        titulo: `${i + 1}. ${tr(item.claveLabel, lang)}`,
        cuerpo: cuerpoItem(id, rol, lang),
      })
    })
    pasos.push({
      id: 'mobile-menu',
      selector: '[data-tour="mobile-menu"]',
      titulo: `${ids.length + 1}. ${tr('tour.menuMobile', lang)}`,
      cuerpo: tr('tour.menuMobileCuerpo', lang),
    })
  } else {
    itemsPlanos(rol).forEach((item, i) => {
      pasos.push({
        id: `nav-${item.id}`,
        selector: `[data-tour="nav-${item.id}"]`,
        titulo: `${i + 1}. ${tr(item.claveLabel, lang)}`,
        cuerpo: cuerpoItem(item.id, rol, lang),
      })
    })
  }

  // 4 · role switcher. En móvil vive dentro del sheet "Más", así que el paso
  // apunta a la tab que lo abre: nunca a un selector del sidebar.
  pasos.push({
    id: 'switch-user',
    selector: esMobile ? '[data-tour="tab-mas"]' : '[data-tour="switch-user"]',
    titulo: tr('tour.switch', lang),
    cuerpo: tr('tour.switchCuerpo', lang),
  })

  // 5 · CTA (ídem: en móvil está en el sheet "Más")
  pasos.push({
    id: 'whatsapp-cta',
    selector: esMobile ? '[data-tour="tab-mas"]' : '[data-tour="whatsapp-cta"]',
    titulo: tr('tour.cta', lang),
    cuerpo: tr('tour.ctaCuerpo', lang),
  })

  return pasos
}
