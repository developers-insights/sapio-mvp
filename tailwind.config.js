/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Permitimos cualquier modificador de opacidad (text-marfil/78, bg-noche/92…):
      // la escala por defecto solo acepta múltiplos de 5 y silenciaba las clases.
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
      ),
      colors: {
        noche: { DEFAULT: '#101D2B', 700: '#1D3245', 800: '#172839', 900: '#101D2B' },
        marfil: { DEFAULT: '#F6F2E9', 200: '#EFE9DB', 300: '#E8E1D3' },
        champan: { DEFAULT: '#C9A974', 600: '#A8854B', 700: '#8A6B38' },
        mineral: {
          DEFAULT: '#527D79',
          // Para TEXTO: el verde del manual sobre marfil da 4.11:1 y no llega a AA.
          // Este token se aclara en oscuro y se oscurece en claro, vía variable CSS.
          texto: 'var(--mineral-texto)',
          600: '#456A66',
          700: '#3A5A57',
          300: '#9BBAB7',
        },
        pizarra: { DEFAULT: '#25465C', 600: '#1E3A4C' },
        terroso: { DEFAULT: '#9C5B4E', 600: '#854A3F' },
        tinta: { DEFAULT: '#101D2B', sec: '#5E6B72' },
        borde: '#E8E1D3',
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Tinos', 'Liberation Serif', 'Georgia', 'serif'],
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem' },
      boxShadow: {
        sapio: '0 1px 2px rgba(16,29,43,.04), 0 8px 24px -12px rgba(16,29,43,.14)',
        'sapio-lg': '0 2px 4px rgba(16,29,43,.05), 0 24px 56px -20px rgba(16,29,43,.22)',
        ring: '0 0 0 1px rgba(232,225,211,1)',
      },
      keyframes: {
        'anillo': { '0%': { transform: 'scale(1)', opacity: '.55' }, '100%': { transform: 'scale(1.28)', opacity: '0' } },
        'pulso': { '0%,100%': { opacity: '1' }, '50%': { opacity: '.35' } },
        'fade-up': { from: { opacity: '0', translate: '0 12px' }, to: { opacity: '1', translate: '0 0' } },
        'scale-in': { from: { opacity: '0', scale: '.95', translate: '0 12px' }, to: { opacity: '1', scale: '1', translate: '0 0' } },
        'dots': { '0%,80%,100%': { opacity: '.25' }, '40%': { opacity: '1' } },
        // Sin `translate`: el tooltip del tour se centra con translate inline y
        // una animación que lo anime se lo pisaría.
        'tip-in': { from: { opacity: '0', scale: '.96' }, to: { opacity: '1', scale: '1' } },
        'slide-up': { from: { translate: '0 100%' }, to: { translate: '0 0' } },
      },
      animation: {
        anillo: 'anillo 1.9s ease-out infinite',
        pulso: 'pulso 2.4s ease-in-out infinite',
        'fade-up': 'fade-up .5s cubic-bezier(.2,.7,.2,1) both',
        'scale-in': 'scale-in .3s cubic-bezier(.2,.7,.2,1) both',
        dots: 'dots 1.2s ease-in-out infinite',
        'tip-in': 'tip-in .22s cubic-bezier(.2,.7,.2,1) both',
        'slide-up': 'slide-up .3s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
