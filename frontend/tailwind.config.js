import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        customBackground: "#E8ECD7",
        customeCard: "#EED3B1",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
