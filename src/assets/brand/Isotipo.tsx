import { useId } from 'react'
import { cn } from '@/lib/cn'

/**
 * Isotipo Sapio: un punto (círculo) arriba y debajo una campana con dos alas
 * ascendentes que dejan en el centro una hoja vertical en negativo.
 * Manual págs. 1, 6 y 17. Tamaño mínimo digital: 24px (BRAND.logo).
 * Nunca estirar, rotar ni deformar: siempre proporción 100:124 vía viewBox.
 */
export function Isotipo({
  size = 28,
  className,
  color = 'currentColor',
  title,
}: {
  size?: number
  className?: string
  color?: string
  title?: string
}) {
  const id = useId().replace(/[:]/g, '')
  const h = Math.round((size * 124) / 100)
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 100 124"
      fill="none"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={cn('shrink-0', className)}
    >
      {title ? <title>{title}</title> : null}
      <mask id={`hoja-${id}`}>
        <rect x="-20" y="-20" width="140" height="170" fill="#fff" />
        <path
          d="M50 40 C 56 60 58 84 56 106 L 50 117 L 44 106 C 42 84 44 60 50 40 Z"
          fill="#000"
        />
      </mask>
      <circle cx="50" cy="15" r="11.5" fill={color} />
      <path
        d="M50 26 C 33 29 15 54 10 98 L 18 106 L 44 106 L 50 117 L 56 106 L 82 106 L 90 98 C 85 54 67 29 50 26 Z"
        fill={color}
        mask={`url(#hoja-${id})`}
      />
    </svg>
  )
}

/** Wordmark "sapio" en minúsculas, Lato Heavy. */
export function Wordmark({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn('font-sans font-black leading-none tracking-[-0.03em]', className)}
      style={style}
    >
      sapio
    </span>
  )
}

/**
 * Firma completa (isotipo + wordmark). Tamaño mínimo 110px de ancho.
 * El gap respeta el área de protección: 3× el diámetro del punto.
 */
export function Firma({
  size = 22,
  className,
  colorIsotipo,
  wordmarkClassName,
}: {
  size?: number
  className?: string
  colorIsotipo?: string
  wordmarkClassName?: string
}) {
  // diámetro del punto = 23/100 del ancho del isotipo
  const punto = (size * 23) / 100
  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: punto * 0.8 }}>
      <Isotipo size={size} color={colorIsotipo} />
      <Wordmark className={wordmarkClassName} style={{ fontSize: size * 1.34 }} />
    </span>
  )
}

/**
 * Anillos concéntricos finos del manual (portada). Motivo animado: se expanden
 * muy lento. Se apagan con prefers-reduced-motion vía la clase de animación.
 */
export function Anillos({
  className,
  cantidad = 7,
  color = 'rgba(201,169,116,.26)',
  animado = true,
}: {
  className?: string
  cantidad?: number
  color?: string
  animado?: boolean
}) {
  const anillos = Array.from({ length: cantidad }, (_, i) => i)
  return (
    <svg
      viewBox="0 0 600 600"
      className={cn('pointer-events-none select-none', className)}
      aria-hidden="true"
    >
      {anillos.map((i) => (
        <circle
          key={i}
          cx="300"
          cy="300"
          r={40 + i * 38}
          fill="none"
          stroke={color}
          strokeWidth="1"
          style={
            animado
              ? {
                  transformOrigin: '300px 300px',
                  animation: `anillo-lento ${16 + i * 2}s cubic-bezier(.4,0,.2,1) ${i * 0.9}s infinite`,
                }
              : undefined
          }
        />
      ))}
      <style>{`@keyframes anillo-lento{0%{transform:scale(.86);opacity:0}18%{opacity:1}100%{transform:scale(1.5);opacity:0}}`}</style>
    </svg>
  )
}
