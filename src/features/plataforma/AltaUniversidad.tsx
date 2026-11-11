import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, Check, Plus, X } from 'lucide-react'
import { dato, useT } from '@/i18n'
import { Modal } from '@/components/ui/Modal'
import { Boton } from '@/components/ui/Boton'
import { Campo, Casilla, Input, Select } from '@/components/ui/Campos'
import { AvatarUni } from '@/components/ui/Piezas'
import { claveFecha, dia } from '@/lib/fechas'
import { cn } from '@/lib/cn'
import type { Universidad } from '@/data/tipos'

/** Los seis pasos, en orden. El índice del arreglo es el paso. */
const PASOS = ['alta.p1', 'alta.p2', 'alta.p3', 'alta.p4', 'alta.p5', 'alta.p6'] as const

const TIPOS = ['publica', 'privada', 'instituto', 'escuela', 'centro'] as const
const PAISES = ['Argentina', 'España', 'Estados Unidos', 'Canadá', 'México', 'Chile', 'Colombia', 'Brasil', 'Reino Unido', 'Noruega'] as const
const ZONAS = ['America/Argentina/Buenos_Aires', 'America/New_York', 'America/Halifax', 'America/Mexico_City', 'America/Bogota', 'America/Sao_Paulo', 'Europe/Madrid', 'Europe/London', 'Europe/Oslo'] as const
const RESIDENCIAS = ['ue', 'us', 'latam', 'ca'] as const
const AUTENTICACIONES = ['email', 'google', 'microsoft', 'saml'] as const
const NIVELES = ['grado', 'posgrado', 'doctorado', 'continua'] as const
const CALENDARIOS = ['semestres', 'trimestres', 'cuatrimestres', 'anual'] as const
const FACULTADES_SUGERIDAS = ['Derecho', 'Administración', 'Ingeniería', 'Medicina', 'Economía', 'Ciencia de Datos', 'Humanidades', 'Educación'] as const
const COLORES = ['#101D2B', '#527D79', '#25465C', '#7B5E57', '#4C4A6B', '#C9A974'] as const

interface Formulario {
  nombreOficial: string
  nombreCorto: string
  tipo: string
  sitio: string
  codigo: string
  fundacion: string
  pais: string
  provincia: string
  ciudad: string
  direccion: string
  zonaHoraria: string
  idioma: 'es' | 'en'
  residencia: string
  slug: string
  dominioCorreo: string
  auth: string
  idp: string
  ssoUrl: string
  certificado: string
  mfa: boolean
  iniciales: string
  color: string
  facultades: string[]
  niveles: string[]
  calendario: string
  inicioCiclo: string
  usuarios: string
  respNombre: string
  respCargo: string
  respEmail: string
  respTelefono: string
  dpoNombre: string
  dpoEmail: string
  razonSocial: string
  idFiscal: string
  emailFactura: string
  plan: 'mensual' | 'anual'
  acuerdo: boolean
}

/**
 * Arranca con un ejemplo cargado: en una demo en vivo nadie quiere tipear
 * cuarenta campos, pero todos tienen que poder editarse y validarse.
 */
