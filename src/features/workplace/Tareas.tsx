import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutList, Columns3, Plus, TriangleAlert, Sparkles } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, PreviewBanner, Pildora, Avatar, EstadoBadge, EstadoVacio } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Input, Select } from '@/components/ui/Campos'
import { PROYECTO_POR_ID } from '@/data/proyecto'
import { persona, USUARIO_POR_ROL, PERSONAS } from '@/data/personas'
import { claveFecha, dia, diasDesdeHoy, fechaCorta } from '@/lib/fechas'
import type { EstadoTarea, Tarea } from '@/data/tipos'
import { cn } from '@/lib/cn'

const COLUMNAS: EstadoTarea[] = ['por-hacer', 'en-curso', 'en-revision', 'hecha']

export function Tareas() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const tareas = useDatos((s) => s.tareas)
  const cambiarEstado = useDatos((s) => s.cambiarEstadoTarea)
  const agregar = useDatos((s) => s.agregarTareas)
  const navigate = useNavigate()
  const [vista, setVista] = useState<'lista' | 'tablero'>('lista')
  const [filtro, setFiltro] = useState<'todas' | 'mias'>('todas')
  const [nueva, setNueva] = useState(false)
  const [titulo, setTitulo] = useState('')
  const yo = persona(USUARIO_POR_ROL[rol])

  const visibles = useMemo(() => {
    const base = rol === 'colaborador' ? tareas.filter((x) => x.proyectoId === 'pr-auditoria' || x.responsableId === yo.id) : tareas
    return filtro === 'mias' ? base.filter((x) => x.responsableId === yo.id) : base
  }, [tareas, filtro, yo.id, rol])

  const ordenadas = [...visibles].sort((a, b) => a.vence.getTime() - b.vence.getTime())

  function crear() {
    const texto = titulo.trim() || (lang === 'en' ? 'New task' : 'Tarea nueva')
    agregar([
      {
        id: 't-' + Date.now(),
        tituloEs: texto,
        tituloEn: texto,
        estado: 'por-hacer',
        responsableId: yo.id,
        vence: dia(5, 12),
        proyectoId: 'pr-tesis',
        prioridad: 'media',
      },
    ])
    setTitulo('')
    setNueva(false)
    toast({ titulo: t('wp.tareas.creada'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
  }

  return (
    <>
      <PreviewBanner
        id="wp-tareas"
        titulo={t('wp.tareas.banner')}
        bullets={[t('wp.tareas.banner1'), t('wp.tareas.banner2'), t('wp.tareas.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('wp.tareas.titulo')}
        acciones={
          <Boton onClick={() => setNueva(true)}>
            <Plus size={16} />
            {t('wp.tareas.nueva')}
          </Boton>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-borde bg-white p-1 dark:border-[#27425a] dark:bg-noche-800">
          <button type="button" onClick={() => setVista('lista')} className={cn('inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold', vista === 'lista' ? 'bg-mineral text-white' : 'text-tinta-sec dark:text-marfil/60')}>
            <LayoutList size={14} /> {t('wp.tareas.lista')}
          </button>
          <button type="button" onClick={() => setVista('tablero')} className={cn('inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-[13px] font-bold', vista === 'tablero' ? 'bg-mineral text-white' : 'text-tinta-sec dark:text-marfil/60')}>
            <Columns3 size={14} /> {t('wp.tareas.tablero')}
          </button>
        </div>
        <Select value={filtro} onChange={(e) => setFiltro(e.target.value as 'todas' | 'mias')} className="w-auto">
          <option value="todas">{t('app.todas')}</option>
          <option value="mias">{yo.nombre}</option>
        </Select>
      </div>

      {!ordenadas.length ? (
        <EstadoVacio titulo={t('app.vacio')} detalle={t('wp.sinTareas')} accion={<Boton onClick={() => setNueva(true)}>{t('wp.tareas.nueva')}</Boton>} />
      ) : vista === 'lista' ? (
        <ul className="space-y-2.5">
          {ordenadas.map((x) => (
            <FilaTarea key={x.id} tarea={x} onEstado={(e) => { cambiarEstado(x.id, e); toast({ titulo: t('wp.tareas.cambiada'), tono: 'ok' }) }} onProyecto={(id) => navigate(`/workplace/proyectos/${id}`)} />
          ))}
        </ul>
      ) : (
        <div className="scroll-x-contenida -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="grid min-w-[760px] grid-cols-4 gap-3">
            {COLUMNAS.map((col) => {
              const items = ordenadas.filter((x) => x.estado === col)
              return (
                <div key={col} className="rounded-2xl border border-borde bg-marfil-200/60 p-2.5 dark:border-[#27425a] dark:bg-noche-800/50">
                  <p className="mb-2.5 flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/55">
                    {t(`estado.${col}`)}
                    <span className="num">{items.length}</span>
                  </p>
                  <ul className="space-y-2">
                    {items.map((x) => {
                      const d = diasDesdeHoy(x.vence)
                      return (
                        <li key={x.id} className="card-sapio p-3">
                          <p className="text-[13px] font-bold leading-snug">{campo(x, 'titulo', lang)}</p>
                          <div className="mt-2.5 flex items-center gap-2">
                            <Avatar personaId={x.responsableId} size={22} />
                            <span className={cn('num text-[11.5px]', d < 0 && x.estado !== 'hecha' ? 'text-terroso' : 'text-tinta-sec dark:text-marfil/50')}>
                              {fechaCorta(x.vence, lang)}
                            </span>
                            {x.creadaPorAsistente ? <Sparkles size={12} className="ml-auto text-mineral" /> : null}
                          </div>
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {COLUMNAS.filter((c) => c !== col).map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => { cambiarEstado(x.id, c); toast({ titulo: t('wp.tareas.cambiada'), tono: 'ok' }) }}
                                className="min-h-[32px] rounded-lg border border-borde px-2 text-[10.5px] font-bold text-tinta-sec transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a] dark:text-marfil/55"
                              >
                                → {t(`estado.${c}`)}
                              </button>
                            ))}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Modal
        abierto={nueva}
        onCerrar={() => setNueva(false)}
        titulo={t('wp.tareas.nueva')}
        ancho={520}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setNueva(false)}>{t('app.cancelar')}</Boton>
            <Boton onClick={crear}>{t('app.crear')}</Boton>
          </>
        }
      >
        <div className="space-y-4">
          <Campo label={t('wp.tareas.titulo')}>
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder={lang === 'en' ? 'Describe the task' : 'Describí la tarea'} />
          </Campo>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label={t('wp.tareas.responsable')}>
              <Select defaultValue={yo.id}>
                {PERSONAS.slice(0, 7).map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </Select>
            </Campo>
            <Campo label={t('wp.tareas.vence')}>
              <Input type="date" defaultValue={claveFecha(dia(5))} />
            </Campo>
          </div>
        </div>
      </Modal>
    </>
  )
}

function FilaTarea({
  tarea,
  onEstado,
  onProyecto,
}: {
  tarea: Tarea
  onEstado: (e: EstadoTarea) => void
  onProyecto: (id: string) => void
}) {
  const { t, lang } = useT()
  const d = diasDesdeHoy(tarea.vence)
  const atrasada = d < 0 && tarea.estado !== 'hecha'
  const proyecto = tarea.proyectoId ? PROYECTO_POR_ID[tarea.proyectoId] : undefined
  return (
    <li className={cn('card-sapio p-3.5 sm:p-4', atrasada && 'border-terroso/45')}>
      <div className="flex flex-wrap items-start gap-3">
        <Avatar personaId={tarea.responsableId} size={34} presencia />
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold leading-snug">
            {campo(tarea, 'titulo', lang)}
            {tarea.creadaPorAsistente ? <Sparkles size={13} className="ml-1.5 inline text-mineral" /> : null}
          </p>
          {campo(tarea, 'descripcion', lang) ? (
            <p className="mt-1 text-[12.5px] leading-snug text-tinta-sec dark:text-marfil/55">
              {campo(tarea, 'descripcion', lang)}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={cn('num inline-flex items-center gap-1 text-[12px] font-bold', atrasada ? 'text-terroso' : 'text-tinta-sec dark:text-marfil/55')}>
              {atrasada ? <TriangleAlert size={12} /> : null}
              {atrasada ? t('wp.tareas.vencio', { n: Math.abs(d) }) : d === 0 ? t('wp.tareas.venceHoy') : t('wp.tareas.venceEn', { n: d })}
            </span>
            <Pildora tono="neutro">{t(`prioridad.${tarea.prioridad}`)}</Pildora>
            {proyecto ? (
              <button type="button" onClick={() => onProyecto(proyecto.id)} className="min-h-[32px] text-[12px] font-bold text-mineral hover:underline">
                {campo(proyecto, 'nombre', lang).split('·')[0].trim()}
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <EstadoBadge estado={atrasada ? 'atrasada' : tarea.estado} />
          <select
            value={tarea.estado}
            onChange={(e) => onEstado(e.target.value as EstadoTarea)}
            aria-label={t('wp.tareas.cambiada')}
            className="min-h-[36px] rounded-lg border border-borde bg-white px-2 text-[12px] font-bold dark:border-[#27425a] dark:bg-noche-800"
          >
            {COLUMNAS.map((c) => (
              <option key={c} value={c}>{t(`estado.${c}`)}</option>
            ))}
          </select>
        </div>
      </div>
    </li>
  )
}
