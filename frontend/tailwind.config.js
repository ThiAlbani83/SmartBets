/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#111427',
        primary: '#4c3a6d',
        primaryLight: '#6d5c8b',
        secondary: '#606d8b',
        bgMenu: '#d6d6d6'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      backgroundColor: {
        primarybg: '#111427',
      },
    },
  },
  plugins: [],
};
