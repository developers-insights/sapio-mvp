import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { RUTA_DEFAULT, useUI } from '@/store/ui'
import { useT } from '@/i18n'
import { Anillos, Firma } from '@/assets/brand/Isotipo'
import { Boton } from '@/components/ui/Boton'
import { Campo, Input } from '@/components/ui/Campos'
import { DevNotice, Pildora } from '@/components/ui/Piezas'
import { UNI_ADMIN, UNI_POR_ID } from '@/data/universidades'
import { P, persona } from '@/data/personas'
import { cn } from '@/lib/cn'

/** Experiencia del invitado: aceptar, definir contraseña y entrar al workplace. */
export function Invitacion() {
  const { token } = useParams()
  const { t } = useT()
  const entrar = useUI((s) => s.entrar)
  const toast = useUI((s) => s.toast)
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const uni = UNI_POR_ID[UNI_ADMIN]
  const quienInvita = persona(P.laura)

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <div className="relative overflow-hidden rounded-2xl border border-borde bg-white p-5 shadow-sapio sm:p-8 dark:border-[#27425a] dark:bg-noche-800">
        <Anillos
          className="pointer-events-none absolute -right-24 -top-32 h-[320px] w-[320px] opacity-70"
          color="rgba(201,169,116,.2)"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <Firma size={20} colorIsotipo="#C9A974" />
            <Pildora tono="neutro" className="ml-auto">
              {t('uni.token.paso', { n: paso })}
            </Pildora>
          </div>

          <p className="kicker mt-6">{t('nav.invitaciones')}</p>
          <h1 className="mt-2 font-black leading-tight" style={{ fontSize: 'clamp(24px,5.4vw,34px)' }}>
            {paso === 3 ? t('uni.token.listo') : t('uni.token.titulo')}
          </h1>
          <span className="filete mt-3" />

          <p className="mt-4 text-[14.5px] leading-relaxed text-tinta-sec dark:text-marfil/70">
            {paso === 3
              ? t('uni.token.listoDet')
              : t('uni.token.bajada', { nombre: quienInvita.nombre, uni: uni.nombre, n: 6 })}
          </p>

          <p className="num mt-3 break-all rounded-xl border border-borde bg-marfil-200/60 p-2.5 text-[11.5px] text-tinta-sec dark:border-[#27425a] dark:bg-noche-700/50 dark:text-marfil/55">
            {uni.slug}.sapio.example/#/invitacion/{token}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Pildora tono="pizarra">{t('uni.token.rol')}: {t('rol.estudiante')}</Pildora>
            <Pildora tono="champan" icono={<ShieldCheck size={10} />}>
              {t('uni.inv.enlaceUnico')}
            </Pildora>
          </div>

          {paso === 1 ? (
            <Boton
              tam="lg"
              className="mt-6 w-full"
              onClick={() => {
                setPaso(2)
                toast({ titulo: t('uni.token.aceptada'), tono: 'ok' })
              }}
            >
              {t('uni.token.aceptar')}
              <ArrowRight size={17} />
            </Boton>
          ) : null}

          {paso === 2 ? (
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setPaso(3)
              }}
            >
              <Campo label={t('uni.token.definir')}>
                <Input type="password" placeholder="••••••••••" autoComplete="new-password" />
              </Campo>
              <Campo label={t('uni.token.repetir')}>
                <Input type="password" placeholder="••••••••••" autoComplete="new-password" />
              </Campo>
              <Boton type="submit" tam="lg" className="w-full">
                {t('app.confirmar')}
                <ArrowRight size={17} />
              </Boton>
            </form>
          ) : null}

          {paso === 3 ? (
            <div className="mt-6 space-y-3">
              <p className="flex items-center gap-2 text-[14px] font-bold text-mineral-texto">
                <CheckCircle2 size={17} /> {t('uni.token.aceptada')}
              </p>
              <Boton
                tam="lg"
                className="w-full"
                onClick={() => {
                  entrar('estudiante')
                  navigate(RUTA_DEFAULT.estudiante)
                }}
              >
                {t('uni.token.entrar')}
                <ArrowRight size={17} />
              </Boton>
            </div>
          ) : null}

          <ol className="mt-7 flex items-center gap-2" aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <li
                key={n}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  n <= paso ? 'bg-mineral' : 'bg-borde dark:bg-[#27425a]',
                )}
              />
            ))}
          </ol>
        </div>
      </div>

      <DevNotice
        className="mt-5"
        funcion={t('uni.inv.dev.correo')}
        hoy={t('uni.inv.dev.correoHoy')}
        alDesarrollar={t('uni.inv.dev.correoDesp')}
      />
    </div>
  )
}
