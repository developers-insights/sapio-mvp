import { CheckCircle2, CircleX, Inbox, Loader2 } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { BRAND } from '@/lib/brand'
import { Firma, Isotipo } from '@/assets/brand/Isotipo'
import {
  EncabezadoSeccion, EstadoBadge, Kpi, Pildora, PreviewBanner, Tabla, Td, Th,
} from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Input, Interruptor, Select } from '@/components/ui/Campos'
import { PASA_AA, ratio } from '@/lib/contraste'
import { cn } from '@/lib/cn'

const PARES: Array<[string, string, string]> = [
  ['#101D2B', '#F6F2E9', 'Azul noche / Marfil'],
  ['#101D2B', '#FFFFFF', 'Azul noche / Blanco'],
  ['#5E6B72', '#FFFFFF', 'Texto secundario / Blanco'],
  ['#5E6B72', '#F6F2E9', 'Texto secundario / Marfil'],
  ['#F6F2E9', '#101D2B', 'Marfil / Azul noche'],
  ['#527D79', '#FFFFFF', 'Verde mineral / Blanco'],
  ['#3A5A57', '#FFFFFF', 'Verde mineral 700 / Blanco'],
  ['#25465C', '#FFFFFF', 'Azul pizarra / Blanco'],
  ['#8A6B38', '#FFFFFF', 'Champán 700 / Blanco'],
  ['#9C5B4E', '#FFFFFF', 'Rojo terroso / Blanco'],
]

