import { useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Papa from 'papaparse'
import {
  CheckCircle2, Copy, ExternalLink, FileSpreadsheet, Link2, MailPlus, RefreshCw, TriangleAlert, Upload, X, XCircle,
} from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { dato, useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import {
  Avatar, DevNotice, EncabezadoSeccion, EstadoBadge, EstadoVacio, Pildora, PreviewBanner, Tabla, Td, Th,
} from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Campo, Input, Select, Textarea } from '@/components/ui/Campos'
import { CSV_TOTALES } from '@/data/gestion'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { P, persona } from '@/data/personas'
import { dia, fechaCorta } from '@/lib/fechas'
import { useEsMobile } from '@/lib/hooks'
import type { FilaCSV, Role, SolicitudProfesor } from '@/data/tipos'
import { cn } from '@/lib/cn'

type Tab = 'profesores' | 'estudiantes'
const ROLES_CSV = ['estudiante', 'colaborador']

export function Invitaciones() {
  const { t, lang } = useT()
  const rolActivo = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') === 'estudiantes' ? 'estudiantes' : 'profesores') as Tab

  return (
    <>
      <PreviewBanner
        id="uni-inv"
        titulo={t('uni.inv.banner')}
        bullets={[t('uni.inv.banner1'), t('uni.inv.banner2'), t('uni.inv.banner3')]}
      />
      <EncabezadoSeccion kicker={kickerRol(rolActivo, lang)} titulo={t('uni.inv.titulo')} />

      <div
        role="tablist"
        aria-label={t('uni.inv.titulo')}
        className="scroll-x-contenida sin-scrollbar mb-5 flex gap-1 rounded-xl border border-borde bg-white p-1 dark:border-[#27425a] dark:bg-noche-800"
      >
        {(['profesores', 'estudiantes'] as Tab[]).map((x) => (
          <button
            key={x}
            type="button"
            role="tab"
            aria-selected={tab === x}
            onClick={() => setParams({ tab: x })}
            className={cn(
              'min-h-[40px] shrink-0 rounded-lg px-3.5 text-[13px] font-bold transition-colors',
              tab === x ? 'bg-mineral text-white' : 'text-tinta-sec hover:text-noche dark:text-marfil/60',
            )}
          >
            {x === 'profesores' ? t('uni.inv.tabProfesores') : t('uni.inv.tabEstudiantes')}
          </button>
        ))}
      </div>

      {tab === 'profesores' ? <TabProfesores /> : <TabEstudiantes />}

      <DevNotice
        className="mt-8"
        funcion={t('uni.inv.dev.correo')}
        hoy={t('uni.inv.dev.correoHoy')}
        alDesarrollar={t('uni.inv.dev.correoDesp')}
      />
      <p className="mt-3 text-[12px] text-tinta-sec dark:text-marfil/45">
        <button
          type="button"
          onClick={() => toast({ titulo: t('uni.inv.verExperiencia'), tono: 'info' })}
          className="hidden"
        />
      </p>
    </>
  )
}

function TabProfesores() {
  const { t, lang } = useT()
  const toast = useUI((s) => s.toast)
  const solicitudes = useDatos((s) => s.solicitudes)
  const resolver = useDatos((s) => s.resolverSolicitud)
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const [invitarAbierto, setInvitarAbierto] = useState(false)
  const [loteAbierto, setLoteAbierto] = useState(false)
  const [rechazando, setRechazando] = useState<SolicitudProfesor | null>(null)
  const [motivo, setMotivo] = useState('')
  const [detalle, setDetalle] = useState<SolicitudProfesor | null>(null)
  const [email, setEmail] = useState('')
  const [lote, setLote] = useState('n.whitmore@northwood.sapio.example\nr.calderon@northwood.sapio.example\nf.harlow@northwood.sapio.example')

  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')
  const uni = UNI_POR_ID[UNI_ADMIN]

  function aprobar(s: SolicitudProfesor) {
    resolver(s.id, 'aprobado')
    setDetalle(null)
    toast({ titulo: t('uni.inv.aprobado', { nombre: s.nombre }), detalle: t('uni.inv.correoEnviado'), tono: 'ok' })
  }

  function copiarEnlace(s: SolicitudProfesor) {
    const url = `https://${uni.slug}.sapio.example/#/invitacion/inv-${s.id}-2026`
    navigator.clipboard?.writeText(url).catch(() => undefined)
    toast({ titulo: t('app.copiado'), detalle: url, tono: 'info' })
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <Boton onClick={() => setInvitarAbierto(true)}>
          <MailPlus size={16} />
          {t('uni.inv.invitarProfesor')}
        </Boton>
        <Boton variante="secundario" onClick={() => setLoteAbierto(true)}>
          <Upload size={16} />
          {t('uni.inv.invitarLote')}
        </Boton>
        <Boton variante="secundario" onClick={() => navigate('/invitacion/inv-demo-2026')}>
          <ExternalLink size={15} />
          {t('uni.inv.verExperiencia')}
        </Boton>
      </div>

      {pendientes.length ? (
        <p className="mb-3 inline-flex items-center gap-2 text-[13px] font-bold text-champan-700 dark:text-champan">
          <TriangleAlert size={14} />
          {t('uni.panel.alertaProf', { n: pendientes.length })}
        </p>
      ) : null}

      {!solicitudes.length ? (
        <EstadoVacio titulo={t('app.vacio')} />
      ) : (
        <ul className="space-y-2.5">
          {solicitudes.map((s) => (
            <li key={s.id} className={cn('card-sapio p-3.5 sm:p-4', s.estado === 'pendiente' && 'border-champan/45')}>
              <div className="flex flex-wrap items-start gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-black text-marfil"
                  style={{ background: uni.colorPrimario }}
                  aria-hidden="true"
                >
                  {s.nombre.replace(/^(Dr\.|Dra\.)\s*/, '').split(' ').map((x) => x[0]).slice(0, 2).join('')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-black leading-snug">{s.nombre}</p>
                  <p className="num truncate text-[12px] text-tinta-sec dark:text-marfil/55">{s.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <EstadoBadge estado={s.estado} />
                    <Pildora tono="neutro">{dato(s.facultad, lang)}</Pildora>
                    {s.estado === 'pendiente' ? (
                      <Pildora tono="champan" icono={<Link2 size={10} />}>
                        {t('uni.inv.venceEn', { n: s.venceEnDias })}
                      </Pildora>
                    ) : null}
                  </div>
                  {s.estado === 'rechazado' && campo(s, 'motivoRechazo', lang) ? (
                    <p className="mt-2 text-[12.5px] italic text-terroso-600 dark:text-[#d79a8c]">
                      {campo(s, 'motivoRechazo', lang)}
                    </p>
                  ) : null}
                </div>
                <div className={cn('flex gap-1.5', esMobile ? 'w-full flex-wrap' : 'shrink-0')}>
                  <Boton tam="sm" variante="secundario" onClick={() => setDetalle(s)}>
                    {t('uni.inv.perfilDocente')}
                  </Boton>
                  {s.estado === 'pendiente' ? (
                    <>
                      <Boton
                        tam="sm"
                        variante="mineral"
                        onClick={() => aprobar(s)}
                        {...(s.id === 's-1' ? { 'data-trailer': 'aprobar-profesor' } : {})}
                      >
                        <CheckCircle2 size={14} />
                        {t('uni.inv.aprobar')}
                      </Boton>
                      <Boton tam="sm" variante="peligro" onClick={() => { setRechazando(s); setMotivo('') }}>
                        <XCircle size={14} />
                        {t('uni.inv.rechazar')}
                      </Boton>
                      <Boton tam="sm" variante="fantasma" onClick={() => copiarEnlace(s)}>
                        <Copy size={14} />
                        {t('uni.inv.copiarEnlace')}
                      </Boton>
                    </>
                  ) : s.estado === 'rechazado' ? (
                    <Boton tam="sm" variante="secundario" onClick={() => { resolver(s.id, 'pendiente'); toast({ titulo: t('uni.inv.reenviada'), tono: 'ok' }) }}>
                      <RefreshCw size={14} />
                      {t('app.reenviar')}
                    </Boton>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Perfil docente */}
      <Modal
        abierto={Boolean(detalle)}
        onCerrar={() => setDetalle(null)}
        titulo={t('uni.inv.perfilDocente')}
        ancho={520}
        pie={
          detalle ? (
            <>
              <Boton variante="secundario" onClick={() => setDetalle(null)}>{t('app.cerrar')}</Boton>
              {detalle.estado === 'pendiente' ? (
                <Boton variante="mineral" onClick={() => aprobar(detalle)}>
                  <CheckCircle2 size={15} />
                  {t('uni.inv.aprobar')}
                </Boton>
              ) : null}
            </>
          ) : null
        }
      >
        {detalle ? (
          <dl className="grid grid-cols-2 gap-3 text-[13px]">
            <div className="col-span-2">
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('uni.inv.nombre')}</dt>
              <dd className="mt-1 text-[15px] font-black">{detalle.nombre}</dd>
            </div>
            <div className="col-span-2 min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('uni.miembros.correo')}</dt>
              <dd className="num mt-1 truncate font-bold">{detalle.email}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('uni.inv.facultad')}</dt>
              <dd className="mt-1 font-bold">{dato(detalle.facultad, lang)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('uni.inv.area')}</dt>
              <dd className="mt-1 font-bold">{campo(detalle, 'area', lang)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('uni.inv.grado')}</dt>
              <dd className="mt-1 font-bold">{detalle.perfil.grado}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('uni.inv.anios')}</dt>
              <dd className="num mt-1 font-bold">{detalle.perfil.anios}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">ORCID</dt>
              <dd className="num mt-1 font-bold">{detalle.perfil.orcid}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('uni.inv.enlaceUnico')}</dt>
              <dd className="num mt-1 break-all text-[12px] text-tinta-sec dark:text-marfil/55">
                https://{uni.slug}.sapio.example/#/invitacion/inv-{detalle.id}-2026
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      {/* Rechazo con motivo */}
      <Modal
        abierto={Boolean(rechazando)}
        onCerrar={() => setRechazando(null)}
        titulo={t('uni.inv.rechazar')}
        ancho={480}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setRechazando(null)}>{t('app.cancelar')}</Boton>
            <Boton
              variante="peligro"
              onClick={() => {
                if (!rechazando) return
                resolver(rechazando.id, 'rechazado', motivo.trim() || t('uni.inv.motivo'))
                toast({ titulo: t('uni.inv.rechazado', { nombre: rechazando.nombre }), detalle: t('uni.inv.correoEnviado'), tono: 'alerta' })
                setRechazando(null)
              }}
            >
              {t('uni.inv.rechazar')}
            </Boton>
          </>
        }
      >
        <Campo label={t('uni.inv.motivo')}>
          <Textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={lang === 'en' ? 'The credential does not match a teaching post…' : 'La credencial no corresponde a un cargo docente…'}
          />
        </Campo>
      </Modal>

      {/* Invitación individual */}
      <Modal
        abierto={invitarAbierto}
        onCerrar={() => setInvitarAbierto(false)}
        titulo={t('uni.inv.invitarProfesor')}
        ancho={480}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setInvitarAbierto(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                setInvitarAbierto(false)
                toast({ titulo: t('uni.inv.enviadaA', { email: email || 'nuevo@northwood.sapio.example' }), detalle: t('uni.inv.correoEnviado'), tono: 'ok' })
                setEmail('')
              }}
            >
              {t('app.enviar')}
            </Boton>
          </>
        }
      >
        <div className="space-y-4">
          <Campo label={t('uni.miembros.correo')}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@northwood.sapio.example" />
          </Campo>
          <Campo label={t('uni.inv.facultad')}>
            <Select defaultValue="Derecho">
              {uni.facultades.map((f) => (
                <option key={f} value={f}>{dato(f, lang)}</option>
              ))}
            </Select>
          </Campo>
          <p className="rounded-xl border border-borde bg-marfil-200/60 p-3 text-[12.5px] leading-relaxed text-tinta-sec dark:border-[#27425a] dark:bg-noche-700/50 dark:text-marfil/60">
            {t('uni.inv.enlaceUnico')} · {t('uni.inv.venceEn', { n: 6 })}
          </p>
        </div>
      </Modal>

      {/* Invitación por lote */}
      <Modal
        abierto={loteAbierto}
        onCerrar={() => setLoteAbierto(false)}
        titulo={t('uni.inv.invitarLote')}
        ancho={520}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setLoteAbierto(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                const n = lote.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean).length
                setLoteAbierto(false)
                toast({ titulo: t('uni.inv.enviadaA', { email: `${n} ${lang === 'en' ? 'addresses' : 'direcciones'}` }), detalle: t('uni.inv.correoEnviado'), tono: 'ok' })
              }}
            >
              {t('app.enviar')}
            </Boton>
          </>
        }
      >
        <Campo label={t('uni.inv.correos')} ayuda={t('uni.inv.invitarLoteDet')}>
          <Textarea value={lote} onChange={(e) => setLote(e.target.value)} className="num min-h-[140px] text-[12.5px]" />
        </Campo>
      </Modal>
    </>
  )
}

