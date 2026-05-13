/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FBDE2A',
        'primary-dark': '#E2C900',
        brand: '#2E2A80',
        'dark-gray': '#2E2A80',
        'light-gray': '#F5F5F5',
      },
    },
  },
  plugins: [],
};
