'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage, isArabic } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Switch language"
      >
        <Globe size={18} />
        <span className="font-medium">{language.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-[150px]">
          <button
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition ${
              language === 'en' ? 'bg-blue-100 font-bold' : ''
            }`}
          >
            English
          </button>
          <button
            onClick={() => {
              setLanguage('ar');
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition ${
              language === 'ar' ? 'bg-blue-100 font-bold' : ''
            }`}
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
