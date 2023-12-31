/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        puffy: ["var(--font-puffy)"],
        normal: ["var(--font-normal)"],
      },
      dropShadow: {
        harsh: "10px 10px 0px rgba(0, 0, 0, 1)",
      },
    },
  },
  plugins: [],
};
