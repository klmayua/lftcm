'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase font-medium">{i18n.language === 'en' ? 'FR' : 'EN'}</span>
    </Button>
  );
}
