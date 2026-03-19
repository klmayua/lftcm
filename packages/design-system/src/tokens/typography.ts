/**
 * LFTCM Design System - Typography
 * Sacred, authoritative, readable
 */

export const typography = {
  // Font families
  fonts: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    accent: '"Cinzel", "Trajan Pro", Georgia, serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  // Font sizes (mobile-first scale)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  // Font weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line heights
  lineHeights: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Heading styles
  headings: {
    h1: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-4xl)',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.025em',
      color: 'var(--authority-black)',
    },
    h2: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-3xl)',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
      color: 'var(--authority-black)',
    },
    h3: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-2xl)',
      fontWeight: '600',
      lineHeight: '1.25',
      color: 'var(--authority-black)',
    },
    h4: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--text-xl)',
      fontWeight: '600',
      lineHeight: '1.3',
      color: 'var(--authority-black)',
    },
    h5: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      fontWeight: '600',
      lineHeight: '1.4',
      color: 'var(--authority-black)',
    },
    h6: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      fontWeight: '600',
      lineHeight: '1.4',
      color: 'var(--authority-black)',
    },
  },

  // Body text styles
  body: {
    large: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-lg)',
      fontWeight: '400',
      lineHeight: '1.625',
      color: 'var(--text-secondary)',
    },
    default: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--text-secondary)',
    },
    small: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'var(--text-muted)',
    },
  },

  // Special styles
  special: {
    scripture: {
      fontFamily: 'var(--font-accent)',
      fontSize: 'var(--text-lg)',
      fontWeight: '400',
      lineHeight: '1.75',
      fontStyle: 'italic',
      color: 'var(--gold-600)',
    },
    banner: {
      fontFamily: 'var(--font-accent)',
      fontSize: 'var(--text-sm)',
      fontWeight: '600',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--gold-500)',
    },
    label: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      fontWeight: '500',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
    },
  },
} as const;

// Responsive typography (mobile-first)
export const responsiveTypography = {
  h1: {
    mobile: '2.25rem',    // 36px
    tablet: '3rem',       // 48px
    desktop: '3.75rem',   // 60px
  },
  h2: {
    mobile: '1.875rem',   // 30px
    tablet: '2.25rem',    // 36px
    desktop: '3rem',      // 48px
  },
  h3: {
    mobile: '1.5rem',     // 24px
    tablet: '1.875rem',   // 30px
    desktop: '2.25rem',   // 36px
  },
  body: {
    mobile: '1rem',       // 16px
    tablet: '1.125rem',   // 18px
    desktop: '1.125rem',
  },
};
