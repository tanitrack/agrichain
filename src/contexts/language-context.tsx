import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { en } from './en';
import { id } from './id';

// Define available languages
export type Language = 'id' | 'en';

// Define translation object structure
type TranslationsType = {
  [key in Language]: {
    [key: string]: string;
  };
};

// Translations dictionary
export const translations: TranslationsType = {
  en: en,
  id: id,
};

// Create the language context
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  // Load saved language preference from localStorage on initialization
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'id' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[language][key]) {
      return translations[language][key];
    }
    return key; // Fallback: return the key itself if translation not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
