import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0b0d12",
          800: "#111522",
          700: "#151b2b",
          600: "#1b2236"
        },
        glow: {
          purple: "#7c5cff",
          blue: "#4cc2ff",
          pink: "#ff6edb"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 30px rgba(124,92,255,0.25)"
      },
      borderRadius: {
        xl: "18px"
      }
    }
  },
  plugins: []
} satisfies Config
