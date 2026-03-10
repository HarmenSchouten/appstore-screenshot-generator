/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          850: '#1f1f23',
        },
      },
    },
  },
  plugins: [],
};
