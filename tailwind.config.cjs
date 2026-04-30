/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
const plugin = require("tailwindcss/plugin")

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".link": {
          color: "inherit",
          "text-decoration": "none",
          "font-weight": "500",
          transition: "color 0.15s ease-in-out",
        },
      })
    }),
  ],
}
