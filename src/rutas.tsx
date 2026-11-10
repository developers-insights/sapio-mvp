import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { Login } from '@/features/login/Login'
import { Esqueleto } from '@/components/layout/Esqueleto'

function Esq({ k, t }: { k: string; t: string }) {
  return <Esqueleto kicker={k} titulo={t} />
}

export function Rutas() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Shell />}>
        <Route path="/propuesta" element={<Esq k="PROPUESTA COMERCIAL" t="Propuesta" />} />
        <Route path="/invitacion/:token" element={<Esq k="INVITACIÓN" t="Activar cuenta" />} />

        <Route path="/plataforma/panel" element={<Esq k="PLATAFORMA" t="Panel" />} />
        <Route path="/plataforma/universidades" element={<Esq k="PLATAFORMA" t="Universidades" />} />
        <Route path="/plataforma/universidades/:id" element={<Esq k="PLATAFORMA" t="Universidad" />} />
        <Route path="/plataforma/planes" element={<Esq k="PLATAFORMA" t="Planes y precios" />} />
        <Route path="/plataforma/roles" element={<Esq k="PLATAFORMA" t="Roles y permisos" />} />
        <Route path="/plataforma/auditoria" element={<Esq k="SEGURIDAD" t="Auditoría" />} />
        <Route path="/plataforma/seguridad" element={<Esq k="SEGURIDAD" t="Seguridad" />} />
        <Route path="/plataforma/marca" element={<Esq k="MARCA" t="Sistema de diseño" />} />

        <Route path="/universidad/panel" element={<Esq k="CAMPUS" t="Panel" />} />
        <Route path="/universidad/miembros" element={<Esq k="CAMPUS" t="Miembros" />} />
        <Route path="/universidad/invitaciones" element={<Esq k="CAMPUS" t="Invitaciones" />} />
        <Route path="/universidad/campus-editor" element={<Esq k="CAMPUS" t="Editor del campus" />} />
        <Route path="/universidad/roles" element={<Esq k="CAMPUS" t="Roles" />} />
        <Route path="/universidad/suscripcion" element={<Esq k="FACTURACIÓN" t="Suscripción" />} />

        <Route path="/workplace" element={<Esq k="MI ESPACIO" t="Inicio" />} />
        <Route path="/workplace/calendario" element={<Esq k="MI ESPACIO" t="Calendario" />} />
        <Route path="/workplace/tareas" element={<Esq k="MI ESPACIO" t="Tareas" />} />
        <Route path="/workplace/documentos" element={<Esq k="MI ESPACIO" t="Documentos" />} />
        <Route path="/workplace/proyectos" element={<Esq k="MI ESPACIO" t="Proyectos" />} />
        <Route path="/workplace/proyectos/:id" element={<Esq k="MI ESPACIO" t="Proyecto" />} />
        <Route path="/workplace/mesas" element={<Esq k="MI ESPACIO" t="Mesas redondas" />} />
        <Route path="/workplace/asistente" element={<Esq k="MI ESPACIO" t="Asistente" />} />
        <Route path="/workplace/notificaciones" element={<Esq k="MI ESPACIO" t="Notificaciones" />} />
        <Route path="/mesa/:id" element={<Esq k="MESA REDONDA" t="Documento compartido" />} />
        <Route path="/chat" element={<Esq k="MI ESPACIO" t="Chat" />} />
        <Route path="/chat/:canal" element={<Esq k="MI ESPACIO" t="Chat" />} />

        <Route path="/campus/:slug" element={<Esq k="CAMPUS PÚBLICO" t="Campus" />} />
        <Route path="/proximamente" element={<Esq k="PRÓXIMAMENTE" t="Fases 2 y 3" />} />
      </Route>
      <Route path="*" element={<Navigate to="/propuesta" replace />} />
    </Routes>
  )
}
