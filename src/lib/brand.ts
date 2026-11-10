/**
 * Fuente única de la marca Sapio.
 * Los valores salen del Manual de Identidad de Marca (Concept Edition 2026).
 * El manual aclara que el logotipo está "propuesto para validación de marca y
 * registro": al validarse, se reemplaza TODO acá y en src/assets/brand/.
 */
export const BRAND = {
  nombre: 'sapio',
  nombreDisplay: 'Sapio',
  claim: { es: 'El conocimiento crea posibilidades.', en: 'Knowledge creates possibilities.' },
  claimCorto: { es: 'Descubrí. Conectá. Creá.', en: 'Discover. Connect. Create.' },
  promesa: { es: 'Tu siguiente etapa comienza aquí.', en: 'Your next chapter starts here.' },
  estado: 'Logotipo propuesto para validación de marca y registro.',
  color: {
    noche: '#101D2B',
    marfil: '#F6F2E9',
    champan: '#C9A974',
    mineral: '#527D79',
    pizarra: '#25465C',
    blanco: '#FFFFFF',
    borde: '#E8E1D3',
    textoSec: '#5E6B72',
    error: '#9C5B4E',
    superficieOscura: '#172839',
    superficieOscura2: '#1D3245',
  },
  proporcion: [
    { nombre: 'Marfil', hex: '#F6F2E9', pct: 45, uso: { es: 'Calma / fondo principal', en: 'Calm / main background' } },
    { nombre: 'Azul noche', hex: '#101D2B', pct: 35, uso: { es: 'Autoridad / fondos oscuros', en: 'Authority / dark backgrounds' } },
    { nombre: 'Verde mineral', hex: '#527D79', pct: 10, uso: { es: 'Progreso / acentos', en: 'Progress / accents' } },
    { nombre: 'Azul pizarra', hex: '#25465C', pct: 7, uso: { es: 'Componentes de interfaz', en: 'UI components' } },
    { nombre: 'Champán', hex: '#C9A974', pct: 3, uso: { es: 'Prestigio / solo detalle', en: 'Prestige / detail only' } },
  ],
  tipografia: {
    titulos: 'Lato Heavy (900)',
    interfaz: 'Lato Regular / Bold (400 / 700)',
    acento: 'Tinos Italic (compatible con Liberation Serif Italic)',
    jerarquia: { h1: '48–64 px', h2: '30–40 px', cuerpo: '16–18 px', etiquetas: '12–14 px' },
  },
  logo: {
    /** Área de protección: 3× el diámetro del punto del símbolo. */
    areaProteccionFactorPunto: 3,
    tamanoMinimoIsotipoPx: 24,
    tamanoMinimoFirmaPx: 110,
  },
  whatsapp:
    'https://wa.me/5491139375146?text=Vi%20el%20demo%20de%20Sapio%2C%20quiero%20que%20avancemos',
  estudio: 'Insights',
  dominioDemo: 'sapio.example',
} as const

export type BrandColor = keyof typeof BRAND.color
