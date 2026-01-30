import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0c0f1a",
          800: "#141928",
          700: "#1d2336",
          600: "#2a3350"
        }
      },
      boxShadow: {
        glow: "0 0 24px rgba(236, 72, 153, 0.25)",
        card: "0 18px 50px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
