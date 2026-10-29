/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quantum: {
          dark: '#080c14',
          panel: '#0e1726',
          panelHover: '#132035',
          border: '#1e293b',
          borderLight: '#334155',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          indigo: '#6366f1',
          purple: '#a855f7',
          pink: '#ec4899',
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

