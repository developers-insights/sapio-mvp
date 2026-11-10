import type { Role } from '@/data/tipos'

export interface ItemNav {
  id: string
  claveLabel: string
  ruta: string
  icono: string
  /** Para la guarda de rutas y el tour. */
  bloqueado?: boolean
}

export interface CategoriaNav {
  id: string
  claveKicker: string
  items: ItemNav[]
}

const COMERCIAL: CategoriaNav = {
  id: 'comercial',
  claveKicker: 'nav.cat.comercial',
  items: [{ id: 'propuesta', claveLabel: 'nav.propuesta', ruta: '/propuesta', icono: 'FileText' }],
}

const PROXIMAMENTE: CategoriaNav = {
  id: 'proximamente',
  claveKicker: 'nav.cat.proximamente',
  items: [
    { id: 'fases23', claveLabel: 'nav.fases23', ruta: '/proximamente', icono: 'Lock', bloqueado: true },
  ],
}

export const MENU_POR_ROL: Record<Role, CategoriaNav[]> = {
  super: [
    COMERCIAL,
    {
      id: 'plataforma',
      claveKicker: 'nav.cat.plataforma',
      items: [
        { id: 'panel', claveLabel: 'nav.panel', ruta: '/plataforma/panel', icono: 'LayoutDashboard' },
        { id: 'universidades', claveLabel: 'nav.universidades', ruta: '/plataforma/universidades', icono: 'Building2' },
        { id: 'planes', claveLabel: 'nav.planes', ruta: '/plataforma/planes', icono: 'Tags' },
        { id: 'roles', claveLabel: 'nav.rolesPermisos', ruta: '/plataforma/roles', icono: 'ShieldCheck' },
      ],
    },
    {
      id: 'seguridad',
      claveKicker: 'nav.cat.seguridad',
      items: [
        { id: 'auditoria', claveLabel: 'nav.auditoria', ruta: '/plataforma/auditoria', icono: 'ScrollText' },
        { id: 'seguridad', claveLabel: 'nav.seguridad', ruta: '/plataforma/seguridad', icono: 'Lock' },
      ],
    },
    {
      id: 'marca',
      claveKicker: 'nav.cat.marca',
      items: [{ id: 'marca', claveLabel: 'nav.sistemaDiseno', ruta: '/plataforma/marca', icono: 'Palette' }],
    },
    PROXIMAMENTE,
  ],
  universidad: [
    COMERCIAL,
    {
      id: 'campus',
      claveKicker: 'nav.cat.campus',
      items: [
        { id: 'panel', claveLabel: 'nav.panel', ruta: '/universidad/panel', icono: 'LayoutDashboard' },
        { id: 'miembros', claveLabel: 'nav.miembros', ruta: '/universidad/miembros', icono: 'Users' },
        { id: 'invitaciones', claveLabel: 'nav.invitaciones', ruta: '/universidad/invitaciones', icono: 'MailPlus' },
        { id: 'campus-editor', claveLabel: 'nav.campusEditor', ruta: '/universidad/campus-editor', icono: 'PanelsTopLeft' },
        { id: 'roles', claveLabel: 'nav.roles', ruta: '/universidad/roles', icono: 'ShieldCheck' },
      ],
    },
    {
      id: 'facturacion',
      claveKicker: 'nav.cat.facturacion',
      items: [
        { id: 'suscripcion', claveLabel: 'nav.suscripcion', ruta: '/universidad/suscripcion', icono: 'CreditCard' },
      ],
    },
    PROXIMAMENTE,
  ],
  profesor: [
    COMERCIAL,
    {
      id: 'mi-espacio',
      claveKicker: 'nav.cat.miEspacio',
      items: [
        { id: 'inicio', claveLabel: 'nav.inicio', ruta: '/workplace', icono: 'House' },
        { id: 'calendario', claveLabel: 'nav.calendario', ruta: '/workplace/calendario', icono: 'CalendarDays' },
        { id: 'tareas', claveLabel: 'nav.tareas', ruta: '/workplace/tareas', icono: 'ListChecks' },
        { id: 'documentos', claveLabel: 'nav.documentos', ruta: '/workplace/documentos', icono: 'Files' },
        { id: 'proyectos', claveLabel: 'nav.proyectos', ruta: '/workplace/proyectos', icono: 'FolderKanban' },
        { id: 'mesas', claveLabel: 'nav.mesas', ruta: '/workplace/mesas', icono: 'Table2' },
        { id: 'chat', claveLabel: 'nav.chat', ruta: '/chat', icono: 'MessagesSquare' },
        { id: 'asistente', claveLabel: 'nav.asistente', ruta: '/workplace/asistente', icono: 'Sparkles' },
        { id: 'notificaciones', claveLabel: 'nav.notificaciones', ruta: '/workplace/notificaciones', icono: 'Bell' },
      ],
    },
    PROXIMAMENTE,
  ],
  estudiante: [
    COMERCIAL,
    {
      id: 'mi-espacio',
      claveKicker: 'nav.cat.miEspacio',
      items: [
        { id: 'inicio', claveLabel: 'nav.inicio', ruta: '/workplace', icono: 'House' },
        { id: 'calendario', claveLabel: 'nav.calendario', ruta: '/workplace/calendario', icono: 'CalendarDays' },
        { id: 'tareas', claveLabel: 'nav.tareas', ruta: '/workplace/tareas', icono: 'ListChecks' },
        { id: 'documentos', claveLabel: 'nav.documentos', ruta: '/workplace/documentos', icono: 'Files' },
        { id: 'proyectos', claveLabel: 'nav.proyectos', ruta: '/workplace/proyectos', icono: 'FolderKanban' },
        { id: 'mesas', claveLabel: 'nav.mesas', ruta: '/workplace/mesas', icono: 'Table2' },
        { id: 'chat', claveLabel: 'nav.chat', ruta: '/chat', icono: 'MessagesSquare' },
        { id: 'asistente', claveLabel: 'nav.asistente', ruta: '/workplace/asistente', icono: 'Sparkles' },
        { id: 'notificaciones', claveLabel: 'nav.notificaciones', ruta: '/workplace/notificaciones', icono: 'Bell' },
      ],
    },
    PROXIMAMENTE,
  ],
  colaborador: [
    COMERCIAL,
    {
      id: 'mi-espacio',
      claveKicker: 'nav.cat.miEspacio',
      items: [
        { id: 'inicio', claveLabel: 'nav.inicio', ruta: '/workplace', icono: 'House' },
        { id: 'tareas', claveLabel: 'nav.tareas', ruta: '/workplace/tareas', icono: 'ListChecks' },
        { id: 'documentos', claveLabel: 'nav.documentos', ruta: '/workplace/documentos', icono: 'Files' },
        { id: 'mesas', claveLabel: 'nav.mesas', ruta: '/workplace/mesas', icono: 'Table2' },
        { id: 'chat', claveLabel: 'nav.chat', ruta: '/chat', icono: 'MessagesSquare' },
        { id: 'asistente', claveLabel: 'nav.asistente', ruta: '/workplace/asistente', icono: 'Sparkles' },
        { id: 'notificaciones', claveLabel: 'nav.notificaciones', ruta: '/workplace/notificaciones', icono: 'Bell' },
      ],
    },
    PROXIMAMENTE,
  ],
}

