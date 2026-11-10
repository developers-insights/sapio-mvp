import * as React from 'react'
import { Wrench, ChevronDown, Check, Lock, Inbox, TriangleAlert, Info } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useT } from '@/i18n'
import { useUI } from '@/store/ui'
import { persona } from '@/data/personas'

/** Kicker numerado + título Lato Heavy + filete champán (firma visual del manual). */
export function EncabezadoSeccion({
  kicker,
  titulo,
  bajada,
  acciones,
  className,
  id,
  nivel = 1,
}: {
  kicker: string
  titulo: React.ReactNode
  bajada?: React.ReactNode
  acciones?: React.ReactNode
  className?: string
  id?: string
  nivel?: 1 | 2
}) {
  const H = nivel === 1 ? 'h1' : 'h2'
  return (
    <header className={cn('mb-6 sm:mb-8', className)} id={id}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="kicker">{kicker}</p>
          <H
            className={cn(
              'mt-2 font-black leading-[1.05]',
              nivel === 1 ? 'text-[clamp(26px,5.4vw,40px)]' : 'text-[clamp(22px,4vw,30px)]',
            )}
          >
            {titulo}
          </H>
          <span className="filete mt-3" />
          {bajada ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-tinta-sec dark:text-marfil/70">
              {bajada}
            </p>
          ) : null}
        </div>
        {acciones ? <div className="flex flex-wrap items-center gap-2">{acciones}</div> : null}
      </div>
    </header>
  )
}

export function Pildora({
  children,
  tono = 'neutro',
  className,
  icono,
}: {
  children: React.ReactNode
  tono?: 'neutro' | 'mineral' | 'pizarra' | 'champan' | 'terroso' | 'noche'
  className?: string
  icono?: React.ReactNode
}) {
  const tonos = {
    neutro:
      'bg-marfil-200 text-tinta-sec border-borde dark:bg-noche-700 dark:text-marfil/70 dark:border-[#27425a]',
    mineral: 'bg-mineral/12 text-mineral-700 border-mineral/30 dark:text-mineral-300',
    pizarra: 'bg-pizarra/12 text-pizarra border-pizarra/25 dark:text-[#8fb6cf]',
    champan: 'bg-champan/15 text-champan-700 border-champan/35 dark:text-champan',
    terroso: 'bg-terroso/12 text-terroso-600 border-terroso/30 dark:text-[#d79a8c]',
    noche: 'bg-noche text-marfil border-noche dark:bg-marfil dark:text-noche',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] leading-none',
        tonos[tono],
        className,
      )}
    >
      {icono}
      {children}
    </span>
  )
}

const TONO_ESTADO: Record<string, 'neutro' | 'mineral' | 'pizarra' | 'champan' | 'terroso'> = {
  pendiente: 'champan',
  aprobado: 'mineral',
  rechazado: 'terroso',
  enviada: 'pizarra',
  aceptada: 'mineral',
  vencida: 'terroso',
  vencido: 'terroso',
  cancelada: 'neutro',
  activa: 'mineral',
  activo: 'mineral',
  prueba: 'pizarra',
  suspendida: 'terroso',
  suspendido: 'terroso',
  pagada: 'mineral',
  'por-hacer': 'neutro',
  'en-curso': 'pizarra',
  'en-revision': 'champan',
  hecha: 'mineral',
  atrasada: 'terroso',
  ok: 'mineral',
  bloqueado: 'terroso',
  conectado: 'mineral',
  ausente: 'champan',
  desconectado: 'neutro',
}

export function EstadoBadge({ estado, className }: { estado: string; className?: string }) {
  const { t } = useT()
  const clave = estado === 'error' ? 'estado.errorRes' : `estado.${estado}`
  return (
    <Pildora tono={TONO_ESTADO[estado] ?? 'neutro'} className={className}>
      {t(clave)}
    </Pildora>
  )
}

