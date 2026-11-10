#!/usr/bin/env node
/**
 * PORTÓN DE CALIDAD. Corre los chequeos que no cubren qa:responsive,
 * qa:i18n ni qa:rutas, y falla con detalle si algo está en rojo:
 *  A · login de cada rol aterriza en /propuesta
 *  B · el ojito de la inversión revela, oculta y vuelve a arrancar oculto tras recargar
 *  C · los 13 "Ver en el demo" abren su ruta con el rol y el modo correctos,
 *      la pantalla poblada, el botón de retorno y el resalte al volver
 *  D · modales centrados: desvío medido en 1440×900, 1920×854 y 375×812
 *  E · consola limpia en todas las vistas clave
 */
import fs from 'node:fs'
import { RUTAS_CLAVE, abrirNavegador, irA, recolectarConsola, rolDeRuta, servirDist } from './_comun.mjs'

if (!fs.existsSync('dist/index.html')) {
  console.error('✗ falta dist/. Corré `npm run build` antes del portón.')
  process.exit(1)
}

const MODULOS = [
  [1, '#/plataforma/universidades', 'Probar aislamiento', 'super'],
  [2, '#/plataforma/roles', 'Roles y permisos', 'super'],
  [3, '#/universidad/campus-editor', 'Editor del campus', 'universidad'],
  [4, '#/universidad/invitaciones?tab=profesores', 'esperan aprobación', 'universidad'],
  [5, '#/universidad/invitaciones?tab=estudiantes', 'filas válidas', 'universidad'],
  [6, '#/workplace', 'Resumen del día', 'estudiante'],
  [7, '#/mesa/tesis-metodologia', 'Metodología', 'estudiante'],
  [8, '#/chat/proyecto-tesis', 'tesis-ale-hernandez', 'estudiante'],
  [9, '#/workplace/asistente', 'Asistente', 'estudiante'],
  [10, '#/universidad/suscripcion', 'Suscripción', 'universidad'],
  [11, '#/plataforma/panel', 'Panel de la plataforma', 'super'],
  [12, '#/plataforma/auditoria', 'Registro de auditoría', 'super'],
  [13, '#/plataforma/marca', 'Sistema de diseño', 'super'],
]

const ROLES = [
  ['Súper usuario', 'super'],
  ['Universidad', 'universidad'],
  ['Profesor', 'profesor'],
  ['Estudiante', 'estudiante'],
  ['Colaborador', 'colaborador'],
]

const VIEWPORTS = [
  [1440, 900],
  [1920, 854],
  [375, 812],
]

const { base, cerrar } = await servirDist()
const browser = await abrirNavegador()
let fallos = 0
const evidencia = { login: [], ojito: {}, modulos: [], modales: [], consola: [] }

const limpio = (e) => !/favicon|manifest|fonts\.googleapis|Download the React DevTools/i.test(e)

