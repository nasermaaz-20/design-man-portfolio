import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05080F',
        panel: '#0D1117',
        panelDark: '#0A0A0A',
        neon: '#00F5D4',
        teal: '#14E1C6',
        glowBlue: '#1FB6FF',
        softCyan: '#6EE7E7',
        steel: '#B0BEC5',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Exo 2', 'sans-serif'],
      },
      boxShadow: {
        cyanSm: '0 0 10px rgba(0,245,212,0.45)',
        cyanMd: '0 0 20px rgba(0,245,212,0.45), 0 0 55px rgba(0,245,212,0.18)',
        cyanLg: '0 0 30px rgba(0,245,212,0.55), 0 0 90px rgba(0,245,212,0.22)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.38' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        float: 'float 3.8s ease-in-out infinite',
        scan: 'scan 3.5s linear infinite',
        pulseGlow: 'pulseGlow 3.4s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
