#!/usr/bin/env node
/** Pack de capturas para la evidencia de entrega. */
import fs from 'node:fs'
import { abrirNavegador, irDirecto, recolectarConsola, rolDeRuta, sembrarSesion, servirDist } from './_comun.mjs'

const VISTAS = [
  ['/#/login', 'login', 'estudiante'],
  ['/#/propuesta', 'propuesta', 'estudiante'],
  ['/#/workplace', 'workplace', 'estudiante'],
  ['/#/workplace/calendario', 'calendario', 'estudiante'],
  ['/#/workplace/tareas', 'tareas', 'estudiante'],
  ['/#/workplace/documentos', 'documentos', 'estudiante'],
  ['/#/workplace/proyectos/pr-tesis', 'proyecto', 'estudiante'],
  ['/#/mesa/tesis-metodologia', 'mesa-redonda', 'estudiante'],
  ['/#/chat/proyecto-tesis', 'chat', 'estudiante'],
  ['/#/workplace/asistente', 'asistente', 'estudiante'],
  ['/#/workplace/notificaciones', 'notificaciones', 'estudiante'],
  ['/#/universidad/panel', 'uni-panel', 'universidad'],
  ['/#/universidad/miembros', 'uni-miembros', 'universidad'],
  ['/#/universidad/invitaciones?tab=profesores', 'invitaciones-profesores', 'universidad'],
  ['/#/universidad/invitaciones?tab=estudiantes', 'invitaciones-csv', 'universidad'],
  ['/#/universidad/campus-editor', 'campus-editor', 'universidad'],
  ['/#/universidad/suscripcion', 'suscripcion', 'universidad'],
  ['/#/campus/northwood', 'campus-publico', 'universidad'],
  ['/#/plataforma/panel', 'plataforma-panel', 'super'],
  ['/#/plataforma/universidades', 'plataforma-universidades', 'super'],
  ['/#/plataforma/roles', 'roles-permisos', 'super'],
  ['/#/plataforma/auditoria', 'auditoria', 'super'],
  ['/#/plataforma/seguridad', 'seguridad', 'super'],
  ['/#/plataforma/marca', 'sistema-diseno', 'super'],
  ['/#/proximamente', 'proximamente', 'estudiante'],
]

const dir = 'qa-salida/evidencia'
fs.rmSync(dir, { recursive: true, force: true })
fs.mkdirSync(dir, { recursive: true })

const { base, cerrar } = await servirDist()
const browser = await abrirNavegador()
let problemas = 0

async function captura(ruta, nombre, rol, ancho, extra) {
  const ctx = await browser.newContext({ viewport: { width: ancho, height: ancho < 500 ? 844 : 950 } })
  await sembrarSesion(ctx, rol ?? rolDeRuta(ruta))
  const page = await ctx.newPage()
  const errores = recolectarConsola(page)
  await irDirecto(page, base, ruta)
  await page.waitForTimeout(ruta.includes('/mesa/') ? 9000 : 1200)
  if (extra) await extra(page)
  const archivo = `${dir}/${nombre}-${ancho}.png`
  await page.screenshot({ path: archivo, fullPage: ancho < 500 })
  const sinScrollH = await page.evaluate(
    () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
  )
  const errs = errores.filter((e) => !/favicon|manifest|fonts/i.test(e))
  if (!sinScrollH || errs.length) problemas++
  console.log(`${sinScrollH && !errs.length ? '✓' : '✗'} ${archivo.padEnd(56)} sinScrollH=${sinScrollH} errores=${errs.length}`)
  await ctx.close()
}

try {
  for (const [ruta, nombre, rol] of VISTAS) {
    await captura(ruta, nombre, rol, 1440)
    await captura(ruta, nombre, rol, 390)
  }

  // Probar aislamiento, con el resultado a la vista
  for (const ancho of [1440, 390]) {
    await captura('/#/plataforma/universidades', 'probar-aislamiento', 'super', ancho, async (page) => {
      await page.getByRole('button', { name: /Probar aislamiento/i }).first().click()
      await page.waitForTimeout(500)
      await page.getByRole('button', { name: /Correr la prueba/i }).click()
      await page.waitForTimeout(1500)
    })
  }

  // Propuesta con la inversión revelada
  for (const ancho of [1440, 390]) {
    await captura('/#/propuesta', 'propuesta-inversion-revelada', 'estudiante', ancho, async (page) => {
      await page.click('[data-ojito-inversion]')
      await page.waitForTimeout(800)
      await page.locator('#inversion').scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
    })
    await captura('/#/propuesta', 'propuesta-inversion-oculta', 'estudiante', ancho, async (page) => {
      await page.locator('#inversion').scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
    })
  }
} finally {
  await browser.close()
  cerrar()
}

console.log(problemas ? `\n✗ ${problemas} capturas con problemas` : `\n✓ pack de evidencia completo en ${dir}`)
process.exit(problemas ? 1 : 0)
