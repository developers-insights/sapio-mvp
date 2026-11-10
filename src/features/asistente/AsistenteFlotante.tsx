import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Maximize2, Send, X } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Isotipo } from '@/assets/brand/Isotipo'
import { DevNotice } from '@/components/ui/Piezas'
import { useEsMobile, useOffsetInferior } from '@/lib/hooks'
import { CHIPS_POR_ROL } from './motor'
import { useConversacion } from './useConversacion'
import { Burbujas, MedidorUso } from './Burbujas'

/**
 * Botón flotante + panel estilo Intercom. En móvil queda POR ENCIMA de la
 * bottom-nav y de cualquier barra fija (incluida la barra de la mesa redonda).
 * Se oculta durante el trailer.
 */
export function AsistenteFlotante() {
  const abierto = useUI((s) => s.asistenteAbierto)
  const setAbierto = useUI((s) => s.setAsistente)
  const rol = useUI((s) => s.rol)
  const trailer = useUI((s) => s.trailerAbierto)
  const tourAbierto = useUI((s) => s.tourAbierto)
  const { t } = useT()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const esMobile = useEsMobile()
  const offsetInferior = useOffsetInferior()
  const { mensajes, pensando, preguntar, uso } = useConversacion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const entradaRef = useRef<HTMLInputElement>(null)

  // Offset real: bottom-nav + barra de formato + botón de comentarios de la mesa.
  const enMesa = pathname.startsWith('/mesa/')
  const extra = esMobile && enMesa ? 120 : 12
  const abajo = offsetInferior + extra

  useEffect(() => {
    if (!abierto || !scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [mensajes, pensando, abierto])

  if (trailer) return null

  return (
    <>
      {!abierto ? (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label={t('asist.abrir')}
          data-trailer="asistente-boton"
          className="fixed right-4 z-[55] grid h-[54px] w-[54px] place-items-center rounded-full bg-noche shadow-sapio-lg transition-colors hover:bg-[#1b3147] sm:right-5 dark:bg-marfil dark:hover:bg-white"
          style={{ bottom: abajo }}
        >
          <Isotipo size={22} color="#C9A974" />
          <span className="absolute right-[7px] top-[7px] h-2.5 w-2.5 animate-pulso rounded-full border-2 border-noche bg-mineral dark:border-marfil" />
        </button>
      ) : null}

      {abierto && !tourAbierto ? (
        <section
          role="dialog"
          aria-label={t('asist.nombre')}
          className="fixed right-4 z-[56] flex flex-col overflow-hidden rounded-2xl border border-borde bg-marfil shadow-sapio-lg sm:right-5 dark:border-[#27425a] dark:bg-noche-800"
          style={{
            bottom: abajo,
            width: 'min(400px, 100vw - 2rem)',
            height: 'min(540px, 64vh)',
          }}
        >
          <header className="flex shrink-0 items-center gap-2.5 border-b border-borde bg-noche px-3.5 py-3 dark:border-[#27425a]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-marfil/10">
              <Isotipo size={17} color="#C9A974" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-black text-marfil">{t('asist.nombre')}</span>
              <span className="flex items-center gap-1.5 text-[11.5px] text-marfil/65">
                <span className="h-1.5 w-1.5 animate-pulso rounded-full bg-mineral" />
                {t('asist.enLinea')}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setAbierto(false)
                navigate('/workplace/asistente')
              }}
              aria-label={t('asist.verCompleto')}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-marfil/70 transition-colors hover:bg-marfil/10 hover:text-marfil"
            >
              <Maximize2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label={t('asist.cerrar')}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-marfil/70 transition-colors hover:bg-marfil/10 hover:text-marfil"
            >
              <X size={16} />
            </button>
          </header>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
            <Burbujas mensajes={mensajes} pensando={pensando} />
            <div className="mt-3">
              <MedidorUso {...uso} />
            </div>
            <DevNotice
              className="mt-3"
              funcion={t('asist.dev.modelo')}
              hoy={t('asist.dev.modeloHoy')}
              alDesarrollar={t('asist.dev.modeloDesp')}
            />
          </div>

          <div className="shrink-0 border-t border-borde px-3 pb-3 pt-2.5 dark:border-[#27425a]">
            <div className="scroll-x-contenida sin-scrollbar mb-2 flex gap-1.5">
              {CHIPS_POR_ROL[rol].map((clave) => (
                <button
                  key={clave}
                  type="button"
                  onClick={() => preguntar(t(clave))}
                  className="min-h-[34px] shrink-0 whitespace-nowrap rounded-full border border-borde bg-white px-3 text-[11.5px] font-bold text-tinta-sec transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a] dark:bg-noche-700 dark:text-marfil/70"
                >
                  {t(clave)}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const v = entradaRef.current?.value ?? ''
                if (entradaRef.current) entradaRef.current.value = ''
                preguntar(v)
              }}
            >
              <input
                ref={entradaRef}
                aria-label={t('asist.escribir')}
                placeholder={t('asist.escribir')}
                className="min-h-[44px] w-full rounded-xl border border-borde bg-white px-3 text-[13.5px] focus:border-mineral focus:outline-none dark:border-[#27425a] dark:bg-noche-700"
              />
              <button
                type="submit"
                aria-label={t('asist.escribir')}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-noche text-marfil transition-colors hover:bg-[#1b3147] dark:bg-marfil dark:text-noche"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </section>
      ) : null}
    </>
  )
}
