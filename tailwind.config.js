/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#030712',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          dark: 'rgba(15, 23, 42, 0.7)',
        },
      },
      boxShadow: {
        glow: '0 20px 60px rgba(3, 7, 18, 0.6)',
      },
      backdropBlur: {
        glass: '18px',
      },
    },
  },
  plugins: [],
};
