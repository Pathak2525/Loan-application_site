/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#101826',
          700: '#2A3646',
          500: '#5B6B79',
          300: '#9AA7B2',
          100: '#E7EBEE',
        },
        navy: {
          900: '#0F2740',
          700: '#16324F',
          500: '#1E4B75',
        },
        teal: {
          600: '#0EA5A0',
          500: '#14B8AE',
          100: '#DCF6F3',
        },
        sand: {
          50: '#F7F8FA',
          100: '#EEF1F4',
        },
        danger: {
          600: '#C13F3F',
          100: '#FBE7E7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(16, 24, 38, 0.06), 0 1px 1px rgba(16, 24, 38, 0.04)',
      },
    },
  },
  plugins: [],
};
