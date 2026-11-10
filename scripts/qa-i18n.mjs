#!/usr/bin/env node
/**
 * QA de i18n sobre las pantallas RENDERIZADAS (con navegador real), en ES y EN.
 * Sale con código distinto de cero si encuentra:
 *  1) claves crudas en el texto visible (palabras unidas por puntos, sin espacios),
 *  2) claves declaradas dos veces en archivos distintos del diccionario,
 *  3) claves usadas en el código que no existen en el diccionario.
 * Si no puede correr (falta el build o el navegador), sale con error: nunca pasa en verde por defecto.
 */
import fs from 'node:fs'
import path from 'node:path'
import { RUTAS_CLAVE, abrirNavegador, irA, rolDeRuta, servirDist } from './_comun.mjs'

const RAIZ = process.cwd()
const DIR_DIC = path.join(RAIZ, 'src/i18n/dic')
const DIR_SRC = path.join(RAIZ, 'src')

function archivos(dir, ext = ['.ts', '.tsx']) {
  const salida = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) salida.push(...archivos(p, ext))
    else if (ext.includes(path.extname(e.name))) salida.push(p)
  }
  return salida
}

// ── 2) claves duplicadas entre archivos del diccionario
const porArchivo = new Map()
for (const f of fs.readdirSync(DIR_DIC)) {
  if (!f.endsWith('.ts')) continue
  const txt = fs.readFileSync(path.join(DIR_DIC, f), 'utf8')
  const claves = new Set()
  for (const m of txt.matchAll(/^\s*'([^']+)'\s*:\s*\{\s*es:/gm)) claves.add(m[1])
  porArchivo.set(f.replace('.ts', ''), claves)
}
const dueno = new Map()
const duplicadas = []
for (const [archivo, claves] of porArchivo) {
  for (const c of claves) {
    if (dueno.has(c)) duplicadas.push(`${c} → ${dueno.get(c)}.ts + ${archivo}.ts`)
    else dueno.set(c, archivo)
  }
}
const declaradas = new Set(dueno.keys())

// ── 3) claves usadas en el código que no existen en el diccionario
const usadas = new Set()
const dinamicas = []
for (const f of archivos(DIR_SRC)) {
  if (f.includes(path.join('i18n', 'dic'))) continue
  const txt = fs.readFileSync(f, 'utf8')
  for (const m of txt.matchAll(/\bt\(\s*'([^']+)'/g)) usadas.add(m[1])
  for (const m of txt.matchAll(/\btr\(\s*'([^']+)'/g)) usadas.add(m[1])
  // claves armadas con template string: se reportan aparte, no se pueden resolver estáticamente
  for (const m of txt.matchAll(/\bt\(\s*`([^`]+)`/g)) dinamicas.push(`${path.relative(RAIZ, f)}: ${m[1]}`)
  for (const m of txt.matchAll(/claveLabel:\s*'([^']+)'/g)) usadas.add(m[1])
  for (const m of txt.matchAll(/claveKicker:\s*'([^']+)'/g)) usadas.add(m[1])
  for (const m of txt.matchAll(/clave(?:Nombre|Resumen|Titulo|Cuerpo|Bullet\d?):\s*'([^']+)'/g)) usadas.add(m[1])
  for (const m of txt.matchAll(/'(prop\.(?:mod\.\d+\.[a-z0-9]+|f[23]\.\d+))'/g)) usadas.add(m[1])
}
const faltantes = [...usadas].filter((c) => !declaradas.has(c)).sort()
const sinUsar = [...declaradas].filter((c) => !usadas.has(c))

// ── 1) claves crudas en el texto renderizado
if (!fs.existsSync('dist/index.html')) {
  console.error('✗ No pude correr qa:i18n: falta dist/. Corré `npm run build` primero.')
  process.exit(1)
}

const CRUDA = /\b[a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*){1,4}\b/g
const PERMITIDAS = [
  /\.sapio\.example$/i,
  /^sapio\.example$/i,
  /\.(?:com|org|net|edu|io|dev|ca|es|svg|png|json|ts|tsx|md|csv|pdf|webmanifest)$/i,
  /^\d/,
  /^v\d/i,
  /^[A-Z]{2,}\./,
  /^(?:index|package|render|tailwind|postcss|vite|tsconfig)\./i,
  /^src\./,
  /^0000-/,
]

let crudas = []
let crudasDetalle = []

const { base, cerrar } = await servirDist()
let browser
try {
  browser = await abrirNavegador()
} catch (e) {
  cerrar()
  console.error('✗ No pude correr qa:i18n: no se pudo abrir el navegador. ' + e.message)
  process.exit(1)
}

try {
  for (const lang of ['es', 'en']) {
    for (const [ruta, nombre] of RUTAS_CLAVE) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
      const page = await ctx.newPage()
      await page.goto(`${base}/#/login`, { waitUntil: 'load' })
      await page.evaluate((l) => localStorage.setItem('sapio_idioma', l), lang)
      await irA(page, base, ruta, rolDeRuta(ruta))
      const texto = await page.evaluate(() => document.body.innerText)
      const encontradas = new Set()
      for (const m of texto.matchAll(CRUDA)) {
        const tok = m[0]
        if (PERMITIDAS.some((re) => re.test(tok))) continue
        // Solo nos interesan tokens que EXISTEN como clave o tienen forma de clave de diccionario
        const pareceClave =
          declaradas.has(tok) ||
          /^(?:app|nav|estado|rol|login|prop|wp|mesa|chat|asist|uni|plat|campus|tour|dev|banner|guard|preview|interuni|buscador|welcome|toast|permiso|plan|prioridad)\./.test(
            tok,
          )
        if (pareceClave) encontradas.add(tok)
      }
      if (encontradas.size) {
        crudas.push(...encontradas)
        crudasDetalle.push(`${lang} · ${nombre}: ${[...encontradas].join(', ')}`)
      }
      await ctx.close()
    }
  }
} finally {
  await browser.close()
  cerrar()
}

crudas = [...new Set(crudas)]

console.log('\n── qa:i18n ───────────────────────────────')
console.log(`claves declaradas: ${declaradas.size}`)
console.log(`claves usadas en el código: ${usadas.size}`)
console.log(`claves con template string (revisión manual): ${dinamicas.length}`)
console.log(`claves declaradas sin uso directo: ${sinUsar.length}`)
console.log(`1) claves crudas en pantalla (ES+EN): ${crudas.length}`)
if (crudasDetalle.length) crudasDetalle.forEach((l) => console.log('   ' + l))
console.log(`2) claves duplicadas entre archivos: ${duplicadas.length}`)
if (duplicadas.length) duplicadas.forEach((l) => console.log('   ' + l))
console.log(`3) claves usadas que no existen: ${faltantes.length}`)
if (faltantes.length) faltantes.forEach((l) => console.log('   ' + l))

fs.mkdirSync('qa-salida', { recursive: true })
fs.writeFileSync(
  'qa-salida/i18n.json',
  JSON.stringify({ crudas, duplicadas, faltantes, dinamicas, sinUsar }, null, 2),
)

if (crudas.length || duplicadas.length || faltantes.length) {
  console.error('\n✗ qa:i18n EN ROJO')
  process.exit(1)
}
console.log('\n✓ qa:i18n en verde: cero claves crudas, cero duplicadas, cero faltantes')
