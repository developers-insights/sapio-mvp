import { useNavigate } from 'react-router-dom'
import { ChevronsUpDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { RUTA_DEFAULT, useUI } from '@/store/ui'
import type { Role } from '@/data/tipos'
import { useT } from '@/i18n'
import { persona, USUARIO_POR_ROL } from '@/data/personas'
import { Avatar } from '@/components/ui/Piezas'
import { cn } from '@/lib/cn'

const ROLES: Role[] = ['super', 'universidad', 'profesor', 'estudiante', 'colaborador']

export function RoleSwitcher({ compacto = false }: { compacto?: boolean }) {
  const { t, lang } = useT()
  const rol = useUI((s) => s.rol)
  const setRol = useUI((s) => s.setRol)
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierto) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false)
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [abierto])

  function elegir(nuevo: Role) {
    setAbierto(false)
    setRol(nuevo)
    // resetea a la vista default del rol
    navigate(RUTA_DEFAULT[nuevo])
  }

  const actual = persona(USUARIO_POR_ROL[rol])

  return (
    <div className="relative" ref={ref} data-tour="switch-user">
      <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-tinta-sec dark:text-marfil/45">
        {t('rol.verComo')}
      </p>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label={t('rol.cambiar')}
        className="flex w-full min-h-[44px] items-center gap-2.5 rounded-xl border border-borde bg-white px-2.5 py-2 text-left transition-colors hover:border-mineral dark:border-[#27425a] dark:bg-noche-800"
      >
        <Avatar personaId={actual.id} size={30} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold leading-tight">{t(`rol.${rol}`)}</span>
          <span className="block truncate text-[11px] leading-tight text-tinta-sec dark:text-marfil/50">
            {actual.nombre}
          </span>
        </span>
        <ChevronsUpDown size={15} className="shrink-0 text-tinta-sec" />
      </button>

      {abierto ? (
        <div
          role="listbox"
          className={cn(
            'absolute z-[80] w-full overflow-hidden rounded-xl border border-borde bg-white shadow-sapio-lg animate-fade-up dark:border-[#27425a] dark:bg-noche-800',
            compacto ? 'top-[calc(100%+6px)]' : 'bottom-[calc(100%+6px)]',
          )}
        >
          {ROLES.map((r) => {
            const p = persona(USUARIO_POR_ROL[r])
            return (
              <button
                key={r}
                type="button"
                role="option"
                aria-selected={r === rol}
                onClick={() => elegir(r)}
                className="flex w-full min-h-[52px] items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-marfil-200 dark:hover:bg-noche-700"
              >
                <Avatar personaId={p.id} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold leading-tight">{t(`rol.${r}`)}</span>
                  <span className="block truncate text-[11px] leading-tight text-tinta-sec dark:text-marfil/50">
                    {p.nombre} · {lang === 'en' ? p.cargoEn : p.cargoEs}
                  </span>
                </span>
                {r === rol ? <Check size={15} className="shrink-0 text-mineral" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
