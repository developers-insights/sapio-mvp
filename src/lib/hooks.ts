import { useEffect, useState } from 'react'

export function useMedia(query: string) {
  const [coincide, setCoincide] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setCoincide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return coincide
}

export const useEsMobile = () => useMedia('(max-width: 1023px)')
export const useEsFino = () => useMedia('(max-width: 639px)')
export const useMenosMovimiento = () => useMedia('(prefers-reduced-motion: reduce)')

/** Altura real de la bottom-nav + safe area, para apilar barras fijas sin taparse. */
export function useOffsetInferior() {
  const esMobile = useEsMobile()
  const [safe, setSafe] = useState(0)
  useEffect(() => {
    const el = document.createElement('div')
    el.style.cssText = 'position:fixed;bottom:0;height:env(safe-area-inset-bottom);visibility:hidden'
    document.body.appendChild(el)
    setSafe(el.getBoundingClientRect().height || 0)
    return () => {
      el.remove()
    }
  }, [])
  return esMobile ? 60 + safe : 0
}
