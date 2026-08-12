/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E13025',
        'primary-dark': '#B91C12',
        secondary: '#009A44',
        'secondary-dark': '#007A35',
        accent: '#1A1A1A',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        foreground: '#2D3436',
        muted: '#636E72',
        border: '#E0E0E0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
