import { Sparkles } from 'lucide-react'
import { useT } from '@/i18n'
import { Isotipo } from '@/assets/brand/Isotipo'
import { cn } from '@/lib/cn'
import type { Mensaje } from './motor'

export function Burbujas({ mensajes, pensando }: { mensajes: Mensaje[]; pensando: boolean }) {
  const { t } = useT()
  return (
    <ul className="space-y-2.5">
      {mensajes.map((m) => (
        <li key={m.id} className={cn('flex gap-2', m.de === 'yo' ? 'justify-end' : 'justify-start')}>
          {m.de === 'asistente' ? (
            <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-noche dark:bg-marfil">
              <Isotipo size={13} color="#C9A974" />
            </span>
          ) : null}
          <span
            className={cn(
              'max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed',
              m.de === 'yo'
                ? 'rounded-br-md bg-mineral text-white'
                : 'rounded-bl-md border border-borde bg-white text-noche dark:border-[#27425a] dark:bg-noche-700 dark:text-marfil',
            )}
          >
            {m.texto}
            {m.nota ? (
              <span className="mt-2 flex items-center gap-1.5 border-t border-borde pt-2 text-[12px] font-bold text-mineral-texto dark:border-[#27425a]">
                <Sparkles size={12} /> {m.nota}
              </span>
            ) : null}
          </span>
        </li>
      ))}
      {pensando ? (
        <li className="flex gap-2">
          <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-noche dark:bg-marfil">
            <Isotipo size={13} color="#C9A974" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-borde bg-white px-3.5 py-3 dark:border-[#27425a] dark:bg-noche-700">
            <span className="sr-only">{t('asist.pensando')}</span>
            <span className="h-1.5 w-1.5 animate-dots rounded-full bg-tinta-sec" />
            <span className="h-1.5 w-1.5 animate-dots rounded-full bg-tinta-sec [animation-delay:.18s]" />
            <span className="h-1.5 w-1.5 animate-dots rounded-full bg-tinta-sec [animation-delay:.36s]" />
          </span>
        </li>
      ) : null}
    </ul>
  )
}

export function MedidorUso({ usadas, limite, pct }: { usadas: number; limite: number; pct: number }) {
  const { t } = useT()
  const cerca = pct >= 80
  return (
    <div className="rounded-xl border border-borde bg-marfil-200/60 p-2.5 dark:border-[#27425a] dark:bg-noche-700/50">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/55">
          {t('asist.usoPlan')}
        </p>
        <p className="num text-[11.5px] font-bold">{pct}%</p>
      </div>
      <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-white dark:bg-noche-800">
        <span className={cn('block h-full rounded-full', cerca ? 'bg-champan' : 'bg-mineral')} style={{ width: `${pct}%` }} />
      </span>
      <p className="num mt-1.5 text-[11.5px] text-tinta-sec dark:text-marfil/50">
        {t('asist.usoDetalle', { usadas, limite })}
      </p>
      {cerca ? <p className="mt-1 text-[11.5px] font-bold text-champan-700 dark:text-champan">{t('asist.limiteCerca')}</p> : null}
    </div>
  )
}
