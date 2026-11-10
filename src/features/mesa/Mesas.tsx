import { useNavigate } from 'react-router-dom'
import { Table2, Users } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, PreviewBanner, Pildora, Avatar, AvatarUni, EstadoVacio } from '@/components/ui/Piezas'
import { MESAS } from '@/data/mesa'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { UNI_POR_ID } from '@/data/universidades'
import { fechaCorta } from '@/lib/fechas'

export function Mesas() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const comentarios = useDatos((s) => s.comentarios)
  const navigate = useNavigate()
  const yo = persona(USUARIO_POR_ROL[rol])
  const mias = MESAS.filter((m) => m.participantes.some((p) => p.personaId === yo.id))

  return (
    <>
      <PreviewBanner
        id="mesas"
        titulo={t('mesa.lista.banner')}
        bullets={[t('mesa.lista.banner1'), t('mesa.lista.banner2'), t('mesa.lista.banner3')]}
      />
      <EncabezadoSeccion kicker={kickerRol(rol, lang)} titulo={t('mesa.titulo')} />

      {!mias.length ? (
        <EstadoVacio titulo={t('app.vacio')} icono={<Table2 size={20} />} />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {mias.map((m) => {
            const sinResolver = (comentarios[m.id] ?? []).filter((c) => !c.resuelto).length
            const miPermiso = m.participantes.find((p) => p.personaId === yo.id)?.permiso ?? 'lectura'
            const conectados = m.participantes.filter((p) => p.presencia === 'conectado').length
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/mesa/${m.id}`)}
                  className="card-sapio flex h-full w-full flex-col p-4 text-left transition-[border-color,box-shadow] hover:border-mineral hover:shadow-sapio-lg sm:p-5"
                >
                  <span className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mineral/12 text-mineral">
                      <Table2 size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15.5px] font-black leading-snug">{campo(m, 'titulo', lang)}</span>
                      <span className="num mt-1 block text-[12px] text-tinta-sec dark:text-marfil/50">
                        {t('mesa.actualizada')} {fechaCorta(m.actualizada, lang)}
                      </span>
                    </span>
                    {sinResolver ? <Pildora tono="terroso">{sinResolver}</Pildora> : null}
                  </span>

                  <span className="mt-3.5 flex flex-wrap items-center gap-2">
                    <Pildora tono="neutro" icono={<Users size={10} />}>
                      {t('mesa.conectados', { n: conectados })}
                    </Pildora>
                    <Pildora tono={miPermiso === 'edicion' ? 'mineral' : 'pizarra'}>
                      {t(`permiso.${miPermiso}`)}
                    </Pildora>
                    {m.interuniversitario ? <Pildora tono="pizarra">{t('interuni.chip')}</Pildora> : null}
                  </span>

                  <span className="mt-auto flex items-center gap-2 pt-4">
                    <span className="flex -space-x-1.5">
                      {m.participantes.map((p) => (
                        <Avatar key={p.personaId} personaId={p.personaId} size={24} presencia />
                      ))}
                    </span>
                    <span className="ml-auto flex -space-x-1">
                      {m.universidades.map((u) => (
                        <AvatarUni key={u} iniciales={UNI_POR_ID[u].iniciales} color={UNI_POR_ID[u].colorPrimario} size={22} />
                      ))}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
