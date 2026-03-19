'use client';

import { useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();

  // Set RTL or document direction if needed
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <>{children}</>;
}
