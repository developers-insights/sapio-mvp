import { useState } from 'react'
import { History, UserCog } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { Avatar, EncabezadoSeccion, Pildora, PreviewBanner } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Select } from '@/components/ui/Campos'
import { UNI_ADMIN } from '@/data/universidades'
import { miembrosDe, persona, P } from '@/data/personas'
import { dia, fechaCorta, horaCorta } from '@/lib/fechas'
import type { Role } from '@/data/tipos'

const ROLES: Role[] = ['profesor', 'estudiante', 'colaborador']

const HISTORIAL = [
  { id: 'h1', personaId: 'p-prof-2', de: 'estudiante' as Role, a: 'profesor' as Role, porId: P.laura, fecha: dia(-1, 16, 20) },
  { id: 'h2', personaId: 'p-est-5', de: 'colaborador' as Role, a: 'estudiante' as Role, porId: P.laura, fecha: dia(-4, 11, 5) },
  { id: 'h3', personaId: 'p-col-1', de: 'estudiante' as Role, a: 'colaborador' as Role, porId: P.laura, fecha: dia(-9, 9, 40) },
  { id: 'h4', personaId: 'p-prof-6', de: 'estudiante' as Role, a: 'profesor' as Role, porId: P.laura, fecha: dia(-15, 14, 12) },
]

export function UniversidadRoles() {
  const { t, lang } = useT()
  const rolActivo = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const miembros = miembrosDe(UNI_ADMIN).slice(0, 12)
  const [seleccion, setSeleccion] = useState<Record<string, Role>>({})

  return (
    <>
      <PreviewBanner
        id="uni-roles"
        titulo={t('uni.roles.banner')}
        bullets={[t('uni.roles.banner1'), t('uni.roles.banner2'), t('uni.roles.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rolActivo, lang)}
        titulo={t('uni.roles.titulo')}
        bajada={t('uni.roles.bajada')}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <section className="min-w-0 space-y-2.5">
          {miembros.map((m) => {
            const valor = seleccion[m.id] ?? (m.rol as Role)
            return (
              <article key={m.id} className="card-sapio flex flex-wrap items-center gap-3 p-3.5">
                <Avatar personaId={m.id} size={34} presencia />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-black">{m.nombre}</p>
                  <p className="truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">{m.departamento}</p>
                </div>
                <Select
                  value={valor}
                  aria-label={t('uni.miembros.asignarRol')}
                  onChange={(e) => setSeleccion((s) => ({ ...s, [m.id]: e.target.value as Role }))}
                  className="w-auto min-w-[150px]"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {t(`rol.${r}`)}
                    </option>
                  ))}
                </Select>
                <Boton
                  tam="sm"
                  disabled={valor === m.rol}
                  onClick={() => toast({ titulo: t('uni.miembros.rolAsignado', { rol: t(`rol.${valor}`) }), detalle: t('toast.accionMockDetalle'), tono: 'ok' })}
                >
                  <UserCog size={14} />
                  {t('app.guardar')}
                </Boton>
              </article>
            )
          })}
        </section>

        <aside className="card-sapio min-w-0 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            <History size={14} className="text-mineral-texto" /> {t('uni.roles.historial')}
          </h2>
          <ol className="mt-3 space-y-3 border-l border-borde pl-4 dark:border-[#27425a]">
            {HISTORIAL.map((h) => (
              <li key={h.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-mineral dark:border-noche-800" />
                <p className="text-[13px] font-bold leading-snug">{persona(h.personaId).nombre}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px] text-tinta-sec dark:text-marfil/55">
                  <Pildora tono="neutro">{t(`rol.${h.de}`)}</Pildora>
                  <span>→</span>
                  <Pildora tono="mineral">{t(`rol.${h.a}`)}</Pildora>
                </p>
                <p className="num mt-1 text-[11.5px] text-tinta-sec dark:text-marfil/45">
                  {t('uni.roles.por')} {persona(h.porId).nombre} · {fechaCorta(h.fecha, lang)} {horaCorta(h.fecha, lang)}
                </p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  )
}
