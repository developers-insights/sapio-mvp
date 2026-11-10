# PROGRESO · MVP Sapio (previsualización navegable)

## Completado

- **Bloque 1 — Cimientos.** Vite + React 18 + TS + Tailwind v3 (todo en `dependencies`),
  HashRouter, tokens de marca en `src/lib/brand.ts`, isotipo/wordmark/firma/anillos como
  SVG propio, i18n con `tr(clave, lang)` puro + `useT()` y aviso ante clave faltante o
  duplicada, stores zustand (`ui` y `datos`) y mock coherente en `src/data/`.
- **Bloque 2 — Shell.** Login a dos columnas, Welcome modal, sidebar con bloque inferior
  pinneado, bottom-nav + sheet «Más», role switcher, CTA WhatsApp, DevNotice, Preview
  banner, guarda de rutas por rol y todas las rutas navegables.
- **Bloque 3 — Workplace (06).** Inicio distinto por rol, calendario (día/semana/mes con
  husos por participante), tareas (lista y tablero), documentos con versiones, proyectos,
  notificaciones y búsqueda global ⌘K.
- **Bloque 4 — Mesa redonda (07).** Editor TipTap, participantes con presencia y permisos,
  guion simulado (dos cursores remotos, una oración escrita en vivo y un comentario que
  aparece para todos), comentarios anclados al texto con hilos, historial de versiones con
  restauración, invitación con permiso y replay.
- **Bloque 5 — Chat (08) y asistente (09).** Canales y directos con mensajes en vivo y
  adjuntos; asistente flotante + vista completa, con respuestas sobre los datos reales del
  mock, creación de tareas, medidor de uso y respeto de permisos.
- **Bloque 6 — Universidad (04, 05).** Panel del campus, miembros con filtros y ficha,
  invitaciones de profesores (perfil docente, aprobar/rechazar con motivo) y de estudiantes
  (CSV de 24 filas con 2 errores marcados), activación por token y roles del campus.
- **Bloque 7 — Campus (03).** Editor sin código con vista previa en vivo y campus público
  con portada a pantalla completa, manifiesto pinneado con scrub y reveals.
- **Bloque 8 — Suscripción (10) y plataforma (11, 01).** Planes, facturas, panel global,
  listado de universidades y «Probar aislamiento» con resultado verificable.
- **Bloque 9 — Permisos y seguridad (02, 12, 13).** Matriz de permisos, auditoría con
  exportación CSV real, panel de seguridad, sistema de diseño con contrastes medidos y
  pantalla «Próximamente».
- **Bloque 10 — Propuesta.** Encabezado, circuito, 13 módulos con «Ver en el demo»,
  extensión bloqueada y bloque de inversión oculto por defecto, con fuente única de montos.
- **Bloque 11 — Tour y trailer.** Tour manual con recorte por `clip-path` y trailer de
  12 escenas (84,5 s) con cursor virtual, solo en ≥1024px.
- **Bloque 12 — QA.** `qa:responsive`, `qa:i18n`, `qa:rutas` y `qa:porton` corriendo en
  Chromium real sobre el build.

- **Bloque 13 — Portón y repo.** Los cuatro chequeos en verde sobre el build final
  (`EVIDENCIA.md` tiene la salida real), el portón probado rompiendo dos bugs a
  propósito, y el repo creado en GitHub.

## En curso

- Nada: el MVP está entregado. Queda el deploy manual en Render.

## Decisiones

- `noUnusedLocals` / `noUnusedParameters` en `false` para no frenar el avance; `strict` queda
  en `true`.
- El isotipo se dibuja con `<mask>` (no con `fill-rule`) para que la hoja central quede en
  negativo sin aristas coincidentes, y mantiene siempre la proporción 100:124 del manual.
- La escala de opacidad de Tailwind se extendió a 0–100: la escala por defecto solo acepta
  múltiplos de 5 y silenciaba clases como `text-marfil/78`.
- El layout de campus lo decide la RUTA, no solo el store: así un enlace directo a
  `/#/campus/...` también entra sin shell de app.
- El trailer se monta fuera del `Shell`: adentro, cambiar de modo lo remontaba y el motor
  de escenas volvía a la escena 1.
- El tooltip del tour usa una animación sin `translate` (`tip-in`): `animate-scale-in`
  pisaba el `translate` inline del caso centrado.

## Bloqueos

- Ninguno.
