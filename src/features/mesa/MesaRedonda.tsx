import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import {
  CheckCircle2, Clock, History, MessageSquareText, PlayCircle, RotateCcw, Sparkles,
  UserPlus, Users,
} from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { tr, useT } from '@/i18n'
import { campo } from '@/lib/texto'
import {
  Avatar, ChipInteruniversitario, DevNotice, EstadoVacio, Pildora, PreviewBanner,
} from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal, Hoja } from '@/components/ui/Modal'
import { Campo, Select } from '@/components/ui/Campos'
import {
  COMENTARIO_EN_VIVO, CONTENIDO_MESA, FRASE_EN_VIVO, MESA_POR_ID, VERSIONES_MESA,
} from '@/data/mesa'
import { P, PERSONAS, persona, USUARIO_POR_ROL } from '@/data/personas'
import { fechaCorta, horaCorta } from '@/lib/fechas'
import { useEsMobile, useMenosMovimiento, useOffsetInferior } from '@/lib/hooks'
import { puntoFinal, rectsRelativos, type Rect } from './overlay'
import { BarraFormato } from './BarraFormato'
import { PanelComentarios } from './Comentarios'
import { cn } from '@/lib/cn'

interface CursorRemoto {
  personaId: string
  color: string
  rect: Rect
  escribiendo: boolean
  /** Cuando el cursor queda cerca del borde, la etiqueta se dibuja hacia adentro. */
  alIzquierda?: boolean
}

