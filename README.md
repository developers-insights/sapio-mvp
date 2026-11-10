# Sapio · MVP de previsualización navegable

Demo navegable (datos mock, sin backend) de **Sapio**, la oficina digital del campus:
cada universidad tiene su campus y cada persona su workplace, con calendario, tareas,
documentos, proyectos, **mesa redonda** de documento compartido, chat interno y un
asistente de IA. La **propuesta comercial va adentro de la demo**, en `/#/propuesta`.

> **Esto no es producción.** Todas las universidades, personas, montos de planes y
> documentos son ficticios. Cada vista lo dice con la pill «Demo – datos ilustrativos».

## Arrancar

```bash
npm install
npm run dev
```

## Build y deploy

```bash
npm run build          # tsc -b && vite build → dist/
npx serve dist         # sin -s: la app usa HashRouter
```

Deploy en Render: **New → Static Site**, build `npm install && npm run build`,
publish `dist`. `render.yaml` queda por prolijidad (sin `plan` ni `region`).

## QA

Todos los chequeos corren en un Chromium real (Playwright) sobre el build.

```bash
npm run build
npm run qa:responsive  # 6 anchos × 2 temas × 28 vistas: scrollWidth === clientWidth + consola
npm run qa:i18n        # claves crudas en pantalla, duplicadas y faltantes, en ES y EN
npm run qa:rutas       # 4 rutas profundas sobre `serve dist` (sin -s) sobreviviendo un F5
npm run qa:porton      # login por rol, ojito de la inversión, los 13 "Ver en el demo",
                       # centrado de modales y consola limpia por vista
```

Cualquiera sale con código distinto de cero si algo está en rojo; `qa:i18n` además
falla si no puede correr, para no pasar en verde por omisión.

## Mapa del código

```
src/
  lib/brand.ts            constante BRAND: toda la marca en un solo lugar
  lib/propuesta-data.ts   FUENTE ÚNICA de los montos de la propuesta
  assets/brand/           isotipo, wordmark, firma y anillos como SVG propio
  i18n/                   tr(clave, lang) puro + useT(); una clave vive en UN archivo
  store/ui.ts             sesión, rol, modo, tema, idioma, previsualización, toasts
  store/datos.ts          estado mutable del mock (tareas, solicitudes, CSV, campus…)
  data/                   mock coherente con semilla fija; los totales se calculan
  components/             primitivas de interfaz y layout (sidebar, bottom-nav, shell)
  features/<modulo>/      una carpeta por módulo de la propuesta
scripts/                  los chequeos de QA
```

## Roles de la demo

| Rol | Persona | Vista por defecto |
|---|---|---|
| Súper usuario | Ale Hernández · Sapio | `/plataforma/panel` |
| Administradora de universidad | Laura Bennett · Northwood State | `/universidad/panel` |
| Profesor | Dr. Michael Grant · Kestrel Bay | `/workplace` |
| Estudiante | Ale Hernández · doctoranda | `/workplace` |
| Colaborador | Ing. Tomás Rivas | `/workplace` |

El login entra con cualquier rol y **siempre** aterriza en `/propuesta`.
El selector de rol del menú cambia la demo en vivo.

## Marca

Los tokens salen del Manual de Identidad de Marca de Sapio (Concept Edition 2026) y
viven en `src/lib/brand.ts`. El manual aclara que el logotipo está «propuesto para
validación de marca y registro»: cuando se valide, se reemplaza ahí y en
`src/assets/brand/`, en un solo lugar.

Powered by **Insights**.
