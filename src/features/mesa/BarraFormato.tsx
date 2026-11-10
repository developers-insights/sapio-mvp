import type { Editor } from '@tiptap/react'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Quote } from 'lucide-react'
import { useT } from '@/i18n'
import { cn } from '@/lib/cn'

/**
 * Barra de formato básico. En móvil queda fija arriba de la bottom-nav,
 * en UNA línea, con scroll horizontal CONTENIDO (nunca desborda la página).
 */
export function BarraFormato({
  editor,
  fija,
  offsetInferior,
}: {
  editor: Editor | null
  fija: boolean
  offsetInferior: number
}) {
  const { t } = useT()
  if (!editor) return null

  const botones: Array<{ id: string; etiqueta: string; icono: React.ReactNode; activo: boolean; accion: () => void }> = [
    { id: 'bold', etiqueta: t('mesa.negrita'), icono: <Bold size={16} />, activo: editor.isActive('bold'), accion: () => editor.chain().focus().toggleBold().run() },
    { id: 'italic', etiqueta: t('mesa.cursiva'), icono: <Italic size={16} />, activo: editor.isActive('italic'), accion: () => editor.chain().focus().toggleItalic().run() },
    { id: 'h2', etiqueta: t('mesa.titulo2'), icono: <Heading2 size={16} />, activo: editor.isActive('heading', { level: 2 }), accion: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { id: 'h3', etiqueta: t('mesa.titulo3'), icono: <Heading3 size={16} />, activo: editor.isActive('heading', { level: 3 }), accion: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { id: 'ul', etiqueta: t('mesa.lista'), icono: <List size={16} />, activo: editor.isActive('bulletList'), accion: () => editor.chain().focus().toggleBulletList().run() },
    { id: 'ol', etiqueta: t('mesa.listaNum'), icono: <ListOrdered size={16} />, activo: editor.isActive('orderedList'), accion: () => editor.chain().focus().toggleOrderedList().run() },
    { id: 'quote', etiqueta: t('mesa.cita'), icono: <Quote size={16} />, activo: editor.isActive('blockquote'), accion: () => editor.chain().focus().toggleBlockquote().run() },
    {
      id: 'link',
      etiqueta: t('mesa.enlace'),
      icono: <Link2 size={16} />,
      activo: editor.isActive('link'),
      accion: () => {
        const url = window.prompt(t('mesa.enlacePregunta'), 'https://')
        if (!url) return
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
      },
    },
  ]

  return (
    <div
      role="toolbar"
      aria-label={t('mesa.formato')}
      className={cn(
        'scroll-x-contenida sin-scrollbar flex items-center gap-1 border-borde bg-white p-1.5 dark:border-[#27425a] dark:bg-noche-800',
        fija
          ? 'fixed inset-x-0 z-[45] border-t lg:static lg:z-auto lg:rounded-xl lg:border'
          : 'rounded-xl border',
      )}
      style={fija ? { bottom: offsetInferior } : undefined}
    >
      {botones.map((b) => (
        <button
          key={b.id}
          type="button"
          onClick={b.accion}
          aria-label={b.etiqueta}
          aria-pressed={b.activo}
          title={b.etiqueta}
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-colors',
            b.activo
              ? 'bg-mineral text-white'
              : 'text-tinta-sec hover:bg-marfil-200 hover:text-noche dark:text-marfil/60 dark:hover:bg-noche-700 dark:hover:text-marfil',
          )}
        >
          {b.icono}
        </button>
      ))}
    </div>
  )
}
