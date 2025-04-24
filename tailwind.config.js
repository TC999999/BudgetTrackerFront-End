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
        blinkText: {
          "20%, 60%, 100%": {
            color: "white",
          },
          "0%, 40%, 80%": {
            color: "#f70515",
          },
        },
      },
      animation: {
        blinkError: "blink 0.5s infinite",
        blinkErrorText: "blinkText 0.5s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
};
