# نظام التوطين (i18n) للموقع

## نظرة عامة
تم إعداد نظام توطين احترافي يسمح بدعم اللغات الإنجليزية والعربية في الموقع بأكمله.

## المميزات الرئيسية

### 1. **الترجمة الديناميكية**
- تثبيت مكتبة `next-intl` 
- دعم نص RTL و LTR تلقائياً
- تغيير اللغة بدون إعادة تحميل الصفحة

### 2. **إدارة اللغة المركزية**
- **LanguageContext** (`app/context/LanguageContext.tsx`): يدير الحالة الكاملة للغة
- **useTranslation Hook** (`app/hooks/useTranslation.ts`): للوصول السهل إلى الترجمات
- **LanguageSwitcher** (`app/Components/LanguageSwitcher/LanguageSwitcher.tsx`): مفتاح تبديل اللغة

### 3. **ملفات الترجمة**
- `locales/en.json`: الترجمة الإنجليزية
- `locales/ar.json`: الترجمة العربية

## هيكل ملفات الترجمة

```json
{
  "common": { ... },           // الكلمات المشتركة
  "dashboard": { 
    "site": { ... },           // ترجمات صفحة إدارة الموقع
    "mysite": { ... }          // ترجمات صفحة mysite
  }
}
```

## الاستخدام

### في المكونات
```tsx
import { useTranslation } from '@/app/hooks/useTranslation';

export function MyComponent() {
  const { t, isArabic, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.site.title')}</h1>
      {isArabic ? 'نص عربي' : 'English text'}
    </div>
  );
}
```

### التبديل بين اللغات
```tsx
const { setLanguage } = useTranslation();

// تغيير اللغة
setLanguage('ar');  // اللغة العربية
setLanguage('en');  // اللغة الإنجليزية
```

## الخصائص المتاحة

```tsx
{
  t: (key: string, defaultValue?: string) => string,  // الدالة الرئيسية للترجمة
  language: 'en' | 'ar',                              // اللغة الحالية
  setLanguage: (lang: 'en' | 'ar') => void,          // تغيير اللغة
  isArabic: boolean,                                  // هل اللغة الحالية عربية؟
  isEnglish: boolean,                                 // هل اللغة الحالية إنجليزية؟
  dir: 'ltr' | 'rtl'                                 // الاتجاه المناسب
}
```

## النقاط المهمة

### 1. **البيانات من قاعدة البيانات**
- أسماء المنتجات والخدمات من قاعدة البيانات **لا تُترجم**
- فقط نصوص الواجهة والعناوين والأزرار تُترجم

### 2. **التخزين المحلي**
- اللغة المختارة تُحفظ في `localStorage`
- تُحمل تلقائياً عند فتح الموقع

### 3. **تحديث خصائص HTML**
- `lang` attribute يُحدّث تلقائياً
- `dir` attribute يتغير تلقائياً (rtl للعربية، ltr للإنجليزية)

## الصفحات المدعومة

### ✅ تم التحديث
- `app/mysite/page.tsx` - صفحة عرض الموقع
- `app/dashboard/site/page.tsx` - صفحة إدارة الموقع (جزئياً)

### ⚠️ يحتاج إلى تحديث
- باقي صفحات الداشبورد
- صفحات المنتجات
- صفحات المستخدمين

## إضافة ترجمات جديدة

### الخطوة 1: أضف المفتاح في ملفات الترجمة
```json
// locales/en.json
{
  "myFeature": {
    "title": "Feature Title"
  }
}

// locales/ar.json
{
  "myFeature": {
    "title": "عنوان الميزة"
  }
}
```

### الخطوة 2: استخدمها في المكون
```tsx
const { t } = useTranslation();
const title = t('myFeature.title');
```

## تثبيت المكتبة الأصلية (إذا لزم الأمر)

```bash
npm install next-intl
```

## الملفات الرئيسية
- `app/context/LanguageContext.tsx` - إدارة الحالة
- `app/hooks/useTranslation.ts` - Hook للوصول السهل
- `app/Components/LanguageSwitcher/LanguageSwitcher.tsx` - المفتاح
- `locales/en.json` - الترجمات الإنجليزية
- `locales/ar.json` - الترجمات العربية
- `app/providers.tsx` - دمج Provider في التطبيق

## ملاحظات الأداء
- الترجمات محملة مباشرة من JSON (بدون طلبات API)
- الترجمات تُخزن مؤقتاً في الذاكرة
- لا توجد تأخيرات عند تغيير اللغة

## الخطوات القادمة
1. إضافة الترجمات لباقي صفحات الداشبورد
2. ترجمة رسائل الخطأ والتحقق من البيانات
3. اختبار الترجمات على جميع الصفحات
4. إضافة دعم لغات إضافية إذا لزم الأمر
