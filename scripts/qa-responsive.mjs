#!/usr/bin/env node
/**
 * QA responsive REAL: mide dentro de la página, en Chromium, en los seis anchos
 * canónicos, en los dos temas. Sale con código distinto de cero si algo rompe.
 */
import {
  ANCHOS,
  RUTAS_CLAVE,
  abrirNavegador,
  irDirecto,
  recolectarConsola,
  rolDeRuta,
  sembrarSesion,
  servirDist,
  sinScrollHorizontal,
} from './_comun.mjs'
import fs from 'node:fs'

const soloRuta = process.argv.find((a) => a.startsWith('--ruta='))?.split('=')[1]
const temas = process.argv.includes('--un-tema') ? ['light'] : ['light', 'dark']

const rutas = soloRuta
  ? RUTAS_CLAVE.filter(([r, nombre]) => r.includes(soloRuta) || nombre.includes(soloRuta))
  : RUTAS_CLAVE

if (!rutas.length) {
  console.error(`\u2717 El filtro --ruta=${soloRuta} no coincide con ninguna vista: no hay nada que medir.`)
  process.exit(1)
}

if (!fs.existsSync('dist/index.html')) {
  console.error('✗ falta dist/. Corré `npm run build` antes del QA.')
  process.exit(1)
}

const { base, cerrar } = await servirDist()
const browser = await abrirNavegador()
let fallos = 0
const filas = []

try {
  for (const tema of temas) {
    for (const [ruta, nombre] of rutas) {
      const rol = rolDeRuta(ruta)
      for (const ancho of ANCHOS) {
        // `serve` a veces corta un socket bajo carga: eso es ruido del arnés,
        // no un error de la app. Si el ÚNICO problema es de transporte,
        // reintentamos la medición una vez antes de darla por fallada.
        let medida = null
        let erroresReales = []
        let ok = false
        let reintentos = 0
        for (let intento = 0; intento < 2; intento++) {
          const ctx = await browser.newContext({
            viewport: { width: ancho, height: 900 },
            deviceScaleFactor: 1,
          })
          await sembrarSesion(ctx, rol, { sapio_tema: tema })
          const page = await ctx.newPage()
          const errores = recolectarConsola(page)
          await irDirecto(page, base, ruta)
          ok = await sinScrollHorizontal(page)
          medida = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }))
          erroresReales = errores.filter(
            (e) => !/favicon|manifest|Download the React DevTools|fonts.googleapis/i.test(e),
          )
          await ctx.close()
          const soloTransporte =
            erroresReales.length > 0 && erroresReales.every((e) => /net::ERR_/.test(e))
          if (!soloTransporte) break
          reintentos++
        }
        if (!ok || erroresReales.length) fallos++
        filas.push({
          tema,
          vista: nombre,
          ancho,
          ok,
          ...medida,
          errores: erroresReales,
          reintentos,
        })
        console.log(
          `${ok && !erroresReales.length ? '✓' : '✗'} ${tema.padEnd(5)} ${nombre.padEnd(22)} ${String(ancho).padStart(4)}px  scrollWidth=${medida.scrollWidth} clientWidth=${medida.clientWidth} → ${ok}` +
            (reintentos ? `  (reintentos por socket: ${reintentos})` : '') +
            (erroresReales.length ? `\n    consola: ${erroresReales.join(' | ')}` : ''),
        )
      }
    }
  }
} finally {
  await browser.close()
  cerrar()
}

fs.mkdirSync('qa-salida', { recursive: true })
fs.writeFileSync('qa-salida/responsive.json', JSON.stringify(filas, null, 2))

console.log(`\n${filas.length - fallos}/${filas.length} chequeos en verde`)
if (fallos) {
  console.error(`✗ QA responsive EN ROJO: ${fallos} chequeos fallaron`)
  process.exit(1)
}
console.log('✓ QA responsive en verde')
