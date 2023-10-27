/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // light mode
        "v-dark-blue": "hsl(200, 15%, 8%)", // Light Mode Text
        "dark-gray": "hsl(0, 0%, 52%)", // Light Mode Input
        "v-light-gray": "hsl(0, 0%, 98%)", // Light Mode Background

        // dark mode
        "lighter-blue": "hsl(212, 25%, 24%)", // Dark Mode Elements Hover
        "dark-blue": "hsl(209, 23%, 22%)", // Dark Mode Elements
        "vd-dark-blue": "hsl(207, 26%, 17%)", // Dark Mode Background
      },
      boxShadow: {
        "3xl": "0px 1px 8px 0px rgba( 0, 0, 0, 0.75)",
        "4xl": "0px 1px 10px 0px rgba( 0, 0, 0, 0.75)",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [],
};