export function Avatar({
  personaId,
  size = 36,
  presencia,
  className,
}: {
  personaId: string
  size?: number
  presencia?: boolean
  className?: string
}) {
  const p = persona(personaId)
  const punto =
    p.presencia === 'conectado' ? '#527D79' : p.presencia === 'ausente' ? '#C9A974' : '#9aa6ad'
  return (
    <span className={cn('relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      <span
        className="grid h-full w-full place-items-center rounded-full font-black text-marfil"
        style={{ background: p.color, fontSize: size * 0.38 }}
        aria-hidden="true"
      >
        {p.iniciales}
      </span>
      {presencia ? (
        <span
          className="absolute -bottom-0 -right-0 rounded-full border-2 border-white dark:border-noche-800"
          style={{ width: size * 0.3, height: size * 0.3, background: punto }}
          aria-hidden="true"
        />
      ) : null}
      <span className="sr-only">{p.nombre}</span>
    </span>
  )
}

export function AvatarUni({
  iniciales,
  color,
  size = 36,
  className,
}: {
  iniciales: string
  color: string
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn('grid shrink-0 place-items-center rounded-xl font-black text-marfil', className)}
      style={{ width: size, height: size, background: color, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {iniciales}
    </span>
  )
}

/** DevNotice ámbar suave sobre funciones simuladas que requieren infraestructura real. */
export function DevNotice({
  funcion,
  hoy,
  alDesarrollar,
  className,
}: {
  funcion: string
  hoy: string
  alDesarrollar: string
  className?: string
}) {
  const { t } = useT()
  return (
    <aside
      className={cn(
        'flex gap-3 rounded-2xl border border-champan/45 bg-champan/[.09] p-3.5 sm:p-4',
        className,
      )}
    >
      <Wrench size={17} className="mt-0.5 shrink-0 text-champan-700 dark:text-champan" />
      <div className="min-w-0 text-[13px] leading-relaxed">
        <p className="font-bold text-noche dark:text-marfil">
          {funcion} · {t('dev.titulo')}
        </p>
        <p className="mt-1 text-tinta-sec dark:text-marfil/70">
          <span className="font-bold">{t('dev.hoy')}</span> {hoy}
        </p>
        <p className="mt-0.5 text-tinta-sec dark:text-marfil/70">
          <span className="font-bold">{t('dev.alDesarrollar')}</span> {alDesarrollar}
        </p>
      </div>
    </aside>
  )
}

/** Preview banner: arriba de cada vista de módulo. Colapsable solo por sesión. */
export function PreviewBanner({
  id,
  titulo,
  bullets,
}: {
  id: string
  titulo: string
  bullets: [string, string, string]
}) {
  const { t } = useT()
  const colapsados = useUI((s) => s.bannersColapsados)
  const toggle = useUI((s) => s.toggleBanner)
  const abierto = !colapsados.includes(id)
  return (
    <section
      className="mb-6 rounded-2xl border border-pizarra/25 bg-pizarra/[.06] p-4 dark:border-[#27425a] dark:bg-noche-800/60"
      data-preview-banner={id}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Pildora tono="pizarra">{t('app.previewNavegable')}</Pildora>
        <Pildora tono="neutro">{t('app.datosMock')}</Pildora>
        <button
          type="button"
          onClick={() => toggle(id)}
          aria-expanded={abierto}
          className="ml-auto inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-tinta-sec transition-colors hover:text-noche dark:text-marfil/60 dark:hover:text-marfil"
        >
          {abierto ? t('banner.colapsar') : t('banner.expandir')}
          <ChevronDown size={14} className={cn('transition-transform', abierto && 'rotate-180')} />
        </button>
      </div>
      {abierto ? (
        <div className="mt-3">
          <p className="text-sm font-black">{titulo}</p>
          <ul className="mt-2.5 grid gap-2 md:grid-cols-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/70">
                <Check size={14} className="mt-[3px] shrink-0 text-mineral" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

export function Kpi({
  etiqueta,
  valor,
  detalle,
  tono = 'neutro',
  icono,
  onClick,
}: {
  etiqueta: string
  valor: string | number
  detalle?: string
  tono?: 'neutro' | 'mineral' | 'terroso' | 'champan'
  icono?: React.ReactNode
  onClick?: () => void
}) {
  const colorValor = {
    neutro: 'text-noche dark:text-marfil',
    mineral: 'text-mineral dark:text-mineral-300',
    terroso: 'text-terroso dark:text-[#d79a8c]',
    champan: 'text-champan-700 dark:text-champan',
  }[tono]
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'card-sapio p-4 text-left sm:p-5',
        onClick && 'min-h-[44px] transition-[border-color,box-shadow] hover:border-mineral hover:shadow-sapio-lg',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-sec dark:text-marfil/55">
          {etiqueta}
        </p>
        {icono ? <span className="shrink-0 text-mineral">{icono}</span> : null}
      </div>
      <p
        className={cn('num mt-2 font-black leading-none', colorValor)}
        style={{ fontSize: 'clamp(26px,5vw,34px)' }}
      >
        {valor}
      </p>
      {detalle ? (
        <p className="mt-2 text-[12.5px] leading-snug text-tinta-sec dark:text-marfil/60">{detalle}</p>
      ) : null}
    </Comp>
  )
}

export function EstadoVacio({
  titulo,
  detalle,
  accion,
  icono,
}: {
  titulo: string
  detalle?: string
  accion?: React.ReactNode
  icono?: React.ReactNode
}) {
  return (
    <div className="card-sapio flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-marfil-200 text-tinta-sec dark:bg-noche-700 dark:text-marfil/60">
        {icono ?? <Inbox size={20} />}
      </span>
      <p className="text-base font-black">{titulo}</p>
      {detalle ? (
        <p className="max-w-sm text-sm text-tinta-sec dark:text-marfil/60">{detalle}</p>
      ) : null}
      {accion}
    </div>
  )
}

export function EstadoCargando({ filas = 3 }: { filas?: number }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: filas }, (_, i) => (
        <div key={i} className="card-sapio animate-pulse p-4">
          <div className="h-3 w-1/3 rounded bg-marfil-200 dark:bg-noche-700" />
          <div className="mt-3 h-3 w-2/3 rounded bg-marfil-200 dark:bg-noche-700" />
        </div>
      ))}
    </div>
  )
}

export function EstadoError({ titulo, detalle, onReintentar }: { titulo: string; detalle: string; onReintentar?: () => void }) {
  const { t } = useT()
  return (
    <div className="card-sapio flex flex-col items-center gap-3 border-terroso/35 px-6 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-terroso/12 text-terroso">
        <TriangleAlert size={20} />
      </span>
      <p className="text-base font-black">{titulo}</p>
      <p className="max-w-sm text-sm text-tinta-sec dark:text-marfil/60">{detalle}</p>
      {onReintentar ? (
        <button
          type="button"
          onClick={onReintentar}
          className="min-h-[44px] rounded-xl border border-borde px-4 text-sm font-bold transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a]"
        >
          {t('app.reintentar')}
        </button>
      ) : null}
    </div>
  )
}

export function TarjetaBloqueada({
  fase,
  nombre,
  linea,
}: {
  fase: string
  nombre: string
  linea: string
}) {
  return (
    <article className="relative rounded-2xl border border-dashed border-borde bg-marfil-200/50 p-4 sm:p-5 dark:border-[#27425a] dark:bg-noche-800/40">
      <div className="flex items-center justify-between gap-2">
        <Pildora tono="champan" icono={<Lock size={11} />}>
          {fase}
        </Pildora>
      </div>
      <h4 className="mt-3 text-[15px] font-black leading-snug text-noche/75 dark:text-marfil/70">
        {nombre}
      </h4>
      <p className="mt-1.5 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/50">{linea}</p>
    </article>
  )
}

/** Popover sobrio, accesible por tap (nunca solo-hover). */
export function Popover({
  disparador,
  children,
  ancho = 300,
  etiqueta,
}: {
  disparador: React.ReactNode
  children: React.ReactNode
  ancho?: number
  etiqueta: string
}) {
  const [abierto, setAbierto] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!abierto) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [abierto])
  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        aria-expanded={abierto}
        aria-label={etiqueta}
        onClick={() => setAbierto((v) => !v)}
        className="inline-flex min-h-[32px] items-center"
      >
        {disparador}
      </button>
      {abierto ? (
        <div
          role="dialog"
          className="absolute left-0 top-[calc(100%+8px)] z-50 rounded-xl border border-borde bg-white p-3.5 text-[13px] leading-relaxed shadow-sapio-lg animate-fade-up dark:border-[#27425a] dark:bg-noche-800"
          style={{ width: `min(${ancho}px, calc(100vw - 32px))` }}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export function ChipInteruniversitario() {
  const { t } = useT()
  return (
    <Popover
      etiqueta={t('interuni.chip')}
      disparador={
        <Pildora tono="pizarra" icono={<Info size={11} />} className="cursor-pointer">
          {t('interuni.chip')}
        </Pildora>
      }
    >
      <p className="text-tinta-sec dark:text-marfil/70">{t('interuni.explica')}</p>
    </Popover>
  )
}

/** Tabla responsive: tarjetas apiladas en mobile, tabla real en desktop. */
export function Tabla({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('scroll-x-contenida card-sapio', className)}>
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  )
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        'whitespace-nowrap border-b border-borde px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:border-[#27425a] dark:text-marfil/55',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <td className={cn('border-b border-borde/70 px-4 py-3 align-middle dark:border-[#27425a]/70', className)}>
      {children}
    </td>
  )
}
