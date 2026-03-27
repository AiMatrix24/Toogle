/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eef7ff', 100: '#d9edff', 200: '#bce0ff', 300: '#8eccff', 400: '#59b0ff', 500: '#338dff', 600: '#1a6df5', 700: '#1357e1', 800: '#1647b6', 900: '#183e8f', 'dark': '#0f2557' },
        accent: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
        samiteon: { 500: '#7c3aed', 600: '#6d28d9', 700: '#5b21b6' }
      }
    }
  },
  plugins: []
}
