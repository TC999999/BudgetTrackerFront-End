/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "20%, 60%, 100%": {
            background: "#f59993",
          },
          "0%, 40%, 80%": {
            background: "white",
          },
        },
      },
      animation: {
        blinkError: "blink 0.25s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
