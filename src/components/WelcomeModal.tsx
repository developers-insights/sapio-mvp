import { useEffect } from 'react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Firma, Anillos } from '@/assets/brand/Isotipo'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'

/**
 * Aparece ~400ms después del login, una vez por sesión, encima de la
 * Propuesta ya renderizada. No se cierra clickeando afuera.
 * El copy no nombra ningún botón.
 */
export function WelcomeModal() {
  const abierto = useUI((s) => s.welcomeAbierto)
  const cerrar = useUI((s) => s.cerrarWelcome)
  const { t } = useT()

  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [abierto, cerrar])

  return (
    <Modal
      abierto={abierto}
      onCerrar={cerrar}
      cerrarAfuera={false}
      ancho={560}
      zIndex={9500}
      etiqueta={t('welcome.saludo')}
    >
      <div className="relative overflow-hidden">
        <Anillos
          className="pointer-events-none absolute -right-28 -top-36 h-[360px] w-[360px] opacity-70"
          color="rgba(201,169,116,.22)"
        />
        <div className="relative">
          <Firma size={22} colorIsotipo="#C9A974" />
          <h2 className="mt-5 text-[clamp(26px,6vw,34px)] font-black leading-tight">
            {t('welcome.saludo')}
          </h2>
          <span className="filete mt-3" />
          <p className="mt-4 text-[15px] leading-relaxed text-tinta-sec dark:text-marfil/75">
            {t('welcome.intro')}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-tinta-sec dark:text-marfil/75">
            {t('welcome.cuerpo')}
          </p>
          <p className="serif-it mt-5 text-[17px] leading-snug text-noche dark:text-marfil">
            {t('welcome.cierre')}
          </p>
          <Boton onClick={cerrar} tam="lg" className="mt-6 w-full sm:w-auto">
            {t('welcome.boton')}
          </Boton>
        </div>
      </div>
    </Modal>
  )
}
