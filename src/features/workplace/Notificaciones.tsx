import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, BellOff, Check, Mail } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useDatos } from '@/store/datos'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import { EncabezadoSeccion, PreviewBanner, Pildora, DevNotice, EstadoVacio } from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { NOTIFICACIONES } from '@/data/gestion'
import { fechaCorta, horaCorta } from '@/lib/fechas'
import { cn } from '@/lib/cn'

const TIPOS = ['todas', 'mesa', 'tarea', 'chat', 'invitacion', 'suscripcion', 'sistema'] as const

export function Notificaciones() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const leidas = useDatos((s) => s.notificacionesLeidas)
  const marcarLeida = useDatos((s) => s.marcarLeida)
  const marcarTodas = useDatos((s) => s.marcarTodasLeidas)
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>('todas')
  const [soloSinLeer, setSoloSinLeer] = useState(false)

  const mias = useMemo(
    () =>
      NOTIFICACIONES.filter((n) => n.paraRoles.includes(rol)).sort(
        (a, b) => b.fecha.getTime() - a.fecha.getTime(),
      ),
    [rol],
  )

  const visibles = mias.filter((n) => {
    const leida = n.leida || leidas.includes(n.id)
    if (soloSinLeer && leida) return false
    return tipo === 'todas' || n.tipo === tipo
  })

  const sinLeer = mias.filter((n) => !n.leida && !leidas.includes(n.id)).length

  return (
    <>
      <PreviewBanner
        id="wp-notif"
        titulo={t('wp.notif.banner')}
        bullets={[t('wp.notif.banner1'), t('wp.notif.banner2'), t('wp.notif.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('wp.notif.titulo')}
        bajada={sinLeer ? t('wp.mensajesSinLeer') + ': ' + sinLeer : undefined}
        acciones={
          <Boton
            variante="secundario"
            onClick={() => {
              marcarTodas(mias.map((n) => n.id))
              toast({ titulo: t('wp.notif.marcarTodas'), tono: 'ok' })
            }}
          >
            <Check size={15} />
            {t('wp.notif.marcarTodas')}
          </Boton>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="scroll-x-contenida sin-scrollbar -mx-4 flex gap-2 px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {TIPOS.map((x) => (
            <button
              key={x}
              type="button"
              onClick={() => setTipo(x)}
              className={cn(
                'min-h-[40px] shrink-0 rounded-full border px-3.5 text-[13px] font-bold transition-colors',
                tipo === x
                  ? 'border-mineral bg-mineral text-white'
                  : 'border-borde bg-white text-tinta-sec hover:border-mineral dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil/65',
              )}
            >
              {x === 'todas' ? t('app.todas') : t(`nav.${x === 'mesa' ? 'mesasCorto' : x === 'tarea' ? 'tareas' : x === 'chat' ? 'chat' : x === 'invitacion' ? 'invitaciones' : x === 'suscripcion' ? 'suscripcion' : 'seguridad'}`)}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSoloSinLeer((v) => !v)}
          className={cn(
            'ml-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-bold transition-colors',
            soloSinLeer ? 'border-mineral bg-mineral text-white' : 'border-borde bg-white text-tinta-sec dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil/65',
          )}
        >
          <BellOff size={14} />
          {t('wp.notif.sinLeer')}
        </button>
      </div>

      {!visibles.length ? (
        <EstadoVacio titulo={t('wp.notif.vacio')} icono={<Bell size={20} />} />
      ) : (
        <ul className="space-y-2.5">
          {visibles.map((n) => {
            const leida = n.leida || leidas.includes(n.id)
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    marcarLeida(n.id)
                    if (n.ruta) navigate(n.ruta)
                    else toast({ titulo: t('wp.notif.leida'), tono: 'ok' })
                  }}
                  className={cn(
                    'card-sapio flex w-full min-h-[64px] items-start gap-3 p-3.5 text-left transition-[border-color] hover:border-mineral sm:p-4',
                    !leida && 'border-l-[3px] border-l-mineral',
                  )}
                >
                  {!leida ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-mineral" /> : <span className="mt-2 h-2 w-2 shrink-0" />}
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-[14.5px] leading-snug', leida ? 'font-bold text-tinta-sec dark:text-marfil/65' : 'font-black')}>
                      {campo(n, 'titulo', lang)}
                    </span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/55">
                      {campo(n, 'cuerpo', lang)}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="num text-[11.5px] text-tinta-sec dark:text-marfil/45">
                        {fechaCorta(n.fecha, lang)} · {horaCorta(n.fecha, lang)}
                      </span>
                      {n.porCorreo ? (
                        <Pildora tono="champan" icono={<Mail size={10} />}>
                          {t('wp.notif.porCorreo')}
                        </Pildora>
                      ) : null}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <DevNotice
        className="mt-8"
        funcion={t('wp.dev.correo')}
        hoy={t('wp.dev.correoHoy')}
        alDesarrollar={t('wp.dev.correoDesp')}
      />
    </>
  )
}
