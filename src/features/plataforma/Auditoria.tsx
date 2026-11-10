import { useMemo, useState } from 'react'
import { Download, Lock, ScrollText } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { campo } from '@/lib/texto'
import {
  AvatarUni, EncabezadoSeccion, EstadoBadge, EstadoVacio, Pildora, PreviewBanner, Tabla, Td, Th,
} from '@/components/ui/Piezas'
import { Boton } from '@/components/ui/Boton'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Campos'
import { AUDITORIA } from '@/data/gestion'
import { UNI_POR_ID } from '@/data/universidades'
import { diasDesdeHoy, fechaCorta, horaCorta } from '@/lib/fechas'
import { useEsMobile } from '@/lib/hooks'
import type { EventoAuditoria } from '@/data/tipos'
import { cn } from '@/lib/cn'

const TIPOS = ['todos', 'acceso', 'rol', 'eliminacion', 'bloqueo', 'config', 'exportacion'] as const

export function Auditoria() {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const esMobile = useEsMobile()
  // La previsualización del módulo 12 llega con el filtro de HOY puesto.
  const [periodo, setPeriodo] = useState<'hoy' | '7' | 'todo'>('hoy')
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>('todos')
  const [detalle, setDetalle] = useState<EventoAuditoria | null>(null)

  const visibles = useMemo(
    () =>
      AUDITORIA.filter((e) => {
        const d = Math.abs(diasDesdeHoy(e.fecha))
        if (periodo === 'hoy' && d !== 0) return false
        if (periodo === '7' && d > 7) return false
        return tipo === 'todos' || e.tipo === tipo
      }).sort((a, b) => b.fecha.getTime() - a.fecha.getTime()),
    [periodo, tipo],
  )

  function exportar() {
    const filas = [
      ['fecha', 'hora', 'usuario', 'universidad', 'tipo', 'accion', 'resultado', 'ip', 'detalle'],
      ...visibles.map((e) => [
        fechaCorta(e.fecha, lang),
        horaCorta(e.fecha, lang),
        e.usuarioNombre,
        UNI_POR_ID[e.universidadId]?.nombre ?? e.universidadId,
        t(`plat.aud.tipo.${e.tipo}`),
        campo(e, 'accion', lang),
        t(e.resultado === 'error' ? 'estado.errorRes' : `estado.${e.resultado}`),
        e.ip,
        campo(e, 'detalle', lang),
      ]),
    ]
    const csv = filas
      .map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `auditoria-sapio-${periodo}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast({ titulo: t('plat.aud.exportado'), detalle: `${visibles.length} ${t('app.resultados', { n: visibles.length }).split(' ')[1] ?? ''}`.trim(), tono: 'ok' })
  }

  return (
    <>
      <PreviewBanner
        id="plat-aud"
        titulo={t('plat.aud.banner')}
        bullets={[t('plat.aud.banner1'), t('plat.aud.banner2'), t('plat.aud.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rol, lang)}
        titulo={t('plat.aud.titulo')}
        bajada={t('plat.aud.bajada')}
        acciones={
          <Boton onClick={exportar}>
            <Download size={15} />
            {t('app.exportar')}
          </Boton>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-borde bg-white p-1 dark:border-[#27425a] dark:bg-noche-800">
          {(['hoy', '7', 'todo'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriodo(p)}
              className={cn(
                'min-h-[36px] shrink-0 rounded-lg px-3 text-[12.5px] font-bold transition-colors',
                periodo === p ? 'bg-mineral text-white' : 'text-tinta-sec dark:text-marfil/60',
              )}
            >
              {p === 'hoy' ? t('plat.aud.filtroHoy') : p === '7' ? t('plat.aud.filtro7') : t('plat.aud.filtroTodo')}
            </button>
          ))}
        </div>
        <Select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as (typeof TIPOS)[number])}
          aria-label={t('plat.aud.tipo')}
          className="w-auto"
        >
          {TIPOS.map((x) => (
            <option key={x} value={x}>
              {x === 'todos' ? t('app.todos') : t(`plat.aud.tipo.${x}`)}
            </option>
          ))}
        </Select>
        <Pildora tono="pizarra" icono={<Lock size={10} />} className="ml-auto">
          {t('plat.aud.inmutable')}
        </Pildora>
      </div>

      <p className="num mb-3 text-[12.5px] font-bold text-tinta-sec dark:text-marfil/50">
        {t('app.resultados', { n: visibles.length })}
      </p>

      {!visibles.length ? (
        <EstadoVacio titulo={t('app.sinResultados')} detalle={t('app.sinResultadosDetalle')} icono={<ScrollText size={20} />} />
      ) : esMobile ? (
        <ul className="space-y-2.5">
          {visibles.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => setDetalle(e)}
                className={cn('card-sapio w-full p-3.5 text-left', e.resultado === 'bloqueado' && 'border-terroso/40')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-black leading-snug">{campo(e, 'accion', lang)}</p>
                    <p className="truncate text-[12px] text-tinta-sec dark:text-marfil/55">{e.usuarioNombre}</p>
                  </div>
                  <EstadoBadge estado={e.resultado} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Pildora tono="neutro">{t(`plat.aud.tipo.${e.tipo}`)}</Pildora>
                  <span className="num text-[11.5px] text-tinta-sec dark:text-marfil/45">
                    {fechaCorta(e.fecha, lang)} · {horaCorta(e.fecha, lang)}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Tabla>
          <thead>
            <tr>
              <Th>{t('wp.cal.fecha')}</Th>
              <Th>{t('plat.aud.usuario')}</Th>
              <Th className="hidden lg:table-cell">{t('plat.aud.tenant')}</Th>
              <Th>{t('plat.aud.accion')}</Th>
              <Th>{t('plat.aud.resultado')}</Th>
              <Th className="hidden md:table-cell">IP</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((e) => (
              <tr
                key={e.id}
                className={cn(
                  'transition-colors hover:bg-marfil-200/50 dark:hover:bg-noche-700/40',
                  e.resultado === 'bloqueado' && 'bg-terroso/[.05]',
                )}
              >
                <Td className="num whitespace-nowrap text-[12.5px]">
                  {fechaCorta(e.fecha, lang)}
                  <span className="block text-[11px] text-tinta-sec dark:text-marfil/45">{horaCorta(e.fecha, lang)}</span>
                </Td>
                <Td className="text-[13px] font-bold">{e.usuarioNombre}</Td>
                <Td className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <AvatarUni
                      iniciales={UNI_POR_ID[e.universidadId]?.iniciales ?? '—'}
                      color={UNI_POR_ID[e.universidadId]?.colorPrimario ?? '#5E6B72'}
                      size={22}
                    />
                    <span className="truncate text-[12px]">{UNI_POR_ID[e.universidadId]?.nombre ?? '—'}</span>
                  </div>
                </Td>
                <Td className="text-[13px]">
                  {campo(e, 'accion', lang)}
                  <span className="mt-0.5 block">
                    <Pildora tono="neutro">{t(`plat.aud.tipo.${e.tipo}`)}</Pildora>
                  </span>
                </Td>
                <Td>
                  <EstadoBadge estado={e.resultado} />
                </Td>
                <Td className="num hidden text-[12px] text-tinta-sec md:table-cell dark:text-marfil/55">{e.ip}</Td>
                <Td>
                  <Boton tam="sm" variante="secundario" onClick={() => setDetalle(e)}>
                    {t('app.ver')}
                  </Boton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Tabla>
      )}

      <Modal
        abierto={Boolean(detalle)}
        onCerrar={() => setDetalle(null)}
        titulo={t('plat.aud.detalle')}
        ancho={560}
        pie={<Boton variante="secundario" onClick={() => setDetalle(null)}>{t('app.cerrar')}</Boton>}
      >
        {detalle ? (
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-xl border border-pizarra/25 bg-pizarra/[.06] px-3 py-2 text-[12.5px] font-bold dark:border-[#27425a] dark:bg-noche-700/50">
              <Lock size={13} className="shrink-0 text-pizarra dark:text-[#8fb6cf]" />
              {t('plat.aud.inmutable')} · {t('plat.aud.inmutableDet')}
            </p>
            <dl className="grid grid-cols-2 gap-3 text-[13px]">
              <div className="col-span-2">
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plat.aud.accion')}</dt>
                <dd className="mt-1 text-[15px] font-black">{campo(detalle, 'accion', lang)}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plat.aud.usuario')}</dt>
                <dd className="mt-1 font-bold">{detalle.usuarioNombre}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plat.aud.tenant')}</dt>
                <dd className="mt-1 truncate font-bold">{UNI_POR_ID[detalle.universidadId]?.nombre ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('wp.cal.fecha')}</dt>
                <dd className="num mt-1 font-bold">
                  {fechaCorta(detalle.fecha, lang)} · {horaCorta(detalle.fecha, lang)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">IP</dt>
                <dd className="num mt-1 font-bold">{detalle.ip}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plat.aud.resultado')}</dt>
                <dd className="mt-1">
                  <EstadoBadge estado={detalle.resultado} />
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">{t('plat.aud.detalle')}</dt>
                <dd className="mt-1 leading-relaxed">{campo(detalle, 'detalle', lang)}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
