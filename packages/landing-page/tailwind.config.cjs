/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'dark-300': '#444444',
        'dark-400': '#1E1E1E',
        'dark-500': '#070707',
        'light-400': '#CCC9C9',
        'light-500': '#fff',
        'accent-500': '#724CF9',
      },
    },
    animation: {
      'row-1-translate': 'row-1-translate 10s ease-in-out infinite',
      'row-2-translate': 'row-2-translate 10s ease-in-out infinite',
      'row-3-translate': 'row-3-translate 10s ease-in-out infinite',
    },
    keyframes: {
      'row-1-translate': {
        '0%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-1rem)' },
        '100%': { transform: 'translateY(0)' },
      },
      'row-2-translate': {
        '0%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(0.5rem)' },
        '100%': { transform: 'translateY(0)' },
      },
      'row-3-translate': {
        '0%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-0.5rem)' },
        '100%': { transform: 'translateY(0)' },
      },
    },
  },
  plugins: [],
};
