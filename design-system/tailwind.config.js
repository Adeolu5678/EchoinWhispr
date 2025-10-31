/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        neutral: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#333333',
          600: '#555555',
          400: '#A0A0A0',
          100: '#F5F5F5',
        },
        white: '#FFFFFF',
        primary: {
          500: '#00A3FF',
          600: '#008EE6',
          400: '#66C7FF',
        },
        accent: {
          500: '#E000FF',
          600: '#C700E6',
        },
        success: '#06C270',
        error: '#FF3B30',
        warning: '#FFC700',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.5' }],
        'h2': ['24px', { lineHeight: '1.5' }],
        'h3': ['20px', { lineHeight: '1.5' }],
        'paragraph': ['16px', { lineHeight: '1.5' }],
        'small': ['14px', { lineHeight: '1.5' }],
        'x-small': ['12px', { lineHeight: '1.5' }],
        'button': ['16px', { fontWeight: 'bold' }],
      },
    },
  },
  plugins: [],
}