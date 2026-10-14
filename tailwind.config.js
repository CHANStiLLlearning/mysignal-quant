/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#05070d',
          900: '#0a0e19',
          850: '#0e1424',
          800: '#131b2e',
          750: '#19233c',
          700: '#1e293b'
        },
        neon: {
          cyan: '#00f2fe',
          blue: '#4facfe',
          purple: '#8b5cf6',
        },
        bull: {
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.35)'
        },
        bear: {
          DEFAULT: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.35)'
        },
        amber: {
          chop: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 242, 254, 0.35)',
        'glow-bull': '0 0 20px rgba(16, 185, 129, 0.35)',
        'glow-bear': '0 0 20px rgba(244, 63, 94, 0.35)',
        'glass': '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
