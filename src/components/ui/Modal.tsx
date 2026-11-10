import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useT } from '@/i18n'

/**
 * REGLA A: los modales se centran con `fixed inset-0 m-auto h-fit`.
 * Nunca con left-1/2 top-1/2 -translate. La animación usa las propiedades
 * individuales `scale` / `translate` / `opacity`: nunca `transform`.
 */
export function Modal({
  abierto,
  onCerrar,
  titulo,
  children,
  pie,
  ancho = 560,
  cerrarAfuera = true,
  zIndex = 70,
  etiqueta,
}: {
  abierto: boolean
  onCerrar: () => void
  titulo?: React.ReactNode
  children: React.ReactNode
  pie?: React.ReactNode
  ancho?: number
  cerrarAfuera?: boolean
  zIndex?: number
  etiqueta?: string
}) {
  const { t } = useT()
  React.useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', onKey)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="fixed inset-0" style={{ zIndex }} role="presentation">
      <div
        className="absolute inset-0 bg-[rgba(16,29,43,.55)] backdrop-blur-[3px]"
        onClick={cerrarAfuera ? onCerrar : undefined}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={etiqueta ?? (typeof titulo === 'string' ? titulo : undefined)}
        data-modal-centrado="1"
        className="fixed inset-0 m-auto h-fit max-h-[88vh] overflow-y-auto rounded-2xl border border-borde bg-white shadow-sapio-lg animate-scale-in dark:border-[#27425a] dark:bg-noche-800"
        style={{ width: `min(${ancho}px, 100vw - 32px)` }}
      >
        {titulo ? (
          <div className="flex items-start justify-between gap-4 border-b border-borde px-5 py-4 dark:border-[#27425a]">
            <h3 className="text-lg font-black leading-tight">{titulo}</h3>
            <button
              type="button"
              onClick={onCerrar}
              aria-label={t('app.cerrar')}
              className="-m-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-tinta-sec transition-colors hover:bg-marfil-200 hover:text-noche dark:hover:bg-noche-700 dark:hover:text-marfil"
            >
              <X size={18} />
            </button>
          </div>
        ) : null}
        <div className="px-5 py-4">{children}</div>
        {pie ? (
          <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-2 border-t border-borde bg-white px-5 py-3.5 dark:border-[#27425a] dark:bg-noche-800">
            {pie}
          </div>
        ) : null}
      </div>
    </div>
  )
}

/** Hoja inferior para mobile (y panel lateral en desktop si se pide). */
export function Hoja({
  abierto,
  onCerrar,
  titulo,
  children,
  zIndex = 70,
  alto = '82vh',
}: {
  abierto: boolean
  onCerrar: () => void
  titulo?: React.ReactNode
  children: React.ReactNode
  zIndex?: number
  alto?: string
}) {
  const { t } = useT()
  React.useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', onKey)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previo
    }
  }, [abierto, onCerrar])

  if (!abierto) return null
  return (
    <div className="fixed inset-0" style={{ zIndex }}>
      <div
        className="absolute inset-0 bg-[rgba(16,29,43,.55)] backdrop-blur-[3px]"
        onClick={onCerrar}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-2xl border-t border-borde bg-white animate-slide-up dark:border-[#27425a] dark:bg-noche-800"
        style={{ maxHeight: alto, paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-borde px-4 py-3 dark:border-[#27425a]">
          <div className="min-w-0 flex-1">
            <span className="mx-auto mb-2 block h-1 w-10 rounded-full bg-borde dark:bg-[#27425a]" />
            {titulo ? <h3 className="truncate text-base font-black">{titulo}</h3> : null}
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label={t('app.cerrar')}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-tinta-sec hover:bg-marfil-200 dark:hover:bg-noche-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  )
}
