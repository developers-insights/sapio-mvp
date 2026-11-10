import * as React from 'react'
import { cn } from '@/lib/cn'

const base =
  'w-full rounded-xl border border-borde bg-white px-3 py-2.5 text-sm text-noche placeholder:text-tinta-sec/60 transition-colors focus:border-mineral focus:outline-none focus:ring-2 focus:ring-mineral/25 dark:bg-noche-800 dark:text-marfil dark:border-[#27425a] dark:placeholder:text-marfil/35'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(base, 'min-h-[44px]', className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(base, 'min-h-[96px] resize-y', className)} {...props} />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select ref={ref} className={cn(base, 'min-h-[44px] pr-8', className)} {...props}>
    {children}
  </select>
))
Select.displayName = 'Select'

export function Etiqueta({
  children,
  className,
  htmlFor,
}: {
  children: React.ReactNode
  className?: string
  htmlFor?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60',
        className,
      )}
    >
      {children}
    </label>
  )
}

export function Campo({
  label,
  children,
  ayuda,
  className,
}: {
  label: string
  children: React.ReactNode
  ayuda?: string
  className?: string
}) {
  const id = React.useId()
  return (
    <div className={className}>
      <Etiqueta htmlFor={id}>{label}</Etiqueta>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id })
        : children}
      {ayuda ? <p className="mt-1.5 text-xs text-tinta-sec dark:text-marfil/50">{ayuda}</p> : null}
    </div>
  )
}

export function Interruptor({
  activo,
  onChange,
  label,
  tam = 'md',
}: {
  activo: boolean
  onChange: (v: boolean) => void
  label: string
  tam?: 'sm' | 'md'
}) {
  const ancho = tam === 'sm' ? 'w-9 h-5' : 'w-11 h-6'
  const bola = tam === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={label}
      onClick={() => onChange(!activo)}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full border transition-colors duration-200',
        ancho,
        activo
          ? 'border-mineral bg-mineral'
          : 'border-borde bg-marfil-200 dark:border-[#27425a] dark:bg-noche-700',
      )}
    >
      <span
        className={cn(
          'absolute rounded-full bg-white shadow-sm transition-[left] duration-200',
          bola,
          tam === 'sm' ? 'h-3.5 w-3.5' : 'h-[18px] w-[18px]',
        )}
        style={{ left: activo ? 'calc(100% - 20px)' : '3px' }}
      />
    </button>
  )
}

export function Casilla({
  activo,
  onChange,
  label,
  id,
}: {
  activo: boolean
  onChange: (v: boolean) => void
  label: string
  id?: string
}) {
  const auto = React.useId()
  const real = id ?? auto
  return (
    <label
      htmlFor={real}
      className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-sm text-tinta-sec dark:text-marfil/70"
    >
      <input
        id={real}
        type="checkbox"
        checked={activo}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-borde accent-mineral"
      />
      {label}
    </label>
  )
}
