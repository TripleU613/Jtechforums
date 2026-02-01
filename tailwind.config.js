/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'monospace'],
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
        'glow-cyan': '0 0 40px rgba(34, 211, 238, 0.15), 0 0 80px rgba(34, 211, 238, 0.1)',
        'glow-indigo': '0 0 40px rgba(129, 140, 248, 0.15), 0 0 80px rgba(129, 140, 248, 0.1)',
      },
      backdropBlur: {
        glass: '18px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pan-vertical': 'panVertical 12s ease-in-out infinite',
        'float-badge': 'floatBadge 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        panVertical: {
          '0%, 12%': { transform: 'translateY(0)' },
          '45%, 55%': { transform: 'translateY(-48%)' },
          '88%, 100%': { transform: 'translateY(0)' },
        },
        floatBadge: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
