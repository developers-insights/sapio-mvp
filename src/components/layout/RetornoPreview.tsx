import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'

/**
 * Pill flotante de retorno a la Propuesta, con anillo verde mineral que late.
 * Se cancela si el usuario navega por el menú o cambia de rol a mano.
 * Nunca se muestra durante el trailer.
 */
export function RetornoPreview() {
  const preview = useUI((s) => s.preview)
  const cerrar = useUI((s) => s.cerrarPreview)
  const cancelar = useUI((s) => s.cancelarPreview)
  const trailer = useUI((s) => s.trailerAbierto)
  const { t } = useT()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const rutaActual = pathname + (search || '')

  // Si el usuario navega a otra ruta por el menú, la previsualización se cancela.
  useEffect(() => {
    if (!preview) return
    if (rutaActual !== preview.view) cancelar()
  }, [rutaActual, preview, cancelar])

  useEffect(() => {
    if (!preview) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cerrar()
        navigate('/propuesta')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview, cerrar, navigate])

  if (!preview || trailer) return null

  return (
    <div
      className="pointer-events-none sticky top-[60px] z-[60] -mb-2 flex flex-wrap items-center gap-2 px-4 pt-3 sm:px-6"
      data-preview-retorno="1"
    >
      <span className="pointer-events-auto relative inline-flex">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-mineral animate-anillo"
          style={{ transformOrigin: 'center' }}
        />
        <button
          type="button"
          onClick={() => {
            cerrar()
            navigate('/propuesta')
          }}
          className="relative inline-flex min-h-[44px] items-center gap-2 rounded-full border border-mineral bg-white px-4 text-[13px] font-black text-mineral-texto shadow-sapio-lg transition-colors hover:bg-mineral hover:text-white dark:bg-noche-800"
        >
          <ArrowLeft size={15} />
          {t('preview.volver')}
        </button>
      </span>
      <span className="pointer-events-auto vidrio inline-flex min-h-[36px] max-w-full items-center truncate rounded-full border border-borde px-3 text-[12px] font-bold text-tinta-sec dark:border-[#27425a] dark:text-marfil/70">
        {t('preview.estasViendo', { modulo: preview.titulo })}
      </span>
    </div>
  )
}
