/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,svelte,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Dosis', 'sans-serif'],
        caption: ['Chango', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
