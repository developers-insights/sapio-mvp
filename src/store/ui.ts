import { create } from 'zustand'
import type { Lang } from '@/i18n/tipos'
import type { Modo, Role } from '@/data/tipos'

export type Tema = 'light' | 'dark'

export interface Toast {
  id: string
  titulo: string
  detalle?: string
  tono: 'ok' | 'info' | 'alerta' | 'error'
}

export interface Preview {
  modulo: number
  view: string
  rolePrevio: Role
  modoPrevio: Modo
  titulo: string
}

const LS = {
  tema: 'sapio_tema',
  idioma: 'sapio_idioma',
  layout: 'sapio_layout',
}
const SS = {
  sesion: 'sapio_sesion',
  welcome: 'welcome_modal_seen',
  banners: 'sapio_banners',
}

function leerLS<T extends string>(clave: string, fallback: T): T {
  try {
    const v = localStorage.getItem(clave)
    return (v as T) || fallback
  } catch {
    return fallback
  }
}
function escribirLS(clave: string, valor: string) {
  try {
    localStorage.setItem(clave, valor)
  } catch {
    /* modo privado */
  }
}
function leerSS(clave: string): string | null {
  try {
    return sessionStorage.getItem(clave)
  } catch {
    return null
  }
}
function escribirSS(clave: string, valor: string) {
  try {
    sessionStorage.setItem(clave, valor)
  } catch {
    /* modo privado */
  }
}

export const RUTA_DEFAULT: Record<Role, string> = {
  super: '/plataforma/panel',
  universidad: '/universidad/panel',
  profesor: '/workplace',
  estudiante: '/workplace',
  colaborador: '/workplace',
}

interface UIState {
  // sesión
  authed: boolean
  rol: Role
  modo: Modo
  // idioma y tema
  lang: Lang
  tema: Tema
  // capas
  welcomeAbierto: boolean
  tourAbierto: boolean
  trailerAbierto: boolean
  asistenteAbierto: boolean
  buscadorAbierto: boolean
  sheetMasAbierto: boolean
  // previsualización desde la Propuesta
  preview: Preview | null
  moduloDestacado: number | null
  // banners de preview colapsados (solo por sesión)
  bannersColapsados: string[]
  // toasts
  toasts: Toast[]
  // acciones
  entrar: (rol: Role) => void
  salir: () => void
  setRol: (rol: Role) => void
  setModo: (modo: Modo) => void
  setLang: (lang: Lang) => void
  toggleLang: () => void
  setTema: (tema: Tema) => void
  toggleTema: () => void
  cerrarWelcome: () => void
  abrirWelcomeSiCorresponde: () => void
  setTour: (v: boolean) => void
  setTrailer: (v: boolean) => void
  setAsistente: (v: boolean) => void
  setBuscador: (v: boolean) => void
  setSheetMas: (v: boolean) => void
  abrirPreview: (p: Preview) => void
  cerrarPreview: () => void
  cancelarPreview: () => void
  limpiarDestacado: () => void
  toggleBanner: (id: string) => void
  toast: (t: Omit<Toast, 'id'>) => void
  quitarToast: (id: string) => void
}

function aplicarTema(tema: Tema) {
  const raiz = document.documentElement
  if (tema === 'dark') raiz.classList.add('dark')
  else raiz.classList.remove('dark')
}

export const useUI = create<UIState>((set, get) => ({
  authed: leerSS(SS.sesion) === '1',
  rol: (leerSS('sapio_rol') as Role) || 'estudiante',
  modo: 'app',
  lang: leerLS<Lang>(LS.idioma, 'es'),
  tema: leerLS<Tema>(LS.tema, 'light'),
  welcomeAbierto: false,
  tourAbierto: false,
  trailerAbierto: false,
  asistenteAbierto: false,
  buscadorAbierto: false,
  sheetMasAbierto: false,
  preview: null,
  moduloDestacado: null,
  bannersColapsados: (() => {
    try {
      return JSON.parse(leerSS(SS.banners) || '[]') as string[]
    } catch {
      return []
    }
  })(),
  toasts: [],

  entrar: (rol) => {
    escribirSS(SS.sesion, '1')
    escribirSS('sapio_rol', rol)
    set({ authed: true, rol, modo: 'app', preview: null })
  },
  salir: () => {
    try {
      sessionStorage.removeItem(SS.sesion)
    } catch {
      /* noop */
    }
    set({ authed: false, preview: null, modo: 'app', trailerAbierto: false, tourAbierto: false })
  },
  setRol: (rol) => {
    escribirSS('sapio_rol', rol)
    // cambiar de rol a mano cancela la previsualización
    set({ rol, preview: null, sheetMasAbierto: false })
  },
  setModo: (modo) => set({ modo }),
  setLang: (lang) => {
    escribirLS(LS.idioma, lang)
    document.documentElement.setAttribute('lang', lang)
    set({ lang })
  },
  toggleLang: () => {
    const siguiente: Lang = get().lang === 'es' ? 'en' : 'es'
    get().setLang(siguiente)
  },
  setTema: (tema) => {
    escribirLS(LS.tema, tema)
    aplicarTema(tema)
    set({ tema })
  },
  toggleTema: () => get().setTema(get().tema === 'light' ? 'dark' : 'light'),

  cerrarWelcome: () => {
    escribirSS(SS.welcome, '1')
    set({ welcomeAbierto: false })
  },
  abrirWelcomeSiCorresponde: () => {
    if (leerSS(SS.welcome) === '1') return
    set({ welcomeAbierto: true })
  },

  setTour: (v) => set({ tourAbierto: v }),
  setTrailer: (v) => set({ trailerAbierto: v, asistenteAbierto: false, tourAbierto: false }),
  setAsistente: (v) => set({ asistenteAbierto: v }),
  setBuscador: (v) => set({ buscadorAbierto: v }),
  setSheetMas: (v) => set({ sheetMasAbierto: v }),

  abrirPreview: (p) => set({ preview: p, rol: p.rolePrevio, modo: p.modoPrevio }),
  cerrarPreview: () => {
    const p = get().preview
    if (!p) return
    set({
      preview: null,
      rol: p.rolePrevio,
      modo: p.modoPrevio,
      moduloDestacado: p.modulo,
    })
  },
  cancelarPreview: () => set({ preview: null }),
  limpiarDestacado: () => set({ moduloDestacado: null }),

  toggleBanner: (id) => {
    const actual = get().bannersColapsados
    const siguiente = actual.includes(id) ? actual.filter((x) => x !== id) : [...actual, id]
    escribirSS(SS.banners, JSON.stringify(siguiente))
    set({ bannersColapsados: siguiente })
  },

  toast: (t) => {
    const id = Math.random().toString(36).slice(2, 9)
    set({ toasts: [...get().toasts, { ...t, id }] })
    window.setTimeout(() => {
      set({ toasts: get().toasts.filter((x) => x.id !== id) })
    }, 4200)
  },
  quitarToast: (id) => set({ toasts: get().toasts.filter((x) => x.id !== id) }),
}))

// aplicar tema inicial (el script anti-flash ya lo hizo en el html)
if (typeof document !== 'undefined') {
  aplicarTema(useUI.getState().tema)
  document.documentElement.setAttribute('lang', useUI.getState().lang)
}
