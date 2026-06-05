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
        forest: {
          light: '#4f8a73',
          DEFAULT: '#346856',
          dark: '#1e3f34',
        },
        sage: {
          light: '#a3a092',
          DEFAULT: '#848171',
          dark: '#615f53',
        },
        mist: {
          DEFAULT: '#bcd2d6',
        },
        sky: {
          DEFAULT: '#80acc7',
          dark: '#5a839e',
        },
        leaf: {
          light: '#6ad081',
          DEFAULT: '#44ac5c',
          dark: '#2c8541',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
