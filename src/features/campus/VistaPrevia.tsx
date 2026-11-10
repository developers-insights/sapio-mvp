import { useDatos } from '@/store/datos'
import { dato, useT } from '@/i18n'
import { Isotipo } from '@/assets/brand/Isotipo'
import { GRANO_SVG, PLACEHOLDERS } from '@/data/assets'
import { PROGRAMAS } from '@/data/campus'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'

/** Miniatura en vivo de la página pública, dentro del editor. */
export function VistaPreviaCampus() {
  const { t, lang } = useT()
  const campus = useDatos((s) => s.campus)
  const uni = UNI_POR_ID[UNI_ADMIN]

  return (
    <div className="bg-marfil text-noche" aria-label={t('campus.editor.vistaPrevia')}>
      {/* barra del navegador simulada */}
      <div className="flex items-center gap-2 border-b border-borde bg-marfil-200 px-3 py-2">
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-borde" />
          <span className="h-2 w-2 rounded-full bg-borde" />
          <span className="h-2 w-2 rounded-full bg-borde" />
        </span>
        <span className="num truncate rounded-md bg-white px-2 py-0.5 text-[10.5px] text-tinta-sec">
          {uni.slug}.sapio.example
        </span>
      </div>

      <div className="max-h-[560px] overflow-y-auto">
        {/* portada */}
        <div
          className="relative px-5 py-8"
          style={{ background: campus.colorPrimario, backgroundImage: GRANO_SVG }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-8 w-8 place-items-center rounded-lg text-[11px] font-black text-marfil"
              style={{ background: 'rgba(255,255,255,.18)' }}
            >
              {campus.iniciales}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-marfil/70">
              {t('campus.hero.kicker')}
            </span>
          </div>
          <h2 className="mt-5 text-[22px] font-black leading-tight text-marfil">{campus.nombre}</h2>
          <span className="mt-3 block h-[3px] w-[64px]" style={{ background: campus.colorAcento }} />
          <p className="serif-it mt-3 text-[13px] text-marfil/80">
            {lang === 'en' ? campus.lemaEn : campus.lemaEs}
          </p>
        </div>

        {campus.secciones.institucional ? (
          <section className="px-5 py-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mineral-texto">
              {t('campus.institucional.kicker')}
            </p>
            <h3 className="mt-1.5 text-[16px] font-black">{t('campus.institucional.titulo')}</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-tinta-sec">
              {lang === 'en' ? campus.textoInstitucionalEn : campus.textoInstitucionalEs}
            </p>
          </section>
        ) : null}

        {campus.secciones.facultades ? (
          <section className="border-t border-borde px-5 py-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mineral-texto">
              {t('campus.facultades.kicker')}
            </p>
            <h3 className="mt-1.5 text-[16px] font-black">{t('campus.facultades.titulo')}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {uni.facultades.map((f, i) => (
                <li key={f} className="rounded-lg border border-borde bg-white p-2.5">
                  <span
                    className="block h-5 w-5 rounded-full"
                    style={{ background: PLACEHOLDERS.campusFacultades.capas[i % 3] }}
                    aria-hidden="true"
                  />
                  <span className="mt-1.5 block text-[11.5px] font-bold leading-snug">{dato(f, lang)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {campus.secciones.programas ? (
          <section className="border-t border-borde px-5 py-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mineral-texto">
              {t('campus.programas.kicker')}
            </p>
            <h3 className="mt-1.5 text-[16px] font-black">{t('campus.programas.titulo')}</h3>
            <ul className="mt-3 space-y-1.5">
              {PROGRAMAS.slice(0, 3).map((p) => (
                <li key={p.id} className="rounded-lg border border-borde bg-white p-2.5 text-[11.5px] font-bold">
                  {lang === 'en' ? p.nombreEn : p.nombreEs}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {campus.secciones.contacto ? (
          <section className="border-t border-borde px-5 py-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mineral-texto">
              {t('campus.contacto.kicker')}
            </p>
            <h3 className="mt-1.5 text-[16px] font-black">{t('campus.contacto.titulo')}</h3>
            <p className="num mt-2 text-[12px] text-tinta-sec">{campus.emailContacto}</p>
            <p className="num text-[12px] text-tinta-sec">{campus.telefono}</p>
          </section>
        ) : null}

        <footer className="flex items-center gap-2 border-t border-borde px-5 py-4">
          <Isotipo size={13} className="text-mineral-texto" />
          <p className="text-[10.5px] text-tinta-sec">{t('campus.footer')}</p>
        </footer>
      </div>
    </div>
  )
}