function formularioInicial(lang: 'es' | 'en'): Formulario {
  return {
    nombreOficial: lang === 'en' ? 'Ridgefield Institute of Advanced Studies' : 'Instituto Ridgefield de Estudios Avanzados',
    nombreCorto: lang === 'en' ? 'Ridgefield Institute' : 'Instituto Ridgefield',
    tipo: 'privada',
    sitio: 'https://www.ridgefield.example',
    codigo: '',
    fundacion: '1964',
    pais: 'Argentina',
    provincia: 'Buenos Aires',
    ciudad: 'La Plata',
    direccion: 'Av. de los Fundadores 1840',
    zonaHoraria: 'America/Argentina/Buenos_Aires',
    idioma: lang,
    residencia: 'latam',
    slug: 'ridgefield',
    dominioCorreo: '@ridgefield.example',
    auth: 'email',
    idp: '',
    ssoUrl: '',
    certificado: '',
    mfa: true,
    iniciales: 'IR',
    color: '#527D79',
    facultades: ['Derecho', 'Administración', 'Ingeniería'],
    niveles: ['grado', 'posgrado'],
    calendario: 'semestres',
    inicioCiclo: claveFecha(dia(45)),
    usuarios: '3200',
    respNombre: 'Irene Salvat',
    respCargo: lang === 'en' ? 'Academic Secretary' : 'Secretaria académica',
    respEmail: 'i.salvat@ridgefield.example',
    respTelefono: '+54 221 555 0142',
    dpoNombre: 'Marcos Lehner',
    dpoEmail: 'datos@ridgefield.example',
    razonSocial: lang === 'en' ? 'Ridgefield Educational Foundation' : 'Fundación Educativa Ridgefield',
    idFiscal: '30-71234567-9',
    emailFactura: 'administracion@ridgefield.example',
    plan: 'anual',
    acuerdo: false,
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AltaUniversidad({
  abierto,
  onCerrar,
  onCreada,
}: {
  abierto: boolean
  onCerrar: () => void
  onCreada: (u: Universidad) => void
}) {
  const { t, lang } = useT()
  const [paso, setPaso] = useState(0)
  const [f, setF] = useState<Formulario>(() => formularioInicial(lang))
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [nuevaFacultad, setNuevaFacultad] = useState('')
  const cuerpoRef = useRef<HTMLDivElement>(null)

  /**
   * Cada apertura arranca limpia y en el idioma de ese momento: el ejemplo
   * cargado se arma al abrir, no al montar, así nadie abre el formulario en
   * inglés y se encuentra el ejemplo en castellano.
   */
  useEffect(() => {
    if (!abierto) return
    setPaso(0)
    setErrores({})
    setNuevaFacultad('')
    setF(formularioInicial(lang))
  }, [abierto, lang])

  const set = <K extends keyof Formulario>(k: K, v: Formulario[K]) => {
    setF((prev) => ({ ...prev, [k]: v }))
    setErrores((prev) => {
      if (!prev[k as string]) return prev
      const { [k as string]: _, ...resto } = prev
      return resto
    })
  }

  /** Cada paso valida lo suyo: nunca se avanza con un obligatorio vacío. */
  function validar(n: number): Record<string, string> {
    const e: Record<string, string> = {}
    const pedir = (k: keyof Formulario) => {
      if (!String(f[k]).trim()) e[k] = t('alta.requerido')
    }
    if (n === 0) {
      pedir('nombreOficial')
      pedir('nombreCorto')
      pedir('sitio')
    }
    if (n === 1) {
      pedir('ciudad')
      pedir('provincia')
    }
    if (n === 2) {
      pedir('slug')
      if (f.slug.trim() && !/^[a-z0-9-]+$/.test(f.slug.trim())) e.slug = t('alta.formatoSubdominio')
      pedir('dominioCorreo')
      if (f.dominioCorreo.trim() && !f.dominioCorreo.trim().startsWith('@')) e.dominioCorreo = t('alta.formatoDominio')
      pedir('iniciales')
      if (f.auth === 'saml') {
        pedir('idp')
        pedir('ssoUrl')
        pedir('certificado')
      }
    }
    if (n === 3) {
      if (f.facultades.length === 0) e.facultades = t('alta.requeridoUno')
      if (f.niveles.length === 0) e.niveles = t('alta.requeridoUno')
      pedir('usuarios')
    }
    if (n === 4) {
      pedir('respNombre')
      pedir('respEmail')
      if (f.respEmail.trim() && !EMAIL.test(f.respEmail.trim())) e.respEmail = t('alta.formatoEmail')
      pedir('dpoEmail')
      if (f.dpoEmail.trim() && !EMAIL.test(f.dpoEmail.trim())) e.dpoEmail = t('alta.formatoEmail')
      pedir('razonSocial')
      pedir('emailFactura')
      if (f.emailFactura.trim() && !EMAIL.test(f.emailFactura.trim())) e.emailFactura = t('alta.formatoEmail')
      if (!f.acuerdo) e.acuerdo = t('alta.requerido')
    }
    return e
  }

  function alTope() {
    cuerpoRef.current?.closest('[data-modal-centrado]')?.scrollTo({ top: 0 })
  }

  function avanzar() {
    const e = validar(paso)
    setErrores(e)
    if (Object.keys(e).length) return
    setPaso((p) => Math.min(p + 1, PASOS.length - 1))
    alTope()
  }

  function retroceder() {
    setErrores({})
    setPaso((p) => Math.max(p - 1, 0))
    alTope()
  }

  function cerrarYReiniciar() {
    onCerrar()
  }

  function crear() {
    const u: Universidad = {
      id: `u-nueva-${f.slug || 'tenant'}`,
      nombre: f.nombreCorto.trim() || f.nombreOficial.trim(),
      slug: f.slug.trim(),
      pais: f.pais,
      ciudad: f.ciudad.trim(),
      plan: f.plan,
      estado: 'prueba',
      usuariosActivos: Number(f.usuarios) || 0,
      iniciales: f.iniciales.trim().toUpperCase().slice(0, 3),
      colorPrimario: f.color,
      colorAcento: '#C9A974',
      idioma: f.idioma,
      zonaHoraria: f.zonaHoraria,
      creada: dia(0),
      facultades: f.facultades,
      verificada: false,
    }
    onCreada(u)
    cerrarYReiniciar()
  }

  const esUltimo = paso === PASOS.length - 1

  return (
    <Modal
      abierto={abierto}
      onCerrar={cerrarYReiniciar}
      titulo={t('plat.uni.alta')}
      ancho={660}
      pie={
        <>
          <Boton variante="fantasma" onClick={cerrarYReiniciar}>{t('app.cancelar')}</Boton>
          <Boton variante="secundario" onClick={retroceder} disabled={paso === 0}>
            {t('alta.atras')}
          </Boton>
          {esUltimo ? (
            <Boton onClick={crear} data-alta="crear">
              <Check size={16} />
              {t('alta.crearEspacio')}
            </Boton>
          ) : (
            <Boton onClick={avanzar} data-alta="siguiente">{t('alta.siguiente')}</Boton>
          )}
        </>
      }
    >
      <div ref={cuerpoRef} className="space-y-5">
        <Progreso paso={paso} />

        <div>
          <h4 className="text-[15px] font-black">{t(PASOS[paso])}</h4>
          <p className="mt-1 text-[13px] leading-relaxed text-tinta-sec dark:text-marfil/60">
            {t(`${PASOS[paso]}.det`)}
          </p>
        </div>

        {Object.keys(errores).length ? (
          <p className="flex items-start gap-2 rounded-xl border border-terroso/40 bg-terroso/[.08] p-3 text-[13px] font-bold text-terroso-600 dark:text-[#d79a8c]">
            <AlertCircle size={15} className="mt-[2px] shrink-0" />
            {t('alta.faltan')}
          </p>
        ) : null}

        {paso === 0 ? (
          <div className="space-y-4">
            <CampoTexto label={t('alta.nombreOficial')} ayuda={t('alta.nombreOficial.ayuda')} error={errores.nombreOficial}>
              <Input value={f.nombreOficial} onChange={(e) => set('nombreOficial', e.target.value)} />
            </CampoTexto>
            <CampoTexto label={t('alta.nombreCorto')} ayuda={t('alta.nombreCorto.ayuda')} error={errores.nombreCorto}>
              <Input value={f.nombreCorto} onChange={(e) => set('nombreCorto', e.target.value)} />
            </CampoTexto>
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto label={t('alta.tipo')}>
                <Select value={f.tipo} onChange={(e) => set('tipo', e.target.value)}>
                  {TIPOS.map((v) => (
                    <option key={v} value={v}>{t(`alta.tipo.${v}`)}</option>
                  ))}
                </Select>
              </CampoTexto>
              <CampoTexto label={t('alta.fundacion')}>
                <Input value={f.fundacion} onChange={(e) => set('fundacion', e.target.value)} className="num" inputMode="numeric" maxLength={4} />
              </CampoTexto>
            </div>
            <CampoTexto label={t('alta.sitio')} error={errores.sitio}>
              <Input value={f.sitio} onChange={(e) => set('sitio', e.target.value)} className="num" />
            </CampoTexto>
            <CampoTexto label={`${t('alta.codigo')} · ${t('alta.opcional')}`} ayuda={t('alta.codigo.ayuda')}>
              <Input value={f.codigo} onChange={(e) => set('codigo', e.target.value)} className="num" placeholder="247542" />
            </CampoTexto>
          </div>
        ) : null}

        {paso === 1 ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto label={t('alta.pais')}>
                <Select value={f.pais} onChange={(e) => set('pais', e.target.value)}>
                  {PAISES.map((p) => (
                    <option key={p} value={p}>{dato(p, lang)}</option>
                  ))}
                </Select>
              </CampoTexto>
              <CampoTexto label={t('alta.provincia')} error={errores.provincia}>
                <Input value={f.provincia} onChange={(e) => set('provincia', e.target.value)} />
              </CampoTexto>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto label={t('alta.ciudad')} error={errores.ciudad}>
                <Input value={f.ciudad} onChange={(e) => set('ciudad', e.target.value)} />
              </CampoTexto>
              <CampoTexto label={t('alta.direccion')}>
                <Input value={f.direccion} onChange={(e) => set('direccion', e.target.value)} />
              </CampoTexto>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto label={t('plat.uni.zona')}>
                <Select value={f.zonaHoraria} onChange={(e) => set('zonaHoraria', e.target.value)} className="num">
                  {ZONAS.map((z) => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </Select>
              </CampoTexto>
              <CampoTexto label={t('plat.uni.idioma')}>
                <Select value={f.idioma} onChange={(e) => set('idioma', e.target.value as 'es' | 'en')}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </Select>
              </CampoTexto>
            </div>
            <CampoTexto label={t('alta.residencia')} ayuda={t('alta.residencia.ayuda')}>
              <Select value={f.residencia} onChange={(e) => set('residencia', e.target.value)}>
                {RESIDENCIAS.map((r) => (
                  <option key={r} value={r}>{t(`alta.residencia.${r}`)}</option>
                ))}
              </Select>
            </CampoTexto>
          </div>
        ) : null}

        {paso === 2 ? (
          <div className="space-y-4">
            <CampoTexto
              label={t('plat.uni.subdominio')}
              ayuda={`${f.slug.trim() || 'tenant'}.sapio.example`}
              error={errores.slug}
            >
              <Input
                value={f.slug}
                onChange={(e) => set('slug', e.target.value.toLowerCase())}
                className="num"
              />
            </CampoTexto>
            <CampoTexto label={t('alta.dominioCorreo')} ayuda={t('alta.dominioCorreo.ayuda')} error={errores.dominioCorreo}>
              <Input value={f.dominioCorreo} onChange={(e) => set('dominioCorreo', e.target.value)} className="num" />
            </CampoTexto>
            <CampoTexto label={t('alta.auth')}>
              <Select value={f.auth} onChange={(e) => set('auth', e.target.value)}>
                {AUTENTICACIONES.map((a) => (
                  <option key={a} value={a}>{t(`alta.auth.${a}`)}</option>
                ))}
              </Select>
            </CampoTexto>
            {f.auth === 'saml' ? (
              <div className="space-y-4 rounded-xl border border-mineral/35 bg-mineral/[.06] p-3.5">
                <p className="text-[12.5px] font-bold leading-snug text-mineral-texto">{t('alta.saml.ayuda')}</p>
                <CampoTexto label={t('alta.idp')} error={errores.idp}>
                  <Input value={f.idp} onChange={(e) => set('idp', e.target.value)} className="num" placeholder="urn:ridgefield:idp" />
                </CampoTexto>
                <CampoTexto label={t('alta.ssoUrl')} error={errores.ssoUrl}>
                  <Input value={f.ssoUrl} onChange={(e) => set('ssoUrl', e.target.value)} className="num" placeholder="https://sso.ridgefield.example/saml" />
                </CampoTexto>
                <CampoTexto label={t('alta.certificado')} error={errores.certificado}>
                  <Input value={f.certificado} onChange={(e) => set('certificado', e.target.value)} className="num" placeholder="A3:5F:9C:…" />
                </CampoTexto>
              </div>
            ) : null}
            <Casilla activo={f.mfa} onChange={(v) => set('mfa', v)} label={t('alta.mfa')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto label={t('plat.uni.logo')} error={errores.iniciales}>
                <Input
                  value={f.iniciales}
                  maxLength={3}
                  onChange={(e) => set('iniciales', e.target.value.toUpperCase())}
                />
              </CampoTexto>
              <CampoTexto label={t('alta.vistaPrevia')}>
                <div className="flex min-h-[44px] items-center gap-2.5 rounded-xl border border-borde bg-marfil-200/50 px-3 dark:border-[#27425a] dark:bg-noche-700/40">
                  <AvatarUni iniciales={f.iniciales || '··'} color={f.color} size={30} />
                  <span className="truncate text-[13px] font-bold">{f.nombreCorto}</span>
                </div>
              </CampoTexto>
            </div>
            <CampoTexto label={t('alta.color')}>
              <div className="flex flex-wrap items-center gap-2">
                {COLORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set('color', c)}
                    aria-label={c}
                    aria-pressed={f.color === c}
                    className={cn(
                      'h-11 w-11 rounded-xl border-2 transition-colors',
                      f.color === c ? 'border-noche dark:border-marfil' : 'border-transparent',
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </CampoTexto>
          </div>
        ) : null}

        {paso === 3 ? (
          <div className="space-y-5">
            <div>
              <CampoTexto label={t('alta.facultades')} ayuda={t('alta.facultades.ayuda')} error={errores.facultades}>
                <div className="flex gap-2">
                  <Input
                    value={nuevaFacultad}
                    onChange={(e) => setNuevaFacultad(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      e.preventDefault()
                      agregarFacultad()
                    }}
                    className="min-w-0 flex-1"
                  />
                  <Boton variante="secundario" onClick={agregarFacultad} className="shrink-0">
                    <Plus size={15} />
                    {t('alta.agregar')}
                  </Boton>
                </div>
              </CampoTexto>
              {f.facultades.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {f.facultades.map((fa) => (
                    <li key={fa}>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-borde bg-marfil-200/70 py-1 pl-3 pr-1 text-[12.5px] font-bold dark:border-[#27425a] dark:bg-noche-700/60">
                        {dato(fa, lang)}
                        <button
                          type="button"
                          onClick={() => set('facultades', f.facultades.filter((x) => x !== fa))}
                          aria-label={t('alta.quitar', { nombre: dato(fa, lang) })}
                          className="grid h-6 w-6 place-items-center rounded-full text-tinta-sec transition-colors hover:bg-terroso/15 hover:text-terroso-600 dark:text-marfil/60"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
                {t('alta.sugeridas')}
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {FACULTADES_SUGERIDAS.filter((s) => !f.facultades.includes(s)).map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => set('facultades', [...f.facultades, s])}
                      className="rounded-full border border-dashed border-borde px-3 py-1.5 text-[12.5px] font-bold text-tinta-sec transition-colors hover:border-mineral hover:text-mineral-texto dark:border-[#27425a] dark:text-marfil/60"
                    >
                      + {dato(s, lang)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
                {t('alta.niveles')}
              </p>
              <div className="grid gap-x-4 sm:grid-cols-2">
                {NIVELES.map((n) => (
                  <Casilla
                    key={n}
                    activo={f.niveles.includes(n)}
                    onChange={(v) => set('niveles', v ? [...f.niveles, n] : f.niveles.filter((x) => x !== n))}
                    label={t(`alta.nivel.${n}`)}
                  />
                ))}
              </div>
              {errores.niveles ? <ErrorCampo texto={errores.niveles} /> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <CampoTexto label={t('alta.calendario')}>
                <Select value={f.calendario} onChange={(e) => set('calendario', e.target.value)}>
                  {CALENDARIOS.map((c) => (
                    <option key={c} value={c}>{t(`alta.calendario.${c}`)}</option>
                  ))}
                </Select>
              </CampoTexto>
              <CampoTexto label={t('alta.inicioCiclo')}>
                <Input type="date" value={f.inicioCiclo} onChange={(e) => set('inicioCiclo', e.target.value)} className="num" />
              </CampoTexto>
            </div>
            <CampoTexto label={t('alta.usuarios')} ayuda={t('alta.usuarios.ayuda')} error={errores.usuarios}>
              <Input
                value={f.usuarios}
                onChange={(e) => set('usuarios', e.target.value.replace(/\D/g, ''))}
                className="num"
                inputMode="numeric"
              />
            </CampoTexto>
          </div>
        ) : null}

        {paso === 4 ? (
          <div className="space-y-5">
            <Grupo titulo={t('alta.responsable')} ayuda={t('alta.responsable.ayuda')}>
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoTexto label={t('alta.nombrePersona')} error={errores.respNombre}>
                  <Input value={f.respNombre} onChange={(e) => set('respNombre', e.target.value)} />
                </CampoTexto>
                <CampoTexto label={t('alta.cargo')}>
                  <Input value={f.respCargo} onChange={(e) => set('respCargo', e.target.value)} />
                </CampoTexto>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoTexto label={t('alta.email')} error={errores.respEmail}>
                  <Input value={f.respEmail} onChange={(e) => set('respEmail', e.target.value)} className="num" type="email" />
                </CampoTexto>
                <CampoTexto label={t('alta.telefono')}>
                  <Input value={f.respTelefono} onChange={(e) => set('respTelefono', e.target.value)} className="num" type="tel" />
                </CampoTexto>
              </div>
            </Grupo>

            <Grupo titulo={t('alta.dpo')} ayuda={t('alta.dpo.ayuda')}>
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoTexto label={t('alta.nombrePersona')}>
                  <Input value={f.dpoNombre} onChange={(e) => set('dpoNombre', e.target.value)} />
                </CampoTexto>
                <CampoTexto label={t('alta.email')} error={errores.dpoEmail}>
                  <Input value={f.dpoEmail} onChange={(e) => set('dpoEmail', e.target.value)} className="num" type="email" />
                </CampoTexto>
              </div>
            </Grupo>

            <Grupo titulo={t('alta.facturacion')}>
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoTexto label={t('alta.razonSocial')} error={errores.razonSocial}>
                  <Input value={f.razonSocial} onChange={(e) => set('razonSocial', e.target.value)} />
                </CampoTexto>
                <CampoTexto label={t('alta.idFiscal')} ayuda={t('alta.idFiscal.ayuda')}>
                  <Input value={f.idFiscal} onChange={(e) => set('idFiscal', e.target.value)} className="num" />
                </CampoTexto>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoTexto label={t('alta.emailFactura')} error={errores.emailFactura}>
                  <Input value={f.emailFactura} onChange={(e) => set('emailFactura', e.target.value)} className="num" type="email" />
                </CampoTexto>
                <CampoTexto label={t('alta.plan')}>
                  <Select value={f.plan} onChange={(e) => set('plan', e.target.value as 'mensual' | 'anual')}>
                    <option value="mensual">{t('plan.mensual')}</option>
                    <option value="anual">{t('plan.anual')}</option>
                  </Select>
                </CampoTexto>
              </div>
            </Grupo>

            <div
              className={cn(
                'rounded-xl border p-3.5',
                errores.acuerdo
                  ? 'border-terroso/50 bg-terroso/[.07]'
                  : 'border-borde dark:border-[#27425a]',
              )}
            >
              <Casilla activo={f.acuerdo} onChange={(v) => set('acuerdo', v)} label={t('alta.acuerdo')} />
              <p className="mt-1 text-xs leading-relaxed text-tinta-sec dark:text-marfil/50">
                {t('alta.acuerdo.ayuda')}
              </p>
              {errores.acuerdo ? <ErrorCampo texto={errores.acuerdo} /> : null}
            </div>
          </div>
        ) : null}

        {paso === 5 ? <Revision f={f} /> : null}
      </div>
    </Modal>
  )

  function agregarFacultad() {
    const v = nuevaFacultad.trim()
    if (!v || f.facultades.includes(v)) return
    set('facultades', [...f.facultades, v])
    setNuevaFacultad('')
  }
}

/** Barra de avance: a 360px no entra una fila de seis círculos con texto. */
function Progreso({ paso }: { paso: number }) {
  const { t } = useT()
  const pct = ((paso + 1) / PASOS.length) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="num text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
          {t('alta.paso', { n: paso + 1, total: PASOS.length })}
        </p>
        <p className="num text-[11px] font-bold text-mineral-texto">{Math.round(pct)}%</p>
      </div>
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-marfil-200 dark:bg-noche-700">
        <span
          className="block h-full rounded-full bg-mineral transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </span>
    </div>
  )
}

function Grupo({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h5 className="text-[13px] font-black uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/60">
          {titulo}
        </h5>
        {ayuda ? (
          <p className="mt-1 text-xs leading-relaxed text-tinta-sec dark:text-marfil/50">{ayuda}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function ErrorCampo({ texto }: { texto: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-terroso-600 dark:text-[#d79a8c]">
      <AlertCircle size={13} className="shrink-0" />
      {texto}
    </p>
  )
}

function CampoTexto({
  label,
  ayuda,
  error,
  children,
}: {
  label: string
  ayuda?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <Campo label={label} ayuda={error ? undefined : ayuda}>
        {children}
      </Campo>
      {error ? <ErrorCampo texto={error} /> : null}
    </div>
  )
}

/** Lee de vuelta lo cargado: es el último control antes de abrir el espacio. */
function Revision({ f }: { f: Formulario }) {
  const { t, lang } = useT()
  const filas = useMemo(
    () => [
      [t('alta.nombreOficial'), f.nombreOficial],
      [t('alta.nombreCorto'), f.nombreCorto],
      [t('alta.tipo'), t(`alta.tipo.${f.tipo}`)],
      [t('alta.sitio'), f.sitio],
      [t('alta.codigo'), f.codigo],
      [t('alta.fundacion'), f.fundacion],
      [t('alta.pais'), dato(f.pais, lang)],
      [t('alta.provincia'), f.provincia],
      [t('alta.ciudad'), f.ciudad],
      [t('alta.direccion'), f.direccion],
      [t('plat.uni.zona'), f.zonaHoraria],
      [t('plat.uni.idioma'), f.idioma === 'en' ? 'English' : 'Español'],
      [t('alta.residencia'), t(`alta.residencia.${f.residencia}`)],
      [t('alta.revision.subdominio'), `${f.slug}.sapio.example`],
      [t('alta.dominioCorreo'), f.dominioCorreo],
      [t('alta.auth'), t(`alta.auth.${f.auth}`)],
      [t('alta.mfa'), f.mfa ? t('alta.mfa.si') : t('alta.mfa.no')],
      [t('alta.facultades'), f.facultades.map((x) => dato(x, lang)).join(' · ')],
      [t('alta.niveles'), f.niveles.map((n) => t(`alta.nivel.${n}`)).join(' · ')],
      [t('alta.calendario'), t(`alta.calendario.${f.calendario}`)],
      [t('alta.inicioCiclo'), f.inicioCiclo],
      [t('alta.usuarios'), f.usuarios],
      [t('alta.responsable'), `${f.respNombre} · ${f.respEmail}`],
      [t('alta.dpo'), `${f.dpoNombre} · ${f.dpoEmail}`],
      [t('alta.razonSocial'), f.razonSocial],
      [t('alta.idFiscal'), f.idFiscal],
      [t('alta.emailFactura'), f.emailFactura],
      [t('alta.plan'), t(`plan.${f.plan}`)],
      [t('alta.acuerdo'), f.acuerdo ? t('alta.acuerdo.si') : t('alta.acuerdo.no')],
    ],
    [f, lang, t],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-borde p-3.5 dark:border-[#27425a]">
        <AvatarUni iniciales={f.iniciales || '··'} color={f.color} size={40} />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-black">{f.nombreCorto}</p>
          <p className="num truncate text-[12px] text-tinta-sec dark:text-marfil/55">
            {f.slug}.sapio.example
          </p>
        </div>
      </div>
      <dl className="grid gap-x-5 gap-y-3 sm:grid-cols-2">
        {filas.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[11px] font-bold uppercase tracking-[0.1em] text-tinta-sec dark:text-marfil/50">
              {k}
            </dt>
            <dd className="mt-0.5 break-words text-[13px] font-bold">
              {v || <span className="font-normal text-tinta-sec/70 dark:text-marfil/35">{t('alta.revision.sinDato')}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
