#!/usr/bin/env node
/**
 * Rutas profundas sobre el build: entra DIRECTO a cada ruta con hash en
 * `npx serve dist` SIN el flag -s, y confirma que sobreviven a un F5.
 */
import { abrirNavegador, recolectarConsola, servirDist } from './_comun.mjs'
import fs from 'node:fs'

const PROFUNDAS = [
  ['/#/propuesta', 'PROPUESTA COMERCIAL', 'estudiante'],
  ['/#/mesa/tesis-metodologia', 'Metodolog', 'estudiante'],
  ['/#/universidad/invitaciones', 'Invitaciones', 'universidad'],
  ['/#/campus/northwood', 'Northwood', 'universidad'],
]

if (!fs.existsSync('dist/index.html')) {
  console.error('✗ falta dist/. Corré `npm run build` antes del QA.')
  process.exit(1)
}

const { base, cerrar } = await servirDist()
const browser = await abrirNavegador()
let fallos = 0

try {
  for (const [ruta, textoEsperado, rol] of PROFUNDAS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    // La sesión se siembra ANTES de que corra cualquier script de la página:
    // así la primera navegación es realmente directa a la ruta profunda.
    await ctx.addInitScript((r) => {
      try {
        sessionStorage.setItem('sapio_sesion', '1')
        sessionStorage.setItem('sapio_rol', r)
        sessionStorage.setItem('welcome_modal_seen', '1')
      } catch {
        /* modo privado */
      }
    }, rol)
    const page = await ctx.newPage()
    const errores = recolectarConsola(page)

    const resp = await page.goto(`${base}${ruta}`, { waitUntil: 'load' })
    await page.waitForTimeout(600)
    const estado = resp?.status() ?? 0
    const cuerpo = await page.evaluate(() => document.body.innerText)
    const notFound = /not found/i.test(cuerpo) && cuerpo.length < 400
    const tieneTexto = cuerpo.includes(textoEsperado)

    // F5
    await page.reload({ waitUntil: 'load' })
    await page.waitForTimeout(600)
    const cuerpo2 = await page.evaluate(() => document.body.innerText)
    const sobreviveF5 = cuerpo2.includes(textoEsperado) && !/not found/i.test(cuerpo2.slice(0, 200))

    const erroresReales = errores.filter((e) => !/favicon|manifest|fonts.googleapis/i.test(e))
    const ok = estado === 200 && !notFound && tieneTexto && sobreviveF5 && !erroresReales.length
    if (!ok) fallos++
    console.log(
      `${ok ? '✓' : '✗'} ${ruta.padEnd(42)} HTTP ${estado}  notFound=${notFound}  texto="${textoEsperado}"=${tieneTexto}  F5=${sobreviveF5}` +
        (erroresReales.length ? `\n    consola: ${erroresReales.join(' | ')}` : ''),
    )
    await ctx.close()
  }
} finally {
  await browser.close()
  cerrar()
}

if (fallos) {
  console.error(`✗ QA de rutas profundas EN ROJO: ${fallos} fallaron`)
  process.exit(1)
}
console.log('✓ 4/4 rutas profundas cargan y sobreviven a F5')
