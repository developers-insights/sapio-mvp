import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, ListChecks, Table2, MessagesSquare, Users } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Campos'
import { Avatar } from '@/components/ui/Piezas'
import { campo, recortar } from '@/lib/texto'
import { DOCUMENTOS } from '@/data/proyecto'
import { MESAS } from '@/data/mesa'
import { MENSAJES, CANAL_POR_ID } from '@/data/chat'
import { PERSONAS } from '@/data/personas'

interface Resultado {
  id: string
  grupo: string
  titulo: string
  detalle: string
  ruta: string
  personaId?: string
}

export function Buscador() {
  const abierto = useUI((s) => s.buscadorAbierto)
  const setAbierto = useUI((s) => s.setBuscador)
  const tareas = useDatos((s) => s.tareas)
  const { t, lang } = useT()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const resultados = useMemo<Resultado[]>(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 2) return []
    const out: Resultado[] = []
    const coincide = (s: string) => s.toLowerCase().includes(term)

    for (const x of tareas) {
      if (coincide(campo(x, 'titulo', lang))) {
        out.push({
          id: 'tarea-' + x.id,
          grupo: t('buscador.tareas'),
          titulo: campo(x, 'titulo', lang),
          detalle: t(`estado.${x.estado}`),
          ruta: '/workplace/tareas',
          personaId: x.responsableId,
        })
      }
    }
    for (const d of DOCUMENTOS) {
      if (coincide(campo(d, 'nombre', lang)) || coincide(d.carpeta)) {
        out.push({
          id: 'doc-' + d.id,
          grupo: t('buscador.documentos'),
          titulo: campo(d, 'nombre', lang),
          detalle: d.carpeta,
          ruta: d.mesaId ? `/mesa/${d.mesaId}` : '/workplace/documentos',
          personaId: d.autorId,
        })
      }
    }
    for (const p of PERSONAS) {
      if (coincide(p.nombre) || coincide(p.email) || coincide(p.departamento)) {
        out.push({
          id: 'per-' + p.id,
          grupo: t('buscador.personas'),
          titulo: p.nombre,
          detalle: lang === 'en' ? p.cargoEn : p.cargoEs,
          ruta: '/universidad/miembros',
          personaId: p.id,
        })
      }
    }
    for (const m of MESAS) {
      if (coincide(campo(m, 'titulo', lang))) {
        out.push({
          id: 'mesa-' + m.id,
          grupo: t('buscador.mesas'),
          titulo: campo(m, 'titulo', lang),
          detalle: `${m.participantes.length} · ${t('nav.mesasCorto')}`,
          ruta: `/mesa/${m.id}`,
        })
      }
    }
    for (const msj of MENSAJES) {
      if (coincide(campo(msj, 'texto', lang))) {
        out.push({
          id: 'msg-' + msj.id,
          grupo: t('buscador.mensajes'),
          titulo: recortar(campo(msj, 'texto', lang), 70),
          detalle: CANAL_POR_ID[msj.canal]?.nombre ?? msj.canal,
          ruta: `/chat/${msj.canal}`,
          personaId: msj.autorId,
        })
      }
    }
    return out.slice(0, 24)
  }, [q, tareas, lang, t])

  const grupos = useMemo(() => {
    const m = new Map<string, Resultado[]>()
    for (const r of resultados) {
      if (!m.has(r.grupo)) m.set(r.grupo, [])
      m.get(r.grupo)!.push(r)
    }
    return [...m.entries()]
  }, [resultados])

  const ICONO: Record<string, typeof FileText> = {
    [t('buscador.tareas')]: ListChecks,
    [t('buscador.documentos')]: FileText,
    [t('buscador.personas')]: Users,
    [t('buscador.mesas')]: Table2,
    [t('buscador.mensajes')]: MessagesSquare,
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={() => setAbierto(false)}
      ancho={620}
      zIndex={9100}
      etiqueta={t('buscador.titulo')}
    >
      <div className="relative">
        <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-sec" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('buscador.placeholder')}
          className="pl-10"
          aria-label={t('buscador.titulo')}
        />
      </div>

      <div className="mt-4 max-h-[52vh] overflow-y-auto">
        {q.trim().length < 2 ? (
          <p className="py-8 text-center text-sm text-tinta-sec dark:text-marfil/55">
            {t('buscador.placeholder')}
          </p>
        ) : !resultados.length ? (
          <div className="py-8 text-center">
            <p className="text-sm font-bold">{t('app.sinResultados')}</p>
            <p className="mt-1 text-[13px] text-tinta-sec dark:text-marfil/55">{t('app.sinResultadosDetalle')}</p>
          </div>
        ) : (
          <>
            <p className="num mb-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
              {t('app.resultados', { n: resultados.length })}
            </p>
            {grupos.map(([grupo, items]) => {
              const I = ICONO[grupo] ?? FileText
              return (
                <section key={grupo} className="mb-4">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-sec dark:text-marfil/45">
                    <I size={12} /> {grupo}
                  </p>
                  <ul className="space-y-1">
                    {items.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setAbierto(false)
                            setQ('')
                            navigate(r.ruta)
                          }}
                          className="flex w-full min-h-[44px] items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-marfil-200 dark:hover:bg-noche-700"
                        >
                          {r.personaId ? <Avatar personaId={r.personaId} size={24} /> : <I size={16} className="shrink-0 text-mineral" />}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-bold">{r.titulo}</span>
                            <span className="block truncate text-[11.5px] text-tinta-sec dark:text-marfil/50">{r.detalle}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </>
        )}
      </div>
    </Modal>
  )
}
