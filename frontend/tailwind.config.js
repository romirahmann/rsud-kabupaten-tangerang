/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { primary: ["Poppins", "sans-serif"] },
      colors: {
        primary: "#3674B5",
        secondary: "#FADA7A",
      },
    },
  },
  plugins: [],
};
