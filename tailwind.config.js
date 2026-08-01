/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        inchiostro: {
          DEFAULT: '#0B0B0D',
          50: '#4A4A4E',
          100: '#3A3A3E',
          200: '#2A2A2E',
          300: '#1A1A1E',
          400: '#121216',
          500: '#0B0B0D',
          600: '#08080A',
          700: '#050506',
        },
        carta: {
          DEFAULT: '#F4F1EA',
          50: '#FBFAF6',
          100: '#F8F6F1',
          200: '#F4F1EA',
          300: '#EDE8DD',
          400: '#E2DBC9',
          500: '#D4CBB4',
          600: '#BFB498',
        },
        denim: {
          DEFAULT: '#2F4A6D',
          50: '#6B82A0',
          100: '#5A7393',
          200: '#496486',
          300: '#3A5677',
          400: '#34506F',
          500: '#2F4A6D',
          600: '#27405C',
          700: '#1F354B',
          800: '#172A3A',
        },
        sabbia: {
          DEFAULT: '#B09A78',
          50: '#D8CCB8',
          100: '#CDBFA5',
          200: '#C2B493',
          300: '#B7A986',
          400: '#B09A78',
          500: '#A08A68',
          600: '#8E7858',
          700: '#7B6648',
        },
        rame: {
          DEFAULT: '#C4633A',
          50: '#E8A98C',
          100: '#DF9270',
          200: '#D67B57',
          300: '#CD6E47',
          400: '#C4633A',
          500: '#B05833',
          600: '#9C4D2C',
          700: '#884225',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '10px': ['10px', '1.2'],
        '11px': ['11px', '1.3'],
      },
      letterSpacing: {
        'label': '0.2em',
        'wide2': '0.15em',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
