import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Building2, ScrollText, ShieldAlert, Tags, TriangleAlert, Users } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { AvatarUni, EncabezadoSeccion, EstadoBadge, Kpi, Pildora, PreviewBanner } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { TOTALES_PLATAFORMA, UNIVERSIDADES } from '@/data/universidades'
import { INTENTOS_BLOQUEADOS_HOY } from '@/data/gestion'
import { addDays, dia, fmt } from '@/lib/fechas'

export function PlataformaPanel() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const navigate = useNavigate()

  const recientes = useMemo(
    () => [...UNIVERSIDADES].sort((a, b) => b.creada.getTime() - a.creada.getTime()).slice(0, 5),
    [],
  )

  const serie = useMemo(() => {
    const valores = [38200, 41500, 44800, 46100, 49300, 52700, TOTALES_PLATAFORMA.usuariosActivos]
    return valores.map((v, i) => ({
      mes: fmt(addDays(dia(0), (i - 6) * 30), 'MMM', lang),
      usuarios: v,
    }))
  }, [lang])

  const vencidas = UNIVERSIDADES.filter((u) => u.estado === 'vencida')
  const suspendidas = UNIVERSIDADES.filter((u) => u.estado === 'suspendida')

  return (
    <>
      <PreviewBanner
        id="plat-panel"
        titulo={t('plat.panel.banner')}
        bullets={[t('plat.panel.banner1'), t('plat.panel.banner2'), t('plat.panel.banner3')]}
      />

      {/* Cabecera azul noche con KPIs globales */}
      <div className="mb-6 rounded-2xl bg-noche p-5 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mineral-300">
          {kickerRol(rol, lang)}
        </p>
        <h1 className="mt-2 font-black leading-tight text-marfil" style={{ fontSize: 'clamp(24px,4.6vw,38px)' }}>
          {t('plat.panel.titulo')}
        </h1>
        <span className="filete mt-4" />
        <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-marfil/70">
          {t('plat.panel.bajada')}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <Kpi etiqueta={t('plat.panel.universidades')} valor={TOTALES_PLATAFORMA.universidades} icono={<Building2 size={16} />} onClick={() => navigate('/plataforma/universidades')} />
        <Kpi etiqueta={t('plat.usuariosActivos')} valor={TOTALES_PLATAFORMA.usuariosActivos.toLocaleString(lang === 'en' ? 'en-US' : 'es-AR')} icono={<Users size={16} />} />
        <Kpi etiqueta={t('plat.panel.suscActivas')} valor={TOTALES_PLATAFORMA.activas} tono="mineral" onClick={() => navigate('/plataforma/planes')} />
        <Kpi etiqueta={t('plat.panel.suscVencidas')} valor={TOTALES_PLATAFORMA.vencidas} tono="terroso" onClick={() => navigate('/plataforma/universidades')} />
        <Kpi etiqueta={t('plat.panel.suspendidas')} valor={TOTALES_PLATAFORMA.suspendidas} tono="terroso" onClick={() => navigate('/plataforma/universidades')} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <section className="card-sapio min-w-0 p-4 sm:p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
            {t('plat.panel.grafico')}
          </h2>
          <div className="mt-4 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serie} margin={{ top: 4, right: 8, bottom: 0, left: -6 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#E8E1D3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#5E6B72' }} tickLine={false} axisLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#5E6B72' }}
                  tickLine={false}
                  axisLine={false}
                  width={46}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  cursor={{ stroke: '#527D79', strokeWidth: 1 }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E8E1D3', fontSize: 12 }}
                  formatter={(v: number) => [v.toLocaleString('en-US'), t('plat.usuariosActivos')]}
                />
                <Area type="monotone" dataKey="usuarios" stroke="#527D79" strokeWidth={2} fill="rgba(82,125,121,.14)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="card-sapio p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              <TriangleAlert size={14} className="text-terroso" /> {t('plat.panel.alertas')}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {vencidas.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/plataforma/universidades/${u.id}`)}
                    className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl border border-terroso/35 bg-terroso/[.07] p-2.5 text-left transition-colors hover:border-terroso"
                  >
                    <AvatarUni iniciales={u.iniciales} color={u.colorPrimario} size={26} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-bold">{u.nombre}</span>
                      <span className="block truncate text-[11px] text-tinta-sec dark:text-marfil/50">
                        {t('plat.panel.alertaVencida')}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {suspendidas.map((u) => (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/plataforma/universidades/${u.id}`)}
                    className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl border border-terroso/35 bg-terroso/[.07] p-2.5 text-left transition-colors hover:border-terroso"
                  >
                    <AvatarUni iniciales={u.iniciales} color={u.colorPrimario} size={26} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-bold">{u.nombre}</span>
                      <span className="block truncate text-[11px] text-tinta-sec dark:text-marfil/50">
                        {t('plat.panel.alertaSuspendida')}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/plataforma/auditoria')}
                  className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl border border-champan/45 bg-champan/[.09] p-2.5 text-left transition-colors hover:border-champan"
                >
                  <ShieldAlert size={18} className="shrink-0 text-champan-700 dark:text-champan" />
                  <span className="min-w-0 flex-1 text-[12.5px] font-bold">
                    {t('plat.panel.alertaBloqueos', { n: INTENTOS_BLOQUEADOS_HOY })}
                  </span>
                </button>
              </li>
            </ul>
          </section>

          <section className="card-sapio p-4 sm:p-5">
            <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              {t('plat.panel.accesos')}
            </h2>
            <div className="mt-3 grid gap-2">
              <Boton variante="secundario" onClick={() => navigate('/plataforma/universidades')}>
                <Building2 size={15} /> {t('nav.universidades')}
              </Boton>
              <Boton variante="secundario" onClick={() => navigate('/plataforma/planes')}>
                <Tags size={15} /> {t('nav.planes')}
              </Boton>
              <Boton variante="secundario" onClick={() => navigate('/plataforma/auditoria')}>
                <ScrollText size={15} /> {t('nav.auditoria')}
              </Boton>
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('plat.panel.recientes')}
        </h2>
        <ul className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          {recientes.map((u) => (
            <li key={u.id} className="min-w-0">
              <button
                type="button"
                onClick={() => navigate(`/plataforma/universidades/${u.id}`)}
                className="card-sapio flex w-full min-h-[64px] items-center gap-3 p-3.5 text-left transition-[border-color] hover:border-mineral"
              >
                <AvatarUni iniciales={u.iniciales} color={u.colorPrimario} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-bold">{u.nombre}</span>
                  <span className="num block truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">
                    {u.slug}.sapio.example
                  </span>
                </span>
                <span className="shrink-0">
                  <EstadoBadge estado={u.estado} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
