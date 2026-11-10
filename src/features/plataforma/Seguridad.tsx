import { useState } from 'react'
import { CheckCircle2, DatabaseBackup, Fingerprint, KeyRound, Lock, ShieldCheck, Settings2 } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { DevNotice, EncabezadoSeccion, Pildora, PreviewBanner } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Select } from '@/components/ui/Campos'
import { INTENTOS_BLOQUEADOS_HOY } from '@/data/gestion'
import { dia, fechaCorta, horaCorta } from '@/lib/fechas'

export function Seguridad() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const [limite, setLimite] = useState(5)
  const [configurar, setConfigurar] = useState(false)

  const capas = [
    { id: 'tls', icono: <Lock size={18} />, titulo: t('plat.seg.tls'), detalle: t('plat.seg.tlsDet') },
    { id: 'reposo', icono: <ShieldCheck size={18} />, titulo: t('plat.seg.reposo'), detalle: t('plat.seg.reposoDet') },
    { id: 'hash', icono: <KeyRound size={18} />, titulo: t('plat.seg.hash'), detalle: t('plat.seg.hashDet') },
    { id: 'iny', icono: <Fingerprint size={18} />, titulo: t('plat.seg.inyeccion'), detalle: t('plat.seg.inyeccionDet') },
  ]

  return (
    <>
      <PreviewBanner
        id="plat-seg"
        titulo={t('plat.seg.banner')}
        bullets={[t('plat.seg.banner1'), t('plat.seg.banner2'), t('plat.seg.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('plat.seg.titulo')}
        bajada={t('plat.seg.bajada')}
      />

      <ul className="mb-4 grid gap-3 md:grid-cols-2">
        {capas.map((c) => (
          <li key={c.id} className="card-sapio flex min-w-0 items-start gap-3 p-4 sm:p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mineral/12 text-mineral-texto">
              {c.icono}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-black leading-snug">{c.titulo}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">{c.detalle}</p>
              <span className="mt-2.5 inline-flex">
                <Pildora tono="mineral" icono={<CheckCircle2 size={10} />}>
                  {t('plat.seg.configurado')}
                </Pildora>
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 md:grid-cols-2">
        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-champan/18 text-champan-700 dark:text-champan">
              <Settings2 size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-black leading-snug">{t('plat.seg.intentos')}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
                {t('plat.seg.intentosDet', { n: limite })}
              </p>
              <p className="num mt-2 text-[12.5px] font-bold text-terroso">
                {t('plat.panel.alertaBloqueos', { n: INTENTOS_BLOQUEADOS_HOY })}
              </p>
              <Boton tam="sm" variante="secundario" className="mt-3" onClick={() => setConfigurar(true)}>
                {t('plat.seg.configurar')}
              </Boton>
            </div>
          </div>
        </section>

        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mineral/12 text-mineral-texto">
              <DatabaseBackup size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-black leading-snug">{t('plat.seg.backups')}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
                {t('plat.seg.backupsDet')}
              </p>
              <p className="num mt-2 text-[12.5px] text-tinta-sec dark:text-marfil/55">
                {t('plat.seg.ultimaRestauracion')}: {fechaCorta(dia(-3, 4), lang)} · {horaCorta(dia(-3, 4), lang)}
              </p>
            </div>
          </div>
        </section>
      </div>

      <DevNotice
        className="mt-6"
        funcion={t('plat.seg.dev.infra')}
        hoy={t('plat.seg.dev.infraHoy')}
        alDesarrollar={t('plat.seg.dev.infraDesp')}
      />

      <Modal
        abierto={configurar}
        onCerrar={() => setConfigurar(false)}
        titulo={t('plat.seg.configurar')}
        ancho={440}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setConfigurar(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                setConfigurar(false)
                toast({ titulo: t('plat.seg.guardado'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
              }}
            >
              {t('app.guardar')}
            </Boton>
          </>
        }
      >
        <Campo label={t('plat.seg.intentos')}>
          <Select value={String(limite)} onChange={(e) => setLimite(Number(e.target.value))}>
            {[3, 5, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Campo>
      </Modal>
    </>
  )
}
