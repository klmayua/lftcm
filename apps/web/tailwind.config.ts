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
      fontSize: {
        // Mobile-first font sizes
        'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        'mobile-base': ['0.9375rem', { lineHeight: '1.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '128': '32rem',
        // Safe area spacing
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'nav': '72px',
        'nav-lg': '80px',
      },
      maxWidth: {
        '7xl': '80rem',
        'mobile': '100%',
        'tablet': '640px',
      },
      borderRadius: {
        '4xl': '2rem',
        'mobile': '1rem',
      },
      boxShadow: {
        'gold': '0 8px 20px rgba(212, 175, 55, 0.4)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'elevated': '0 20px 40px rgba(0, 0, 0, 0.12)',
        'float': '0 4px 20px rgba(0, 0, 0, 0.15), 0 8px 40px rgba(0, 0, 0, 0.1)',
        'mobile-nav': '0 -4px 20px rgba(0, 0, 0, 0.15)',
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
        'bounce-subtle': 'bounceSubtle 2s infinite',
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
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionTimingFunction: {
        'mobile': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-mobile': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      screens: {
        'xs': '380px',
        'mobile': '640px',
      },
      minHeight: {
        'touch': '48px',
        'touch-lg': '56px',
      },
      minWidth: {
        'touch': '48px',
        'touch-lg': '56px',
      },
    },
  },
  plugins: [
    // Custom plugin for mobile utilities
    function({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.overscroll-contain': {
          'overscroll-behavior': 'contain',
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
      });
    },
  ],
};

export default config;
