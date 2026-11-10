import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FolderKanban, MessagesSquare, Table2 } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, PreviewBanner, Avatar, AvatarUni, ChipInteruniversitario, EstadoBadge, EstadoVacio, Pildora } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { DOCUMENTOS, PROYECTOS, PROYECTO_POR_ID } from '@/data/proyecto'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { UNI_POR_ID } from '@/data/universidades'
import { fechaCorta } from '@/lib/fechas'

export function Proyectos() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const navigate = useNavigate()
  const yo = persona(USUARIO_POR_ROL[rol])
  const mios = PROYECTOS.filter((p) => p.miembros.includes(yo.id))

  return (
    <>
      <PreviewBanner
        id="wp-pr"
        titulo={t('wp.pr.banner')}
        bullets={[t('wp.pr.banner1'), t('wp.pr.banner2'), t('wp.pr.banner3')]}
      />
      <EncabezadoSeccion kicker={kickerRol(rol, lang)} titulo={t('wp.pr.titulo')} />

      {!mios.length ? (
        <EstadoVacio titulo={t('app.vacio')} icono={<FolderKanban size={20} />} />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {mios.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => navigate(`/workplace/proyectos/${p.id}`)}
                className="card-sapio flex h-full w-full flex-col p-4 text-left transition-[border-color,box-shadow] hover:border-mineral hover:shadow-sapio-lg sm:p-5"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-[16px] font-black leading-snug">{campo(p, 'nombre', lang)}</span>
                </span>
                <span className="mt-2 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
                  {campo(p, 'descripcion', lang)}
                </span>
                <span className="mt-3 flex flex-wrap items-center gap-2">
                  {p.interuniversitario ? <Pildora tono="pizarra">{t('interuni.chip')}</Pildora> : null}
                </span>
                <span className="mt-auto pt-4">
                  <span className="flex items-center gap-2">
                    <span className="flex -space-x-1.5">
                      {p.miembros.map((m) => (
                        <Avatar key={m} personaId={m} size={24} />
                      ))}
                    </span>
                    <span className="num ml-auto text-[12px] font-bold text-tinta-sec dark:text-marfil/55">
                      {p.progreso}%
                    </span>
                  </span>
                  <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-marfil-200 dark:bg-noche-700">
                    <span className="block h-full rounded-full bg-mineral" style={{ width: `${p.progreso}%` }} />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export function ProyectoDetalle() {
  const { id } = useParams()
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const tareas = useDatos((s) => s.tareas)
  const navigate = useNavigate()
  const p = id ? PROYECTO_POR_ID[id] : undefined

  if (!p) {
    return (
      <EstadoVacio
        titulo={t('app.vacio')}
        accion={<Boton onClick={() => navigate('/workplace/proyectos')}>{t('app.volver')}</Boton>}
      />
    )
  }

  const delProyecto = tareas.filter((x) => x.proyectoId === p.id)
  const docs = DOCUMENTOS.filter((d) => ['d-cap3', 'd-cap2', 'd-encuesta', 'd-protocolos', 'd-datos', 'd-comite'].includes(d.id))

  return (
    <>
      <PreviewBanner
        id="wp-pr-det"
        titulo={t('wp.pr.banner')}
        bullets={[t('wp.pr.banner1'), t('wp.pr.banner2'), t('wp.pr.banner3')]}
      />
      <button
        type="button"
        onClick={() => navigate('/workplace/proyectos')}
        className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-[13px] font-bold text-mineral hover:underline"
      >
        <ArrowLeft size={15} /> {t('wp.pr.titulo')}
      </button>

      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={campo(p, 'nombre', lang)}
        bajada={campo(p, 'descripcion', lang)}
        acciones={
          <>
            {p.mesaId ? (
              <Boton onClick={() => navigate(`/mesa/${p.mesaId}`)}>
                <Table2 size={15} /> {t('wp.pr.suMesa')}
              </Boton>
            ) : null}
            {p.canalChat ? (
              <Boton variante="secundario" onClick={() => navigate(`/chat/${p.canalChat}`)}>
                <MessagesSquare size={15} /> {t('wp.pr.suChat')}
              </Boton>
            ) : null}
          </>
        }
      />

      {p.interuniversitario ? (
        <div className="mb-6">
          <ChipInteruniversitario />
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <section className="card-sapio p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {t('wp.pr.tareasDel')}
            </h2>
            <ul className="space-y-2">
              {delProyecto.map((x) => (
                <li key={x.id} className="flex flex-wrap items-center gap-2.5 rounded-xl border border-borde p-3 dark:border-[#27425a]">
                  <Avatar personaId={x.responsableId} size={26} />
                  <span className="min-w-0 flex-1 text-[13.5px] font-bold leading-snug">{campo(x, 'titulo', lang)}</span>
                  <span className="num text-[12px] text-tinta-sec dark:text-marfil/50">{fechaCorta(x.vence, lang)}</span>
                  <EstadoBadge estado={x.estado} />
                </li>
              ))}
            </ul>
          </section>

          <section className="card-sapio p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {t('wp.pr.docsDel')}
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {docs.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => navigate(d.mesaId ? `/mesa/${d.mesaId}` : '/workplace/documentos')}
                    className="flex w-full min-h-[44px] items-center gap-2 rounded-xl border border-borde p-3 text-left text-[13px] font-bold transition-colors hover:border-mineral dark:border-[#27425a]"
                  >
                    <span className="min-w-0 flex-1 truncate">{campo(d, 'nombre', lang)}</span>
                    <span className="num shrink-0 text-[11.5px] text-tinta-sec dark:text-marfil/50">{d.versiones[0].etiqueta}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="card-sapio p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {t('wp.pr.miembros')}
            </h2>
            <ul className="space-y-2.5">
              {p.miembros.map((m) => {
                const q = persona(m)
                const u = UNI_POR_ID[q.universidadId]
                return (
                  <li key={m} className="flex items-center gap-2.5">
                    <Avatar personaId={m} size={32} presencia />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold">{q.nombre}</span>
                      <span className="block truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">
                        {lang === 'en' ? q.cargoEn : q.cargoEs}
                      </span>
                    </span>
                    <AvatarUni iniciales={u.iniciales} color={u.colorPrimario} size={24} />
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="card-sapio p-4 sm:p-5">
            <h2 className="mb-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {t('wp.pr.progreso')}
            </h2>
            <p className="num text-3xl font-black text-mineral">{p.progreso}%</p>
            <span className="mt-2 block h-2 overflow-hidden rounded-full bg-marfil-200 dark:bg-noche-700">
              <span className="block h-full rounded-full bg-mineral" style={{ width: `${p.progreso}%` }} />
            </span>
          </section>
        </aside>
      </div>
    </>
  )
}
