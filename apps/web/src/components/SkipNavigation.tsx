'use client';

import { useState, useEffect } from 'react';

export function SkipNavigation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show skip link on Tab key press
      if (e.key === 'Tab') {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleClick = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed top-4 left-4 z-[100]
        px-4 py-2 bg-gold-500 text-authority-black font-semibold
        rounded-lg shadow-lg
        transition-transform duration-200
        focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2
        ${isVisible ? 'translate-y-0' : '-translate-y-full pointer-events-none'}
      `}
      aria-label="Skip to main content"
    >
      Skip to main content
    </button>
  );
}
