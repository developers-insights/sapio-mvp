import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import net from 'node:net'

export const ANCHOS = [360, 390, 768, 1024, 1280, 1440]

export const RUTAS_CLAVE = [
  ['/#/propuesta', 'propuesta'],
  ['/#/workplace', 'workplace'],
  ['/#/workplace/calendario', 'calendario'],
  ['/#/workplace/tareas', 'tareas'],
  ['/#/workplace/documentos', 'documentos'],
  ['/#/workplace/proyectos', 'proyectos'],
  ['/#/workplace/proyectos/pr-tesis', 'proyecto-detalle'],
  ['/#/workplace/notificaciones', 'notificaciones'],
  ['/#/workplace/mesas', 'mesas'],
  ['/#/mesa/tesis-metodologia', 'mesa-redonda'],
  ['/#/chat', 'chat-lista'],
  ['/#/chat/proyecto-tesis', 'chat'],
  ['/#/workplace/asistente', 'asistente'],
  ['/#/universidad/panel', 'uni-panel'],
  ['/#/universidad/miembros', 'uni-miembros'],
  ['/#/universidad/invitaciones?tab=profesores', 'uni-invitaciones-prof'],
  ['/#/universidad/invitaciones?tab=estudiantes', 'uni-invitaciones-csv'],
  ['/#/universidad/campus-editor', 'campus-editor'],
  ['/#/universidad/roles', 'uni-roles'],
  ['/#/universidad/suscripcion', 'suscripcion'],
  ['/#/plataforma/panel', 'plat-panel'],
  ['/#/plataforma/universidades', 'plat-universidades'],
  ['/#/plataforma/universidades/u-kestrel', 'plat-universidad-detalle'],
  ['/#/plataforma/planes', 'plat-planes'],
  ['/#/plataforma/roles', 'plat-roles'],
  ['/#/plataforma/auditoria', 'plat-auditoria'],
  ['/#/plataforma/seguridad', 'plat-seguridad'],
  ['/#/plataforma/marca', 'plat-marca'],
  ['/#/campus/northwood', 'campus-publico'],
  ['/#/proximamente', 'proximamente'],
  ['/#/invitacion/inv-demo-2026', 'invitacion'],
]

/** Rol con el que hay que entrar para ver cada ruta. */
export function rolDeRuta(ruta) {
  if (ruta.includes('/plataforma/')) return 'super'
  if (ruta.includes('/universidad/')) return 'universidad'
  return 'estudiante'
}

async function puertoLibre(desde = 4321) {
  for (let p = desde; p < desde + 40; p++) {
    const libre = await new Promise((res) => {
      const s = net.createServer()
      s.once('error', () => res(false))
      s.once('listening', () => s.close(() => res(true)))
      s.listen(p, '127.0.0.1')
    })
    if (libre) return p
  }
  throw new Error('sin puertos libres')
}

/** Levanta `npx serve dist` SIN el flag -s (a propósito: probamos el hash router). */
export async function servirDist() {
  const puerto = await puertoLibre()
  const proc = spawn('npx', ['--yes', 'serve', 'dist', '-l', String(puerto), '--no-clipboard'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const base = `http://127.0.0.1:${puerto}`
  await new Promise((res, rej) => {
    const limite = setTimeout(() => rej(new Error('serve no arrancó a tiempo')), 45000)
    const probar = async () => {
      try {
        const r = await fetch(base + '/index.html')
        if (r.ok) {
          clearTimeout(limite)
          res()
          return
        }
      } catch {
        /* todavía no */
      }
      setTimeout(probar, 400)
    }
    probar()
  })
  return { base, cerrar: () => proc.kill('SIGTERM') }
}

export async function abrirNavegador() {
  const browser = await chromium.launch()
  return browser
}

/** Entra a la demo por el login real y deja la sesión lista en el rol pedido. */
export async function entrar(page, base, rol = 'estudiante') {
  await page.goto(`${base}/#/login`, { waitUntil: 'load' })
  await page.evaluate(
    ([r]) => {
      sessionStorage.setItem('sapio_sesion', '1')
      sessionStorage.setItem('sapio_rol', r)
      sessionStorage.setItem('welcome_modal_seen', '1')
    },
    [rol],
  )
}

export async function irA(page, base, ruta, rol) {
  await entrar(page, base, rol)
  // goto a una URL que solo cambia el hash NO recarga el documento: el store ya
  // leyó sessionStorage vacío. Recargamos para que la sesión sembrada aplique.
  await page.goto(`${base}${ruta}`, { waitUntil: 'load' })
  await page.reload({ waitUntil: 'load' })
  await page.waitForTimeout(520)
}

export function recolectarConsola(page) {
  const errores = []
  page.on('console', (m) => {
    if (m.type() === 'error') errores.push(m.text())
  })
  page.on('pageerror', (e) => errores.push('pageerror: ' + e.message))
  return errores
}

export async function sinScrollHorizontal(page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
  )
}

/**
 * Siembra la sesión (y tema/idioma) ANTES de que corra cualquier script de la
 * página: así la primera navegación es directa a la ruta pedida, sin recargar.
 */
export async function sembrarSesion(ctx, rol = 'estudiante', extra = {}) {
  await ctx.addInitScript(
    ([r, ex]) => {
      try {
        sessionStorage.setItem('sapio_sesion', '1')
        sessionStorage.setItem('sapio_rol', r)
        sessionStorage.setItem('welcome_modal_seen', '1')
        for (const [k, v] of Object.entries(ex)) localStorage.setItem(k, v)
      } catch {
        /* modo privado */
      }
    },
    [rol, extra],
  )
}

/** Entrada directa a una ruta, con el contexto ya sembrado. */
export async function irDirecto(page, base, ruta) {
  await page.goto(`${base}${ruta}`, { waitUntil: 'load' })
  await page.waitForTimeout(520)
}
