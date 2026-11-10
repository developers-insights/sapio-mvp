import { useState } from 'react'
import { ChevronDown, History, ServerCog } from 'lucide-react'
import { useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { kickerRol } from '@/lib/rol'
import { Avatar, EncabezadoSeccion, Pildora, PreviewBanner } from '@/components/ui/Piezas'
import { Interruptor } from '@/components/ui/Campos'
import { persona, P } from '@/data/personas'
import { dia, fechaCorta, horaCorta } from '@/lib/fechas'
import { useEsMobile } from '@/lib/hooks'
import type { Role } from '@/data/tipos'
import { cn } from '@/lib/cn'

const ROLES: Role[] = ['super', 'universidad', 'profesor', 'estudiante', 'colaborador']
const ACCIONES = ['ver', 'crear', 'editar', 'eliminar'] as const
const MODULOS = [
  'campus', 'miembros', 'invitaciones', 'workplace', 'mesas', 'chat', 'documentos', 'suscripcion', 'auditoria',
] as const

type Accion = (typeof ACCIONES)[number]
type Modulo = (typeof MODULOS)[number]

/** Matriz base de permisos del mock. */
const MATRIZ: Record<Role, Partial<Record<Modulo, Accion[]>>> = {
  super: {
    campus: ['ver', 'crear', 'editar', 'eliminar'],
    miembros: ['ver', 'crear', 'editar', 'eliminar'],
    invitaciones: ['ver', 'crear', 'editar', 'eliminar'],
    workplace: ['ver'],
    mesas: ['ver'],
    chat: ['ver'],
    documentos: ['ver'],
    suscripcion: ['ver', 'crear', 'editar', 'eliminar'],
    auditoria: ['ver'],
  },
  universidad: {
    campus: ['ver', 'editar'],
    miembros: ['ver', 'crear', 'editar', 'eliminar'],
    invitaciones: ['ver', 'crear', 'editar', 'eliminar'],
    workplace: ['ver'],
    mesas: ['ver'],
    chat: ['ver'],
    documentos: ['ver'],
    suscripcion: ['ver', 'editar'],
    auditoria: ['ver'],
  },
  profesor: {
    miembros: ['ver'],
    invitaciones: ['ver', 'crear'],
    workplace: ['ver', 'crear', 'editar'],
    mesas: ['ver', 'crear', 'editar'],
    chat: ['ver', 'crear'],
    documentos: ['ver', 'crear', 'editar', 'eliminar'],
  },
  estudiante: {
    workplace: ['ver', 'crear', 'editar'],
    mesas: ['ver', 'crear', 'editar'],
    chat: ['ver', 'crear'],
    documentos: ['ver', 'crear', 'editar'],
  },
  colaborador: {
    workplace: ['ver'],
    mesas: ['ver'],
    chat: ['ver', 'crear'],
    documentos: ['ver', 'editar'],
  },
}

const HISTORIAL = [
  { id: 'r1', personaId: 'p-prof-2', de: 'estudiante' as Role, a: 'profesor' as Role, porId: P.laura, fecha: dia(-1, 16, 20) },
  { id: 'r2', personaId: P.rivas, de: 'estudiante' as Role, a: 'colaborador' as Role, porId: P.super, fecha: dia(-4, 15, 0) },
  { id: 'r3', personaId: 'p-est-9', de: 'colaborador' as Role, a: 'estudiante' as Role, porId: P.laura, fecha: dia(-8, 10, 30) },
  { id: 'r4', personaId: 'p-prof-7', de: 'estudiante' as Role, a: 'profesor' as Role, porId: P.super, fecha: dia(-17, 12, 5) },
]

export function PlataformaRoles() {
  const { t, lang } = useT()
  const rolActivo = useUI((s) => s.rol)
  const toast = useUI((s) => s.toast)
  const esMobile = useEsMobile()
  const [extra, setExtra] = useState<Record<string, boolean>>({})
  const [abierto, setAbierto] = useState<Role | null>('estudiante')

  const tiene = (rol: Role, mod: Modulo, acc: Accion) => {
    const clave = `${rol}.${mod}.${acc}`
    if (clave in extra) return extra[clave]
    return (MATRIZ[rol][mod] ?? []).includes(acc)
  }

  const alternar = (rol: Role, mod: Modulo, acc: Accion) => {
    const clave = `${rol}.${mod}.${acc}`
    setExtra((e) => ({ ...e, [clave]: !tiene(rol, mod, acc) }))
    toast({ titulo: t('plat.roles.cambiado'), detalle: t('plat.roles.nota'), tono: 'ok' })
  }

  return (
    <>
      <PreviewBanner
        id="plat-roles"
        titulo={t('plat.roles.banner')}
        bullets={[t('plat.roles.banner1'), t('plat.roles.banner2'), t('plat.roles.banner3')]}
      />
      <EncabezadoSeccion
        kicker={kickerRol(rolActivo, lang)}
        titulo={t('plat.roles.titulo')}
        bajada={t('plat.roles.bajada')}
      />

      <p className="mb-5 inline-flex items-center gap-2 rounded-xl border border-pizarra/25 bg-pizarra/[.06] px-3 py-2 text-[12.5px] font-bold dark:border-[#27425a] dark:bg-noche-800/60">
        <ServerCog size={14} className="shrink-0 text-pizarra dark:text-[#8fb6cf]" />
        {t('plat.roles.nota')}
      </p>

      {esMobile ? (
        <div className="space-y-2.5">
          {ROLES.map((r) => (
            <section key={r} className="card-sapio overflow-hidden">
              <button
                type="button"
                onClick={() => setAbierto(abierto === r ? null : r)}
                aria-expanded={abierto === r}
                className="flex w-full min-h-[52px] items-center gap-2 px-4 py-3 text-left"
              >
                <span className="min-w-0 flex-1 text-[14px] font-black">{t(`rol.${r}`)}</span>
                <ChevronDown size={16} className={cn('shrink-0 transition-transform', abierto === r && 'rotate-180')} />
              </button>
              {abierto === r ? (
                <div className="border-t border-borde px-4 py-3 dark:border-[#27425a]">
                  <ul className="space-y-3.5">
                    {MODULOS.map((m) => (
                      <li key={m}>
                        <p className="text-[12.5px] font-bold">{t(`plat.mod.${m}`)}</p>
                        <ul className="mt-2 grid grid-cols-2 gap-2">
                          {ACCIONES.map((a) => (
                            <li key={a} className="flex min-h-[40px] items-center gap-2">
                              <Interruptor
                                tam="sm"
                                activo={tiene(r, m, a)}
                                label={`${t(`rol.${r}`)} · ${t(`plat.mod.${m}`)} · ${t(`permiso.${a}`)}`}
                                onChange={() => alternar(r, m, a)}
                              />
                              <span className="text-[12px] text-tinta-sec dark:text-marfil/60">{t(`permiso.${a}`)}</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      ) : (
        <div className="scroll-x-contenida card-sapio">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 border-b border-borde bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:border-[#27425a] dark:bg-noche-800 dark:text-marfil/55">
                  {t('plat.roles.modulo')}
                </th>
                {ROLES.map((r) => (
                  <th
                    key={r}
                    colSpan={1}
                    className="border-b border-l border-borde px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-tinta-sec dark:border-[#27425a] dark:text-marfil/55"
                  >
                    {t(`rol.${r === 'universidad' ? 'universidad.corto' : r}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULOS.map((m) => (
                <tr key={m}>
                  <td className="sticky left-0 z-10 border-b border-borde/70 bg-white px-4 py-3 text-[13px] font-bold dark:border-[#27425a]/70 dark:bg-noche-800">
                    {t(`plat.mod.${m}`)}
                  </td>
                  {ROLES.map((r) => (
                    <td key={r} className="border-b border-l border-borde/70 px-2 py-2.5 dark:border-[#27425a]/70">
                      <div className="flex flex-wrap justify-center gap-1">
                        {ACCIONES.map((a) => {
                          const activo = tiene(r, m, a)
                          return (
                            <button
                              key={a}
                              type="button"
                              onClick={() => alternar(r, m, a)}
                              title={`${t(`rol.${r}`)} · ${t(`plat.mod.${m}`)} · ${t(`permiso.${a}`)}`}
                              aria-pressed={activo}
                              className={cn(
                                'grid h-7 w-7 place-items-center rounded-md text-[10px] font-black uppercase transition-colors',
                                activo
                                  ? 'bg-mineral text-white'
                                  : 'bg-marfil-200 text-tinta-sec/60 hover:bg-marfil-300 dark:bg-noche-700 dark:text-marfil/35',
                              )}
                            >
                              {t(`permiso.abr.${a}`)}
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {ACCIONES.map((a) => (
          <Pildora key={a} tono="neutro">
            {t(`permiso.abr.${a}`)} · {t(`permiso.${a}`)}
          </Pildora>
        ))}
      </div>

      <section className="card-sapio mt-6 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          <History size={14} className="text-mineral" /> {t('plat.roles.historial')}
        </h2>
        <ol className="mt-3 space-y-3 border-l border-borde pl-4 dark:border-[#27425a]">
          {HISTORIAL.map((h) => (
            <li key={h.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-mineral dark:border-noche-800" />
              <div className="flex flex-wrap items-center gap-2">
                <Avatar personaId={h.personaId} size={22} />
                <span className="text-[13px] font-bold">{persona(h.personaId).nombre}</span>
                <Pildora tono="neutro">{t(`rol.${h.de}`)}</Pildora>
                <span aria-hidden="true">→</span>
                <Pildora tono="mineral">{t(`rol.${h.a}`)}</Pildora>
              </div>
              <p className="num mt-1 text-[11.5px] text-tinta-sec dark:text-marfil/45">
                {t('uni.roles.por')} {persona(h.porId).nombre} · {fechaCorta(h.fecha, lang)} {horaCorta(h.fecha, lang)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