export function MesaRedonda() {
  const { id } = useParams()
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const setAsistente = useUI((s) => s.setAsistente)
  const trailer = useUI((s) => s.trailerAbierto)
  const comentariosPorMesa = useDatos((s) => s.comentarios)
  const agregarComentario = useDatos((s) => s.agregarComentario)
  const invitarAMesa = useDatos((s) => s.invitarAMesa)
  const participantesExtra = useDatos((s) => s.participantesExtra)
  const restaurar = useDatos((s) => s.restaurarVersion)
  const versionRestaurada = useDatos((s) => s.versionRestaurada)
  const navigate = useNavigate()
  const esMobile = useEsMobile()
  const menosMovimiento = useMenosMovimiento()
  const offsetInferior = useOffsetInferior()

  const mesa = id ? MESA_POR_ID[id] : undefined
  const yo = persona(USUARIO_POR_ROL[rol])

  const [guardando, setGuardando] = useState(false)
  const [cursores, setCursores] = useState<CursorRemoto[]>([])
  const [anclas, setAnclas] = useState<Array<{ id: string; rects: Rect[]; resuelto: boolean }>>([])
  const [comentarioActivo, setComentarioActivo] = useState<string | null>(null)
  const [hojaComentarios, setHojaComentarios] = useState(false)
  const [versionesAbierto, setVersionesAbierto] = useState(false)
  const [invitarAbierto, setInvitarAbierto] = useState(false)
  const [invitado, setInvitado] = useState('p-prof-3')
  const [permiso, setPermiso] = useState<'lectura' | 'edicion'>('lectura')
  const [replay, setReplay] = useState<number | null>(null)

  const contenedorRef = useRef<HTMLDivElement>(null)
  const temporizadores = useRef<number[]>([])
  const guionCorrido = useRef<string | null>(null)

  const comentarios = useMemo(
    () => (id ? (comentariosPorMesa[id] ?? []) : []),
    [comentariosPorMesa, id],
  )

  const participantes = useMemo(() => {
    if (!mesa) return []
    const extra = (participantesExtra[mesa.id] ?? []).map((p) => ({
      personaId: p.personaId,
      permiso: p.permiso,
      presencia: 'desconectado' as const,
      cursor: '#5E6B72',
    }))
    return [...mesa.participantes, ...extra]
  }, [mesa, participantesExtra])

  const miPermiso = participantes.find((p) => p.personaId === yo.id)?.permiso ?? 'lectura'
  const puedeEditar = miPermiso === 'edicion'

  const html = mesa ? (CONTENIDO_MESA[mesa.id]?.[lang] ?? '') : ''

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ heading: { levels: [2, 3] } }),
        Link.configure({ openOnClick: false, autolink: false }),
      ],
      content: html,
      editable: puedeEditar,
      editorProps: {
        attributes: {
          class:
            'prose-sapio min-h-[320px] focus:outline-none',
          'aria-label': mesa ? campo(mesa, 'titulo', lang) : '',
        },
      },
    },
    [mesa?.id],
  )

  // Idioma: el documento de la mesa también se traduce.
  useEffect(() => {
    if (!editor || !html) return
    editor.commands.setContent(html, false)
  }, [editor, html])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(puedeEditar)
  }, [editor, puedeEditar])

  // Guardado automático continuo (simulado).
  useEffect(() => {
    if (!editor) return
    const onUpdate = () => {
      setGuardando(true)
      const id = window.setTimeout(() => setGuardando(false), 900)
      temporizadores.current.push(id)
    }
    editor.on('update', onUpdate)
    return () => {
      editor.off('update', onUpdate)
    }
  }, [editor])

  /** Recalcula cursores y anclas de comentarios sobre el texto renderizado. */
  const medir = useCallback(() => {
    const raiz = contenedorRef.current?.querySelector('.ProseMirror') as HTMLElement | null
    if (!raiz || !mesa) return
    setAnclas(
      comentarios
        .map((c) => ({ id: c.id, rects: rectsRelativos(raiz, campo(c, 'fragmento', lang)), resuelto: c.resuelto }))
        .filter((x) => x.rects.length > 0),
    )
    const anchoCaja = raiz.getBoundingClientRect().width
    setCursores((prev) =>
      prev.map((c) => {
        const frase = FRASE_EN_VIVO[lang].trim()
        const anclas =
          c.personaId === P.grant
            ? [frase.slice(-32), frase.slice(0, 24), lang === 'en' ? 'stratified by sector and organisation size.' : 'estratificado por sector y tamaño de organización.']
            : [lang === 'en' ? 'Triangulation across sources' : 'triangulación entre fuentes', campo(COMENTARIO_EN_VIVO, 'fragmento', lang)]
        for (const a of anclas) {
          const r = puntoFinal(raiz, a)
          if (r) return { ...c, rect: r, alIzquierda: r.left > anchoCaja - 130 }
        }
        return c
      }),
    )
  }, [comentarios, lang, mesa])

  useEffect(() => {
    const id = window.setTimeout(medir, 260)
    const id2 = window.setTimeout(medir, 700)
    temporizadores.current.push(id, id2)
    window.addEventListener('resize', medir)
    window.addEventListener('scroll', medir, true)
    return () => {
      window.removeEventListener('resize', medir)
      window.removeEventListener('scroll', medir, true)
    }
  }, [medir])

  /**
   * Guion simulado: aparecen dos cursores remotos, uno escribe una oración
   * nueva en vivo y el otro deja un comentario sobre ese mismo fragmento.
   * Los timers se limpian al salir de la vista.
   */
  useEffect(() => {
    if (!editor || !mesa || trailer) return
    if (mesa.id !== 'tesis-metodologia') return
    if (guionCorrido.current === mesa.id + lang) return
    guionCorrido.current = mesa.id + lang

    const empujar = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms)
      temporizadores.current.push(id)
    }

    const raizDe = () => contenedorRef.current?.querySelector('.ProseMirror') as HTMLElement | null

    const anclaGrant = lang === 'en' ? 'stratified by sector and organisation size.' : 'estratificado por sector y tamaño de organización.'

    empujar(() => {
      const raiz = raizDe()
      const r = raiz ? puntoFinal(raiz, anclaGrant) : null
      if (r) setCursores((c) => [...c.filter((x) => x.personaId !== P.grant), { personaId: P.grant, color: '#25465C', rect: r, escribiendo: false }])
    }, 900)

    empujar(() => {
      const raiz = raizDe()
      const r = raiz ? puntoFinal(raiz, lang === 'en' ? 'Triangulation across sources' : 'triangulación entre fuentes') : null
      if (r) setCursores((c) => [...c.filter((x) => x.personaId !== P.whitfield), { personaId: P.whitfield, color: '#9C5B4E', rect: r, escribiendo: false }])
    }, 1700)

    // El Dr. Grant escribe una oración nueva, carácter por carácter.
    empujar(() => {
      const frase = FRASE_EN_VIVO[lang]
      const base = posicionDespuesDe(anclaGrant)
      if (base < 0) return
      if (menosMovimiento) {
        insertarEn(base, frase)
        empujar(medir, 120)
        return
      }
      setCursores((c) => c.map((x) => (x.personaId === P.grant ? { ...x, escribiendo: true } : x)))
      for (let i = 0; i < frase.length; i++) {
        empujar(() => {
          // La posición avanza con cada carácter: si no, la frase saldría al revés.
          insertarEn(base + i, frase[i])
          if (i % 6 === 0) medir()
        }, i * 26)
      }
      empujar(() => {
        setCursores((c) => c.map((x) => (x.personaId === P.grant ? { ...x, escribiendo: false } : x)))
        medir()
      }, frase.length * 26 + 120)
    }, 2400)

    /** Posición del documento justo después del texto ancla. */
    function posicionDespuesDe(ancla: string): number {
      if (!editor) return -1
      let posicion = -1
      editor.state.doc.descendants((nodo, pos) => {
        if (posicion >= 0) return false
        if (nodo.isText && nodo.text && nodo.text.includes(ancla)) {
          posicion = pos + nodo.text.indexOf(ancla) + ancla.length
          return false
        }
        return true
      })
      return posicion
    }

    function insertarEn(posicion: number, texto: string) {
      if (!editor || posicion < 0) return
      if (posicion > editor.state.doc.content.size) return
      editor.view.dispatch(editor.state.tr.insertText(texto, posicion))
    }

    return () => {
      temporizadores.current.forEach((x) => window.clearTimeout(x))
      temporizadores.current = []
    }
  }, [editor, mesa, lang, trailer, menosMovimiento, agregarComentario, toast, medir])

  // Limpieza dura al desmontar: ningún timer del guion sigue corriendo al salir.
  useEffect(() => {
    return () => {
      temporizadores.current.forEach((x) => window.clearTimeout(x))
      temporizadores.current = []
      guionCorrido.current = null
    }
  }, [])

  // Replay corto: recorre la línea de tiempo de versiones.
  useEffect(() => {
    if (replay === null) return
    if (replay >= VERSIONES_MESA.length) {
      const id = window.setTimeout(() => {
        setReplay(null)
        toast({ titulo: t('mesa.replayFin'), tono: 'ok' })
      }, 700)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setReplay((r) => (r === null ? null : r + 1)), 850)
    return () => window.clearTimeout(id)
  }, [replay, toast, t])

  useEffect(() => {
    if (!comentarioActivo) return
    const el = document.getElementById(`comentario-${comentarioActivo}`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [comentarioActivo])

  if (!mesa) {
    return (
      <EstadoVacio
        titulo={t('app.vacio')}
        accion={<Boton onClick={() => navigate('/workplace/mesas')}>{t('mesa.titulo')}</Boton>}
      />
    )
  }

  const conectados = participantes.filter((p) => p.presencia === 'conectado').length
  const sinResolver = comentarios.filter((c) => !c.resuelto).length
  const escribiendo = cursores.find((c) => c.escribiendo)

  return (
    <>
      <PreviewBanner
        id="mesa"
        titulo={t('mesa.banner')}
        bullets={[t('mesa.banner1'), t('mesa.banner2'), t('mesa.banner3')]}
      />

      {/* Cabecera de la mesa */}
      <header className="mb-5">
        <p className="kicker">{t('mesa.unaMesa')}</p>
        <h1 className="mt-2 font-black leading-[1.08]" style={{ fontSize: 'clamp(24px,5vw,38px)' }}>
          {campo(mesa, 'titulo', lang)}
        </h1>
        <span className="filete mt-3" />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {mesa.interuniversitario ? <ChipInteruniversitario /> : null}
          <Pildora tono={guardando ? 'champan' : 'mineral'} icono={guardando ? <Clock size={11} /> : <CheckCircle2 size={11} />}>
            {guardando ? t('mesa.guardando') : t('mesa.guardado')}
          </Pildora>
          {!puedeEditar ? <Pildora tono="terroso">{t('mesa.soloLectura')}</Pildora> : null}
          {versionRestaurada ? <Pildora tono="pizarra">{versionRestaurada}</Pildora> : null}
        </div>

        {/* Participantes con presencia y permisos */}
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-tinta-sec dark:text-marfil/50">
            <Users size={12} /> {t('mesa.participantes')} · {t('mesa.conectados', { n: conectados })}
          </p>
          {/* En móvil: fila compacta de avatares. En desktop: con nombre y permiso. */}
          <ul className="flex flex-wrap gap-2">
            {participantes.map((p) => {
              const q = persona(p.personaId)
              return (
                <li
                  key={p.personaId}
                  className="flex items-center gap-2 rounded-full border border-borde bg-white py-1 pl-1 pr-1 sm:pr-3 dark:border-[#27425a] dark:bg-noche-800"
                  title={`${q.nombre} · ${t(`permiso.${p.permiso}`)}`}
                >
                  <Avatar personaId={p.personaId} size={26} presencia />
                  <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-[160px] truncate text-[12px] font-bold leading-tight">{q.nombre}</span>
                    <span className="block text-[10.5px] leading-tight text-tinta-sec dark:text-marfil/50">
                      {t(`permiso.${p.permiso}`)}
                    </span>
                  </span>
                </li>
              )
            })}
            <li>
              <button
                type="button"
                onClick={() => setInvitarAbierto(true)}
                className="flex min-h-[36px] items-center gap-1.5 rounded-full border border-dashed border-borde px-3 text-[12px] font-bold text-tinta-sec transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a] dark:text-marfil/60"
              >
                <UserPlus size={13} />
                <span className="hidden sm:inline">{t('mesa.invitar')}</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Boton variante="mineral" tam="sm" onClick={() => setAsistente(true)}>
            <Sparkles size={14} />
            {t('mesa.pedirResumen')}
          </Boton>
          <Boton variante="secundario" tam="sm" onClick={() => setVersionesAbierto(true)}>
            <History size={14} />
            {t('mesa.versiones')}
          </Boton>
          <Boton variante="secundario" tam="sm" onClick={() => setReplay(0)}>
            <PlayCircle size={14} />
            {t('mesa.replay')}
          </Boton>
        </div>

        {escribiendo ? (
          <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-mineral">
            <span className="flex gap-0.5">
              <span className="h-1.5 w-1.5 animate-dots rounded-full bg-mineral" />
              <span className="h-1.5 w-1.5 animate-dots rounded-full bg-mineral [animation-delay:.15s]" />
              <span className="h-1.5 w-1.5 animate-dots rounded-full bg-mineral [animation-delay:.3s]" />
            </span>
            {t('mesa.escribiendo', { nombre: persona(escribiendo.personaId).nombre })}
          </p>
        ) : null}
      </header>

      {/* Documento + comentarios */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="min-w-0">
          {!esMobile ? (
            <div className="mb-3">
              <BarraFormato editor={editor} fija={false} offsetInferior={0} />
            </div>
          ) : null}

          <div
            ref={contenedorRef}
            className="card-sapio relative overflow-hidden px-4 py-5 sm:px-7 sm:py-8"
            data-trailer="mesa-documento"
          >
            {/* Anclas de los comentarios, por debajo del texto */}
            <div className="pointer-events-none absolute inset-0 px-4 py-5 sm:px-7 sm:py-8">
              <div className="relative h-full w-full">
                {anclas.map((a) =>
                  a.rects.map((r, i) => (
                    <span
                      key={a.id + i}
                      className={cn(
                        'absolute rounded-[2px]',
                        a.resuelto ? 'bg-mineral/[.10]' : 'bg-champan/25',
                        comentarioActivo === a.id && 'bg-mineral/25 outline outline-1 outline-mineral',
                      )}
                      style={{ top: r.top, left: r.left, width: r.width, height: r.height }}
                    />
                  )),
                )}
                {cursores.map((c) => (
                  <span key={c.personaId} className="absolute" style={{ top: c.rect.top, left: c.rect.left }}>
                    <span className="block h-[20px] w-[2px]" style={{ background: c.color }} />
                    <span
                      className={cn(
                        'absolute -top-[18px] whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-black leading-none text-white',
                        c.alIzquierda ? 'right-0' : 'left-0',
                      )}
                      style={{ background: c.color }}
                    >
                      {persona(c.personaId).nombre.replace(/^(Dr\.|Dra\.|Ing\.)\s*/, '')}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <EditorContent editor={editor} />

            {/* Clics sobre las anclas: capa superior solo en las zonas marcadas */}
            <div className="absolute inset-0 px-4 py-5 sm:px-7 sm:py-8" aria-hidden="true" style={{ pointerEvents: 'none' }}>
              <div className="relative h-full w-full">
                {anclas.map((a) =>
                  a.rects.map((r, i) => (
                    <button
                      key={'btn' + a.id + i}
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        setComentarioActivo(a.id)
                        if (esMobile) setHojaComentarios(true)
                      }}
                      className="absolute cursor-pointer"
                      style={{ top: r.top, left: r.left, width: r.width, height: r.height, pointerEvents: 'auto' }}
                    />
                  )),
                )}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[12px] text-tinta-sec dark:text-marfil/45">
            {t('mesa.docDe')} {persona(P.ale).nombre} · {t('mesa.actualizada')} {fechaCorta(mesa.actualizada, lang)}
          </p>
        </section>

        {/* Panel de comentarios: desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-[76px] flex h-[calc(100dvh-120px)] flex-col overflow-hidden rounded-2xl border border-borde bg-marfil-200/50 p-3.5 dark:border-[#27425a] dark:bg-noche-800/40">
            <PanelComentarios
              mesaId={mesa.id}
              comentarios={comentarios}
              activo={comentarioActivo}
              onActivar={setComentarioActivo}
            />
          </div>
        </aside>
      </div>

      <DevNotice
        className="mt-8"
        funcion={t('mesa.dev.tiempoReal')}
        hoy={t('mesa.dev.tiempoRealHoy')}
        alDesarrollar={t('mesa.dev.tiempoRealDesp')}
      />

      {/* Móvil: barra de formato fija + botón flotante de comentarios */}
      {esMobile && puedeEditar ? (
        <BarraFormato editor={editor} fija offsetInferior={offsetInferior} />
      ) : null}

      {esMobile ? (
        <button
          type="button"
          onClick={() => setHojaComentarios(true)}
          data-trailer="mesa-comentarios"
          className="fixed right-4 z-[46] inline-flex min-h-[48px] items-center gap-2 rounded-full border border-mineral bg-white px-4 text-[13px] font-black text-mineral shadow-sapio-lg dark:bg-noche-800"
          style={{ bottom: offsetInferior + (puedeEditar ? 64 : 12) }}
        >
          <MessageSquareText size={16} />
          {t('mesa.comentarios')}
          <span className="num grid h-5 min-w-[20px] place-items-center rounded-full bg-mineral px-1 text-[11px] text-white">
            {sinResolver}
          </span>
        </button>
      ) : null}

      <Hoja
        abierto={hojaComentarios}
        onCerrar={() => setHojaComentarios(false)}
        titulo={t('mesa.comentarios')}
        zIndex={80}
      >
        <PanelComentarios
          mesaId={mesa.id}
          comentarios={comentarios}
          activo={comentarioActivo}
          onActivar={setComentarioActivo}
        />
      </Hoja>

      {/* Historial de versiones */}
      <Modal
        abierto={versionesAbierto}
        onCerrar={() => setVersionesAbierto(false)}
        titulo={t('mesa.versiones')}
        ancho={560}
        pie={<Boton variante="secundario" onClick={() => setVersionesAbierto(false)}>{t('app.cerrar')}</Boton>}
      >
        <ol className="relative space-y-3.5 border-l border-borde pl-4 dark:border-[#27425a]">
          {VERSIONES_MESA.map((v, i) => (
            <li key={v.id} className="relative">
              <span
                className={cn(
                  'absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-noche-800',
                  i === 0 ? 'bg-mineral' : 'bg-borde dark:bg-[#27425a]',
                )}
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="num text-[13px] font-black">{v.etiqueta}</span>
                {v.actual ? <Pildora tono="mineral">{t('mesa.versionActual')}</Pildora> : null}
                <span className="num text-[12px] text-tinta-sec dark:text-marfil/50">
                  {fechaCorta(v.fecha, lang)} · {horaCorta(v.fecha, lang)}
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-tinta-sec dark:text-marfil/55">
                <Avatar personaId={v.autorId} size={18} /> {persona(v.autorId).nombre}
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-tinta-sec dark:text-marfil/60">
                {campo(v, 'nota', lang)}
              </p>
              {!v.actual ? (
                <button
                  type="button"
                  onClick={() => {
                    restaurar(v.etiqueta)
                    setVersionesAbierto(false)
                    toast({ titulo: t('mesa.restaurada', { v: v.etiqueta }), detalle: t('toast.accionMockDetalle'), tono: 'ok' })
                  }}
                  className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-borde px-2.5 text-[12px] font-bold transition-colors hover:border-mineral hover:text-mineral dark:border-[#27425a]"
                >
                  <RotateCcw size={12} />
                  {t('mesa.restaurar')}
                </button>
              ) : null}
            </li>
          ))}
        </ol>
      </Modal>

      {/* Invitar participantes */}
      <Modal
        abierto={invitarAbierto}
        onCerrar={() => setInvitarAbierto(false)}
        titulo={t('mesa.invitar')}
        ancho={520}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setInvitarAbierto(false)}>{t('app.cancelar')}</Boton>
            <Boton
              onClick={() => {
                invitarAMesa(mesa.id, invitado, permiso)
                setInvitarAbierto(false)
                toast({ titulo: t('mesa.invitado', { nombre: persona(invitado).nombre }), detalle: t('mesa.invitarDetalle'), tono: 'ok' })
              }}
            >
              {t('app.enviar')}
            </Boton>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/65">
            {t('mesa.invitarDetalle')}
          </p>
          <Campo label={t('mesa.participantes')}>
            <Select value={invitado} onChange={(e) => setInvitado(e.target.value)}>
              {PERSONAS.filter((p) => !participantes.some((x) => x.personaId === p.id) && p.rol !== 'super')
                .slice(0, 14)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} · {p.email}
                  </option>
                ))}
            </Select>
          </Campo>
          <Campo label={t('mesa.permiso')}>
            <Select value={permiso} onChange={(e) => setPermiso(e.target.value as 'lectura' | 'edicion')}>
              <option value="lectura">{t('permiso.lectura')}</option>
              <option value="edicion">{t('permiso.edicion')}</option>
            </Select>
          </Campo>
        </div>
      </Modal>

      {/* Replay del historial */}
      <Modal
        abierto={replay !== null}
        onCerrar={() => setReplay(null)}
        titulo={t('mesa.replay')}
        ancho={520}
        pie={<Boton variante="secundario" onClick={() => setReplay(null)}>{t('app.cerrar')}</Boton>}
      >
        <p className="mb-4 text-[13px] text-tinta-sec dark:text-marfil/65">{t('mesa.replayCorriendo')}</p>
        <ol className="space-y-2.5">
          {[...VERSIONES_MESA].reverse().map((v, i) => {
            const activo = replay !== null && i <= replay
            return (
              <li
                key={v.id}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border p-3 transition-[opacity,border-color] duration-500',
                  activo
                    ? 'border-mineral opacity-100'
                    : 'border-borde opacity-35 dark:border-[#27425a]',
                )}
              >
                <span className="num text-[13px] font-black">{v.etiqueta}</span>
                <Avatar personaId={v.autorId} size={22} />
                <span className="min-w-0 flex-1 text-[12.5px] leading-snug">{campo(v, 'nota', lang)}</span>
              </li>
            )
          })}
        </ol>
      </Modal>
    </>
  )
}
