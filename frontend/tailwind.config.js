/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAFBFC",
        primary: "#3B70A2",
        primaryLight: "#5BB9D3",
        primaryDark: "#101A5A",
        secondary: "#171717",
        bgMenu: "#d6d6d6",
        mainText: "#303030",
        linesAndBorders: "#B9B9B9",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        rem: ["REM", "sans-serif"],
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
