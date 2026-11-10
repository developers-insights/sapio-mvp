import { useMemo, useState } from 'react'
import { MoreVertical, UserCog, UserMinus, Users } from 'lucide-react'
import { useUI } from '@/store/ui'
import { dato, useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { Avatar, EncabezadoSeccion, EstadoBadge, EstadoVacio, Pildora, PreviewBanner, Tabla, Td, Th } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Select } from '@/components/ui/Campos'
import { UNI_ADMIN } from '@/data/universidades'
import { miembrosDe } from '@/data/personas'
import type { Persona, Role } from '@/data/tipos'
import { useEsMobile } from '@/lib/hooks'

const ROLES: Role[] = ['profesor', 'estudiante', 'colaborador']

export function Miembros() {
  const { t, lang } = useT()
  const rolActivo = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const esMobile = useEsMobile()
  const [dep, setDep] = useState('todos')
  const [rol, setRol] = useState('todos')
  const [ficha, setFicha] = useState<Persona | null>(null)
  const [nuevoRol, setNuevoRol] = useState<Role>('profesor')

  const miembros = useMemo(() => miembrosDe(UNI_ADMIN), [])
  const departamentos = useMemo(
    () => ['todos', ...Array.from(new Set(miembros.map((m) => m.departamento)))],
    [miembros],
  )

  const visibles = miembros.filter(
    (m) => (dep === 'todos' || m.departamento === dep) && (rol === 'todos' || m.rol === rol),
  )

  function abrirFicha(m: Persona) {
    setFicha(m)
    setNuevoRol(m.rol as Role)
  }

  return (
    <>
      <PreviewBanner
        id="uni-miembros"
        titulo={t('uni.miembros.banner')}
        bullets={[t('uni.miembros.banner1'), t('uni.miembros.banner2'), t('uni.miembros.banner3')]}
      />
      <EncabezadoSeccion kicker={kickerRol(rolActivo, lang)} titulo={t('uni.miembros.titulo')} />

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:max-w-xl">
        <Campo label={t('uni.miembros.departamento')}>
          <Select value={dep} onChange={(e) => setDep(e.target.value)}>
            {departamentos.map((d) => (
              <option key={d} value={d}>
                {d === 'todos' ? t('app.todos') : dato(d, lang)}
              </option>
            ))}
          </Select>
        </Campo>
        <Campo label={t('uni.miembros.rol')}>
          <Select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="todos">{t('app.todos')}</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`rol.${r}`)}
              </option>
            ))}
          </Select>
        </Campo>
      </div>

      <p className="num mb-3 text-[12.5px] font-bold text-tinta-sec dark:text-marfil/50">
        {t('app.resultados', { n: visibles.length })}
      </p>

      {!visibles.length ? (
        <EstadoVacio titulo={t('app.sinResultados')} detalle={t('app.sinResultadosDetalle')} icono={<Users size={20} />} />
      ) : esMobile ? (
        <ul className="space-y-2.5">
          {visibles.map((m) => (
            <li key={m.id} className="card-sapio p-3.5">
              <div className="flex items-start gap-3">
                <Avatar personaId={m.id} size={38} presencia />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-black leading-snug">{m.nombre}</p>
                  <p className="truncate text-[12px] text-tinta-sec dark:text-marfil/55">
                    {lang === 'en' ? m.cargoEn : m.cargoEs}
                  </p>
                  <p className="num mt-0.5 truncate text-[11.5px] text-tinta-sec dark:text-marfil/45">{m.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Pildora tono="pizarra">{t(`rol.${m.rol}`)}</Pildora>
                    <Pildora tono="neutro">{dato(m.departamento, lang)}</Pildora>
                    <EstadoBadge estado={m.presencia} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => abrirFicha(m)}
                  aria-label={t('uni.miembros.ficha')}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-tinta-sec hover:bg-marfil-200 dark:hover:bg-noche-700"
                >
                  <MoreVertical size={17} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>{t('uni.inv.nombre')}</Th>
              <Th className="hidden md:table-cell">{t('uni.miembros.correo')}</Th>
              <Th>{t('uni.miembros.rol')}</Th>
              <Th className="hidden lg:table-cell">{t('uni.miembros.departamento')}</Th>
              <Th className="hidden lg:table-cell">{t('uni.miembros.presencia')}</Th>
              <Th>{t('uni.miembros.acciones')}</Th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-marfil-200/50 dark:hover:bg-noche-700/40">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <Avatar personaId={m.id} size={30} presencia />
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-bold">{m.nombre}</p>
                      <p className="truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">
                        {lang === 'en' ? m.cargoEn : m.cargoEs}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td className="num hidden text-[12.5px] text-tinta-sec md:table-cell dark:text-marfil/55">{m.email}</Td>
                <Td>
                  <Pildora tono="pizarra">{t(`rol.${m.rol}`)}</Pildora>
                </Td>
                <Td className="hidden text-[12.5px] lg:table-cell">{dato(m.departamento, lang)}</Td>
                <Td className="hidden lg:table-cell">
                  <EstadoBadge estado={m.presencia} />
                </Td>
                <Td>
                  <Boton tam="sm" variante="secundario" onClick={() => abrirFicha(m)}>
                    {t('app.verDetalle')}
                  </Boton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      )}

      <Modal
        abierto={Boolean(ficha)}
        onCerrar={() => setFicha(null)}
        titulo={t('uni.miembros.ficha')}
        ancho={520}
        pie={
          ficha ? (
            <>
              <Boton
                variante="peligro"
                onClick={() => {
                  setFicha(null)
                  toast({ titulo: t('uni.miembros.revocado'), detalle: t('toast.accionMockDetalle'), tono: 'alerta' })
                }}
              >
                <UserMinus size={15} />
                {t('uni.miembros.revocar')}
              </Boton>
              <Boton
                onClick={() => {
                  setFicha(null)
                  toast({ titulo: t('uni.miembros.rolAsignado', { rol: t(`rol.${nuevoRol}`) }), tono: 'ok' })
                }}
              >
                <UserCog size={15} />
                {t('uni.miembros.asignarRol')}
              </Boton>
            </>
          ) : null
        }
      >
        {ficha ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar personaId={ficha.id} size={52} presencia />
              <div className="min-w-0">
                <p className="text-[17px] font-black leading-tight">{ficha.nombre}</p>
                <p className="text-[13px] text-tinta-sec dark:text-marfil/60">
                  {lang === 'en' ? ficha.cargoEn : ficha.cargoEs}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-[13px]">
              <div className="min-w-0">
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
                  {t('uni.miembros.correo')}
                </dt>
                <dd className="num mt-1 truncate font-bold">{ficha.email}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
                  {t('uni.miembros.departamento')}
                </dt>
                <dd className="mt-1 font-bold">{dato(ficha.departamento, lang)}</dd>
              </div>
            </dl>
            <Campo label={t('uni.miembros.asignarRol')}>
              <Select value={nuevoRol} onChange={(e) => setNuevoRol(e.target.value as Role)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {t(`rol.${r}`)}
                  </option>
                ))}
              </Select>
            </Campo>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
