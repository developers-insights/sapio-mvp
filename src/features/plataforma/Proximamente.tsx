import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { EncabezadoSeccion, DevNotice, TarjetaBloqueada, Pildora } from '@/components/ui/Piezas'
import { EXTENSION } from '@/lib/propuesta-data'
import { kickerRol } from '@/lib/rol'

/**
 * Única pantalla de Fase 2 y Fase 3: SOLO tarjetas bloqueadas.
 * Ninguna de estas funciones se construye en la demo.
 */
export function Proximamente() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)

  return (
    <>
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('prox.titulo')}
        bajada={t('prox.bajada')}
      />

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            {t('prop.fase2')}
          </h2>
          <Pildora tono="champan">{EXTENSION.fase2.semanas} {t('prop.semanas')}</Pildora>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXTENSION.fase2.items.map((clave) => (
            <li key={clave}>
              <TarjetaBloqueada fase={t('prop.fase2')} nombre={t(clave)} linea={t(`${clave}.det`)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            {t('prop.fase3')}
          </h2>
          <Pildora tono="champan">{EXTENSION.fase3.semanas} {t('prop.semanas')}</Pildora>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXTENSION.fase3.items.map((clave) => (
            <li key={clave}>
              <TarjetaBloqueada fase={t('prop.fase3')} nombre={t(clave)} linea={t(`${clave}.det`)} />
            </li>
          ))}
        </ul>
      </section>

      <DevNotice
        funcion={t('prox.dev.titulo')}
        hoy={t('prox.dev.hoy')}
        alDesarrollar={t('prox.dev.desp')}
      />
    </>
  )
}
