/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#f2590d',
        'background-light': '#f8f6f5',
        'background-dark': '#221610',
        'surface-light': '#ffffff',
        'surface-dark': '#2d201a',
      },
      fontFamily: {
        display: ['Work Sans', 'Noto Sans', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
