/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700", // Yellow for branding
        dark: "#0F0F0F",
        light: "#F8F8F8",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
