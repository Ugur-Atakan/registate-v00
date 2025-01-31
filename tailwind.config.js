/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1649FF',
        accent: '#9EE248',
        text: '#333333',
        'hover-text': '#3B82F6',
        'background-alt': '#ECEFF1',
      },
    },
  },
  plugins: [],
};