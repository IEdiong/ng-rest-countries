/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // light mode
        "v-dark-blue": "hsl(200, 15%, 8%)", //? Light Mode Text (#111517)
        "dark-gray": "hsl(0, 0%, 52%)", // Light Mode Input
        "v-light-gray": "hsl(0, 0%, 98%)", // Light Mode Background

        // dark mode
        "lighter-blue": "hsl(212, 25%, 24%)", // Dark Mode Elements Hover
        "dark-blue": "hsl(209, 23%, 22%)", //? Dark Mode Elements (#2B3844)
        "vd-dark-blue": "hsl(207, 26%, 17%)", // Dark Mode Background
      },
      boxShadow: {
        nav: "0px 2px 4px 0px rgba(0, 0, 0, 0.06)",
        card: "0px 0px 7px 2px rgba(0, 0, 0, 0.03)",
        back: "0px 0px 7px 0px rgba(0, 0, 0, 0.29)",
        flag: "0px 0px 14px 4px rgba(0, 0, 0, 0.03)",
        tag: "0px 0px 4px 1px rgba(0, 0, 0, 0.10)",
        filter: "0px 2px 9px 0px rgba(0, 0, 0, 0.05)",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [],
};