/** 4 ítems de la bottom-nav por rol (el 5º es "Más"). */
export const BOTTOM_NAV: Record<Role, string[]> = {
  super: ['panel', 'universidades', 'auditoria', 'roles'],
  universidad: ['panel', 'miembros', 'invitaciones', 'suscripcion'],
  profesor: ['inicio', 'mesas', 'chat', 'tareas'],
  estudiante: ['inicio', 'mesas', 'chat', 'tareas'],
  colaborador: ['inicio', 'mesas', 'chat', 'documentos'],
}

export function itemsPlanos(rol: Role): ItemNav[] {
  return MENU_POR_ROL[rol].flatMap((c) => c.items)
}

export function itemPorId(rol: Role, id: string) {
  return itemsPlanos(rol).find((i) => i.id === id)
}

/**
 * Guarda de rutas por rol. Devuelve true si el rol puede ver la ruta.
 * Las rutas comunes (propuesta, próximamente, invitación, campus) las ve todo el mundo.
 */
const PREFIJOS_POR_ROL: Record<Role, string[]> = {
  super: ['/plataforma'],
  universidad: ['/universidad'],
  profesor: ['/workplace', '/chat', '/mesa'],
  estudiante: ['/workplace', '/chat', '/mesa'],
  colaborador: ['/workplace', '/chat', '/mesa'],
}

const COMUNES = ['/propuesta', '/proximamente', '/invitacion', '/campus', '/login']

/** El colaborador no ve el calendario institucional ni proyectos a los que no fue invitado. */
const VETADAS_POR_ROL: Record<Role, string[]> = {
  super: [],
  universidad: [],
  profesor: [],
  estudiante: [],
  colaborador: ['/workplace/calendario', '/workplace/proyectos'],
}

export function puedeVer(rol: Role, ruta: string): boolean {
  if (COMUNES.some((p) => ruta.startsWith(p))) return true
  if (VETADAS_POR_ROL[rol].some((p) => ruta.startsWith(p))) return false
  return PREFIJOS_POR_ROL[rol].some((p) => ruta.startsWith(p))
}
