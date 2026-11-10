import { useState } from 'react'
import { CheckCircle2, Pencil } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { EncabezadoSeccion, Pildora, PreviewBanner } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Input } from '@/components/ui/Campos'
import { PLANES } from '@/data/gestion'
import { UNIVERSIDADES } from '@/data/universidades'
import type { Plan } from '@/data/tipos'
import { cn } from '@/lib/cn'

export function Planes() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const [editando, setEditando] = useState<Plan | null>(null)

  // Reparto ilustrativo de universidades por plan, calculado desde los datos.
  const porPlan = (i: number) =>
    UNIVERSIDADES.filter((_, idx) => idx % PLANES.length === i).length

  return (
    <>
      <PreviewBanner
        id="plat-planes"
        titulo={t('plat.planes.banner')}
        bullets={[t('plat.planes.banner1'), t('plat.planes.banner2'), t('plat.planes.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('plat.planes.titulo')}
        bajada={t('plat.planes.bajada')}
        acciones={<Pildora tono="champan">{t('plat.planes.ilustrativos')}</Pildora>}
      />

      <ul className="grid gap-4 md:grid-cols-3">
        {PLANES.map((p, i) => (
          <li key={p.id}>
            <article
              className={cn(
                'card-sapio flex h-full flex-col p-5',
                p.destacado && 'border-mineral shadow-sapio-lg',
              )}
            >
              {p.destacado ? (
                <Pildora tono="mineral" className="mb-3 self-start">
                  {t('plat.planes.destacado')}
                </Pildora>
              ) : null}
              <p className="num text-[11px] font-bold tracking-[0.14em] text-champan-700 dark:text-champan">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-1.5 text-[20px] font-black leading-tight">
                {lang === 'en' ? p.nombreEn : p.nombreEs}
              </h2>
              <span className="filete mt-3" />

              <p className="num mt-5 font-black leading-none" style={{ fontSize: 'clamp(28px,5vw,38px)' }}>
                USD {p.precioMensual.toLocaleString('en-US')}
                <span className="ml-1 text-[13px] font-bold text-tinta-sec dark:text-marfil/50">
                  {t('plat.planes.porMes')}
                </span>
              </p>
              <p className="num mt-1 text-[13px] text-tinta-sec dark:text-marfil/55">
                USD {p.precioAnual.toLocaleString('en-US')} {t('plat.planes.porAnio')}
              </p>

              <ul className="mt-5 space-y-2">
                <li className="num flex gap-2 text-[13px]">
                  <CheckCircle2 size={15} className="mt-[2px] shrink-0 text-mineral-texto" />
                  {t('plat.planes.usuarios', { n: p.usuariosIncluidos.toLocaleString('en-US') })}
                </li>
                <li className="num flex gap-2 text-[13px]">
                  <CheckCircle2 size={15} className="mt-[2px] shrink-0 text-mineral-texto" />
                  {t('plat.planes.limiteIA', { n: p.limiteIA.toLocaleString('en-US') })}
                </li>
                {(lang === 'en' ? p.incluyeEn : p.incluyeEs).map((x) => (
                  <li key={x} className="flex gap-2 text-[13px] leading-relaxed">
                    <CheckCircle2 size={15} className="mt-[3px] shrink-0 text-mineral-texto" />
                    {x}
                  </li>
                ))}
              </ul>

              <p className="num mt-5 text-[12px] text-tinta-sec dark:text-marfil/50">
                {t('plat.planes.universidadesEn', { n: porPlan(i) })}
              </p>

              <Boton variante="secundario" className="mt-4 w-full" onClick={() => setEditando(p)}>
                <Pencil size={14} />
                {t('plat.planes.editar')}
              </Boton>
            </article>
          </li>
        ))}
      </ul>

      <Modal
        abierto={Boolean(editando)}
        onCerrar={() => setEditando(null)}
        titulo={t('plat.planes.editar')}
        ancho={480}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setEditando(null)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                setEditando(null)
                toast({ titulo: t('plat.planes.guardado'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
              }}
            >
              {t('app.guardar')}
            </Boton>
          </>
        }
      >
        {editando ? (
          <div className="space-y-4">
            <Campo label={t('plat.uni.nombre')}>
              <Input defaultValue={lang === 'en' ? editando.nombreEn : editando.nombreEs} />
            </Campo>
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label={`USD ${t('plat.planes.porMes')}`}>
                <Input type="number" defaultValue={editando.precioMensual} className="num" />
              </Campo>
              <Campo label={`USD ${t('plat.planes.porAnio')}`}>
                <Input type="number" defaultValue={editando.precioAnual} className="num" />
              </Campo>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label={t('plat.planes.usuarios', { n: '' }).trim()}>
                <Input type="number" defaultValue={editando.usuariosIncluidos} className="num" />
              </Campo>
              <Campo label={t('plat.planes.limiteIA', { n: '' }).trim()}>
                <Input type="number" defaultValue={editando.limiteIA} className="num" />
              </Campo>
            </div>
            <p className="text-[12px] text-tinta-sec dark:text-marfil/50">{t('plat.planes.ilustrativos')}</p>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
