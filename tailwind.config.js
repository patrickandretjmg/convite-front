/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A3D44',
          light: '#3A4D54',
          dark: '#1A2D34',
        },
        secondary: {
          light: '#F7F8FA',
          DEFAULT: '#D1D9E6',
          dark: '#A1A9B6',
        },
        success: '#4CAF50',
        error: '#D32F2F',
        warning: '#FF9800',
        highlight: '#FF5722',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}