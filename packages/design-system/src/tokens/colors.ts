/**
 * LFTCM Design System - Colors
 * Based on official Living Faith Tabernacle visual identity
 */

export const colors = {
  // Primary - Divine Gold
  gold: {
    divine: '#D4AF37',
    light: '#F5D77A',
    deep: '#A67C00',
    50: '#FDF9E8',
    100: '#F9F0C4',
    200: '#F5E79A',
    300: '#F0DD6F',
    400: '#EBD34A',
    500: '#D4AF37', // Primary
    600: '#B8962E',
    700: '#9C7D25',
    800: '#80641C',
    900: '#644B13',
  },

  // Secondary - Fire & Cross
  fire: {
    red: '#8B0000',      // Cross red
    orange: '#FF8C00',   // Flame orange
    yellow: '#FFD700',   // Flame yellow
  },

  // Foundation
  foundation: {
    holyGreen: '#0B6623',
    authorityBlack: '#0A0A0A',
    pureWhite: '#FFFFFF',
  },

  // Backgrounds
  background: {
    main: '#FFFFFF',
    alt: '#F9F6EF',       // Warm temple off-white
    dark: '#0A0A0A',
    card: '#FFFFFF',
    elevated: '#FAFAFA',
  },

  // Text
  text: {
    primary: '#0A0A0A',
    secondary: '#444444',
    muted: '#666666',
    inverse: '#FFFFFF',
    gold: '#D4AF37',
  },

  // Semantic
  semantic: {
    success: '#0B6623',
    warning: '#FF8C00',
    error: '#8B0000',
    info: '#0066CC',
  },

  // Gradients (CSS strings)
  gradients: {
    divineGold: 'linear-gradient(135deg, #F5D77A 0%, #D4AF37 50%, #A67C00 100%)',
    fire: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 50%, #8B0000 100%)',
    altarGlow: 'radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,255,255,0) 70%)',
    darkSection: 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
  },
} as const;

// Tailwind CSS configuration extension
export const tailwindColors = {
  gold: colors.gold,
  fire: colors.fire,
  foundation: colors.foundation,
  background: colors.background,
  text: colors.text,
  semantic: colors.semantic,
};

// CSS Variables for runtime theming
export const cssVariables = `
  :root {
    /* Gold Scale */
    --gold-50: ${colors.gold[50]};
    --gold-100: ${colors.gold[100]};
    --gold-200: ${colors.gold[200]};
    --gold-300: ${colors.gold[300]};
    --gold-400: ${colors.gold[400]};
    --gold-500: ${colors.gold[500]};
    --gold-600: ${colors.gold[600]};
    --gold-700: ${colors.gold[700]};
    --gold-800: ${colors.gold[800]};
    --gold-900: ${colors.gold[900]};

    /* Foundation */
    --holy-green: ${colors.foundation.holyGreen};
    --authority-black: ${colors.foundation.authorityBlack};
    --pure-white: ${colors.foundation.pureWhite};

    /* Fire */
    --cross-red: ${colors.fire.red};
    --flame-orange: ${colors.fire.orange};
    --flame-yellow: ${colors.fire.yellow};

    /* Backgrounds */
    --bg-main: ${colors.background.main};
    --bg-alt: ${colors.background.alt};
    --bg-dark: ${colors.background.dark};

    /* Text */
    --text-primary: ${colors.text.primary};
    --text-secondary: ${colors.text.secondary};
    --text-muted: ${colors.text.muted};
    --text-inverse: ${colors.text.inverse};

    /* Semantic */
    --success: ${colors.semantic.success};
    --warning: ${colors.semantic.warning};
    --error: ${colors.semantic.error};
    --info: ${colors.semantic.info};
  }
`;
