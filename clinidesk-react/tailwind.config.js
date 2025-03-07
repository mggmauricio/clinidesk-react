/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
      "./src/contexts/**/*.{js,ts,jsx,tsx}",
      "./src/hooks/**/*.{js,ts,jsx,tsx}",
      "./src/lib/**/*.{js,ts,jsx,tsx}",
      "./src/services/**/*.{js,ts,jsx,tsx}",
      "./src/styles/**/*.{css,scss}",
        "node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: ["class", '[data-theme="dark"]'],
    theme: {
      extend: {
        fontFamily: {
          sans: ["Poppins", "sans-serif"],
          display: ["BEBAS NEUE CYRILLIC", "sans-serif"],
          modern: ["Neue Montreal", "sans-serif"],
        },
        textShadow: {
          neon: "0 0 5px #5ce1e6, 0 0 10px #39aea9",
        },
      },
    },
    plugins: [

    ],
  };
  