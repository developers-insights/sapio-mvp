import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2, Database, HardDrive, Plus, Settings2, ShieldCheck, TerminalSquare } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import {
  AvatarUni, DevNotice, EncabezadoSeccion, EstadoBadge, EstadoVacio, Pildora, PreviewBanner, Tabla, Td, Th,
} from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Input, Select } from '@/components/ui/Campos'
import { TOTALES_PLATAFORMA, UNIVERSIDADES, UNI_POR_ID } from '@/data/universidades'
import { miembrosDe } from '@/data/personas'
import { fechaCorta } from '@/lib/fechas'
import { useEsMobile } from '@/lib/hooks'
import { cn } from '@/lib/cn'

export function Universidades() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const [alta, setAlta] = useState(false)
  const [aislamiento, setAislamiento] = useState(false)
  const [suspendidas, setSuspendidas] = useState<string[]>([])

  const lista = useMemo(
    () =>
      UNIVERSIDADES.map((u) =>
        suspendidas.includes(u.id) ? { ...u, estado: 'suspendida' as const } : u,
      ),
    [suspendidas],
  )

  function alternarSuspension(id: string, nombre: string) {
    const yaEsta = suspendidas.includes(id)
    setSuspendidas((s) => (yaEsta ? s.filter((x) => x !== id) : [...s, id]))
    toast({
      titulo: yaEsta ? t('plat.uni.reactivada', { nombre }) : t('plat.uni.suspendida', { nombre }),
      detalle: t('toast.accionMockDetalle'),
      tono: yaEsta ? 'ok' : 'alerta',
    })
  }

  return (
    <>
      <PreviewBanner
        id="plat-uni"
        titulo={t('plat.uni.banner')}
        bullets={[t('plat.uni.banner1'), t('plat.uni.banner2'), t('plat.uni.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('plat.uni.titulo')}
        bajada={t('plat.uni.bajada')}
        acciones={
          <>
            {/* El botón "Probar aislamiento" queda SIEMPRE visible en esta vista. */}
            <Boton variante="mineral" onClick={() => setAislamiento(true)} data-trailer="probar-aislamiento">
              <ShieldCheck size={15} />
              {t('plat.uni.probar')}
            </Boton>
            <Boton onClick={() => setAlta(true)}>
              <Plus size={16} />
              {t('plat.uni.alta')}
            </Boton>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Pildora tono="neutro">{TOTALES_PLATAFORMA.universidades} {t('plat.panel.universidades')}</Pildora>
        <Pildora tono="mineral">{TOTALES_PLATAFORMA.activas} {t('estado.activa')}</Pildora>
        <Pildora tono="pizarra">{TOTALES_PLATAFORMA.prueba} {t('estado.prueba')}</Pildora>
        <Pildora tono="terroso">{TOTALES_PLATAFORMA.vencidas} {t('estado.vencida')}</Pildora>
        <Pildora tono="terroso">{TOTALES_PLATAFORMA.suspendidas} {t('estado.suspendida')}</Pildora>
      </div>

      {esMobile ? (
        <ul className="space-y-2.5">
          {lista.map((u) => (
            <li key={u.id} className="card-sapio p-3.5">
              <div className="flex items-start gap-3">
                <AvatarUni iniciales={u.iniciales} color={u.colorPrimario} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-black leading-snug">{u.nombre}</p>
                  <p className="num truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">
                    {u.slug}.sapio.example
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <EstadoBadge estado={u.estado} />
                    <Pildora tono="neutro">{t(`plan.${u.plan}`)}</Pildora>
                    <Pildora tono="pizarra" className="num">
                      {u.usuariosActivos.toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')}
                    </Pildora>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Boton tam="sm" variante="secundario" onClick={() => navigate(`/plataforma/universidades/${u.id}`)}>
                  {t('app.verDetalle')}
                </Boton>
                <Boton tam="sm" variante="fantasma" onClick={() => alternarSuspension(u.id, u.nombre)}>
                  {u.estado === 'suspendida' ? t('plat.uni.reactivar') : t('plat.uni.suspender')}
                </Boton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>{t('plat.uni.nombre')}</Th>
              <Th className="hidden md:table-cell">{t('plat.uni.subdominio')}</Th>
              <Th>{t('plat.uni.plan')}</Th>
              <Th>{t('plat.uni.estado')}</Th>
              <Th className="hidden lg:table-cell">{t('plat.usuariosActivos')}</Th>
              <Th>{t('uni.miembros.acciones')}</Th>
            </tr>
          </thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.id} className="transition-colors hover:bg-marfil-200/50 dark:hover:bg-noche-700/40">
                <Td>
                  <div className="flex items-center gap-2.5">
                    <AvatarUni iniciales={u.iniciales} color={u.colorPrimario} size={30} />
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-bold">{u.nombre}</p>
                      <p className="truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">
                        {u.ciudad}, {u.pais}
                      </p>
                    </div>
                  </div>
                </Td>
                <Td className="num hidden text-[12.5px] text-tinta-sec md:table-cell dark:text-marfil/55">
                  {u.slug}.sapio.example
                </Td>
                <Td>
                  <Pildora tono="neutro">{t(`plan.${u.plan}`)}</Pildora>
                </Td>
                <Td>
                  <EstadoBadge estado={u.estado} />
                </Td>
                <Td className="num hidden font-bold lg:table-cell">
                  {u.usuariosActivos.toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')}
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Boton tam="sm" variante="secundario" onClick={() => navigate(`/plataforma/universidades/${u.id}`)}>
                      {t('app.ver')}
                    </Boton>
                    <Boton tam="sm" variante="fantasma" onClick={() => alternarSuspension(u.id, u.nombre)}>
                      {u.estado === 'suspendida' ? t('plat.uni.reactivar') : t('plat.uni.suspender')}
                    </Boton>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      )}

      <ModalAislamiento abierto={aislamiento} onCerrar={() => setAislamiento(false)} />

      <Modal
        abierto={alta}
        onCerrar={() => setAlta(false)}
        titulo={t('plat.uni.alta')}
        ancho={520}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setAlta(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                setAlta(false)
                toast({ titulo: t('plat.uni.creada'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
              }}
            >
              {t('app.crear')}
            </Boton>
          </>
        }
      >
        <div className="space-y-4">
          <Campo label={t('plat.uni.nombre')}>
            <Input defaultValue={lang === 'en' ? 'Ridgefield Institute' : 'Instituto Ridgefield'} />
          </Campo>
          <Campo label={t('plat.uni.subdominio')} ayuda="ridgefield.sapio.example">
            <Input defaultValue="ridgefield" className="num" />
          </Campo>
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo label={t('plat.uni.idioma')}>
              <Select defaultValue="es">
                <option value="es">Español</option>
                <option value="en">English</option>
              </Select>
            </Campo>
            <Campo label={t('plat.uni.zona')}>
              <Select defaultValue="America/Argentina/Buenos_Aires">
                <option>America/Argentina/Buenos_Aires</option>
                <option>America/New_York</option>
                <option>Europe/Madrid</option>
              </Select>
            </Campo>
          </div>
          <Campo label={t('plat.uni.logo')}>
            <Input maxLength={3} defaultValue="IR" />
          </Campo>
        </div>
      </Modal>

      <DevNotice
        className="mt-8"
        funcion={t('campus.editor.dev.subdominio')}
        hoy={t('campus.editor.dev.subdominioHoy')}
        alDesarrollar={t('campus.editor.dev.subdominioDesp')}
      />
    </>
  )
}

/** Prueba de aislamiento: consulta simulada y panel de pruebas automáticas. */
function ModalAislamiento({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const { t } = useT()
  const [estado, setEstado] = useState<'listo' | 'corriendo' | 'hecho'>('listo')
  const temporizador = useRef<number | null>(null)

  useEffect(() => {
    if (!abierto) {
      setEstado('listo')
      if (temporizador.current) window.clearTimeout(temporizador.current)
    }
    return () => {
      if (temporizador.current) window.clearTimeout(temporizador.current)
    }
  }, [abierto])

  function correr() {
    setEstado('corriendo')
    temporizador.current = window.setTimeout(() => setEstado('hecho'), 1100)
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={t('plat.uni.probarTitulo')}
      ancho={620}
      pie={
        <>
          <Boton variante="secundario" onClick={onCerrar}>{t('app.cerrar')}</Boton>
          <Boton variante="mineral" onClick={correr} disabled={estado === 'corriendo'}>
            <TerminalSquare size={15} />
            {estado === 'corriendo' ? t('plat.uni.corriendo') : t('plat.uni.correr')}
          </Boton>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-[13.5px] leading-relaxed text-tinta-sec dark:text-marfil/70">
          {t('plat.uni.probarDet')}
        </p>

        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
            {t('plat.uni.consulta')}
          </p>
          <pre className="num overflow-x-auto rounded-xl border border-borde bg-noche p-3 text-[12px] leading-relaxed text-marfil">
{`-- tenant: northwood
select count(*) from documentos
where universidad_id = 'u-valmira';`}
          </pre>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
            {t('plat.uni.resultado')}
          </p>
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-xl border p-3 text-[13px] font-bold transition-[border-color,background-color]',
              estado === 'hecho'
                ? 'border-terroso/40 bg-terroso/[.08] text-terroso-600 dark:text-[#d79a8c]'
                : 'border-borde bg-marfil-200/60 text-tinta-sec dark:border-[#27425a] dark:bg-noche-700/50 dark:text-marfil/55',
            )}
          >
            <Database size={15} className="shrink-0" />
            {estado === 'listo'
              ? t('plat.uni.correr')
              : estado === 'corriendo'
                ? t('plat.uni.corriendo')
                : t('plat.uni.bloqueado')}
          </div>
        </div>

        <div className="rounded-xl border border-mineral/35 bg-mineral/[.07] p-3.5">
          <p className="flex items-center gap-2 text-[13px] font-black">
            <ShieldCheck size={15} className="shrink-0 text-mineral-texto" />
            {t('plat.uni.pruebasAuto')}
          </p>
          <p className="num mt-1 text-[13px] font-bold text-mineral-texto">{t('plat.uni.pruebasAutoDet')}</p>
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white dark:bg-noche-800">
            <span className="block h-full w-full rounded-full bg-mineral" />
          </span>
        </div>
      </div>
    </Modal>
  )
}

export function UniversidadDetalle() {
  const { id } = useParams()
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const navigate = useNavigate()
  const u = id ? UNI_POR_ID[id] : undefined

  if (!u) {
    return (
      <EstadoVacio
        titulo={t('app.vacio')}
        icono={<Building2 size={20} />}
        accion={<Boton onClick={() => navigate('/plataforma/universidades')}>{t('plat.uni.titulo')}</Boton>}
      />
    )
  }

  const miembros = miembrosDe(u.id)

  return (
    <>
      <PreviewBanner
        id="plat-uni-det"
        titulo={t('plat.uni.banner')}
        bullets={[t('plat.uni.banner1'), t('plat.uni.banner2'), t('plat.uni.banner3')]}
      />
      <button
        type="button"
        onClick={() => navigate('/plataforma/universidades')}
        className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-[13px] font-bold text-mineral-texto hover:underline"
      >
        <ArrowLeft size={15} /> {t('plat.uni.titulo')}
      </button>

      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={u.nombre}
        bajada={`${u.ciudad}, ${u.pais} · ${u.slug}.sapio.example`}
        acciones={<EstadoBadge estado={u.estado} />}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-sapio p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            <Settings2 size={14} className="text-mineral-texto" /> {t('plat.uni.config')}
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plat.uni.idioma')}</dt>
              <dd className="mt-1 font-bold">{u.idioma === 'en' ? 'English' : 'Español'}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plat.uni.zona')}</dt>
              <dd className="num mt-1 truncate font-bold">{u.zonaHoraria}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plan.mensual')}</dt>
              <dd className="mt-1 font-bold">{t(`plan.${u.plan}`)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('wp.doc.actualizado')}</dt>
              <dd className="num mt-1 font-bold">{fechaCorta(u.creada, lang)}</dd>
            </div>
          </dl>
          <ul className="mt-4 flex flex-wrap gap-2">
            {u.facultades.map((f) => (
              <li key={f}>
                <Pildora tono="neutro">{f}</Pildora>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-sapio p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            <HardDrive size={14} className="text-mineral-texto" /> {t('plat.uni.almacenamiento')}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
            {t('plat.uni.almacenamientoDet')}
          </p>
          <p className="num mt-4 text-[26px] font-black">
            {u.usuariosActivos.toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')}
          </p>
          <p className="text-[12px] text-tinta-sec dark:text-marfil/50">{t('plat.usuariosActivos')}</p>
          <p className="num mt-3 text-[13px] font-bold">
            {miembros.length} {t('uni.miembros.titulo').toLowerCase()}
          </p>
        </section>
      </div>
    </>
  )
}
