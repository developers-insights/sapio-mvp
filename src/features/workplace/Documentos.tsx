import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileSpreadsheet, FileText, Database, Folder, History, Lock, Table2, Upload, RotateCcw } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, PreviewBanner, Pildora, Avatar, DevNotice, EstadoVacio } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { CARPETAS, DOCUMENTOS } from '@/data/proyecto'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { fechaCorta, horaCorta } from '@/lib/fechas'
import type { Documento } from '@/data/tipos'
import { cn } from '@/lib/cn'

const ICONO = {
  doc: FileText,
  pdf: FileText,
  hoja: FileSpreadsheet,
  dataset: Database,
} as const

export function Documentos() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const restaurar = useDatos((s) => s.restaurarVersion)
  const navigate = useNavigate()
  const [carpeta, setCarpeta] = useState<string>('todas')
  const [abierto, setAbierto] = useState<Documento | null>(null)
  const yo = persona(USUARIO_POR_ROL[rol])

  const visibles = useMemo(() => {
    // El colaborador solo ve lo que le compartieron.
    const base =
      rol === 'colaborador'
        ? DOCUMENTOS.filter((d) => ['d-protocolos', 'd-cap3', 'd-datos'].includes(d.id))
        : DOCUMENTOS
    return carpeta === 'todas' ? base : base.filter((d) => d.carpeta === carpeta)
  }, [carpeta, rol])

  const carpetas = ['todas', ...CARPETAS, ...(rol === 'universidad' ? ['Northwood · interno'] : [])]

  return (
    <>
      <PreviewBanner
        id="wp-doc"
        titulo={t('wp.doc.banner')}
        bullets={[t('wp.doc.banner1'), t('wp.doc.banner2'), t('wp.doc.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('wp.doc.titulo')}
        acciones={
          <Boton onClick={() => toast({ titulo: t('toast.accionMock'), detalle: t('wp.dev.archivosHoy'), tono: 'info' })}>
            <Upload size={16} />
            {t('wp.doc.subir')}
          </Boton>
        }
      />

      <div className="scroll-x-contenida sin-scrollbar -mx-4 mb-4 flex gap-2 px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {carpetas.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCarpeta(c)}
            className={cn(
              'inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-bold transition-colors',
              carpeta === c
                ? 'border-mineral bg-mineral text-white'
                : 'border-borde bg-white text-tinta-sec hover:border-mineral dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil/65',
            )}
          >
            <Folder size={14} />
            {c === 'todas' ? t('app.todas') : c}
          </button>
        ))}
      </div>

      {!visibles.length ? (
        <EstadoVacio titulo={t('app.vacio')} />
      ) : (
        <ul className="grid gap-2.5 md:grid-cols-2">
          {visibles.map((d) => {
            const I = ICONO[d.tipo]
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setAbierto(d)}
                  className="card-sapio flex w-full min-h-[84px] items-start gap-3 p-3.5 text-left transition-[border-color] hover:border-mineral sm:p-4"
                >
                  <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', d.restringido ? 'bg-terroso/12 text-terroso' : 'bg-mineral/12 text-mineral-texto')}>
                    {d.restringido ? <Lock size={17} /> : <I size={17} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-bold leading-snug">{campo(d, 'nombre', lang)}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-tinta-sec dark:text-marfil/50">
                      <span>{d.carpeta}</span>
                      <span>·</span>
                      <span className="num">{d.tamano}</span>
                      <span>·</span>
                      <span className="num">{fechaCorta(d.actualizado, lang)}</span>
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      <Avatar personaId={d.autorId} size={20} />
                      <Pildora tono="neutro">{d.versiones.length} {t('wp.doc.versiones')}</Pildora>
                      {d.mesaId ? <Pildora tono="mineral">{t('nav.mesasCorto')}</Pildora> : null}
                      {d.restringido ? <Pildora tono="terroso">{t('wp.doc.restringido')}</Pildora> : null}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <Modal
        abierto={Boolean(abierto)}
        onCerrar={() => setAbierto(null)}
        titulo={abierto ? campo(abierto, 'nombre', lang) : ''}
        ancho={580}
        pie={
          abierto ? (
            <>
              <Boton variante="secundario" onClick={() => setAbierto(null)}>{t('app.cerrar')}</Boton>
              {abierto.mesaId ? (
                <Boton onClick={() => { const id = abierto.mesaId!; setAbierto(null); navigate(`/mesa/${id}`) }}>
                  <Table2 size={15} />
                  {t('wp.doc.abrirMesa')}
                </Boton>
              ) : !abierto.restringido ? (
                <Boton
                  onClick={() => {
                    setAbierto(null)
                    toast({ titulo: t('wp.doc.llevado'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
                    navigate('/workplace/mesas')
                  }}
                >
                  <Table2 size={15} />
                  {t('wp.doc.llevarMesa')}
                </Boton>
              ) : null}
            </>
          ) : null
        }
      >
        {abierto ? (
          <div className="space-y-5">
            {abierto.restringido ? (
              <p className="rounded-xl border border-terroso/35 bg-terroso/[.08] p-3 text-[13px] leading-relaxed text-terroso-600 dark:text-[#d79a8c]">
                {t('wp.doc.restringido')}
              </p>
            ) : null}
            <dl className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('wp.doc.autor')}</dt>
                <dd className="mt-1 font-bold">{persona(abierto.autorId).nombre}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('wp.doc.tamano')}</dt>
                <dd className="num mt-1 font-bold">{abierto.tamano}</dd>
              </div>
            </dl>

            <div>
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/55">
                <History size={13} /> {t('wp.doc.historial')}
              </p>
              <ol className="relative space-y-3 border-l border-borde pl-4 dark:border-[#27425a]">
                {abierto.versiones.map((v, i) => (
                  <li key={v.id} className="relative">
                    <span className={cn('absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-noche-800', i === 0 ? 'bg-mineral' : 'bg-borde dark:bg-[#27425a]')} />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="num text-[13px] font-black">{v.etiqueta}</span>
                      <span className="num text-[12px] text-tinta-sec dark:text-marfil/50">
                        {fechaCorta(v.fecha, lang)} · {horaCorta(v.fecha, lang)}
                      </span>
                      <span className="text-[12px] text-tinta-sec dark:text-marfil/50">{persona(v.autorId).nombre}</span>
                      {i > 0 ? (
                        <button
                          type="button"
                          onClick={() => { restaurar(v.id); toast({ titulo: t('wp.doc.restaurada', { v: v.etiqueta }), detalle: t('toast.accionMockDetalle'), tono: 'ok' }) }}
                          className="ml-auto inline-flex min-h-[32px] items-center gap-1 rounded-lg border border-borde px-2 text-[11.5px] font-bold transition-colors hover:border-mineral hover:text-mineral-texto dark:border-[#27425a]"
                        >
                          <RotateCcw size={11} />
                          {t('wp.doc.restaurar')}
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-tinta-sec dark:text-marfil/55">{campo(v, 'nota', lang)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </Modal>

      <DevNotice
        className="mt-8"
        funcion={t('wp.dev.archivos')}
        hoy={t('wp.dev.archivosHoy')}
        alDesarrollar={t('wp.dev.archivosDesp')}
      />
    </>
  )
}
