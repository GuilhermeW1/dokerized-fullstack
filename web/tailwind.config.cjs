/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx', './index.html'],
  theme: {
    extend: {
      colors: {
        blackCustom: {
          700: '#121212',
          600: '#181818',
          500: '#202020',
          400: '#303030'
        }
      }
    }
  },
  plugins: []
}
