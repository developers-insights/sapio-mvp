#!/usr/bin/env node
/**
 * QA responsive REAL: mide dentro de la página, en Chromium, en los seis anchos
 * canónicos, en los dos temas. Sale con código distinto de cero si algo rompe.
 */
import {
  ANCHOS,
  RUTAS_CLAVE,
  abrirNavegador,
  irA,
  recolectarConsola,
  rolDeRuta,
  servirDist,
  sinScrollHorizontal,
} from './_comun.mjs'
import fs from 'node:fs'

const soloRuta = process.argv.find((a) => a.startsWith('--ruta='))?.split('=')[1]
const temas = process.argv.includes('--un-tema') ? ['light'] : ['light', 'dark']

const rutas = soloRuta ? RUTAS_CLAVE.filter(([r]) => r.includes(soloRuta)) : RUTAS_CLAVE

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
        const ctx = await browser.newContext({
          viewport: { width: ancho, height: 900 },
          deviceScaleFactor: 1,
        })
        const page = await ctx.newPage()
        const errores = recolectarConsola(page)
        await page.goto(`${base}/#/login`, { waitUntil: 'load' })
        await page.evaluate((t) => localStorage.setItem('sapio_tema', t), tema)
        await irA(page, base, ruta, rol)
        const ok = await sinScrollHorizontal(page)
        const medida = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }))
        const erroresReales = errores.filter(
          (e) => !/favicon|manifest|Download the React DevTools|fonts.googleapis/i.test(e),
        )
        if (!ok || erroresReales.length) fallos++
        filas.push({
          tema,
          vista: nombre,
          ancho,
          ok,
          ...medida,
          errores: erroresReales,
        })
        console.log(
          `${ok && !erroresReales.length ? '✓' : '✗'} ${tema.padEnd(5)} ${nombre.padEnd(22)} ${String(ancho).padStart(4)}px  scrollWidth=${medida.scrollWidth} clientWidth=${medida.clientWidth} → ${ok}` +
            (erroresReales.length ? `\n    consola: ${erroresReales.join(' | ')}` : ''),
        )
        await ctx.close()
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
