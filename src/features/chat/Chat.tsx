import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Hash, MessagesSquare, Paperclip, Search, Send, Users } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import {
  Avatar, ChipInteruniversitario, DevNotice, EncabezadoSeccion, EstadoVacio, Pildora, PreviewBanner,
} from '@/components/ui/Piezas'
import { Input } from '@/components/ui/Campos'
import { CANALES, CANAL_POR_ID, MENSAJES, MENSAJES_EN_VIVO } from '@/data/chat'
import { DOC_POR_ID } from '@/data/proyecto'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { fechaCorta, horaCorta } from '@/lib/fechas'
import { useEsMobile, useOffsetInferior } from '@/lib/hooks'
import type { Mensaje } from '@/data/tipos'
import { cn } from '@/lib/cn'

export function Chat() {
  const { canal } = useParams()
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const offsetInferior = useOffsetInferior()
  const yo = persona(USUARIO_POR_ROL[rol])

  const [enviados, setEnviados] = useState<Mensaje[]>([])
  const [enVivo, setEnVivo] = useState<Mensaje[]>([])
  const [busqueda, setBusqueda] = useState('')
  const entradaRef = useRef<HTMLInputElement>(null)
  const finRef = useRef<HTMLDivElement>(null)
  const temporizadores = useRef<number[]>([])

  const mios = useMemo(() => CANALES.filter((c) => c.miembros.includes(yo.id)), [yo.id])
  const activo = canal ? CANAL_POR_ID[canal] : undefined
  const puedeVerCanal = Boolean(activo && activo.miembros.includes(yo.id))

  // Mensajes que "llegan en vivo" al abrir el canal (guion simulado).
  useEffect(() => {
    setEnVivo([])
    setEnviados([])
    temporizadores.current.forEach((x) => window.clearTimeout(x))
    temporizadores.current = []
    if (!canal) return
    const guion = MENSAJES_EN_VIVO[canal] ?? []
    guion.forEach((m, i) => {
      const id = window.setTimeout(() => {
        setEnVivo((prev) => [...prev, m])
      }, 2200 + i * 2600)
      temporizadores.current.push(id)
    })
    return () => {
      temporizadores.current.forEach((x) => window.clearTimeout(x))
      temporizadores.current = []
    }
  }, [canal])

  const mensajes = useMemo(() => {
    if (!canal) return []
    const base = [...MENSAJES.filter((m) => m.canal === canal), ...enVivo, ...enviados]
    const term = busqueda.trim().toLowerCase()
    const filtrados = term
      ? base.filter((m) => campo(m, 'texto', lang).toLowerCase().includes(term))
      : base
    return filtrados.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
  }, [canal, enVivo, enviados, busqueda, lang])

  useEffect(() => {
    if (!canal) return
    finRef.current?.scrollIntoView({ block: 'end' })
  }, [mensajes.length, canal])

  function enviar(texto: string) {
    const limpio = texto.trim()
    if (!limpio || !canal) return
    setEnviados((prev) => [
      ...prev,
      {
        id: 'env-' + Date.now(),
        canal,
        autorId: yo.id,
        fecha: new Date(),
        textoEs: limpio,
        textoEn: limpio,
      },
    ])
    toast({ titulo: t('chat.enviado'), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
  }

  const lista = (
    <ul className="space-y-1.5">
      {(['canal', 'directo'] as const).map((tipo) => {
        const items = mios.filter((c) => c.tipo === tipo)
        if (!items.length) return null
        return (
          <li key={tipo}>
            <p className="px-1 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-tinta-sec/80 dark:text-marfil/40">
              {tipo === 'canal' ? t('chat.canales') : t('chat.directos')}
            </p>
            <ul className="space-y-1">
              {items.map((c) => {
                const ultimo = [...MENSAJES.filter((m) => m.canal === c.id)].pop()
                const esActivo = c.id === canal
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => navigate(`/chat/${c.id}`)}
                      className={cn(
                        'flex w-full min-h-[56px] items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors',
                        esActivo
                          ? 'border-mineral bg-mineral/[.08]'
                          : 'border-borde bg-white hover:border-mineral dark:border-[#27425a] dark:bg-noche-800',
                      )}
                    >
                      {c.tipo === 'canal' ? (
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-pizarra/12 text-pizarra dark:text-[#8fb6cf]">
                          <Hash size={15} />
                        </span>
                      ) : (
                        <Avatar personaId={c.miembros.find((m) => m !== yo.id) ?? yo.id} size={32} presencia />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold leading-tight">{c.nombre}</span>
                        <span className="block truncate text-[11.5px] leading-tight text-tinta-sec dark:text-marfil/50">
                          {ultimo ? campo(ultimo, 'texto', lang) : campo(c, 'descripcion', lang)}
                        </span>
                      </span>
                      {c.noLeidos ? <Pildora tono="terroso">{c.noLeidos}</Pildora> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )

  const conversacion = activo ? (
    <section className="flex min-w-0 flex-1 flex-col">
      <header className="mb-3 flex flex-wrap items-center gap-2">
        {esMobile ? (
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="inline-flex min-h-[40px] items-center gap-1.5 text-[13px] font-bold text-mineral"
          >
            <ArrowLeft size={15} /> {t('chat.volverLista')}
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[17px] font-black leading-tight">{activo.nombre}</h2>
          <p className="truncate text-[12px] text-tinta-sec dark:text-marfil/55">
            {campo(activo, 'descripcion', lang)} · {t('chat.miembrosN', { n: activo.miembros.length })}
          </p>
        </div>
        <span className="flex shrink-0 -space-x-1.5">
          {activo.miembros.slice(0, 5).map((m) => (
            <Avatar key={m} personaId={m} size={24} presencia />
          ))}
        </span>
      </header>

      {activo.interuniversitario ? (
        <div className="mb-3">
          <ChipInteruniversitario />
        </div>
      ) : null}

      <div className="relative mb-3">
        <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-sec" />
        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder={t('chat.buscarHistorial')}
          className="pl-9"
          aria-label={t('chat.buscarHistorial')}
        />
      </div>
      {busqueda.trim() ? (
        <p className="num mb-2 text-[12px] font-bold text-tinta-sec dark:text-marfil/50">
          {t('chat.resultadosHistorial', { n: mensajes.length })}
        </p>
      ) : null}

      <div className="card-sapio min-h-0 flex-1 overflow-y-auto p-3.5 sm:p-4" style={{ maxHeight: esMobile ? '52vh' : '58vh' }}>
        {!mensajes.length ? (
          <p className="py-10 text-center text-sm text-tinta-sec dark:text-marfil/55">{t('chat.sinMensajes')}</p>
        ) : (
          <ul className="space-y-3">
            {mensajes.map((m) => {
              const mio = m.autorId === yo.id
              const doc = m.adjuntoDocId ? DOC_POR_ID[m.adjuntoDocId] : undefined
              return (
                <li key={m.id} className={cn('flex gap-2.5', mio ? 'justify-end' : 'justify-start')}>
                  {!mio ? <Avatar personaId={m.autorId} size={30} presencia /> : null}
                  <span className="max-w-[80%]">
                    {!mio ? (
                      <span className="mb-1 block text-[11.5px] font-black text-tinta-sec dark:text-marfil/60">
                        {persona(m.autorId).nombre}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        'block rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed',
                        mio
                          ? 'rounded-br-md bg-mineral text-white'
                          : 'rounded-bl-md border border-borde bg-marfil-200/70 dark:border-[#27425a] dark:bg-noche-700',
                      )}
                    >
                      {campo(m, 'texto', lang)}
                      {doc ? (
                        <button
                          type="button"
                          onClick={() => navigate(doc.mesaId ? `/mesa/${doc.mesaId}` : '/workplace/documentos')}
                          className={cn(
                            'mt-2 flex w-full min-h-[40px] items-center gap-2 rounded-lg border px-2.5 text-left text-[12px] font-bold',
                            mio ? 'border-white/35 text-white' : 'border-borde dark:border-[#27425a]',
                          )}
                        >
                          <Paperclip size={13} className="shrink-0" />
                          <span className="min-w-0 flex-1 truncate">{campo(doc, 'nombre', lang)}</span>
                        </button>
                      ) : null}
                    </span>
                    <span className="num mt-1 block text-[10.5px] text-tinta-sec dark:text-marfil/40">
                      {fechaCorta(m.fecha, lang)} · {horaCorta(m.fecha, lang)}
                    </span>
                  </span>
                </li>
              )
            })}
          </ul>
        )}
        <div ref={finRef} />
      </div>

      <form
        className={cn(
          'mt-3 flex items-center gap-2',
          esMobile && 'fixed inset-x-0 z-[45] border-t border-borde bg-marfil px-3 py-2.5 dark:border-[#27425a] dark:bg-noche',
        )}
        style={esMobile ? { bottom: offsetInferior } : undefined}
        onSubmit={(e) => {
          e.preventDefault()
          const v = entradaRef.current?.value ?? ''
          if (entradaRef.current) entradaRef.current.value = ''
          enviar(v)
        }}
      >
        <input
          ref={entradaRef}
          aria-label={t('chat.escribirMensaje')}
          placeholder={t('chat.escribirMensaje')}
          className="min-h-[44px] w-full rounded-xl border border-borde bg-white px-3 text-[13.5px] focus:border-mineral focus:outline-none dark:border-[#27425a] dark:bg-noche-800"
        />
        <button
          type="submit"
          aria-label={t('chat.enviar')}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-noche text-marfil transition-colors hover:bg-[#1b3147] dark:bg-marfil dark:text-noche"
        >
          <Send size={16} />
        </button>
      </form>
    </section>
  ) : null

  return (
    <>
      <PreviewBanner
        id="chat"
        titulo={t('chat.banner')}
        bullets={[t('chat.banner1'), t('chat.banner2'), t('chat.banner3')]}
      />

      {!canal || !esMobile ? (
        <EncabezadoSeccion kicker={kickerRol(rol, lang)} titulo={t('chat.titulo')} />
      ) : null}

      <div className={cn('grid gap-4', !esMobile && 'lg:grid-cols-[300px_1fr]')}>
        {(!canal || !esMobile) ? <aside className="min-w-0">{lista}</aside> : null}

        {canal ? (
          puedeVerCanal ? (
            conversacion
          ) : (
            <EstadoVacio titulo={t('guard.titulo')} detalle={t('guard.detalle')} />
          )
        ) : !esMobile ? (
          <EstadoVacio
            titulo={t('chat.elegirConversacion')}
            detalle={t('chat.elegirDetalle')}
            icono={<MessagesSquare size={20} />}
          />
        ) : null}
      </div>

      {!esMobile || !canal ? (
        <DevNotice
          className="mt-8"
          funcion={t('chat.dev.tiempoReal')}
          hoy={t('chat.dev.tiempoRealHoy')}
          alDesarrollar={t('chat.dev.tiempoRealDesp')}
        />
      ) : null}
    </>
  )
}
