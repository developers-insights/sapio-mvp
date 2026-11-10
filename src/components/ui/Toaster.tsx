import { CheckCircle2, Info, TriangleAlert, X, CircleX } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'

export function Toaster() {
  const toasts = useUI((s) => s.toasts)
  const quitar = useUI((s) => s.quitarToast)
  const { t } = useT()
  if (!toasts.length) return null
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9000] flex flex-col items-center gap-2 px-4 pt-3 sm:items-end sm:pr-5"
      style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}
      role="status"
      aria-live="polite"
    >
      {toasts.map((x) => {
        const icono = {
          ok: <CheckCircle2 size={16} className="text-mineral-texto" />,
          info: <Info size={16} className="text-pizarra dark:text-[#8fb6cf]" />,
          alerta: <TriangleAlert size={16} className="text-champan-700 dark:text-champan" />,
          error: <CircleX size={16} className="text-terroso" />,
        }[x.tono]
        return (
          <div
            key={x.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-[min(420px,100vw-32px)] items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-sapio-lg animate-fade-up dark:bg-noche-800',
              x.tono === 'error' ? 'border-terroso/40' : 'border-borde dark:border-[#27425a]',
            )}
          >
            <span className="mt-0.5 shrink-0">{icono}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-snug">{x.titulo}</p>
              {x.detalle ? (
                <p className="mt-0.5 text-[12.5px] leading-snug text-tinta-sec dark:text-marfil/60">
                  {x.detalle}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => quitar(x.id)}
              aria-label={t('app.cerrar')}
              className="-m-1 grid h-8 w-8 shrink-0 place-items-center rounded text-tinta-sec hover:text-noche dark:hover:text-marfil"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
