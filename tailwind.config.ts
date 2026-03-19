import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFCF8',
          100: '#F9F5EE',
          200: '#F4EDE0',
          300: '#ECE2D0',
          400: '#DED4BE',
          500: '#C9BDAA',
        },
        sky: {
          pale:  '#DCEEF7',
          light: '#B8D8EC',
          note:  '#7BB5D0',
          mid:   '#5A9AB8',
          deep:  '#3D7FA0',
        },
        warm: {
          50:  '#FAFAF6',
          100: '#F5F1EA',
          200: '#EDE6D9',
        },
        ink: {
          DEFAULT: '#2A2825',
          muted:   '#6B6560',
          subtle:  '#9E9890',
          faint:   '#C4BDB5',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.45' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.45s ease-out forwards',
        'slide-in':   'slide-in 0.3s ease-out forwards',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
        shimmer:      'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
