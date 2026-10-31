import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Indian boutique palette
        maroon: {
          50: '#fbf4f5',
          100: '#f6e3e6',
          200: '#eec7cd',
          300: '#e09dab',
          400: '#cd6a81',
          500: '#b7435f',
          600: '#9c2e4c',
          700: '#7e2440',
          800: '#6a2039',
          900: '#5b1e34',
          950: '#330c1a',
        },
        gold: {
          50: '#fdfbf0',
          100: '#faf4d4',
          200: '#f4e7a3',
          300: '#ecd368',
          400: '#e4bf3c',
          500: '#d4a62a',
          600: '#b78320',
          700: '#92611e',
          800: '#794d20',
          900: '#684020',
          950: '#3c220e',
        },
        cream: '#fdfaf5',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
