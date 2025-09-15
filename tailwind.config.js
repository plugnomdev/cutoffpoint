/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2d3192',
          secondary: '#fbc024',
        },
      },
    },
  },
  plugins: [],
};
