# Evidencia de QA · MVP Sapio

Todo lo de acá abajo es la **salida real** de los chequeos corriendo en un Chromium
real (Playwright) sobre el build de `dist/`. Los comandos están en `package.json` y
los scripts en `scripts/`. Cualquiera de ellos sale con código distinto de cero si
algo está en rojo.

```bash
npm run build
npm run qa:responsive   # anchos, temas y consola
npm run qa:i18n         # claves crudas, duplicadas y faltantes, en ES y EN
npm run qa:rutas        # rutas profundas sobre `serve dist` sin -s
npm run qa:porton       # login por rol, ojito, los 13 "Ver en el demo", modales, consola
npm run qa:evidencia    # pack de capturas
```

## 1 · Sin scroll horizontal en los seis anchos

Medido **dentro de la página** con
`document.documentElement.scrollWidth === document.documentElement.clientWidth`,
en 360 / 390 / 768 / 1024 / 1280 / 1440 px, en los dos temas, sobre 31 vistas.

> _(pendiente: salida de `npm run qa:responsive`)_

## 2 · Consola limpia

Cada vista se mide con sus animaciones corriendo; la mesa redonda se mide **con el
guion simulado corriendo** (9 s).

> _(pendiente: salida del portón, sección E)_

## 3 · Texto real en pantalla (i18n)

> _(pendiente: salida de `npm run qa:i18n`)_

## 4 · Contrastes medidos (AA)

Calculados desde los hex de la paleta del manual y mostrados en
`/#/plataforma/marca`.

> _(pendiente)_

## 5 · Modales centrados

Desvío entre el centro del modal y el centro del viewport, medido con
`getBoundingClientRect()`.

> _(pendiente: salida del portón, sección D)_

## 6 · Rutas profundas sobre el build

`npx serve dist` **sin** el flag `-s`, entrando directo a cada ruta con hash y
sobreviviendo un F5.

> _(pendiente: salida de `npm run qa:rutas`)_

## 7 · Portón de calidad

> _(pendiente: salida de `npm run qa:porton`)_

## 8 · El portón falla cuando tiene que fallar

Antes de confiar en él, se volvieron a meter dos bugs ya arreglados.

> _(pendiente)_

## 9 · Capturas

58 capturas en `qa-salida/evidencia/`, cada vista clave a 1440 y 390 px, más la
Propuesta con el precio revelado y oculto, el modo oscuro y la versión en inglés.
