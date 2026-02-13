/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F2B705',
        'dark-gray': '#1A1A1A',
        'light-gray': '#F5F5F5',
      },
    },
  },
  plugins: [],
};
