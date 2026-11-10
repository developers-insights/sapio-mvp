import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { Login } from '@/features/login/Login'
import { Esqueleto } from '@/components/layout/Esqueleto'
import { WorkplaceInicio } from '@/features/workplace/Inicio'
import { Calendario } from '@/features/workplace/Calendario'
import { Tareas } from '@/features/workplace/Tareas'
import { Documentos } from '@/features/workplace/Documentos'
import { Proyectos, ProyectoDetalle } from '@/features/workplace/Proyectos'
import { Notificaciones } from '@/features/workplace/Notificaciones'
import { Mesas } from '@/features/mesa/Mesas'
import { MesaRedonda } from '@/features/mesa/MesaRedonda'
import { Chat } from '@/features/chat/Chat'
import { Asistente } from '@/features/asistente/Asistente'
import { UniversidadPanel } from '@/features/universidad/Panel'
import { Miembros } from '@/features/universidad/Miembros'
import { Invitaciones } from '@/features/universidad/Invitaciones'
import { Invitacion } from '@/features/universidad/Invitacion'
import { UniversidadRoles } from '@/features/universidad/Roles'
import { CampusEditor } from '@/features/campus/Editor'
import { CampusPublico } from '@/features/campus/Publico'

function Esq({ k, t }: { k: string; t: string }) {
  return <Esqueleto kicker={k} titulo={t} />
}

export function Rutas() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Shell />}>
        <Route path="/propuesta" element={<Esq k="PROPUESTA COMERCIAL" t="Propuesta" />} />
        <Route path="/invitacion/:token" element={<Invitacion />} />

        <Route path="/plataforma/panel" element={<Esq k="PLATAFORMA" t="Panel" />} />
        <Route path="/plataforma/universidades" element={<Esq k="PLATAFORMA" t="Universidades" />} />
        <Route path="/plataforma/universidades/:id" element={<Esq k="PLATAFORMA" t="Universidad" />} />
        <Route path="/plataforma/planes" element={<Esq k="PLATAFORMA" t="Planes y precios" />} />
        <Route path="/plataforma/roles" element={<Esq k="PLATAFORMA" t="Roles y permisos" />} />
        <Route path="/plataforma/auditoria" element={<Esq k="SEGURIDAD" t="Auditoría" />} />
        <Route path="/plataforma/seguridad" element={<Esq k="SEGURIDAD" t="Seguridad" />} />
        <Route path="/plataforma/marca" element={<Esq k="MARCA" t="Sistema de diseño" />} />

        <Route path="/universidad/panel" element={<UniversidadPanel />} />
        <Route path="/universidad/miembros" element={<Miembros />} />
        <Route path="/universidad/invitaciones" element={<Invitaciones />} />
        <Route path="/universidad/campus-editor" element={<CampusEditor />} />
        <Route path="/universidad/roles" element={<UniversidadRoles />} />
        <Route path="/universidad/suscripcion" element={<Esq k="FACTURACIÓN" t="Suscripción" />} />

        <Route path="/workplace" element={<WorkplaceInicio />} />
        <Route path="/workplace/calendario" element={<Calendario />} />
        <Route path="/workplace/tareas" element={<Tareas />} />
        <Route path="/workplace/documentos" element={<Documentos />} />
        <Route path="/workplace/proyectos" element={<Proyectos />} />
        <Route path="/workplace/proyectos/:id" element={<ProyectoDetalle />} />
        <Route path="/workplace/mesas" element={<Mesas />} />
        <Route path="/workplace/asistente" element={<Asistente />} />
        <Route path="/workplace/notificaciones" element={<Notificaciones />} />
        <Route path="/mesa/:id" element={<MesaRedonda />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:canal" element={<Chat />} />

        <Route path="/campus/:slug" element={<CampusPublico />} />
        <Route path="/proximamente" element={<Esq k="PRÓXIMAMENTE" t="Fases 2 y 3" />} />
      </Route>
      <Route path="*" element={<Navigate to="/propuesta" replace />} />
    </Routes>
  )
}
