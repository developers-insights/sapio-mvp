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
import { Suscripcion } from '@/features/universidad/Suscripcion'
import { PlataformaPanel } from '@/features/plataforma/Panel'
import { Universidades, UniversidadDetalle } from '@/features/plataforma/Universidades'
import { Planes } from '@/features/plataforma/Planes'
import { PlataformaRoles } from '@/features/plataforma/Roles'
import { Auditoria } from '@/features/plataforma/Auditoria'
import { Seguridad } from '@/features/plataforma/Seguridad'
import { Marca } from '@/features/plataforma/Marca'
import { Proximamente } from '@/features/plataforma/Proximamente'
import { Propuesta } from '@/features/propuesta/Propuesta'

function Esq({ k, t }: { k: string; t: string }) {
  return <Esqueleto kicker={k} titulo={t} />
}

export function Rutas() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Shell />}>
        <Route path="/propuesta" element={<Propuesta />} />
        <Route path="/invitacion/:token" element={<Invitacion />} />

        <Route path="/plataforma/panel" element={<PlataformaPanel />} />
        <Route path="/plataforma/universidades" element={<Universidades />} />
        <Route path="/plataforma/universidades/:id" element={<UniversidadDetalle />} />
        <Route path="/plataforma/planes" element={<Planes />} />
        <Route path="/plataforma/roles" element={<PlataformaRoles />} />
        <Route path="/plataforma/auditoria" element={<Auditoria />} />
        <Route path="/plataforma/seguridad" element={<Seguridad />} />
        <Route path="/plataforma/marca" element={<Marca />} />

        <Route path="/universidad/panel" element={<UniversidadPanel />} />
        <Route path="/universidad/miembros" element={<Miembros />} />
        <Route path="/universidad/invitaciones" element={<Invitaciones />} />
        <Route path="/universidad/campus-editor" element={<CampusEditor />} />
        <Route path="/universidad/roles" element={<UniversidadRoles />} />
        <Route path="/universidad/suscripcion" element={<Suscripcion />} />

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
        <Route path="/proximamente" element={<Proximamente />} />
      </Route>
      <Route path="*" element={<Navigate to="/propuesta" replace />} />
    </Routes>
  )
}
