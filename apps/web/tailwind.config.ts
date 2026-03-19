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
        // Divine Gold
        gold: {
          50: '#FDF9E8',
          100: '#F9F0C4',
          200: '#F5E79A',
          300: '#F0DD6F',
          400: '#EBD34A',
          500: '#D4AF37',
          600: '#B8962E',
          700: '#9C7D25',
          800: '#80641C',
          900: '#644B13',
        },
        // Fire
        fire: {
          red: '#8B0000',
          orange: '#FF8C00',
          yellow: '#FFD700',
        },
        // Foundation
        holy: {
          green: '#0B6623',
        },
        authority: {
          black: '#0A0A0A',
        },
        pure: {
          white: '#FFFFFF',
        },
        // Backgrounds
        temple: '#F9F6EF',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '128': '32rem',
      },
      maxWidth: {
        '7xl': '80rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'gold': '0 8px 20px rgba(212, 175, 55, 0.4)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'elevated': '0 20px 40px rgba(0, 0, 0, 0.12)',
      },
      backgroundImage: {
        'divine-gold': 'linear-gradient(135deg, #F5D77A 0%, #D4AF37 50%, #A67C00 100%)',
        'fire': 'linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #8B0000 100%)',
        'altar-glow': 'radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,255,255,0) 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
