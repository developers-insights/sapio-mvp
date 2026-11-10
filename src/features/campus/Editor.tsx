import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ExternalLink, Eye, PencilLine, Upload } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { DevNotice, EncabezadoSeccion, Pildora, PreviewBanner } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Input, Interruptor, Textarea } from '@/components/ui/Campos'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { useEsMobile } from '@/lib/hooks'
import { VistaPreviaCampus } from './VistaPrevia'
import { cn } from '@/lib/cn'

const COLORES = ['#101D2B', '#25465C', '#527D79', '#C9A974', '#9C5B4E']

export function CampusEditor() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const setModo = useUI((s) => s.setModo)
  const toast = useUI((s) => s.toast)
  const campus = useDatos((s) => s.campus)
  const setCampus = useDatos((s) => s.setCampus)
  const publicar = useDatos((s) => s.publicarCampus)
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const [tab, setTab] = useState<'editar' | 'vista'>('editar')
  const [confirmar, setConfirmar] = useState(false)
  const uni = UNI_POR_ID[UNI_ADMIN]

  const editor = (
    <div className="space-y-5">
      <section className="card-sapio p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('campus.editor.identidad')}
        </h2>
        <div className="mt-3 space-y-3.5">
          <Campo label={t('campus.editor.nombre')}>
            <Input value={campus.nombre} onChange={(e) => setCampus({ nombre: e.target.value })} />
          </Campo>
          <Campo label={t('campus.editor.lema')}>
            <Input
              value={lang === 'en' ? campus.lemaEn : campus.lemaEs}
              onChange={(e) => setCampus(lang === 'en' ? { lemaEn: e.target.value } : { lemaEs: e.target.value })}
            />
          </Campo>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label={t('campus.editor.iniciales')}>
              <Input
                maxLength={3}
                value={campus.iniciales}
                onChange={(e) => setCampus({ iniciales: e.target.value.toUpperCase() })}
              />
            </Campo>
            <div>
              <p className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
                {t('campus.editor.colorPrimario')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COLORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCampus({ colorPrimario: c })}
                    aria-label={c}
                    className={cn(
                      'h-11 w-11 rounded-xl border-2 transition-[border-color]',
                      campus.colorPrimario === c ? 'border-mineral' : 'border-transparent',
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <Boton
            variante="secundario"
            onClick={() => toast({ titulo: t('toast.accionMock'), detalle: t('wp.dev.archivosHoy'), tono: 'info' })}
          >
            <Upload size={15} />
            {t('campus.editor.subirLogo')}
          </Boton>
        </div>
      </section>

      <section className="card-sapio p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('campus.editor.secciones')}
        </h2>
        <ul className="mt-3 space-y-2.5">
          {(['institucional', 'facultades', 'programas', 'contacto'] as const).map((s) => (
            <li key={s} className="flex min-h-[44px] items-center gap-3">
              <span className="min-w-0 flex-1 text-[13.5px] font-bold">{t(`campus.editor.${s}`)}</span>
              <Interruptor
                activo={campus.secciones[s]}
                label={t(`campus.editor.${s}`)}
                onChange={(v) => setCampus({ secciones: { ...campus.secciones, [s]: v } })}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="card-sapio p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('campus.editor.institucional')}
        </h2>
        <div className="mt-3 space-y-3.5">
          <Campo label={t('campus.editor.textoInstitucional')}>
            <Textarea
              value={lang === 'en' ? campus.textoInstitucionalEn : campus.textoInstitucionalEs}
              onChange={(e) =>
                setCampus(lang === 'en' ? { textoInstitucionalEn: e.target.value } : { textoInstitucionalEs: e.target.value })
              }
              className="min-h-[120px]"
            />
          </Campo>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label={t('campus.editor.emailContacto')}>
              <Input value={campus.emailContacto} onChange={(e) => setCampus({ emailContacto: e.target.value })} />
            </Campo>
            <Campo label={t('campus.editor.telefono')}>
              <Input value={campus.telefono} onChange={(e) => setCampus({ telefono: e.target.value })} />
            </Campo>
          </div>
        </div>
      </section>

      <DevNotice
        funcion={t('campus.editor.dev.subdominio')}
        hoy={t('campus.editor.dev.subdominioHoy')}
        alDesarrollar={t('campus.editor.dev.subdominioDesp')}
      />
    </div>
  )

  const vista = (
    <div className="lg:sticky lg:top-[76px]">
      <p className="num mb-2 flex flex-wrap items-center gap-2 text-[11.5px] text-tinta-sec dark:text-marfil/50">
        <span className="font-bold uppercase tracking-[0.1em]">{t('campus.editor.subdominio')}:</span>
        {uni.slug}.sapio.example
      </p>
      <div className="overflow-hidden rounded-2xl border border-borde shadow-sapio dark:border-[#27425a]">
        <VistaPreviaCampus />
      </div>
    </div>
  )

  return (
    <>
      <PreviewBanner
        id="campus-editor"
        titulo={t('campus.editor.banner')}
        bullets={[t('campus.editor.banner1'), t('campus.editor.banner2'), t('campus.editor.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('campus.editor.titulo')}
        bajada={t('campus.editor.bajada')}
        acciones={
          <>
            <Boton
              variante="secundario"
              onClick={() => {
                setModo('campus')
                navigate(`/campus/${uni.slug}`)
              }}
            >
              <ExternalLink size={15} />
              {t('nav.verCampusPublico')}
            </Boton>
            <Boton onClick={() => setConfirmar(true)}>
              <CheckCircle2 size={15} />
              {t('campus.editor.publicar')}
            </Boton>
          </>
        }
      />

      <div className="mb-4">
        {campus.cambiosSinPublicar ? (
          <Pildora tono="champan">{t('campus.editor.sinPublicar')}</Pildora>
        ) : (
          <Pildora tono="mineral">{t('campus.editor.alDia')}</Pildora>
        )}
      </div>

      {esMobile ? (
        <>
          <div className="mb-4 flex rounded-xl border border-borde bg-white p-1 dark:border-[#27425a] dark:bg-noche-800">
            {(['editar', 'vista'] as const).map((x) => (
              <button
                key={x}
                type="button"
                onClick={() => setTab(x)}
                className={cn(
                  'inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg text-[13px] font-bold transition-colors',
                  tab === x ? 'bg-mineral text-white' : 'text-tinta-sec dark:text-marfil/60',
                )}
              >
                {x === 'editar' ? <PencilLine size={14} /> : <Eye size={14} />}
                {x === 'editar' ? t('campus.editor.editar') : t('campus.editor.vistaPrevia')}
              </button>
            ))}
          </div>
          {tab === 'editar' ? editor : vista}
        </>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="min-w-0">{editor}</div>
          <div className="min-w-0">{vista}</div>
        </div>
      )}

      <Modal
        abierto={confirmar}
        onCerrar={() => setConfirmar(false)}
        titulo={t('campus.editor.publicarConfirma')}
        ancho={480}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setConfirmar(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                publicar()
                setConfirmar(false)
                toast({ titulo: t('campus.editor.publicado'), detalle: `${uni.slug}.sapio.example`, tono: 'ok' })
              }}
            >
              {t('campus.editor.publicar')}
            </Boton>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-tinta-sec dark:text-marfil/70">
          {t('campus.editor.publicarDetalle')}
        </p>
      </Modal>
    </>
  )
}
