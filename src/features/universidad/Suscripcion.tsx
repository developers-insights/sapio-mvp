import { useState } from 'react'
import { CheckCircle2, CreditCard, Download, Mail, XCircle } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import {
  DevNotice, EncabezadoSeccion, EstadoBadge, Pildora, PreviewBanner, Tabla, Td, Th,
} from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { FACTURAS, PLANES } from '@/data/gestion'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { fechaCorta } from '@/lib/fechas'
import { useEsMobile } from '@/lib/hooks'
import { cn } from '@/lib/cn'

export function Suscripcion() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const planActual = useDatos((s) => s.planActual)
  const ciclo = useDatos((s) => s.cicloPlan)
  const setPlan = useDatos((s) => s.setPlan)
  const campus = useDatos((s) => s.campus)
  const esMobile = useEsMobile()
  const [cambiar, setCambiar] = useState(false)
  const [cancelar, setCancelar] = useState(false)
  const uni = UNI_POR_ID[UNI_ADMIN]
  const plan = PLANES.find((p) => p.id === planActual) ?? PLANES[1]

  const precio = (p: (typeof PLANES)[number]) =>
    ciclo === 'anual' ? p.precioAnual : p.precioMensual

  return (
    <>
      <PreviewBanner
        id="susc"
        titulo={t('susc.banner')}
        bullets={[t('susc.banner1'), t('susc.banner2'), t('susc.banner3')]}
      />
      <EncabezadoSeccion kicker={kickerRol(rol, lang)} titulo={t('susc.titulo')} />

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_340px]">
        <section className="card-sapio min-w-0 p-4 sm:p-6">
          <div className="flex flex-wrap items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mineral/12 text-mineral">
              <CreditCard size={19} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-sec dark:text-marfil/50">
                {t('susc.planActual')}
              </p>
              <h2 className="mt-1 text-[clamp(20px,3.4vw,26px)] font-black leading-tight">
                {lang === 'en' ? plan.nombreEn : plan.nombreEs} · {t(`plan.${ciclo}`)}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <EstadoBadge estado="activo" />
                <Pildora tono="neutro">{t('plat.planes.ilustrativos')}</Pildora>
              </div>
            </div>
            <p
              className="num shrink-0 font-black leading-none"
              style={{ fontSize: 'clamp(26px,5vw,38px)' }}
            >
              USD {precio(plan).toLocaleString('en-US')}
              <span className="ml-1 text-[13px] font-bold text-tinta-sec dark:text-marfil/50">
                {ciclo === 'anual' ? t('plat.planes.porAnio') : t('plat.planes.porMes')}
              </span>
            </p>
          </div>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {(lang === 'en' ? plan.incluyeEn : plan.incluyeEs).map((x) => (
              <li key={x} className="flex gap-2 text-[13.5px] leading-relaxed">
                <CheckCircle2 size={15} className="mt-[3px] shrink-0 text-mineral" />
                {x}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <Boton onClick={() => setCambiar(true)}>{t('susc.cambiarPlan')}</Boton>
            <Boton variante="secundario" onClick={() => setCancelar(true)}>
              <XCircle size={15} />
              {t('susc.cancelar')}
            </Boton>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-champan/45 bg-champan/[.09] p-4">
            <p className="flex items-center gap-2 text-sm font-black">
              <Mail size={15} className="shrink-0 text-champan-700 dark:text-champan" />
              {t('susc.avisoVencimiento')}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/65">
              {t('susc.avisoDetalle', { n: 18, email: campus.emailContacto })}
            </p>
          </section>

          <section className="card-sapio p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-sec dark:text-marfil/50">
              {t('susc.ciclo')}
            </p>
            <div className="mt-2.5 flex rounded-xl border border-borde p-1 dark:border-[#27425a]">
              {(['mensual', 'anual'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setPlan(planActual, c)
                    toast({ titulo: t('susc.cambiado', { plan: t(`plan.${c}`) }), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
                  }}
                  className={cn(
                    'min-h-[40px] flex-1 rounded-lg text-[13px] font-bold transition-colors',
                    ciclo === c ? 'bg-mineral text-white' : 'text-tinta-sec dark:text-marfil/60',
                  )}
                >
                  {t(`plan.${c}`)}
                </button>
              ))}
            </div>
            <p className="num mt-3 text-[12.5px] text-tinta-sec dark:text-marfil/55">
              {uni.usuariosActivos.toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')} {t('plat.usuariosActivos').toLowerCase()}
            </p>
          </section>
        </aside>
      </div>

      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
        {t('susc.facturas')}
      </h2>

      {esMobile ? (
        <ul className="space-y-2.5">
          {FACTURAS.map((f) => (
            <li key={f.id} className="card-sapio p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="num text-[14px] font-black">{f.numero}</p>
                  <p className="text-[12px] text-tinta-sec dark:text-marfil/55">{campo(f, 'periodo', lang)}</p>
                  <p className="num mt-0.5 text-[11.5px] text-tinta-sec dark:text-marfil/45">
                    {fechaCorta(f.fecha, lang)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="num text-[15px] font-black">USD {f.monto.toLocaleString('en-US')}</p>
                  <EstadoBadge estado={f.estado} className="mt-1.5" />
                </div>
              </div>
              <Boton
                tam="sm"
                variante="secundario"
                className="mt-2.5 w-full"
                onClick={() => toast({ titulo: t('susc.descargarPDF'), detalle: t('susc.pdfSimulado'), tono: 'info' })}
              >
                <Download size={13} />
                {t('susc.descargarPDF')}
              </Boton>
            </li>
          ))}
        </ul>
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>{t('susc.numero')}</Th>
              <Th>{t('susc.periodo')}</Th>
              <Th className="hidden md:table-cell">{t('wp.doc.actualizado')}</Th>
              <Th>{t('susc.monto')}</Th>
              <Th>{t('estado.activo')}</Th>
              <Th>{t('susc.comprobante')}</Th>
            </tr>
          </thead>
          <tbody>
            {FACTURAS.map((f) => (
              <tr key={f.id} className="transition-colors hover:bg-marfil-200/50 dark:hover:bg-noche-700/40">
                <Td className="num font-bold">{f.numero}</Td>
                <Td>{campo(f, 'periodo', lang)}</Td>
                <Td className="num hidden md:table-cell">{fechaCorta(f.fecha, lang)}</Td>
                <Td className="num font-bold">USD {f.monto.toLocaleString('en-US')}</Td>
                <Td>
                  <EstadoBadge estado={f.estado} />
                </Td>
                <Td>
                  <Boton
                    tam="sm"
                    variante="secundario"
                    onClick={() => toast({ titulo: t('susc.descargarPDF'), detalle: t('susc.pdfSimulado'), tono: 'info' })}
                  >
                    <Download size={13} />
                    PDF
                  </Boton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      )}

      <DevNotice
        className="mt-8"
        funcion={t('susc.dev.pagos')}
        hoy={t('susc.dev.pagosHoy')}
        alDesarrollar={t('susc.dev.pagosDesp')}
      />

      <Modal
        abierto={cambiar}
        onCerrar={() => setCambiar(false)}
        titulo={t('susc.cambiarPlan')}
        ancho={640}
        pie={<Boton variante="secundario" onClick={() => setCambiar(false)}>{t('app.cerrar')}</Boton>}
      >
        <ul className="grid gap-3 sm:grid-cols-3">
          {PLANES.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  setPlan(p.id, ciclo)
                  setCambiar(false)
                  toast({ titulo: t('susc.cambiado', { plan: lang === 'en' ? p.nombreEn : p.nombreEs }), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
                }}
                className={cn(
                  'flex h-full w-full flex-col rounded-2xl border p-3.5 text-left transition-[border-color]',
                  p.id === planActual ? 'border-mineral bg-mineral/[.06]' : 'border-borde hover:border-mineral dark:border-[#27425a]',
                )}
              >
                {p.destacado ? <Pildora tono="champan" className="mb-2 self-start">{t('plat.planes.destacado')}</Pildora> : null}
                <span className="text-[15px] font-black">{lang === 'en' ? p.nombreEn : p.nombreEs}</span>
                <span className="num mt-1.5 text-[20px] font-black">
                  USD {precio(p).toLocaleString('en-US')}
                </span>
                <span className="num mt-1 text-[11.5px] text-tinta-sec dark:text-marfil/50">
                  {t('plat.planes.usuarios', { n: p.usuariosIncluidos.toLocaleString('en-US') })}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-tinta-sec dark:text-marfil/50">{t('plat.planes.ilustrativos')}</p>
      </Modal>

      <Modal
        abierto={cancelar}
        onCerrar={() => setCancelar(false)}
        titulo={t('susc.cancelarConfirma')}
        ancho={480}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setCancelar(false)}>{t('app.cancelar')}</Boton>
            <Boton
              variante="peligro"
              onClick={() => {
                setCancelar(false)
                toast({ titulo: t('susc.cancelada'), detalle: t('toast.accionMockDetalle'), tono: 'alerta' })
              }}
            >
              {t('app.confirmar')}
            </Boton>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-tinta-sec dark:text-marfil/70">
          {t('susc.cancelarDetalle')}
        </p>
      </Modal>
    </>
  )
}
