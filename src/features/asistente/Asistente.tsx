import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ListChecks, Send, Sparkles, Wand2 } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, PreviewBanner, DevNotice, Pildora } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Campo, Select, Textarea } from '@/components/ui/Campos'
import { DOCUMENTOS } from '@/data/proyecto'
import { tareasSugeridas, CHIPS_POR_ROL } from './motor'
import { useConversacion } from './useConversacion'
import { Burbujas, MedidorUso } from './Burbujas'
import { USUARIO_POR_ROL } from '@/data/personas'

/** Vista completa del módulo 09. */
export function Asistente() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const agregarTareas = useDatos((s) => s.agregarTareas)
  const navigate = useNavigate()
  const { mensajes, pensando, preguntar, uso } = useConversacion()
  const entradaRef = useRef<HTMLInputElement>(null)

  const [docElegido, setDocElegido] = useState('d-cap3')
  const [original, setOriginal] = useState(
    lang === 'en'
      ? 'The methodology is mixed and it uses interviews and also a database of incidents, we think this is enough to answer the research question.'
      : 'La metodología es mixta y usa entrevistas y también una base de incidentes, creemos que esto alcanza para responder la pregunta de investigación.',
  )
  const [mejorado, setMejorado] = useState('')
  const [textoTareas, setTextoTareas] = useState(
    lang === 'en'
      ? 'Whitfield asks for a 120-case validation survey before closing the chapter; Ortega will send two European references and Grant wants the sequential design justified.'
      : 'Whitfield pide una encuesta de validación sobre 120 casos antes de cerrar el capítulo; Ortega va a mandar dos referencias europeas y Grant quiere justificado el diseño secuencial.',
  )

  // Solo los documentos con permiso para este rol.
  const permitidos = DOCUMENTOS.filter((d) => {
    if (d.restringido) return false
    if (rol === 'colaborador') return ['d-protocolos', 'd-cap3', 'd-datos'].includes(d.id)
    return true
  })

  function mejorar() {
    setMejorado(
      lang === 'en'
        ? 'The study adopts a **sequential explanatory mixed design**. The qualitative phase draws on semi-structured interviews with response leads; the quantitative phase analyses the 2019–2025 incident dataset. Triangulating both sources is what allows the research question to be answered, rather than either source on its own.\n\nChanges: “is mixed and uses” → “adopts a sequential explanatory mixed design” (precise term); “we think this is enough” → claim grounded in triangulation (removes hedging).'
        : 'El estudio adopta un **diseño mixto secuencial explicativo**. La fase cualitativa se apoya en entrevistas semiestructuradas a responsables de respuesta; la fase cuantitativa analiza la base de incidentes 2019–2025. La triangulación entre ambas fuentes es lo que permite responder la pregunta de investigación, y no cada fuente por separado.\n\nCambios: «es mixta y usa» → «adopta un diseño mixto secuencial explicativo» (término preciso); «creemos que esto alcanza» → afirmación fundada en la triangulación (saca la vaguedad).',
    )
    toast({ titulo: t('asist.vista.redaccionBoton'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
  }

  return (
    <>
      <PreviewBanner
        id="asistente"
        titulo={t('asist.banner')}
        bullets={[t('asist.banner1'), t('asist.banner2'), t('asist.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('asist.vista.titulo')}
        bajada={t('asist.banner')}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-4">
          {/* Resumen de documentos */}
          <section className="card-sapio p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              <FileText size={14} className="text-mineral" /> {t('asist.vista.resumir')}
            </h2>
            <p className="mt-1.5 text-[13px] text-tinta-sec dark:text-marfil/55">{t('asist.vista.resumirDet')}</p>
            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-end">
              <Campo label={t('wp.doc.titulo')} className="min-w-0 flex-1">
                <Select value={docElegido} onChange={(e) => setDocElegido(e.target.value)}>
                  {permitidos.map((d) => (
                    <option key={d.id} value={d.id}>
                      {campo(d, 'nombre', lang)}
                    </option>
                  ))}
                </Select>
              </Campo>
              <Boton
                className="shrink-0"
                onClick={() => {
                  const d = DOCUMENTOS.find((x) => x.id === docElegido)!
                  preguntar(
                    lang === 'en'
                      ? `Summarise ${d.nombreEn}`
                      : `Resumí ${d.nombreEs}`,
                  )
                }}
              >
                <Sparkles size={15} />
                {t('asist.vista.resumirBoton')}
              </Boton>
            </div>
          </section>

          {/* Redacción y corrección */}
          <section className="card-sapio p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              <Wand2 size={14} className="text-mineral" /> {t('asist.vista.redaccion')}
            </h2>
            <p className="mt-1.5 text-[13px] text-tinta-sec dark:text-marfil/55">{t('asist.vista.redaccionDet')}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Campo label={t('asist.vista.original')}>
                <Textarea value={original} onChange={(e) => setOriginal(e.target.value)} className="min-h-[140px] text-[13px]" />
              </Campo>
              <div>
                <p className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
                  {t('asist.vista.mejorado')}
                </p>
                <div className="min-h-[140px] whitespace-pre-line rounded-xl border border-mineral/35 bg-mineral/[.06] p-3 text-[13px] leading-relaxed">
                  {mejorado || <span className="text-tinta-sec dark:text-marfil/45">{t('asist.vista.pegaTexto')}</span>}
                </div>
              </div>
            </div>
            <Boton className="mt-3" variante="mineral" onClick={mejorar}>
              <Wand2 size={15} />
              {t('asist.vista.redaccionBoton')}
            </Boton>
          </section>

          {/* Sugerir tareas */}
          <section className="card-sapio p-4 sm:p-5">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
              <ListChecks size={14} className="text-mineral" /> {t('asist.vista.tareas')}
            </h2>
            <p className="mt-1.5 text-[13px] text-tinta-sec dark:text-marfil/55">{t('asist.vista.tareasDet')}</p>
            <Textarea
              value={textoTareas}
              onChange={(e) => setTextoTareas(e.target.value)}
              className="mt-3 min-h-[100px] text-[13px]"
              aria-label={t('asist.vista.tareas')}
            />
            <Boton
              className="mt-3"
              onClick={() => {
                agregarTareas(tareasSugeridas(lang, USUARIO_POR_ROL[rol]))
                toast({ titulo: t('asist.resp.tareasCreadas'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
                navigate('/workplace/tareas')
              }}
            >
              <ListChecks size={15} />
              {t('asist.vista.tareasBoton')}
            </Boton>
          </section>
        </div>

        {/* Conversación */}
        <aside className="min-w-0 space-y-4">
          <section className="card-sapio flex h-[min(620px,72vh)] flex-col overflow-hidden p-0">
            <header className="flex shrink-0 items-center gap-2 border-b border-borde px-4 py-3 dark:border-[#27425a]">
              <h2 className="text-sm font-black uppercase tracking-[0.1em]">{t('asist.vista.conversacion')}</h2>
              <Pildora tono="mineral" className="ml-auto">
                {t('asist.enLinea')}
              </Pildora>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
              <Burbujas mensajes={mensajes} pensando={pensando} />
            </div>
            <div className="shrink-0 border-t border-borde px-3 pb-3 pt-2.5 dark:border-[#27425a]">
              <div className="scroll-x-contenida sin-scrollbar mb-2 flex gap-1.5">
                {CHIPS_POR_ROL[rol].map((clave) => (
                  <button
                    key={clave}
                    type="button"
                    onClick={() => preguntar(t(clave))}
                    className="min-h-[34px] shrink-0 whitespace-nowrap rounded-full border border-borde bg-white px-3 text-[11.5px] font-bold text-tinta-sec transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a] dark:bg-noche-700 dark:text-marfil/70"
                  >
                    {t(clave)}
                  </button>
                ))}
              </div>
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  const v = entradaRef.current?.value ?? ''
                  if (entradaRef.current) entradaRef.current.value = ''
                  preguntar(v)
                }}
              >
                <input
                  ref={entradaRef}
                  aria-label={t('asist.escribir')}
                  placeholder={t('asist.escribir')}
                  className="min-h-[44px] w-full rounded-xl border border-borde bg-white px-3 text-[13.5px] focus:border-mineral focus:outline-none dark:border-[#27425a] dark:bg-noche-700"
                />
                <button
                  type="submit"
                  aria-label={t('asist.escribir')}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-noche text-marfil transition-colors hover:bg-[#1b3147] dark:bg-marfil dark:text-noche"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </section>

          <MedidorUso {...uso} />

          <DevNotice
            funcion={t('asist.dev.modelo')}
            hoy={t('asist.dev.modeloHoy')}
            alDesarrollar={t('asist.dev.modeloDesp')}
          />
        </aside>
      </div>
    </>
  )
}
