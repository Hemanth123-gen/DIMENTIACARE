import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../services/translationService';
import type { LanguageKey } from '../services/translationService';
import { storageService } from '../services/storageService';

interface LanguageContextProps {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<LanguageKey>('English');

  useEffect(() => {
    storageService.init();
    const currentSettings = storageService.getSettings();
    if (currentSettings && currentSettings.language) {
      // Map to correct key name if different
      let lang = currentSettings.language as LanguageKey;
      if (lang === 'Assamese') lang = 'Assamese';
      if (lang === 'Bengali') lang = 'Bengali';
      if (lang === 'Hindi') lang = 'Hindi';
      if (lang === 'Manipuri') lang = 'Manipuri';
      if (lang === 'Khasi') lang = 'Khasi';
      if (lang === 'Mizo') lang = 'Mizo';
      if (lang === 'Nagamese') lang = 'Nagamese';
      if (lang === 'Tripuri') lang = 'Tripuri';
      setLangState(lang);
    }
  }, []);

  const setLanguage = (lang: LanguageKey) => {
    setLangState(lang);
    const currentSettings = storageService.getSettings();
    storageService.saveSettings({
      ...currentSettings,
      language: lang
    });
  };

  const t = (key: string): string => {
    // Lookup selected language
    const langDict = translations[language] || {};
    if (key in langDict) {
      return langDict[key];
    }
    // Fallback to English
    const engDict = translations['English'] || {};
    if (key in engDict) {
      return engDict[key];
    }
    // Final key fallback
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
export default LanguageContext;
