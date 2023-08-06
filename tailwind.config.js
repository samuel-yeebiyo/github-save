/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        monaSans: ["Mona Sans", "sans-serif"],
      },
      colors: {
        fadedWhite: "rgb(133,133,133)",
        // Dark theme
        darkBg: "rgba(0,0,0,0.9)",
        darkInset: "rgb(40,40,40)",
        darkCard: "rgb(26,26,26)",
        // Light theme
        lightBg: "rgba(255,255,255,0.9)",
        lightInset: "rgb(229,229,229)",
        lightCard: "rgb(242,242,242)",
      },
    },
  },
  plugins: [],
};
