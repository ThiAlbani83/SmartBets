"use strict";Object.defineProperty(exports, "__esModule", {value: true});/** @type {import('tailwindcss').Config} */
exports. default = {
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
 /* v7-a0dd0db87fd52a5c */