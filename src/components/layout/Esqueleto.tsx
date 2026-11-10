import { EncabezadoSeccion, PreviewBanner } from '@/components/ui/Piezas'
import { useT } from '@/i18n'

/** Pantalla esqueleto navegable: se reemplaza por la vista real en su bloque. */
export function Esqueleto({ kicker, titulo }: { kicker: string; titulo: string }) {
  const { t } = useT()
  return (
    <>
      <PreviewBanner
        id={`esq-${titulo}`}
        titulo={t('banner.titulo')}
        bullets={[t('app.previewNavegable'), t('app.datosMock'), t('app.cargando')]}
      />
      <EncabezadoSeccion kicker={kicker} titulo={titulo} />
    </>
  )
}