export function Marca() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)

  return (
    <>
      <PreviewBanner
        id="plat-marca"
        titulo={t('plat.marca.banner')}
        bullets={[t('plat.marca.banner1'), t('plat.marca.banner2'), t('plat.marca.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('plat.marca.titulo')}
        bajada={t('plat.marca.bajada')}
        acciones={<Pildora tono="champan">{BRAND.estado}</Pildora>}
      />

      {/* Logo */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('plat.marca.logo')}
        </h2>
        <span className="filete mt-2.5" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: 'principal', fondo: '#101D2B', color: '#C9A974', etiqueta: t('plat.marca.logoPrincipal') },
            { id: 'alternativa', fondo: '#FFFFFF', color: '#527D79', etiqueta: t('plat.marca.logoAlternativa') },
            { id: 'mono', fondo: '#C9A974', color: '#101D2B', etiqueta: t('plat.marca.logoMono') },
            { id: 'digital', fondo: '#527D79', color: '#FFFFFF', etiqueta: t('plat.marca.logoDigital') },
          ].map((v) => (
            <li key={v.id} className="card-sapio overflow-hidden p-0">
              <div className="grid h-32 place-items-center" style={{ background: v.fondo }}>
                <Isotipo size={44} color={v.color} />
              </div>
              <p className="px-3.5 py-3 text-[12.5px] font-bold">{v.etiqueta}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="card-sapio flex items-center justify-center bg-noche p-6">
            <Firma size={26} colorIsotipo="#C9A974" wordmarkClassName="text-marfil" />
          </div>
          <div className="card-sapio space-y-1.5 p-4 text-[12.5px] text-tinta-sec dark:text-marfil/60">
            <p>{t('plat.marca.area')}</p>
            <p>{t('plat.marca.minimo')}</p>
            <p className="font-bold text-noche dark:text-marfil">{BRAND.estado}</p>
          </div>
        </div>
      </section>

      {/* Paleta */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('plat.marca.paleta')}
        </h2>
        <span className="filete mt-2.5" />
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {BRAND.proporcion.map((c) => (
            <li key={c.hex} className="card-sapio overflow-hidden p-0">
              <div
                className="h-24 border-b border-borde"
                style={{ background: c.hex }}
                aria-label={c.nombre}
                role="img"
              />
              <div className="p-3.5">
                <p className="text-[13px] font-black">{c.nombre}</p>
                <p className="num text-[12px] text-tinta-sec dark:text-marfil/55">{c.hex}</p>
                <p className="num mt-1.5 text-[12px] font-bold text-mineral">{c.pct}%</p>
                <p className="mt-1 text-[11.5px] leading-snug text-tinta-sec dark:text-marfil/50">
                  {lang === 'en' ? c.uso.en : c.uso.es}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {/* Barra de proporción */}
        <div className="mt-3 flex h-3 overflow-hidden rounded-full">
          {BRAND.proporcion.map((c) => (
            <span key={c.hex} style={{ background: c.hex, width: `${c.pct}%` }} />
          ))}
        </div>
      </section>

      {/* Tipografía */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('plat.marca.tipografia')}
        </h2>
        <span className="filete mt-2.5" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="card-sapio p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-sec dark:text-marfil/50">
              {BRAND.tipografia.titulos}
            </p>
            <p className="mt-3 text-[clamp(32px,6vw,52px)] font-black leading-none">Aa Bb Cc</p>
            <dl className="mt-4 space-y-1 text-[12.5px] text-tinta-sec dark:text-marfil/60">
              <div className="flex gap-2">
                <dt className="font-bold">H1</dt>
                <dd className="num">{BRAND.tipografia.jerarquia.h1}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">H2</dt>
                <dd className="num">{BRAND.tipografia.jerarquia.h2}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">{lang === 'en' ? 'Body' : 'Cuerpo'}</dt>
                <dd className="num">{BRAND.tipografia.jerarquia.cuerpo}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-bold">{lang === 'en' ? 'Labels' : 'Etiquetas'}</dt>
                <dd className="num">{BRAND.tipografia.jerarquia.etiquetas}</dd>
              </div>
            </dl>
          </div>
          <div className="card-sapio bg-noche p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-champan">
              {BRAND.tipografia.acento}
            </p>
            <p className="serif-it mt-3 text-[clamp(22px,4vw,34px)] leading-snug text-marfil">
              {lang === 'en' ? BRAND.claim.en : BRAND.claim.es}
            </p>
            <p className="mt-4 text-[12.5px] leading-relaxed text-marfil/60">
              {lang === 'en'
                ? 'For quotes, manifestos and selective accents. Never replaces functional interface text.'
                : 'Para citas, manifiestos y acentos selectivos. Nunca sustituye los textos funcionales de interfaz.'}
            </p>
          </div>
        </div>
      </section>

      {/* Componentes */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('plat.marca.componentes')}
        </h2>
        <span className="filete mt-2.5" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="card-sapio p-4 sm:p-5">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
              {t('plat.marca.botones')}
            </p>
            <div className="flex flex-wrap gap-2">
              <Boton>{t('app.guardar')}</Boton>
              <Boton variante="mineral">{t('app.confirmar')}</Boton>
              <Boton variante="secundario">{t('app.cancelar')}</Boton>
              <Boton variante="fantasma">{t('app.ver')}</Boton>
              <Boton variante="peligro">{t('app.eliminar')}</Boton>
            </div>
          </div>
          <div className="card-sapio p-4 sm:p-5">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
              {t('plat.marca.campos')}
            </p>
            <div className="space-y-2.5">
              <Input placeholder={t('app.buscar')} aria-label={t('app.buscar')} />
              <Select aria-label={t('app.filtrar')} defaultValue="a">
                <option value="a">{t('app.todos')}</option>
              </Select>
              <div className="flex items-center gap-2">
                <Interruptor activo onChange={() => undefined} label={t('app.ver')} />
                <span className="text-[13px]">{t('app.ver')}</span>
              </div>
            </div>
          </div>
          <div className="card-sapio p-4 sm:p-5">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
              {t('plat.marca.chips')}
            </p>
            <div className="flex flex-wrap gap-2">
              <EstadoBadge estado="activa" />
              <EstadoBadge estado="pendiente" />
              <EstadoBadge estado="vencida" />
              <EstadoBadge estado="en-curso" />
              <Pildora tono="pizarra">{t('interuni.chip')}</Pildora>
            </div>
          </div>
          <div className="card-sapio p-4 sm:p-5">
            <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
              KPI
            </p>
            <Kpi etiqueta={t('plat.usuariosActivos')} valor="11.240" tono="mineral" detalle="Northwood State" />
          </div>
        </div>

        <div className="mt-3">
          <Tabla>
            <thead>
              <tr>
                <Th>{t('plat.marca.tablas')}</Th>
                <Th>{t('plat.aud.resultado')}</Th>
                <Th>{t('uni.miembros.acciones')}</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td className="text-[13px] font-bold">Kestrel Bay University</Td>
                <Td>
                  <EstadoBadge estado="activa" />
                </Td>
                <Td>
                  <Boton tam="sm" variante="secundario">
                    {t('app.ver')}
                  </Boton>
                </Td>
              </tr>
            </tbody>
          </Tabla>
        </div>
      </section>

      {/* Estados de interfaz */}
      <section className="mb-8">
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('plat.marca.estados')}
        </h2>
        <span className="filete mt-2.5" />
        <p className="mt-3 text-[13px] text-tinta-sec dark:text-marfil/60">{t('plat.marca.estadoNota')}</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          <li className="card-sapio flex flex-col items-center gap-2 p-6 text-center">
            <Loader2 size={20} className="animate-spin text-mineral" />
            <p className="text-[13px] font-bold">{t('app.cargando')}</p>
          </li>
          <li className="card-sapio flex flex-col items-center gap-2 p-6 text-center">
            <Inbox size={20} className="text-tinta-sec" />
            <p className="text-[13px] font-bold">{t('app.vacio')}</p>
          </li>
          <li className="card-sapio flex flex-col items-center gap-2 border-terroso/35 p-6 text-center">
            <CircleX size={20} className="text-terroso" />
            <p className="text-[13px] font-bold">{t('app.error')}</p>
          </li>
        </ul>
      </section>

      {/* Accesibilidad: contrastes medidos */}
      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {t('plat.marca.accesibilidad')}
        </h2>
        <span className="filete mt-2.5" />
        <p className="mt-3 text-[13px] text-tinta-sec dark:text-marfil/60">{t('plat.marca.contraste')}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PARES.map(([frente, fondo, etiqueta]) => {
            const r = ratio(frente, fondo)
            const pasa = PASA_AA(r)
            return (
              <li
                key={etiqueta}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3',
                  pasa ? 'border-mineral/35 bg-mineral/[.05]' : 'border-terroso/40 bg-terroso/[.06]',
                )}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[13px] font-black"
                  style={{ background: fondo, color: frente }}
                >
                  Aa
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-bold">{etiqueta}</span>
                  <span className="num block text-[11.5px] text-tinta-sec dark:text-marfil/50">
                    {frente} {t('plat.marca.sobre')} {fondo}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="num block text-[14px] font-black">{r.toFixed(2)}:1</span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10.5px] font-bold',
                      pasa ? 'text-mineral' : 'text-terroso',
                    )}
                  >
                    {pasa ? <CheckCircle2 size={10} /> : <CircleX size={10} />}
                    {t('plat.marca.cumpleAA')}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
