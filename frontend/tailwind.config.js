/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Пастельная палитра для романтического интерфейса
        blush: {
          50: '#FFF5F7',
          100: '#FFE4E9',
          200: '#FFC9D3',
          300: '#FFA8B8',
          400: '#FF8FA3',
          500: '#FF6B8A',
          600: '#F04E70',
          700: '#D63A5B',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FFF8F0',
          200: '#FFEFDD',
        },
        lavender: {
          50: '#F8F7FF',
          100: '#EFEDFF',
          200: '#DDD8FF',
          300: '#C4BCFF',
        },
        peach: {
          50: '#FFF9F5',
          100: '#FFF0E8',
          200: '#FFE0D0',
          300: '#FFC9AD',
        },
      },
      fontFamily: {
        sans: ['"Nunito"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(255, 107, 138, 0.08)',
        'soft-lg': '0 8px 40px rgba(255, 107, 138, 0.12)',
        'soft-xl': '0 12px 60px rgba(255, 107, 138, 0.15)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'float-heart': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-100vh) scale(1.2)', opacity: '0' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-heart': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'float-heart': 'float-heart 6s linear infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'pulse-heart': 'pulse-heart 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
