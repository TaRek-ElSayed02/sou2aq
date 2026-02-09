import { useLanguage } from '@/app/context/LanguageContext';

/**
 * Hook مخصص للوصول إلى الترجمات
 * مثال: const { t } = useTranslation();
 * const text = t('dashboard.site.title');
 */
export function useTranslation() {
  const { t, language, setLanguage, isArabic, isEnglish, dir } = useLanguage();
  
  return {
    t,
    language,
    setLanguage,
    isArabic,
    isEnglish,
    dir,
  };
}
