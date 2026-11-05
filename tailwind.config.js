/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: { colors: { brand: "#c8102e", ink: "#171717", sand: "#eee9e2" }, fontFamily: { sans: ["DM Sans", "sans-serif"], display: ["Playfair Display", "serif"] } } },
  plugins: []
};