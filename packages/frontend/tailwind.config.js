/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media', // or 'class' for manual control
  theme: {
    extend: {
      colors: {
        discord: {
          blurple: '#5865F2',
          green: '#57F287',
          yellow: '#FEE75C',
          fuchsia: '#EB459E',
          red: '#ED4245',
          white: '#FFFFFF',
          black: '#000000',
          dark: '#36393F',
          darker: '#2F3136',
          darkest: '#202225',
          gray: '#99AAB5',
          light: '#F2F3F5',
        }
      },
      fontFamily: {
        sans: ['Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}