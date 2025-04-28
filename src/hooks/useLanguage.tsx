
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

// Define the type for translations based on the English translation object
type TranslationType = typeof translations.en;

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    // Use type assertion to ensure the compiler knows we're providing a valid translation object
    t: (translations[language as keyof typeof translations] || translations.en) as TranslationType,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
