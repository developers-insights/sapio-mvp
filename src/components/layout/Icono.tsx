import {
  FileText, LayoutDashboard, Building2, Tags, ShieldCheck, ScrollText, Lock, Palette,
  Users, MailPlus, PanelsTopLeft, CreditCard, House, CalendarDays, ListChecks, Files,
  FolderKanban, Table2, MessagesSquare, Sparkles, Bell, Ellipsis,
} from 'lucide-react'

const MAPA = {
  FileText, LayoutDashboard, Building2, Tags, ShieldCheck, ScrollText, Lock, Palette,
  Users, MailPlus, PanelsTopLeft, CreditCard, House, CalendarDays, ListChecks, Files,
  FolderKanban, Table2, MessagesSquare, Sparkles, Bell, Ellipsis,
} as const

export type NombreIcono = keyof typeof MAPA

export function Icono({ nombre, size = 18, className }: { nombre: string; size?: number; className?: string }) {
  const C = MAPA[nombre as NombreIcono] ?? FileText
  return <C size={size} className={className} aria-hidden="true" />
}
