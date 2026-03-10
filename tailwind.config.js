/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elavon Primary Brand Colors
        elavon: {
          navy: '#002D5C',
          'navy-dark': '#001A3A',
          'navy-light': '#003F7F',
          blue: '#0073B1',
          'blue-light': '#0090DB',
          teal: '#00A3AD',
          'teal-light': '#00BFC9',
          'teal-dark': '#007A83',
        },
        // US Bank Integration Colors
        usbank: {
          primary: '#154273',
          secondary: '#0B2E52',
          accent: '#D4192C',
          gold: '#F5A623',
        },
        // Neutral Palette
        neutral: {
          50: '#F5F7FA',
          100: '#EBF0F7',
          200: '#D1DCE8',
          300: '#A8BECF',
          400: '#7B9AB5',
          500: '#5A7A96',
          600: '#3D5C78',
          700: '#2C445C',
          800: '#1C2E40',
          900: '#0F1A26',
        },
        // Semantic Colors
        success: {
          light: '#E8F8F0',
          DEFAULT: '#00875A',
          dark: '#005C3C',
        },
        warning: {
          light: '#FFF8E6',
          DEFAULT: '#FF8B00',
          dark: '#C06800',
        },
        danger: {
          light: '#FFECEB',
          DEFAULT: '#DE350B',
          dark: '#B22A08',
        },
        info: {
          light: '#E6F2FF',
          DEFAULT: '#0073B1',
          dark: '#005285',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 45, 92, 0.08), 0 1px 3px rgba(0, 45, 92, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 45, 92, 0.12), 0 4px 8px rgba(0, 45, 92, 0.08)',
        'modal': '0 20px 60px rgba(0, 45, 92, 0.2), 0 8px 24px rgba(0, 45, 92, 0.12)',
        'dropdown': '0 8px 24px rgba(0, 45, 92, 0.15)',
        'inner-card': 'inset 0 2px 6px rgba(0, 45, 92, 0.06)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'bounce-gentle': 'bounceGentle 0.5s ease',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceGentle: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
