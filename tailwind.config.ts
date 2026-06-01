import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/globals.css",
  ],
  safelist: [
    "text-medical-deep",
    "bg-medical-deep",
    "border-medical-deep",
    "from-medical-deep",
    "to-medical-deep",
    "via-medical-deep",
    "ring-medical-deep",
    "hover:text-medical-deep",
    "text-medical-deep/80",
    "bg-medical-deep/5",
    "bg-medical-deep/10",
    "bg-medical-deep/40",
    "bg-medical-deep/50",
    "bg-medical-deep/80",
    "border-medical-deep/10",
    "border-medical-deep/15",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          white: "#FAFBFC",
        },
        medical: {
          deep: "#0B3558",
          blue: "#123A5A",
          sky: "#EAF7FA",
          teal: "#5EC8B5",
          coral: "#FF8A7A",
        },
        health: {
          green: "#22C55E",
        },
        text: {
          muted: "#5F6F7A",
        },
        surface: {
          soft: "#F4F9FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(11, 53, 88, 0.08)",
        card: "0 12px 40px -12px rgba(11, 53, 88, 0.12)",
        float: "0 20px 56px -16px rgba(11, 53, 88, 0.18)",
        glow: "0 0 0 1px rgba(94, 200, 181, 0.15), 0 8px 32px -8px rgba(94, 200, 181, 0.25)",
        "inner-soft": "inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(145deg, #FAFBFC 0%, #EAF7FA 42%, #F4F9FA 72%, #E8F4F8 100%)",
        "institutional":
          "linear-gradient(135deg, #0B3558 0%, #123A5A 55%, #1a4d73 100%)",
        "trust-strip":
          "linear-gradient(90deg, #0B3558 0%, #123A5A 50%, #0B3558 100%)",
        "vaccine-soft":
          "linear-gradient(160deg, #EAF7FA 0%, #f0fdf9 50%, #EAF7FA 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
