import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: '#800000',
        input: '#800000',
        ring: '#800000',
        background: '#FFFFFF',
        foreground: '#800000',
        primary: {
          DEFAULT: '#800000',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#800000',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: '#800000',
          foreground: '#FFFFFF'
        },
        muted: {
          DEFAULT: '#FFFFFF',
          foreground: '#800000'
        },
        accent: {
          DEFAULT: '#FFFFFF',
          foreground: '#800000'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#800000'
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;