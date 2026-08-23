/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0B1220",
          900: "#0F1B33",
          800: "#152442",
        },
      },
    },
  },
  plugins: [],
};
