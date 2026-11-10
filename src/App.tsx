import { HashRouter } from 'react-router-dom'
import { Rutas } from './rutas'
import { Trailer } from '@/features/trailer/Trailer'
import { useUI } from '@/store/ui'

/**
 * El trailer se monta ACÁ, fuera del Shell: si viviera dentro, cambiar de modo
 * (app ↔ campus) lo remontaría y el motor de escenas volvería a la escena 1.
 */
function CapaTrailer() {
  const abierto = useUI((s) => s.trailerAbierto)
  return abierto ? <Trailer /> : null
}

export default function App() {
  return (
    <HashRouter>
      <Rutas />
      <CapaTrailer />
    </HashRouter>
  )
}
