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
        // We'll define some custom colors matching standard Todo app themes
        "todo-light-bg": "hsl(0, 0%, 98%)",
        "todo-light-surface": "hsl(0, 0%, 100%)",
        "todo-light-text": "hsl(235, 19%, 35%)",
        "todo-dark-bg": "hsl(235, 21%, 11%)",
        "todo-dark-surface": "hsl(235, 24%, 19%)",
        "todo-dark-text": "hsl(234, 39%, 85%)",
        "todo-primary": "hsl(220, 98%, 61%)", // A nice active blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
