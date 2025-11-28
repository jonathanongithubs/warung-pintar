/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'forest': {
          DEFAULT: '#114B3A',
          dark: '#0D3A2D',
        },
        'emerald-accent': '#2ECC71',
        'input-bg': 'rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
      },
      spacing: {
        'standard': '1rem',
        'input-gap': '1.25rem',
        'heading-form-gap': '3rem',
      },
      borderRadius: {
        'input': '8px',
        'button': '25px',
      },
    },
  },
  plugins: [],
}
