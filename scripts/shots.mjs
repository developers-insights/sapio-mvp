#!/usr/bin/env node
/** Capturas de pantalla para evidencia. Uso: node scripts/shots.mjs <ruta> <nombre> [rol] [anchos] */
import fs from 'node:fs'
import { abrirNavegador, irA, recolectarConsola, rolDeRuta, servirDist } from './_comun.mjs'

const [, , ruta = '/#/login', nombre = 'shot', rolArg, anchosArg] = process.argv
const rol = rolArg || rolDeRuta(ruta)
const anchos = (anchosArg || '1440,390').split(',').map(Number)

const { base, cerrar } = await servirDist()
const browser = await abrirNavegador()
fs.mkdirSync('qa-salida/shots', { recursive: true })
try {
  for (const w of anchos) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 500 ? 844 : 900 } })
    const page = await ctx.newPage()
    const errores = recolectarConsola(page)
    if (ruta === '/#/login') {
      await page.goto(`${base}${ruta}`, { waitUntil: 'load' })
      await page.waitForTimeout(1200)
    } else {
      await irA(page, base, ruta, rol)
      await page.waitForTimeout(1200)
    }
    const f = `qa-salida/shots/${nombre}-${w}.png`
    await page.screenshot({ path: f, fullPage: w < 500 })
    const ok = await page.evaluate(
      () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
    )
    const er = errores.filter((e) => !/favicon|manifest|fonts.googleapis/i.test(e))
    console.log(`${f}  sinScrollH=${ok}  errores=${er.length}${er.length ? ' → ' + er.join(' | ') : ''}`)
    await ctx.close()
  }
} finally {
  await browser.close()
  cerrar()
}
