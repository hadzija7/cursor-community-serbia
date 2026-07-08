import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cursor: {
          bg: '#14120b',
          'bg-dark': '#0f0d06',
          surface: '#1c1a12',
          'surface-raised': '#262318',
          text: '#edecec',
          'text-secondary': 'rgba(237,236,236,0.75)',
          'text-muted': 'rgba(237,236,236,0.55)',
          'text-faint': 'rgba(237,236,236,0.35)',
          border: 'rgba(237,236,236,0.08)',
          'border-emphasis': 'rgba(237,236,236,0.15)',
          overlay: 'rgba(237,236,236,0.05)',
          'accent-blue': '#a8b4c8',
          'accent-green': '#a8c4a0',
          'accent-red': '#c4a0a0',
          'accent-purple': '#b8a8c8',
          'accent-yellow': '#c8bfa0',
          'accent-orange': '#e8925a',
          'accent-blue-bg': 'rgba(26,29,46,0.3)',
          'accent-green-bg': 'rgba(26,36,24,0.3)',
          'accent-red-bg': 'rgba(42,26,24,0.3)',
          'accent-purple-bg': 'rgba(34,26,46,0.3)',
          'accent-yellow-bg': 'rgba(42,36,24,0.3)',
          'accent-orange-bg': 'rgba(232,146,90,0.18)',
        },
      },
      fontFamily: {
        sans: ['CursorGothic', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)'],
        cursor: ['var(--font-cursor)'],
        bsru: ['var(--font-bsru)'],
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        marquee: 'marquee 40s linear infinite',
        'marquee-right': 'marquee-right 28s linear infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
