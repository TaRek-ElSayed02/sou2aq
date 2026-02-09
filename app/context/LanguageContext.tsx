'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  isArabic: boolean;
  isEnglish: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, any> = {
  en,
  ar,
};

// دالة مساعدة للوصول للقيمة من Object باستخدام dot notation
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // إرجاع المفتاح نفسه إذا لم تجد القيمة
    }
  }
  
  return typeof value === 'string' ? value : path;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  // تحميل اللغة المحفوظة عند الـ mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguageState(savedLanguage);
    }
    setMounted(true);

    // تعيين خصائص html
    const html = document.documentElement;
    html.lang = savedLanguage || 'en';
    html.dir = (savedLanguage || 'en') === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // تحديث خصائص html
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // إرسال حدث مخصص لتحديث الصفحات الأخرى
    window.dispatchEvent(
      new CustomEvent('languageChanged', { detail: { language: lang } })
    );
  };

  const t = (key: string, defaultValue?: string): string => {
    const value = getNestedValue(translations[language], key);
    return value || defaultValue || key;
  };

  const isArabic = language === 'ar';
  const isEnglish = language === 'en';
  const dir = isArabic ? 'rtl' : 'ltr';

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isArabic,
        isEnglish,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return default context instead of throwing error
    console.warn('useLanguage used outside LanguageProvider, returning defaults');
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: (key: string) => key,
      isArabic: false,
      isEnglish: true,
      dir: 'ltr' as const,
    };
  }
  return context;
}
