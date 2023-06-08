/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderWidth: {
        1: '0.5px',
      },
      fontFamily: {
        'akira-expanded': ['AkiraExpanded'],
        // sf pro expanded bold
      },
      colors: {
        'dark-500': '#070707',
        'dark-400': '#161617',
        'dark-300': '#201F21',
        'dark-200': '#4D4E53',
        'light-500': '#fff',
        'light-400': '#CCC9C9',
        accent: '#724CF9',
      },
    },
  },
  plugins: [],
};
