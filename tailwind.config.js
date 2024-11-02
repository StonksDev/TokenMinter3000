/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'stonks-pattern': 'linear-gradient(90deg, rgba(120,131,214,0.2), rgba(20,70,255,0.3)), url("/src/assets/stocks.pattern.gif")',
      },
    },
  },
  plugins: [],
} 