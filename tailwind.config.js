/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
colors: {
        primary: '#F5F5DC',
        secondary: '#F0E68C',
        accent: '#DDD5A7',
        surface: '#FDFDF5',
        creme: {
          50: '#FDFDF8',
          100: '#FAFAF2',
          200: '#F5F5DC',
          300: '#F0E68C',
          400: '#E6D875',
          500: '#DDD5A7',
          600: '#C4B969',
          700: '#A69F4B',
          800: '#8B8639',
          900: '#6B6629',
          950: '#4A4418',
        },
        brown: {
          50: '#FAF7F0',
          100: '#F3EDE0',
          200: '#E7D7C1',
          300: '#D4B896',
          400: '#C19A6B',
          500: '#A67C52',
          600: '#8B6635',
          700: '#70522A',
          800: '#5A4222',
          900: '#4A361C',
          950: '#2E2210',
        }
      },
      fontFamily: {
        sans: ['Proxima Nova', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 0.6s ease-in-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}