import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { BottomNav } from './BottomNav'
import { RetornoPreview } from './RetornoPreview'
import { Toaster } from '@/components/ui/Toaster'
import { WelcomeModal } from '@/components/WelcomeModal'
import { Buscador } from '@/features/buscador/Buscador'
import { AsistenteFlotante } from '@/features/asistente/AsistenteFlotante'
import { Tour } from '@/features/tour/Tour'
import { Trailer } from '@/features/trailer/Trailer'
import { useUI } from '@/store/ui'
import { puedeVer } from '@/lib/navegacion'
import { GuardaRol } from './GuardaRol'

export function Shell() {
  const modo = useUI((s) => s.modo)
  const rol = useUI((s) => s.rol)
  const authed = useUI((s) => s.authed)
  const setBuscador = useUI((s) => s.setBuscador)
  const trailer = useUI((s) => s.trailerAbierto)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authed) navigate('/login', { replace: true })
  }, [authed, navigate])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setBuscador(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setBuscador])

  // El layout lo decide la RUTA (un enlace directo a /campus/... también entra
  // sin shell de app). `modo` sigue en el store porque la previsualización de
  // la Propuesta guarda y restaura el modo previo.
  const enCampus = pathname.startsWith('/campus/') || modo === 'campus'
  if (enCampus) {
    return (
      <>
        <Outlet />
        <Toaster />
        <Tour />
        {trailer ? <Trailer /> : null}
      </>
    )
  }

  const permitido = puedeVer(rol, pathname)

  return (
    <div className="flex min-h-[100dvh] bg-marfil dark:bg-noche">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <RetornoPreview />
        <main
          className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 sm:pt-7 lg:pb-12"
          style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto w-full max-w-[1180px]">
            {permitido ? <Outlet /> : <GuardaRol />}
          </div>
        </main>
      </div>
      <BottomNav />
      <AsistenteFlotante />
      <Buscador />
      <WelcomeModal />
      <Tour />
      {trailer ? <Trailer /> : null}
      <Toaster />
    </div>
  )
}
