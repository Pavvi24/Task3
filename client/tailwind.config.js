/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f6f3',
          100: '#eeebe4',
          200: '#dbd4c5',
          300: '#c4b89e',
          400: '#aa9678',
          500: '#977f60',
          600: '#896e52',
          700: '#715944',
          800: '#5d493b',
          900: '#4d3d33',
          950: '#291f19',
        },
        paper: {
          50: '#fdfcf8',
          100: '#faf8f2',
          200: '#f5f0e8',
          300: '#ede4d4',
        },
        accent: '#c8102e',
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: '"Source Serif 4", Georgia, serif',
            lineHeight: '1.8',
          },
        },
      },
    },
  },
  plugins: [],
};
