/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07090E',
        canvas: '#090B11',
        surface: '#121720',
        raised: '#171D28',

        line: '#283041',
        'line-soft': '#1D2330',

        fg: {
          hi: '#F7F8FB',
          mid: '#B5BDCD',
          low: '#707A90'
        },

        primary: {
          DEFAULT: '#121720',
          light: '#1B2230',
          dark: '#080A10'
        },

        brass: {
          DEFAULT: '#D4AF37',
          light: '#F1D488',
          dark: '#9C7B20',
          glow: 'rgba(212,175,55,.22)'
        },

        accent: {
          DEFAULT: '#14B8A6',
          light: '#55E5D4',
          dark: '#0D7C71'
        },

        danger: '#EF5350',
        amber: '#F5B942',
        success: '#22C55E'
      },

      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },

      boxShadow: {
        card:
          '0 1px 0 rgba(255,255,255,.03) inset,0 18px 40px -18px rgba(0,0,0,.75)',

        pop:
          '0 35px 70px -20px rgba(0,0,0,.80)',

        inset:
          'inset 0 1px 0 rgba(255,255,255,.05)',

        brass:
          '0 0 0 1px rgba(212,175,55,.30),0 18px 45px -15px rgba(212,175,55,.35)',

        glass:
          '0 8px 40px rgba(0,0,0,.45)',

        glow:
          '0 0 30px rgba(212,175,55,.18)'
      },

      borderRadius: {
        xl2: '1.35rem',
        xl3: '1.7rem'
      },

      transitionTimingFunction: {
        premium: 'cubic-bezier(.22,.61,.36,1)'
      },

      transitionDuration: {
        400: '400ms',
        600: '600ms'
      },

      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,.04) 1px, transparent 0)',

        'brass-fade':
          'linear-gradient(180deg, rgba(212,175,55,.35) 0%, rgba(212,175,55,0) 100%)',

        'premium-card':
          'linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.01))'
      },

      backdropBlur: {
        premium: '22px'
      }
    }
  },
  plugins: []
}