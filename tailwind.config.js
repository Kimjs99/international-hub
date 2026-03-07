/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        sakura: '#F9A8D4',
        'accent-red': '#EF4444',
      },
      fontFamily: {
        ko: ['"Noto Sans KR"', 'sans-serif'],
        ja: ['"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