try {
  // ── A · login de cada rol → /propuesta
  console.log('\n── A · El login de cada rol aterriza en /propuesta ──')
  for (const [etiqueta, rol] of ROLES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } })
    const page = await ctx.newPage()
    const errores = recolectarConsola(page)
    await page.goto(`${base}/#/login`, { waitUntil: 'load' })
    await page.waitForTimeout(700)
    await page.getByRole('button', { name: new RegExp(`^${etiqueta}$`, 'i') }).first().click()
    await page.getByRole('button', { name: /^Entrar$/ }).click()
    await page.waitForTimeout(1200)
    const hash = await page.evaluate(() => location.hash)
    const welcome = await page.evaluate(() => document.body.innerText.includes('Hola Ale'))
    const ok = hash.startsWith('#/propuesta') && errores.filter(limpio).length === 0
    if (!ok) fallos++
    evidencia.login.push({ rol, hash, welcome, ok })
    console.log(`${ok ? '✓' : '✗'} ${etiqueta.padEnd(14)} → ${hash}   welcome=${welcome}`)
    await ctx.close()
  }

  // ── B · ojito de la inversión
  console.log('\n── B · El ojito de la inversión ──')
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } })
    const page = await ctx.newPage()
    const errores = recolectarConsola(page)
    await irA(page, base, '/#/propuesta', 'estudiante')
    const hay = () => page.evaluate(() => document.body.innerText.includes('USD 16,000'))
    const ocultoInicial = !(await hay())
    await page.click('[data-ojito-inversion]')
    await page.waitForTimeout(700)
    const revelado = await page.evaluate(
      () =>
        document.body.innerText.includes('USD 16,000') &&
        document.body.innerText.includes('USD 13,600') &&
        document.body.innerText.includes('USD 40,000') &&
        document.body.innerText.includes('USD 97'),
    )
    await page.click('[data-ojito-inversion]')
    await page.waitForTimeout(600)
    const vueltoAOcultar = !(await hay())
    await page.reload({ waitUntil: 'load' })
    await page.waitForTimeout(900)
    const ocultoTrasRecarga = !(await hay())
    const ok = ocultoInicial && revelado && vueltoAOcultar && ocultoTrasRecarga && errores.filter(limpio).length === 0
    if (!ok) fallos++
    evidencia.ojito = { ocultoInicial, revelado, vueltoAOcultar, ocultoTrasRecarga }
    console.log(
      `${ok ? '✓' : '✗'} arranca oculto=${ocultoInicial}  revela todo=${revelado}  vuelve a ocultar=${vueltoAOcultar}  oculto tras F5=${ocultoTrasRecarga}`,
    )
    await ctx.close()
  }

  // ── C · los 13 "Ver en el demo"
  console.log('\n── C · "Ver en el demo" de los 13 módulos ──')
  for (const [n, ruta, texto, rolDestino] of MODULOS) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } })
    const page = await ctx.newPage()
    const errores = recolectarConsola(page)
    await irA(page, base, '/#/propuesta', 'estudiante')
    const tarjeta = page.locator(`#modulo-${n}`)
    await tarjeta.scrollIntoViewIfNeeded()
    await tarjeta.getByRole('button', { name: /Ver en el demo/i }).click()
    await page.waitForTimeout(1300)
    const hash = await page.evaluate(() => location.hash)
    const cuerpo = await page.evaluate(() => document.body.innerText)
    const rolActivo = await page.evaluate(() => sessionStorage.getItem('sapio_rol'))
    const enCampus = await page.evaluate(() => Boolean(document.querySelector('[data-trailer="campus-portada"]')))
    const rutaOk = hash.includes(ruta.slice(1))
    const pobladaOk = cuerpo.includes(texto)
    const retornoOk = await page.evaluate(() => Boolean(document.querySelector('[data-preview-retorno]')))
    const rolOk = rolActivo === rolDestino
    const modoOk = enCampus === false
    let resalteOk = false
    if (retornoOk) {
      await page.getByRole('button', { name: /Volver a la propuesta/i }).click()
      await page.waitForTimeout(1200)
      resalteOk = await page.evaluate((mod) => {
        const el = document.getElementById('modulo-' + mod)
        return Boolean(el && el.className.includes('ring-2'))
      }, n)
    }
    const rolRestaurado = await page.evaluate(() => sessionStorage.getItem('sapio_rol'))
    const errs = errores.filter(limpio)
    const ok = rutaOk && pobladaOk && retornoOk && rolOk && modoOk && resalteOk && rolRestaurado === 'estudiante' && !errs.length
    if (!ok) fallos++
    evidencia.modulos.push({ n, hash, rolActivo, rolRestaurado, rutaOk, pobladaOk, retornoOk, resalteOk, errores: errs })
    console.log(
      `${ok ? '✓' : '✗'} módulo ${String(n).padStart(2)} → ${ruta.padEnd(42)} rol=${rolActivo} ruta=${rutaOk} poblada=${pobladaOk} retorno=${retornoOk} resalte=${resalteOk} rolRestaurado=${rolRestaurado}` +
        (errs.length ? `\n     consola: ${errs.join(' | ')}` : ''),
    )
    await ctx.close()
  }

  // ── D · modales centrados
  console.log('\n── D · Modales centrados (desvío del centro, en px) ──')
  for (const [w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    const page = await ctx.newPage()
    // Login real: el Welcome aparece ~400ms después, una vez por sesión.
    await page.goto(`${base}/#/login`, { waitUntil: 'load' })
    await page.waitForTimeout(700)
    await page.getByRole('button', { name: /^Estudiante$/i }).first().click()
    await page.getByRole('button', { name: /^Entrar$/ }).click()
    await page.waitForTimeout(1600)
    const medida = await page.evaluate(() => {
      const el = document.querySelector('[data-modal-centrado]')
      if (!el) return null
      const r = el.getBoundingClientRect()
      return {
        dx: Math.round((r.left + r.width / 2 - innerWidth / 2) * 100) / 100,
        dy: Math.round((r.top + r.height / 2 - innerHeight / 2) * 100) / 100,
        ancho: Math.round(r.width),
        alto: Math.round(r.height),
      }
    })
    // Tolerancia sub-pixel: con alturas impares el centro cae en .5 y el
    // navegador redondea. Cualquier desvío por debajo de medio píxel es exacto.
    const ok = medida !== null && Math.abs(medida.dx) < 0.5 && Math.abs(medida.dy) < 0.5
    if (!ok) fallos++
    evidencia.modales.push({ viewport: `${w}x${h}`, ...(medida ?? {}) })
    console.log(
      `${ok ? '\u2713' : '\u2717'} ${String(w).padStart(4)}x${String(h).padEnd(4)} Welcome ${medida ? `(${medida.ancho}x${medida.alto}px)` : ''} -> desvio x=${medida?.dx ?? 'sin modal'}px  y=${medida?.dy ?? 'sin modal'}px`,
    )
    await ctx.close()
  }

  // ── E · consola limpia en todas las vistas clave
  console.log('\n── E · Consola limpia en cada vista ──')
  for (const [ruta, nombre] of RUTAS_CLAVE) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page = await ctx.newPage()
    const errores = recolectarConsola(page)
    await irA(page, base, ruta, rolDeRuta(ruta))
    // La mesa redonda se mide CON el guion corriendo.
    await page.waitForTimeout(ruta.includes('/mesa/') ? 9000 : 900)
    const errs = errores.filter(limpio)
    if (errs.length) fallos++
    evidencia.consola.push({ vista: nombre, errores: errs })
    console.log(`${errs.length ? '✗' : '✓'} ${nombre.padEnd(24)} ${errs.length ? errs.join(' | ') : 'sin errores'}`)
    await ctx.close()
  }
} finally {
  await browser.close()
  cerrar()
}

fs.mkdirSync('qa-salida', { recursive: true })
fs.writeFileSync('qa-salida/porton.json', JSON.stringify(evidencia, null, 2))

if (fallos) {
  console.error(`\n✗ PORTÓN EN ROJO: ${fallos} chequeos fallaron`)
  process.exit(1)
}
console.log('\n✓ PORTÓN EN VERDE')
