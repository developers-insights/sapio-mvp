import { useNavigate } from 'react-router-dom'
import {
  ArrowUpRight, BookOpen, CalendarDays, Clock, FolderKanban, Lock, MessagesSquare,
  Search, Sparkles, Table2, TriangleAlert,
} from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol, saludoRol, bajadaRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, Kpi, PreviewBanner, Pildora, Avatar, EstadoBadge, ChipInteruniversitario } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { EVENTOS, PROYECTOS, PROYECTO_TESIS, MESA_TESIS, CANAL_TESIS } from '@/data/proyecto'
import { MESAS } from '@/data/mesa'
import { CANALES } from '@/data/chat'
import { NOTIFICACIONES } from '@/data/gestion'
import { P, persona, USUARIO_POR_ROL } from '@/data/personas'
import { diasDesdeHoy, horaCorta, dia, fechaCorta } from '@/lib/fechas'
import { cn } from '@/lib/cn'

export function WorkplaceInicio() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const setBuscador = useUI((s) => s.setBuscador)
  const setAsistente = useUI((s) => s.setAsistente)
  const tareas = useDatos((s) => s.tareas)
  const comentarios = useDatos((s) => s.comentarios)
  const leidas = useDatos((s) => s.notificacionesLeidas)
  const navigate = useNavigate()
  const yo = persona(USUARIO_POR_ROL[rol])

  const esColab = rol === 'colaborador'
  const esProf = rol === 'profesor'

  // Datos propios de cada rol (no la misma vista filtrada)
  const misTareas = tareas.filter((x) =>
    esProf ? x.responsableId === P.grant : esColab ? x.responsableId === P.rivas : x.responsableId === P.ale,
  )
  const porVencer = misTareas
    .filter((x) => x.estado !== 'hecha')
    .sort((a, b) => a.vence.getTime() - b.vence.getTime())
    .slice(0, 4)
  const atrasadas = misTareas.filter((x) => x.estado !== 'hecha' && diasDesdeHoy(x.vence) < 0)

  const eventosHoy = EVENTOS.filter(
    (e) => diasDesdeHoy(e.inicio) === 0 && e.participantes.includes(yo.id),
  )
  const eventosSemana = EVENTOS.filter((e) => {
    const d = diasDesdeHoy(e.inicio)
    return d >= 0 && d <= 7 && e.participantes.includes(yo.id)
  })

  const misMesas = MESAS.filter((m) => m.participantes.some((p) => p.personaId === yo.id))
  const sinResolver = (comentarios[MESA_TESIS] ?? []).filter((c) => !c.resuelto)
  const misCanales = CANALES.filter((c) => c.miembros.includes(yo.id))
  const sinLeer = misCanales.reduce((a, c) => a + c.noLeidos, 0)
  const notifSinLeer = NOTIFICACIONES.filter(
    (n) => n.paraRoles.includes(rol) && !n.leida && !leidas.includes(n.id),
  ).length
  const misProyectos = PROYECTOS.filter((p) => p.miembros.includes(yo.id))
  const doctorandos = esProf ? [P.ale, 'p-est-3', 'p-est-7'] : []

  return (
    <>
      <PreviewBanner
        id="wp-inicio"
        titulo={t('wp.banner.inicio')}
        bullets={[t('wp.banner.inicio1'), t('wp.banner.inicio2'), t('wp.banner.inicio3')]}
      />

      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={saludoRol(rol, lang)}
        bajada={bajadaRol(rol, lang)}
        acciones={
          <>
            <Boton variante="secundario" onClick={() => setBuscador(true)}>
              <Search size={15} />
              {t('buscador.atajo')}
            </Boton>
            <Boton variante="mineral" onClick={() => setAsistente(true)}>
              <Sparkles size={15} />
              {t('nav.asistente')}
            </Boton>
          </>
        }
      />

      {esColab ? (
        <p className="mb-6 rounded-2xl border border-pizarra/25 bg-pizarra/[.06] p-4 text-[13.5px] leading-relaxed text-tinta-sec dark:border-[#27425a] dark:bg-noche-800/60 dark:text-marfil/70">
          {t('wp.colabNota')}
        </p>
      ) : null}

      {/* KPIs por rol */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {esProf ? (
          <>
            <Kpi etiqueta={t('wp.doctorandos')} valor={doctorandos.length} icono={<BookOpen size={16} />} onClick={() => navigate('/workplace/proyectos')} />
            <Kpi etiqueta={t('wp.entregasPendientes')} valor={porVencer.length} tono="champan" icono={<Clock size={16} />} onClick={() => navigate('/workplace/tareas')} />
            <Kpi etiqueta={t('wp.mesasQueDirijo')} valor={misMesas.length} icono={<Table2 size={16} />} onClick={() => navigate('/workplace/mesas')} />
            <Kpi etiqueta={t('wp.comentariosSinResolver')} valor={sinResolver.length} tono="terroso" icono={<MessagesSquare size={16} />} onClick={() => navigate(`/mesa/${MESA_TESIS}`)} />
          </>
        ) : esColab ? (
          <>
            <Kpi etiqueta={t('wp.proyectosCompartidos')} valor={misProyectos.length} icono={<FolderKanban size={16} />} onClick={() => navigate('/workplace/documentos')} />
            <Kpi etiqueta={t('nav.mesas')} valor={misMesas.length} icono={<Table2 size={16} />} onClick={() => navigate('/workplace/mesas')} />
            <Kpi etiqueta={t('wp.tareasPorVencer')} valor={porVencer.length} tono="champan" icono={<Clock size={16} />} onClick={() => navigate('/workplace/tareas')} />
            <Kpi etiqueta={t('wp.mensajesSinLeer')} valor={sinLeer} icono={<MessagesSquare size={16} />} onClick={() => navigate('/chat')} />
          </>
        ) : (
          <>
            <Kpi etiqueta={t('wp.horasEstaSemana')} valor={eventosSemana.length} icono={<CalendarDays size={16} />} onClick={() => navigate('/workplace/calendario')} />
            <Kpi etiqueta={t('wp.tareasPorVencer')} valor={porVencer.length} tono={atrasadas.length ? 'terroso' : 'champan'} detalle={atrasadas.length ? `${atrasadas.length} ${t('estado.atrasada').toLowerCase()}` : undefined} icono={<Clock size={16} />} onClick={() => navigate('/workplace/tareas')} />
            <Kpi etiqueta={t('wp.comentariosSinResolver')} valor={sinResolver.length} tono="mineral" icono={<Table2 size={16} />} onClick={() => navigate(`/mesa/${MESA_TESIS}`)} />
            <Kpi etiqueta={t('wp.notif.titulo')} valor={notifSinLeer} icono={<MessagesSquare size={16} />} onClick={() => navigate('/workplace/notificaciones')} />
          </>
        )}
      </div>

      {/* Tres cards del mockup del manual */}
      <div className="mb-8 grid gap-3 sm:gap-4 md:grid-cols-3">
        <TarjetaManual
          color="#527D79"
          titulo={t('wp.tarjeta.conocimiento')}
          detalle={t('wp.tarjeta.conocimientoDet')}
          onClick={() => navigate('/workplace/documentos')}
        />
        <TarjetaManual
          color="#C9A974"
          titulo={t('wp.tarjeta.proyectos')}
          detalle={t('wp.tarjeta.proyectosDet')}
          onClick={() => navigate(esColab ? '/workplace/mesas' : '/workplace/proyectos')}
        />
        <TarjetaManual
          color="#25465C"
          titulo={t('wp.tarjeta.oportunidades')}
          detalle={t('wp.tarjeta.oportunidadesDet')}
          bloqueada
          nota={t('wp.tarjeta.oportunidadesFase')}
          onClick={() => navigate('/proximamente')}
        />
      </div>

      {/* Resumen del día */}
      <h2 className="mb-4 text-xl font-black">{t('wp.resumenDia')}</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="min-w-0 truncate text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {t('wp.proximosEventos')}
            </h3>
            {!esColab ? (
              <button type="button" onClick={() => navigate('/workplace/calendario')} className="min-h-[36px] shrink-0 text-[12px] font-bold text-mineral-texto hover:underline">
                {t('wp.verTodo')}
              </button>
            ) : null}
          </div>
          {eventosHoy.length ? (
            <ul className="space-y-2.5">
              {eventosHoy.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => navigate(e.proyectoId === PROYECTO_TESIS && e.tipo === 'comite' ? `/mesa/${MESA_TESIS}` : '/workplace/calendario')}
                    className="flex w-full min-h-[44px] items-start gap-3 rounded-xl border border-borde p-3 text-left transition-colors hover:border-mineral dark:border-[#27425a]"
                  >
                    <span className="num mt-0.5 shrink-0 rounded-lg bg-marfil-200 px-2 py-1 text-[12px] font-black dark:bg-noche-700">
                      {horaCorta(e.inicio, lang)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-bold leading-snug">{campo(e, 'titulo', lang)}</span>
                      <span className="block truncate text-[12px] text-tinta-sec dark:text-marfil/55">
                        {campo(e, 'lugar', lang)}
                      </span>
                    </span>
                    {e.interuniversitario ? <Pildora tono="pizarra">3</Pildora> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-tinta-sec dark:text-marfil/55">{t('wp.sinEventosHoy')}</p>
          )}
        </section>

        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="min-w-0 truncate text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {esProf ? t('wp.entregasPendientes') : t('wp.tareasPorVencer')}
            </h3>
            <button type="button" onClick={() => navigate('/workplace/tareas')} className="min-h-[36px] shrink-0 text-[12px] font-bold text-mineral-texto hover:underline">
              {t('wp.verTodo')}
            </button>
          </div>
          {porVencer.length ? (
            <ul className="space-y-2.5">
              {porVencer.map((x) => {
                const d = diasDesdeHoy(x.vence)
                return (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => navigate('/workplace/tareas')}
                      className="flex w-full min-h-[44px] items-start gap-3 rounded-xl border border-borde p-3 text-left transition-colors hover:border-mineral dark:border-[#27425a]"
                    >
                      {d < 0 ? <TriangleAlert size={15} className="mt-0.5 shrink-0 text-terroso" /> : null}
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-bold leading-snug">{campo(x, 'titulo', lang)}</span>
                        <span className={cn('block text-[12px]', d < 0 ? 'text-terroso' : 'text-tinta-sec dark:text-marfil/55')}>
                          {d < 0 ? t('wp.tareas.vencio', { n: Math.abs(d) }) : d === 0 ? t('wp.tareas.venceHoy') : t('wp.tareas.venceEn', { n: d })}
                        </span>
                      </span>
                      <EstadoBadge estado={x.estado} />
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-tinta-sec dark:text-marfil/55">{t('wp.sinTareas')}</p>
          )}
        </section>

        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            {t('wp.mesasActividad')}
          </h3>
          <ul className="space-y-2.5">
            {misMesas.slice(0, 3).map((m) => {
              const nuevos = (comentarios[m.id] ?? []).filter((c) => !c.resuelto).length
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/mesa/${m.id}`)}
                    className="flex w-full min-h-[44px] items-center gap-3 rounded-xl border border-borde p-3 text-left transition-colors hover:border-mineral dark:border-[#27425a]"
                  >
                    <Table2 size={16} className="shrink-0 text-mineral-texto" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold leading-snug">{campo(m, 'titulo', lang)}</span>
                      <span className="flex -space-x-1.5 pt-1.5">
                        {m.participantes.slice(0, 5).map((p) => (
                          <Avatar key={p.personaId} personaId={p.personaId} size={20} />
                        ))}
                      </span>
                    </span>
                    {nuevos ? <Pildora tono="terroso">{nuevos}</Pildora> : null}
                    <ArrowUpRight size={15} className="shrink-0 text-tinta-sec" />
                  </button>
                </li>
              )
            })}
          </ul>
          {misMesas.some((m) => m.interuniversitario) ? (
            <div className="mt-3">
              <ChipInteruniversitario />
            </div>
          ) : null}
        </section>

        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="min-w-0 truncate text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {t('wp.mensajesSinLeer')}
            </h3>
            <button type="button" onClick={() => navigate('/chat')} className="min-h-[36px] shrink-0 text-[12px] font-bold text-mineral-texto hover:underline">
              {t('wp.verTodo')}
            </button>
          </div>
          <ul className="space-y-2.5">
            {misCanales
              .filter((c) => c.noLeidos > 0)
              .slice(0, 3)
              .map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/chat/${c.id}`)}
                    className="flex w-full min-h-[44px] items-center gap-3 rounded-xl border border-borde p-3 text-left transition-colors hover:border-mineral dark:border-[#27425a]"
                  >
                    <MessagesSquare size={16} className="shrink-0 text-mineral-texto" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-bold leading-snug">{c.nombre}</span>
                      <span className="block truncate text-[12px] text-tinta-sec dark:text-marfil/55">
                        {campo(c, 'descripcion', lang)}
                      </span>
                    </span>
                    <Pildora tono="terroso">{c.noLeidos}</Pildora>
                  </button>
                </li>
              ))}
            {!misCanales.some((c) => c.noLeidos > 0) ? (
              <li className="py-6 text-center text-sm text-tinta-sec dark:text-marfil/55">{t('app.vacio')}</li>
            ) : null}
          </ul>
        </section>
      </div>

      <p className="mt-8 text-[12px] text-tinta-sec dark:text-marfil/45">
        {fechaCorta(dia(0), lang)} · {t('app.demoPill')}
      </p>
    </>
  )
}

function TarjetaManual({
  color,
  titulo,
  detalle,
  bloqueada,
  nota,
  onClick,
}: {
  color: string
  titulo: string
  detalle: string
  bloqueada?: boolean
  nota?: string
  onClick: () => void
}) {
  const { t } = useT()
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'card-sapio group flex min-h-[132px] flex-col items-start p-5 text-left transition-[border-color,box-shadow] hover:border-mineral hover:shadow-sapio-lg',
        bloqueada && 'border-dashed bg-marfil-200/50 dark:bg-noche-800/40',
      )}
    >
      <span className="h-6 w-6 rounded-full" style={{ background: color }} aria-hidden="true" />
      <span className="mt-3.5 flex items-center gap-2 text-[17px] font-black leading-tight">
        {titulo}
        {bloqueada ? <Lock size={14} className="text-champan-700 dark:text-champan" /> : null}
      </span>
      <span className="mt-1 text-[13px] text-tinta-sec dark:text-marfil/55">{detalle}</span>
      {bloqueada ? (
        <span className="mt-auto pt-3">
          <Pildora tono="champan" icono={<Lock size={11} />}>
            {t('nav.fases23')}
          </Pildora>
        </span>
      ) : null}
      {nota ? (
        <span className="mt-2 text-[12px] leading-snug text-tinta-sec dark:text-marfil/45">{nota}</span>
      ) : null}
    </button>
  )
}
