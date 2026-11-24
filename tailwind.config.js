/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'soft-dark': '0 8px 32px rgba(0, 0, 0, 0.4)',
        glow: '0 0 0 1px rgba(16, 185, 129, 0.18), 0 8px 28px rgba(16, 185, 129, 0.15)',
        'glow-lg': '0 0 0 1px rgba(16, 185, 129, 0.25), 0 12px 40px rgba(16, 185, 129, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
        'scale-in': 'scaleIn 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(16, 185, 129, 0.05) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 40% 20%, rgba(16, 185, 129, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.08) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
