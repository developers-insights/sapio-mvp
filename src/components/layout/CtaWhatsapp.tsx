import { MessageCircle } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'

/** Un solo nombre de CTA en toda la demo: "Avanzar por WhatsApp". */
export function CtaWhatsapp({
  className,
  variante = 'primario',
  tam = 'md',
  dataTour = true,
}: {
  className?: string
  variante?: 'primario' | 'mineral' | 'contorno' | 'claro'
  tam?: 'sm' | 'md' | 'lg'
  dataTour?: boolean
}) {
  const { t } = useT()
  const estilos = {
    primario: 'bg-noche text-marfil hover:bg-[#1b3147] dark:bg-marfil dark:text-noche dark:hover:bg-white',
    mineral: 'bg-mineral text-white hover:bg-mineral-600',
    contorno:
      'border border-borde bg-white text-noche hover:border-mineral hover:text-mineral-texto dark:bg-noche-800 dark:text-marfil dark:border-[#27425a]',
    claro: 'bg-marfil text-noche hover:bg-white',
  }[variante]
  const tamanos = { sm: 'min-h-[40px] px-3 text-[13px]', md: 'min-h-[44px] px-4 text-sm', lg: 'min-h-[52px] px-6 text-[15px]' }[tam]
  return (
    <a
      href={BRAND.whatsapp}
      target="_blank"
      rel="noreferrer noopener"
      {...(dataTour ? { 'data-tour': 'whatsapp-cta' } : {})}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors duration-200 active:scale-[.985]',
        estilos,
        tamanos,
        className,
      )}
    >
      <MessageCircle size={16} className="shrink-0" />
      {t('app.cta')}
    </a>
  )
}
