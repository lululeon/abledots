/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,svelte,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        caption: ['Berkshire Swash', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
