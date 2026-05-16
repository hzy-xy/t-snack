/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: '#4f8cff',
          light: '#eef3ff',
          muted: '#7aaaff',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f8f9fa',
          hover: '#f0f1f3',
          border: '#e5e7eb',
        },
        ink: {
          DEFAULT: '#1a1a2e',
          muted: '#555555',
          subtle: '#999999',
          faint: '#cccccc',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', '"Fira Code"', '"Fira Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '10px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        pop: '0 4px 16px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};