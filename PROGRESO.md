# PROGRESO · MVP Sapio (previsualización navegable)

## Completado
- **Bloque 1 — Scaffold y cimientos.** Vite + React 18 + TS + Tailwind v3 (todo en `dependencies`),
  HashRouter, tokens de marca del manual en `src/lib/brand.ts`, isotipo/wordmark/firma/anillos como
  SVG propio en `src/assets/brand/Isotipo.tsx`, i18n con `tr(clave, lang)` puro + `useT()` y aviso en
  consola ante clave faltante o duplicada, stores zustand (`ui` y `datos`), mock completo en
  `src/data/` (12 universidades, ~65 personas, proyecto de tesis, mesa, chat, gestión, auditoría).
- **Bloque 2 — Shell.** Login a dos columnas, Welcome modal, sidebar fija con bloque inferior
  pinneado, bottom-nav + sheet "Más", role switcher, CTA WhatsApp, DevNotice, Preview banner,
  guarda de rutas por rol y TODAS las rutas como esqueletos navegables.

## En curso
- Bloque 3 — Workplace (06).

## Pendiente
- Bloques 4 a 13 según el orden de trabajo.

## Decisiones
- `noUnusedLocals`/`noUnusedParameters` en `false` para no frenar el avance; `strict` queda en `true`.
- El isotipo se dibuja con `<mask>` (no con `fill-rule`) para que la hoja central quede en negativo
  sin bordes coincidentes, y mantiene siempre la proporción 100:124 del manual.
- Los totales de plataforma se calculan desde los datos (`TOTALES_PLATAFORMA`), nunca a mano.

## Bloqueos
- Ninguno.
