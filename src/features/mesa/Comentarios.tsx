import { useState } from 'react'
import { CheckCircle2, CornerDownRight, MessageSquareText, RotateCcw } from 'lucide-react'
import { useT } from '@/i18n'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { campo } from '@/lib/texto'
import { Avatar, Pildora } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Textarea } from '@/components/ui/Campos'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { horaCorta, fechaCorta } from '@/lib/fechas'
import type { ComentarioMesa } from '@/data/tipos'
import { cn } from '@/lib/cn'

export function PanelComentarios({
  mesaId,
  comentarios,
  activo,
  onActivar,
}: {
  mesaId: string
  comentarios: ComentarioMesa[]
  activo: string | null
  onActivar: (id: string | null) => void
}) {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const responder = useDatos((s) => s.responderComentario)
  const alternar = useDatos((s) => s.alternarResuelto)
  const [respondiendo, setRespondiendo] = useState<string | null>(null)
  const [texto, setTexto] = useState('')
  const yo = persona(USUARIO_POR_ROL[rol])

  const sinResolver = comentarios.filter((c) => !c.resuelto).length

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <MessageSquareText size={16} className="shrink-0 text-mineral" />
        <h2 className="text-sm font-black uppercase tracking-[0.1em]">{t('mesa.comentarios')}</h2>
        {sinResolver ? (
          <Pildora tono="terroso" className="ml-auto">
            {t('mesa.sinResolverN', { n: sinResolver })}
          </Pildora>
        ) : null}
      </div>

      <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5">
        {comentarios.map((c) => {
          const autor = persona(c.autorId)
          const esActivo = activo === c.id
          return (
            <li
              key={c.id}
              id={`comentario-${c.id}`}
              className={cn(
                'rounded-2xl border p-3.5 transition-[border-color,box-shadow]',
                c.resuelto
                  ? 'border-borde bg-marfil-200/50 dark:border-[#27425a] dark:bg-noche-800/50'
                  : 'border-borde bg-white dark:border-[#27425a] dark:bg-noche-800',
                esActivo && 'border-mineral shadow-sapio-lg ring-2 ring-mineral/25',
              )}
            >
              <button
                type="button"
                onClick={() => onActivar(esActivo ? null : c.id)}
                className="w-full text-left"
              >
                <span className="flex items-start gap-2.5">
                  <Avatar personaId={c.autorId} size={30} presencia />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-black leading-tight">{autor.nombre}</span>
                    <span className="num block text-[11px] leading-tight text-tinta-sec dark:text-marfil/50">
                      {fechaCorta(c.fecha, lang)} · {horaCorta(c.fecha, lang)}
                    </span>
                  </span>
                  {c.resuelto ? (
                    <CheckCircle2 size={15} className="shrink-0 text-mineral" />
                  ) : (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-terroso" />
                  )}
                </span>
                <span className="mt-2.5 block border-l-2 border-champan pl-2.5 text-[12px] italic leading-snug text-tinta-sec dark:text-marfil/55">
                  {t('mesa.comentarSobre')} “{campo(c, 'fragmento', lang)}”
                </span>
                <span className="mt-2 block text-[13.5px] leading-relaxed">{campo(c, 'texto', lang)}</span>
              </button>

              {c.respuestas.length ? (
                <ul className="mt-3 space-y-2.5 border-l border-borde pl-3 dark:border-[#27425a]">
                  {c.respuestas.map((r) => (
                    <li key={r.id} className="flex items-start gap-2">
                      <Avatar personaId={r.autorId} size={22} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-black leading-tight">{persona(r.autorId).nombre}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-tinta-sec dark:text-marfil/65">
                          {campo(r, 'texto', lang)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {respondiendo === c.id ? (
                <div className="mt-3 space-y-2">
                  <Textarea
                    autoFocus
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder={t('mesa.tuRespuesta')}
                    className="min-h-[72px] text-[13px]"
                  />
                  <div className="flex flex-wrap justify-end gap-2">
                    <Boton variante="fantasma" tam="sm" onClick={() => { setRespondiendo(null); setTexto('') }}>
                      {t('app.cancelar')}
                    </Boton>
                    <Boton
                      tam="sm"
                      onClick={() => {
                        responder(mesaId, c.id, texto.trim() || (lang === 'en' ? 'Noted.' : 'Tomo nota.'), yo.id)
                        setRespondiendo(null)
                        setTexto('')
                        toast({ titulo: t('mesa.respondido'), tono: 'ok' })
                      }}
                    >
                      {t('mesa.responder')}
                    </Boton>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRespondiendo(c.id)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-borde px-2.5 text-[12px] font-bold transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a]"
                  >
                    <CornerDownRight size={12} />
                    {t('mesa.responder')}
                  </button>
                  <button
                    type="button"
                    onClick={() => { alternar(mesaId, c.id); toast({ titulo: c.resuelto ? t('estado.sinResolver') : t('estado.resuelto'), tono: 'ok' }) }}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-borde px-2.5 text-[12px] font-bold transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a]"
                  >
                    {c.resuelto ? <RotateCcw size={12} /> : <CheckCircle2 size={12} />}
                    {c.resuelto ? t('mesa.marcarSinResolver') : t('mesa.marcarResuelto')}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
