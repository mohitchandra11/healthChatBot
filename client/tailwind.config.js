/** @type {import('tailwindcss').Config} */
require('@tailwindcss/typography')
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This line is the important one
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}