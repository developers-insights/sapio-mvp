import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { RUTA_DEFAULT, useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Boton } from '@/components/ui/Boton'

/** Estado amable cuando el rol no puede ver la ruta: parte de la demo de permisos. */
export function GuardaRol() {
  const rol = useUI((s) => s.rol)
  const { t } = useT()
  const navigate = useNavigate()
  return (
    <div className="card-sapio mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-champan/15 text-champan-700 dark:text-champan">
        <ShieldAlert size={24} />
      </span>
      <h2 className="text-xl font-black leading-tight">{t('guard.titulo')}</h2>
      <span className="filete" />
      <p className="max-w-md text-sm leading-relaxed text-tinta-sec dark:text-marfil/65">
        {t('guard.detalle')}
      </p>
      <Boton onClick={() => navigate(RUTA_DEFAULT[rol])}>{t('guard.volver')}</Boton>
    </div>
  )
}
