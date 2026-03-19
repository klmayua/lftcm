'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect user's preference for reduced motion
 * Returns true if user prefers reduced motion (accessibility)
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation props based on reduced motion preference
 * Use with Framer Motion to disable animations for users who prefer reduced motion
 */
export function useAccessibleAnimation() {
  const prefersReducedMotion = useReducedMotion();

  return {
    // Disable animations if user prefers reduced motion
    initial: prefersReducedMotion ? false : undefined,
    animate: prefersReducedMotion ? false : undefined,
    exit: prefersReducedMotion ? false : undefined,
    transition: prefersReducedMotion ? { duration: 0 } : undefined,
  };
}
