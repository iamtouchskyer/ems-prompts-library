
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: {
    createNew: string;
    home: string;
    changeHistory: string;
    language: string;
    view: string;
    edit: string;
    save: string;
    revert: string;
    unsavedChanges: string;
    tags: string;
    searchTags: string;
    submit: string;
    cancel: string;
    title: string;
    all: string;
    library: string;
    logout: string;
    errorUpdating: string;  // Added missing translation
  };
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: {
    createNew: '',
    home: '',
    changeHistory: '',
    language: '',
    view: '',
    edit: '',
    save: '',
    revert: '',
    unsavedChanges: '',
    tags: '',
    searchTags: '',
    submit: '',
    cancel: '',
    title: '',
    all: '',
    library: '',
    logout: '',
    errorUpdating: '', // Added missing translation
  },
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
    t: translations[language as keyof typeof translations],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
