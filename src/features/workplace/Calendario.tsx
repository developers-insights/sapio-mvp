import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Globe, Plus, Users } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, PreviewBanner, Pildora, Avatar, DevNotice } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Input, Select } from '@/components/ui/Campos'
import { EVENTOS, ZONAS_PARTICIPANTE } from '@/data/proyecto'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import {
  addDays, claveFecha, dia, endOfMonth, fechaLarga, fmt, horaCorta, isSameDay,
  startOfMonth, startOfWeek,
} from '@/lib/fechas'
import { useEsMobile } from '@/lib/hooks'
import { cn } from '@/lib/cn'
import type { Evento } from '@/data/tipos'

type Vista = 'dia' | 'semana' | 'mes'

export function Calendario() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const tareas = useDatos((s) => s.tareas)
  const esMobile = useEsMobile()
  const [vista, setVista] = useState<Vista>('semana')
  const [cursor, setCursor] = useState(() => dia(0))
  const [detalle, setDetalle] = useState<Evento | null>(null)
  const [nuevoAbierto, setNuevoAbierto] = useState(false)
  const yo = persona(USUARIO_POR_ROL[rol])

  // En móvil la vista por defecto es DÍA.
  useEffect(() => {
    setVista(esMobile ? 'dia' : 'semana')
  }, [esMobile])

  const mios = useMemo(
    () => EVENTOS.filter((e) => e.participantes.includes(yo.id)),
    [yo.id],
  )

  /** Las tareas con fecha aparecen en el calendario. */
  const comoEventos = useMemo(
    () =>
      tareas
        .filter((x) => x.responsableId === yo.id && x.estado !== 'hecha')
        .map((x) => ({
          id: 'tarea-' + x.id,
          tituloEs: x.tituloEs,
          tituloEn: x.tituloEn,
          inicio: x.vence,
          fin: x.vence,
          lugarEs: t('wp.cal.tareaEnCalendario'),
          lugarEn: t('wp.cal.tareaEnCalendario'),
          participantes: [x.responsableId],
          tipo: 'entrega' as const,
          interuniversitario: false,
          esTarea: true,
        })) satisfies Array<Evento & { esTarea: boolean }>,
    [tareas, yo.id, t],
  )

  const todos: Array<Evento & { esTarea?: boolean }> = [...mios, ...comoEventos]

  function delDia(d: Date) {
    return todos
      .filter((e) => isSameDay(e.inicio, d))
      .sort((a, b) => a.inicio.getTime() - b.inicio.getTime())
  }

  const diasSemana = useMemo(() => {
    const inicio = startOfWeek(cursor, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(inicio, i))
  }, [cursor])

  const diasMes = useMemo(() => {
    const ini = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
    const fin = endOfMonth(cursor)
    const total = Math.ceil((fin.getTime() - ini.getTime()) / 86400000 / 7) * 7 + 7
    return Array.from({ length: Math.min(42, total) }, (_, i) => addDays(ini, i))
  }, [cursor])

  function mover(d: number) {
    setCursor((c) => addDays(c, vista === 'dia' ? d : vista === 'semana' ? d * 7 : d * 30))
  }

  return (
    <>
      <PreviewBanner
        id="wp-cal"
        titulo={t('wp.cal.banner')}
        bullets={[t('wp.cal.banner1'), t('wp.cal.banner2'), t('wp.cal.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('wp.cal.titulo')}
        acciones={
          <Boton onClick={() => setNuevoAbierto(true)}>
            <Plus size={16} />
            {t('wp.cal.nuevoEvento')}
          </Boton>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-borde bg-white p-1 dark:border-[#27425a] dark:bg-noche-800">
          {(['dia', 'semana', 'mes'] as Vista[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVista(v)}
              className={cn(
                'min-h-[36px] rounded-lg px-3 text-[13px] font-bold transition-colors',
                vista === v ? 'bg-mineral text-white' : 'text-tinta-sec hover:text-noche dark:text-marfil/60',
              )}
            >
              {t(`wp.cal.${v}`)}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={() => mover(-1)} aria-label={t('app.anterior')} className="grid h-11 w-11 place-items-center rounded-lg border border-borde bg-white dark:border-[#27425a] dark:bg-noche-800">
            <ChevronLeft size={17} />
          </button>
          <button type="button" onClick={() => setCursor(dia(0))} className="min-h-[44px] rounded-lg border border-borde bg-white px-3 text-[13px] font-bold dark:border-[#27425a] dark:bg-noche-800">
            {t('app.hoy')}
          </button>
          <button type="button" onClick={() => mover(1)} aria-label={t('app.siguiente')} className="grid h-11 w-11 place-items-center rounded-lg border border-borde bg-white dark:border-[#27425a] dark:bg-noche-800">
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <p className="mb-3 text-sm font-bold capitalize text-tinta-sec dark:text-marfil/60">
        {vista === 'mes' ? fmt(cursor, 'MMMM yyyy', lang) : fechaLarga(cursor, lang)}
      </p>

      {vista === 'dia' ? (
        <ListaDia eventos={delDia(cursor)} onAbrir={setDetalle} />
      ) : vista === 'semana' ? (
        <div className="scroll-x-contenida card-sapio">
          <div className="grid min-w-[700px] grid-cols-7">
            {diasSemana.map((d) => {
              const hoyEs = isSameDay(d, dia(0))
              return (
                <div key={claveFecha(d)} className="min-h-[300px] border-r border-borde p-2 last:border-r-0 dark:border-[#27425a]">
                  <p className={cn('mb-2 text-center text-[11px] font-bold uppercase tracking-wider', hoyEs ? 'text-mineral-texto' : 'text-tinta-sec dark:text-marfil/50')}>
                    {fmt(d, 'EEE d', lang)}
                  </p>
                  <ul className="space-y-1.5">
                    {delDia(d).map((e) => (
                      <li key={e.id}>
                        <button type="button" onClick={() => setDetalle(e as Evento)} className="w-full rounded-lg border-l-[3px] bg-marfil-200 p-2 text-left text-[11.5px] leading-snug transition-colors hover:bg-marfil-300 dark:bg-noche-700 dark:hover:bg-noche-700/70" style={{ borderLeftColor: e.interuniversitario ? '#25465C' : e.tipo === 'entrega' ? '#C9A974' : '#527D79' }}>
                          <span className="num block font-black">{horaCorta(e.inicio, lang)}</span>
                          <span className="block">{campo(e, 'titulo', lang)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="card-sapio overflow-hidden p-2">
            <div className="grid grid-cols-7">
              {diasSemana.map((d) => (
                <p key={'h' + claveFecha(d)} className="pb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-tinta-sec dark:text-marfil/45">
                  {fmt(d, 'EEEEE', lang)}
                </p>
              ))}
              {diasMes.map((d) => {
                const eventos = delDia(d)
                const esHoy = isSameDay(d, dia(0))
                const sel = isSameDay(d, cursor)
                const delMes = d.getMonth() === cursor.getMonth()
                return (
                  <button
                    key={claveFecha(d)}
                    type="button"
                    onClick={() => setCursor(d)}
                    className={cn(
                      'flex min-h-[48px] flex-col items-center justify-start gap-1 rounded-lg py-1.5 transition-colors',
                      sel ? 'bg-mineral/15' : 'hover:bg-marfil-200 dark:hover:bg-noche-700',
                      !delMes && 'opacity-35',
                    )}
                  >
                    <span className={cn('num text-[12.5px] font-bold', esHoy && 'grid h-6 w-6 place-items-center rounded-full bg-mineral text-white')}>
                      {d.getDate()}
                    </span>
                    <span className="flex gap-0.5">
                      {eventos.slice(0, 3).map((e) => (
                        <span key={e.id} className="h-1.5 w-1.5 rounded-full" style={{ background: e.interuniversitario ? '#25465C' : e.tipo === 'entrega' ? '#C9A974' : '#527D79' }} />
                      ))}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold capitalize text-tinta-sec dark:text-marfil/60">{fechaLarga(cursor, lang)}</p>
            <ListaDia eventos={delDia(cursor)} onAbrir={setDetalle} />
          </div>
        </>
      )}

      <Modal
        abierto={Boolean(detalle)}
        onCerrar={() => setDetalle(null)}
        titulo={detalle ? campo(detalle, 'titulo', lang) : ''}
        ancho={520}
        pie={<Boton variante="secundario" onClick={() => setDetalle(null)}>{t('app.cerrar')}</Boton>}
      >
        {detalle ? (
          <div className="space-y-4">
            <p className="text-sm text-tinta-sec dark:text-marfil/70">
              {fechaLarga(detalle.inicio, lang)} · {horaCorta(detalle.inicio, lang)}–{horaCorta(detalle.fin, lang)}
            </p>
            <p className="text-sm">{campo(detalle, 'lugar', lang)}</p>
            {detalle.interuniversitario ? <Pildora tono="pizarra">{t('interuni.chip')}</Pildora> : null}
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/55">
                <Users size={13} /> {t('wp.cal.invitados')}
              </p>
              <ul className="space-y-2">
                {detalle.participantes.map((pid) => {
                  const p = persona(pid)
                  const z = ZONAS_PARTICIPANTE[pid]
                  const horaLocal = z
                    ? horaCorta(new Date(detalle.inicio.getTime() + z.offset * 3600000), lang)
                    : null
                  return (
                    <li key={pid} className="flex items-center gap-2.5">
                      <Avatar personaId={pid} size={28} presencia />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold">{p.nombre}</span>
                        <span className="block truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">
                          {lang === 'en' ? p.cargoEn : p.cargoEs}
                        </span>
                      </span>
                      {horaLocal && detalle.interuniversitario ? (
                        <span className="num shrink-0 rounded-lg bg-marfil-200 px-2 py-1 text-[11.5px] font-bold dark:bg-noche-700">
                          {horaLocal}
                        </span>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
              {detalle.interuniversitario ? (
                <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-tinta-sec dark:text-marfil/45">
                  <Globe size={12} /> {t('wp.cal.zonas')}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        abierto={nuevoAbierto}
        onCerrar={() => setNuevoAbierto(false)}
        titulo={t('wp.cal.nuevoEvento')}
        ancho={520}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setNuevoAbierto(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                setNuevoAbierto(false)
                toast({ titulo: t('wp.cal.creado'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
              }}
            >
              {t('app.crear')}
            </Boton>
          </>
        }
      >
        <div className="space-y-4">
          <Campo label={t('wp.cal.titEvento')}>
            <Input defaultValue={lang === 'en' ? 'Methodology review' : 'Revisión de metodología'} />
          </Campo>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label={t('wp.cal.fecha')}>
              <Input type="date" defaultValue={claveFecha(dia(1))} />
            </Campo>
            <Campo label={t('wp.cal.hora')}>
              <Input type="time" defaultValue="15:00" />
            </Campo>
          </div>
          <Campo label={t('wp.cal.invitados')}>
            <Select defaultValue="comite">
              <option value="comite">{lang === 'en' ? 'Thesis committee (3 universities)' : 'Comité de tesis (3 universidades)'}</option>
              <option value="grant">Dr. Michael Grant</option>
              <option value="whitfield">Dra. Sarah Whitfield</option>
            </Select>
          </Campo>
        </div>
      </Modal>

      <DevNotice
        className="mt-8"
        funcion={t('wp.dev.correo')}
        hoy={t('wp.dev.correoHoy')}
        alDesarrollar={t('wp.dev.correoDesp')}
      />
    </>
  )
}

function ListaDia({
  eventos,
  onAbrir,
}: {
  eventos: Array<Evento & { esTarea?: boolean }>
  onAbrir: (e: Evento) => void
}) {
  const { t, lang } = useT()
  if (!eventos.length) {
    return (
      <div className="card-sapio px-6 py-10 text-center text-sm text-tinta-sec dark:text-marfil/55">
        {t('wp.cal.sinEventos')}
      </div>
    )
  }
  return (
    <ul className="space-y-2.5">
      {eventos.map((e) => (
        <li key={e.id}>
          <button
            type="button"
            onClick={() => onAbrir(e)}
            className="card-sapio flex w-full min-h-[64px] items-start gap-3 p-3.5 text-left transition-[border-color] hover:border-mineral sm:p-4"
          >
            <span
              className="mt-0.5 h-10 w-[3px] shrink-0 rounded-full"
              style={{ background: e.interuniversitario ? '#25465C' : e.esTarea ? '#C9A974' : '#527D79' }}
            />
            <span className="num shrink-0 text-[13px] font-black">{horaCorta(e.inicio, lang)}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-bold leading-snug">{campo(e, 'titulo', lang)}</span>
              <span className="block truncate text-[12.5px] text-tinta-sec dark:text-marfil/55">
                {campo(e, 'lugar', lang)}
              </span>
            </span>
            <span className="flex shrink-0 -space-x-1.5">
              {e.participantes.slice(0, 4).map((p) => (
                <Avatar key={p} personaId={p} size={22} />
              ))}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
