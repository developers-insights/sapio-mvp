import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { AlertTriangle, CreditCard, MailPlus, Users } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { AvatarUni, EncabezadoSeccion, EstadoBadge, Kpi, Pildora, PreviewBanner } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { miembrosDe } from '@/data/personas'
import { PLANES } from '@/data/gestion'
import { addDays, dia, fmt } from '@/lib/fechas'

export function UniversidadPanel() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const solicitudes = useDatos((s) => s.solicitudes)
  const invitaciones = useDatos((s) => s.invitaciones)
  const planActual = useDatos((s) => s.planActual)
  const navigate = useNavigate()
  const uni = UNI_POR_ID[UNI_ADMIN]

  const miembros = useMemo(() => miembrosDe(UNI_ADMIN), [])
  const profesores = miembros.filter((m) => m.rol === 'profesor').length
  const estudiantes = miembros.filter((m) => m.rol === 'estudiante').length
  const colaboradores = miembros.filter((m) => m.rol === 'colaborador').length
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente')
  const invPendientes = invitaciones.filter((i) => i.estado === 'enviada').length
  const plan = PLANES.find((p) => p.id === planActual) ?? PLANES[1]

  const datos = useMemo(() => {
    const base = [
      [142, 38, 24],
      [168, 41, 31],
      [151, 29, 19],
      [189, 52, 44],
      [174, 47, 36],
      [96, 18, 11],
      [64, 9, 6],
    ]
    return base.map((d, i) => ({
      dia: fmt(addDays(dia(-6), i), 'EEE', lang),
      sesiones: d[0],
      documentos: d[1],
      comentarios: d[2],
    }))
  }, [lang])

  return (
    <>
      <PreviewBanner
        id="uni-panel"
        titulo={t('uni.panel.banner')}
        bullets={[t('uni.panel.banner1'), t('uni.panel.banner2'), t('uni.panel.banner3')]}
      />

      {/* Cabecera con el color y el logo de la universidad */}
      <div
        className="mb-6 overflow-hidden rounded-2xl p-5 sm:p-7"
        style={{ background: uni.colorPrimario }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <AvatarUni iniciales={uni.iniciales} color="rgba(255,255,255,.18)" size={54} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-marfil/65">
              {kickerRol(rol, lang)}
            </p>
            <h1 className="mt-1 font-black leading-tight text-marfil" style={{ fontSize: 'clamp(22px,4.4vw,32px)' }}>
              {uni.nombre}
            </h1>
            <p className="num mt-1 text-[13px] text-marfil/65">
              {uni.slug}.sapio.example · {uni.ciudad}, {uni.pais}
            </p>
          </div>
          {/* Pill clara: sobre el color de la universidad el badge normal no contrasta. */}
          <span className="shrink-0 rounded-full border border-marfil/35 bg-marfil/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-marfil">
            {t(`estado.${uni.estado}`)}
          </span>
        </div>
        <span className="filete mt-5" />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Kpi etiqueta={t('uni.panel.profesores')} valor={profesores} icono={<Users size={16} />} onClick={() => navigate('/universidad/miembros')} />
        <Kpi etiqueta={t('uni.panel.estudiantes')} valor={estudiantes} icono={<Users size={16} />} onClick={() => navigate('/universidad/miembros')} />
        <Kpi etiqueta={t('uni.panel.colaboradores')} valor={colaboradores} icono={<Users size={16} />} onClick={() => navigate('/universidad/miembros')} />
        <Kpi
          etiqueta={t('uni.panel.invitacionesPend')}
          valor={invPendientes + pendientes.length}
          tono="champan"
          icono={<MailPlus size={16} />}
          onClick={() => navigate('/universidad/invitaciones')}
        />
      </div>

      {pendientes.length ? (
        <aside className="mb-6 flex flex-col gap-3 rounded-2xl border border-champan/45 bg-champan/[.09] p-4 sm:flex-row sm:items-center">
          <AlertTriangle size={18} className="shrink-0 text-champan-700 dark:text-champan" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{t('uni.panel.alertaProf', { n: pendientes.length })}</p>
            <p className="mt-0.5 text-[13px] text-tinta-sec dark:text-marfil/65">{t('uni.panel.alertaProfDet')}</p>
          </div>
          <Boton className="shrink-0" onClick={() => navigate('/universidad/invitaciones?tab=profesores')}>
            {t('uni.panel.revisar')}
          </Boton>
        </aside>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            {t('uni.panel.actividad')}
          </h2>
          <p className="mt-1 text-[13px] text-tinta-sec dark:text-marfil/55">{t('uni.panel.actividadDet')}</p>
          <div className="mt-4 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datos} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#E8E1D3" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#5E6B72' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5E6B72' }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(82,125,121,.08)' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E8E1D3', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="sesiones" name={t('uni.panel.sesiones')} fill="#527D79" radius={[4, 4, 0, 0]} />
                <Bar dataKey="documentos" name={t('uni.panel.documentos')} fill="#25465C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comentarios" name={t('uni.panel.comentarios')} fill="#C9A974" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <aside className="card-sapio min-w-0 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            <CreditCard size={14} className="text-mineral-texto" /> {t('uni.panel.suscripcion')}
          </h2>
          <p className="mt-3 text-[17px] font-black">
            {lang === 'en' ? plan.nombreEn : plan.nombreEs} · {t('plan.anual')}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <EstadoBadge estado="activo" />
            <Pildora tono="neutro">{t('uni.panel.proxFactura', { n: 18 })}</Pildora>
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-tinta-sec dark:text-marfil/55">
            {uni.usuariosActivos.toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')} {t('plat.usuariosActivos').toLowerCase()}
          </p>
          <Boton variante="secundario" className="mt-4 w-full" onClick={() => navigate('/universidad/suscripcion')}>
            {t('nav.suscripcion')}
          </Boton>
        </aside>
      </div>
    </>
  )
}
