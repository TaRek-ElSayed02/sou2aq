/**
 * مثال عملي: كيفية إضافة i18n إلى أي صفحة أو مكون
 * 
 * هذا الملف يوضح الخطوات الأساسية لتطبيق نظام الترجمة
 */

// ==================== الخطوة 1: استيراد Hook ====================
import { useTranslation } from '@/app/hooks/useTranslation';

// ==================== الخطوة 2: استخدام Hook في المكون ====================
'use client';
import React from 'react';

export default function ExamplePage() {
  // استخراج الخصائص من Hook
  const { t, isArabic, language, setLanguage, dir } = useTranslation();

  return (
    <div dir={dir}>
      {/* ============ مثال 1: عنوان مترجم ============ */}
      <h1>{t('dashboard.site.title')}</h1>

      {/* ============ مثال 2: نص مشروط حسب اللغة ============ */}
      {isArabic ? (
        <p>هذا نص يظهر فقط في اللغة العربية</p>
      ) : (
        <p>This text appears only in English</p>
      )}

      {/* ============ مثال 3: جملة مترجمة ============ */}
      <button>{t('common.save')}</button>
      <button>{t('common.cancel')}</button>
      <button>{t('dashboard.site.saveSite')}</button>

      {/* ============ مثال 4: اتجاه النص التلقائي ============ */}
      <div dir={dir} className={isArabic ? 'text-right' : 'text-left'}>
        محتوى يتم محاذاته حسب اللغة
      </div>

      {/* ============ مثال 5: تبديل اللغة ============ */}
      <div>
        <button onClick={() => setLanguage('en')}>
          English
        </button>
        <button onClick={() => setLanguage('ar')}>
          العربية
        </button>
      </div>

      {/* ============ مثال 6: عرض اللغة الحالية ============ */}
      <p>{language === 'ar' ? 'اللغة الحالية: العربية' : 'Current language: English'}</p>
    </div>
  );
}

// ==================== الخطوة 3: إضافة الترجمات ====================
/**
 * في locales/en.json:
 * {
 *   "example": {
 *     "title": "Example Title",
 *     "description": "This is an example"
 *   }
 * }
 * 
 * في locales/ar.json:
 * {
 *   "example": {
 *     "title": "العنوان الفارغ",
 *     "description": "هذا مثال"
 *   }
 * }
 */

// ==================== الخطوة 4: استخدام الترجمات الجديدة ====================
/**
 * <h1>{t('example.title')}</h1>
 * <p>{t('example.description')}</p>
 */

// ==================== حالات الاستخدام الشائعة ====================

/**
 * 1. عنوان مع ترجمة:
 * <h1>{t('dashboard.site.basicInfo')}</h1>
 * 
 * 2. زر مع ترجمة:
 * <button>{t('common.save')}</button>
 * 
 * 3. فئة مشروطة حسب الاتجاه:
 * <div className={isArabic ? 'text-right' : 'text-left'}>
 *   محتوى
 * </div>
 * 
 * 4. نص مشروط حسب اللغة:
 * {isArabic ? <p>نص عربي</p> : <p>English text</p>}
 * 
 * 5. تعيين اتجاه للعنصر:
 * <div dir={dir}>
 *   المحتوى يتم محاذاته تلقائياً
 * </div>
 * 
 * 6. منطق مشروط حسب اللغة:
 * if (isArabic) {
 *   // قم بشيء للعربية
 * } else {
 *   // قم بشيء للإنجليزية
 * }
 */

// ==================== نصائح مهمة ====================

/**
 * ✅ افعل:
 * - استخدم t() لجميع النصوص المرئية
 * - أضف dir={dir} إلى العناصر الرئيسية
 * - استخدم isArabic للحالات الخاصة
 * - أضف المفاتيح في locales/en.json و locales/ar.json
 * 
 * ❌ لا تفعل:
 * - لا تترجم أسماء المنتجات من قاعدة البيانات
 * - لا تنس 'use client' في المكونات التي تستخدم Hook
 * - لا تستخدم hardcoded strings بدلاً من t()
 * - لا تنسى المفاتيح في ملفات الترجمة
 */

// ==================== البنية الموصى بها للترجمات ====================

/**
 * locales/en.json:
 * {
 *   "common": {
 *     "save": "Save",
 *     "cancel": "Cancel",
 *     ...
 *   },
 *   "dashboard": {
 *     "site": {
 *       "title": "Site Management",
 *       "basicInfo": "Basic Info",
 *       ...
 *     },
 *     "products": {
 *       "title": "Products",
 *       "addProduct": "Add Product",
 *       ...
 *     }
 *   }
 * }
 */

// ==================== اختبار الترجمات ====================

/**
 * لاختبار الترجمات:
 * 
 * 1. افتح المتصفح DevTools Console
 * 2. اكتب:
 *    localStorage.setItem('language', 'ar')
 * 3. أعد تحميل الصفحة
 * 4. يجب أن ترى اللغة العربية
 * 
 * 5. اكتب:
 *    localStorage.setItem('language', 'en')
 * 6. أعد تحميل الصفحة
 * 7. يجب أن ترى اللغة الإنجليزية
 */
