import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const variantes = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-[background-color,color,border-color,box-shadow,scale] duration-200 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[.985] focus-visible:outline-mineral',
  {
    variants: {
      variante: {
        primario:
          'bg-noche text-marfil hover:bg-[#1b3147] dark:bg-marfil dark:text-noche dark:hover:bg-white',
        mineral: 'bg-mineral text-white hover:bg-mineral-600',
        secundario:
          'bg-white text-noche border border-borde hover:border-mineral hover:text-mineral dark:bg-noche-800 dark:text-marfil dark:border-[#27425a] dark:hover:border-mineral',
        fantasma:
          'bg-transparent text-tinta-sec hover:bg-marfil-200 hover:text-noche dark:text-marfil/70 dark:hover:bg-noche-700 dark:hover:text-marfil',
        contorno:
          'bg-transparent text-noche border border-noche hover:bg-noche hover:text-marfil dark:text-marfil dark:border-marfil/40 dark:hover:bg-marfil dark:hover:text-noche',
        peligro: 'bg-terroso text-white hover:bg-terroso-600',
        enlace: 'bg-transparent text-mineral underline-offset-4 hover:underline px-0',
      },
      tam: {
        sm: 'h-9 px-3 text-[13px]',
        md: 'min-h-[44px] px-4 text-sm',
        lg: 'min-h-[48px] px-6 text-[15px]',
        icono: 'h-11 w-11 p-0',
        iconoSm: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: { variante: 'primario', tam: 'md' },
  },
)

export interface BotonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantes> {}

export const Boton = React.forwardRef<HTMLButtonElement, BotonProps>(
  ({ className, variante, tam, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={cn(variantes({ variante, tam }), className)} {...props} />
  ),
)
Boton.displayName = 'Boton'

export interface EnlaceBotonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof variantes> {}

export const EnlaceBoton = React.forwardRef<HTMLAnchorElement, EnlaceBotonProps>(
  ({ className, variante, tam, ...props }, ref) => (
    <a ref={ref} className={cn(variantes({ variante, tam }), className)} {...props} />
  ),
)
EnlaceBoton.displayName = 'EnlaceBoton'

export { variantes as botonVariantes }