function TabEstudiantes() {
  const { t, lang } = useT()
  const toast = useUI((s) => s.toast)
  const csv = useDatos((s) => s.csv)
  const csvNombre = useDatos((s) => s.csvNombre)
  const csvImportado = useDatos((s) => s.csvImportado)
  const importarCSV = useDatos((s) => s.importarCSV)
  const marcarImportado = useDatos((s) => s.marcarCSVImportado)
  const invitaciones = useDatos((s) => s.invitaciones)
  const reenviar = useDatos((s) => s.reenviarInvitacion)
  const cancelar = useDatos((s) => s.cancelarInvitacion)
  const agregar = useDatos((s) => s.agregarInvitacion)
  const esMobile = useEsMobile()
  const archivoRef = useRef<HTMLInputElement>(null)
  const [invitarAbierto, setInvitarAbierto] = useState(false)
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState<Role>('estudiante')
  const [grupo, setGrupo] = useState('Posgrado · Derecho')

  const totales = useMemo(
    () => ({
      validas: csv.filter((f) => !f.error).length,
      conError: csv.filter((f) => f.error).length,
      filas: csv.length,
    }),
    [csv],
  )

  function onArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const filas: FilaCSV[] = res.data.map((r, i) => {
          const nombre = r.nombre ?? r.name ?? ''
          const email = r.email ?? r.correo ?? ''
          const rolFila = (r.rol ?? r.role ?? '').trim().toLowerCase()
          const grupoFila = r.grupo ?? r.group ?? ''
          const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          return {
            fila: i + 2,
            nombre,
            email,
            rol: rolFila,
            grupo: grupoFila,
            error: !emailValido ? 'email' : !ROLES_CSV.includes(rolFila) ? 'rol' : undefined,
          }
        })
        importarCSV(filas, file.name)
        toast({ titulo: t('uni.inv.archivoCargado'), detalle: file.name, tono: 'ok' })
      },
    })
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <Boton onClick={() => setInvitarAbierto(true)}>
          <MailPlus size={16} />
          {t('uni.inv.invitarCorreo')}
        </Boton>
        <Boton variante="secundario" onClick={() => archivoRef.current?.click()}>
          <Upload size={16} />
          {t('uni.inv.subirOtro')}
        </Boton>
        <input ref={archivoRef} type="file" accept=".csv,text/csv" onChange={onArchivo} className="sr-only" aria-label={t('uni.inv.cargaCSV')} />
      </div>

      {/* CSV ya cargado */}
      <section className="card-sapio mb-5 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <FileSpreadsheet size={18} className="shrink-0 text-mineral-texto" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{t('uni.inv.cargaCSV')}</p>
            <p className="num truncate text-[12.5px] text-tinta-sec dark:text-marfil/55">{csvNombre}</p>
          </div>
          <Pildora tono="mineral">{t('uni.inv.filasOk', { n: totales.validas })}</Pildora>
          <Pildora tono="terroso">{t('uni.inv.filasError', { n: totales.conError })}</Pildora>
        </div>

        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
          {t('uni.inv.vistaPrevia')}
        </p>

        <div className="scroll-x-contenida mt-2 max-h-[340px] overflow-y-auto rounded-xl border border-borde dark:border-[#27425a]">
          <table className="w-full min-w-[620px] text-left text-[12.5px]">
            <thead className="sticky top-0 bg-marfil-200 dark:bg-noche-700">
              <tr>
                <Th>{t('uni.inv.fila')}</Th>
                <Th>{t('uni.inv.nombre')}</Th>
                <Th>{t('uni.miembros.correo')}</Th>
                <Th>{t('uni.miembros.rol')}</Th>
                <Th className="hidden md:table-cell">{t('uni.inv.grupo')}</Th>
              </tr>
            </thead>
            <tbody>
              {csv.map((f) => (
                <tr key={f.fila} className={cn(f.error && 'bg-terroso/[.07]')}>
                  <Td className="num">{f.fila}</Td>
                  <Td>{f.nombre}</Td>
                  <Td className="num">
                    <span className={cn(f.error === 'email' && 'font-bold text-terroso')}>{f.email}</span>
                    {f.error === 'email' ? (
                      <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-terroso">
                        <TriangleAlert size={10} /> {t('uni.inv.errorEmail')}
                      </span>
                    ) : null}
                  </Td>
                  <Td>
                    <span className={cn(f.error === 'rol' && 'font-bold text-terroso')}>{f.rol}</span>
                    {f.error === 'rol' ? (
                      <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-terroso">
                        <TriangleAlert size={10} /> {t('uni.inv.errorRol')}
                      </span>
                    ) : null}
                  </Td>
                  <Td className="hidden md:table-cell">{dato(f.grupo, lang)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Boton
          className="mt-4"
          disabled={csvImportado}
          onClick={() => {
            marcarImportado()
            toast({ titulo: t('uni.inv.importado', { n: totales.validas }), detalle: t('uni.inv.correoEnviado'), tono: 'ok' })
          }}
        >
          <CheckCircle2 size={15} />
          {csvImportado ? t('uni.inv.importado', { n: totales.validas }) : t('uni.inv.importar')}
        </Boton>
      </section>

      {/* Listado de invitaciones */}
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
        {t('uni.inv.listado')}
      </h2>
      {esMobile ? (
        <ul className="space-y-2.5">
          {invitaciones.map((i) => (
            <li key={i.id} className="card-sapio p-3.5">
              <p className="text-[14px] font-black leading-snug">{i.nombre}</p>
              <p className="num truncate text-[12px] text-tinta-sec dark:text-marfil/55">{i.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <EstadoBadge estado={i.estado} />
                <Pildora tono="pizarra">{t(`rol.${i.rol}`)}</Pildora>
                <Pildora tono="neutro">{dato(i.grupo, lang)}</Pildora>
              </div>
              <p className="num mt-1.5 text-[11.5px] text-tinta-sec dark:text-marfil/45">
                {i.venceEnDias >= 0 ? t('uni.inv.venceEn', { n: i.venceEnDias }) : t('uni.inv.vencioHace', { n: Math.abs(i.venceEnDias) })}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Boton tam="sm" variante="secundario" onClick={() => { reenviar(i.id); toast({ titulo: t('uni.inv.reenviada'), detalle: t('uni.inv.correoEnviado'), tono: 'ok' }) }}>
                  <RefreshCw size={13} /> {t('app.reenviar')}
                </Boton>
                <Boton tam="sm" variante="fantasma" onClick={() => { cancelar(i.id); toast({ titulo: t('uni.inv.cancelada'), tono: 'alerta' }) }}>
                  <X size={13} /> {t('app.cancelar')}
                </Boton>
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
              <Th>{t('uni.inv.rolPreasignado')}</Th>
              <Th className="hidden lg:table-cell">{t('uni.inv.grupo')}</Th>
              <Th>{t('uni.inv.estado')}</Th>
              <Th>{t('uni.miembros.acciones')}</Th>
            </tr>
          </thead>
          <tbody>
            {invitaciones.map((i) => (
              <tr key={i.id} className="transition-colors hover:bg-marfil-200/50 dark:hover:bg-noche-700/40">
                <Td className="text-[13.5px] font-bold">{i.nombre}</Td>
                <Td className="num hidden text-[12.5px] text-tinta-sec md:table-cell dark:text-marfil/55">{i.email}</Td>
                <Td>
                  <Pildora tono="pizarra">{t(`rol.${i.rol}`)}</Pildora>
                </Td>
                <Td className="hidden text-[12.5px] lg:table-cell">{dato(i.grupo, lang)}</Td>
                <Td>
                  <EstadoBadge estado={i.estado} />
                  <p className="num mt-1 text-[11px] text-tinta-sec dark:text-marfil/45">
                    {fechaCorta(i.enviada, lang)}
                  </p>
                </Td>
                <Td>
                  <div className="flex gap-1.5">
                    <Boton tam="sm" variante="secundario" onClick={() => { reenviar(i.id); toast({ titulo: t('uni.inv.reenviada'), detalle: t('uni.inv.correoEnviado'), tono: 'ok' }) }}>
                      <RefreshCw size={13} />
                    </Boton>
                    <Boton tam="sm" variante="fantasma" onClick={() => { cancelar(i.id); toast({ titulo: t('uni.inv.cancelada'), tono: 'alerta' }) }}>
                      <X size={13} />
                    </Boton>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      )}

      <Modal
        abierto={invitarAbierto}
        onCerrar={() => setInvitarAbierto(false)}
        titulo={t('uni.inv.invitarCorreo')}
        ancho={480}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setInvitarAbierto(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                const correo = email || 'nuevo@northwood.sapio.example'
                agregar({
                  id: 'i-' + Date.now(),
                  email: correo,
                  nombre: correo.split('@')[0],
                  rol,
                  grupo,
                  estado: 'enviada',
                  enviada: dia(0, 9),
                  venceEnDias: 6,
                })
                setInvitarAbierto(false)
                setEmail('')
                toast({ titulo: t('uni.inv.enviadaA', { email: correo }), detalle: t('uni.inv.correoEnviado'), tono: 'ok' })
              }}
            >
              {t('app.enviar')}
            </Boton>
          </>
        }
      >
        <div className="space-y-4">
          <Campo label={t('uni.miembros.correo')}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@northwood.sapio.example" />
          </Campo>
          <Campo label={t('uni.inv.rolPreasignado')}>
            <Select value={rol} onChange={(e) => setRol(e.target.value as Role)}>
              <option value="estudiante">{t('rol.estudiante')}</option>
              <option value="colaborador">{t('rol.colaborador')}</option>
            </Select>
          </Campo>
          <Campo label={t('uni.inv.grupo')}>
            <Select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
              <option>Posgrado · Derecho</option>
              <option>Posgrado · Finanzas</option>
              <option>Posgrado · Salud Pública</option>
              <option>Proyecto · Resiliencia</option>
            </Select>
          </Campo>
        </div>
      </Modal>
    </>
  )
}
