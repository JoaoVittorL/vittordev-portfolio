/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Corpo de texto: Inter (neutro, legível)
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Títulos com personalidade — quebra o "Inter em tudo"
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Borda padrão (classes `border` sem cor explícita)
      borderColor: {
        DEFAULT: '#1E293B', // slate-800
      },
      colors: {
        // === ACENTO ÚNICO (teal) ===
        // Para trocar a identidade inteira, mude só estes valores.
        // Uso primário: accent-400 (#2DD4BF); hover: accent-300.
        accent: {
          DEFAULT: '#2DD4BF',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
