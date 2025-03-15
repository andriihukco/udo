"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Locale, getTranslation } from "@/translations";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Get initial locale from localStorage or default to 'en'
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access localStorage
  useEffect(() => {
    setMounted(true);

    const savedLocale = localStorage.getItem("locale") as Locale;
    if (
      savedLocale &&
      (savedLocale === "en" ||
        savedLocale === "uk" ||
        savedLocale === "pl" ||
        savedLocale === "jp")
    ) {
      setLocale(savedLocale);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "uk") {
        setLocale("uk");
      } else if (browserLang === "pl") {
        setLocale("pl" as Locale);
      } else if (browserLang === "ja") {
        setLocale("jp" as Locale);
      }
    }
  }, []);

  // Update localStorage when locale changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("locale", locale);
    }
  }, [locale, mounted]);

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = getTranslation(key, locale);

    // Replace parameters in the translation if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return translation;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
