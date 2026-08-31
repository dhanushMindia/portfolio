import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-crimson-pro)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "monospace"],
      },
      colors: {
        // A sophisticated grayscale foundation
        sand: {
          50: "#FCFCFA",
          100: "#F5F5f2",
          200: "#EAEAE5",
          300: "#D4D4CE",
          400: "#A3A39D",
          500: "#73736D",
          600: "#52524D",
          700: "#40403B",
          800: "#262623",
          900: "#141413",
          950: "#0A0A09",
        },
        // Muted accent for data and subtle emphasis
        accent: {
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#243b53",
          900: "#102a43",
          950: "#091724",
        }
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "reveal": "reveal 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        }
      },
      lineHeight: {
        tighter: '1.1',
        relaxed: '1.7',
        loose: '2',
      },
      letterSpacing: {
        tighter: '0',
        tight: '0',
        normal: '0',
        wide: '0.02em',
        wider: '0.06em',
        widest: '0.1em',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
