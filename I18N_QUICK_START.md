# دليل i18n السريع

## تم الإنجاز ✅

### 1. الأساسيات
- ✅ تثبيت `next-intl`
- ✅ إنشاء `LanguageContext` لإدارة اللغة
- ✅ إنشاء `useTranslation` Hook
- ✅ إنشاء `LanguageSwitcher` مكون
- ✅ إضافة Provider إلى `app/providers.tsx`
- ✅ إضافة `suppressHydrationWarning` إلى `layout.tsx`

### 2. ملفات الترجمة
- ✅ `locales/en.json` - جميع الترجمات الإنجليزية
- ✅ `locales/ar.json` - جميع الترجمات العربية

### 3. الصفحات المحدثة
- ✅ `app/mysite/page.tsx` - مع Language Switcher والترجمات كاملة
- ✅ `app/dashboard/site/page.tsx` - ترجمة الـ Tabs

## كيفية الاستخدام

### في أي صفحة عميل (Client Component)
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

export default function MyPage() {
  const { t, isArabic, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.site.title')}</h1>
      {isArabic && <p>نص عربي</p>}
      <button onClick={() => setLanguage('ar')}>
        تحويل إلى العربية
      </button>
    </div>
  );
}
```

### إضافة ترجمات جديدة
1. أضف المفتاح في `locales/en.json`:
   ```json
   {
     "mySection": {
       "myKey": "English Text"
     }
   }
   ```

2. أضف نفس المفتاح في `locales/ar.json`:
   ```json
   {
     "mySection": {
       "myKey": "النص العربي"
     }
   }
   ```

3. استخدمه في المكون:
   ```tsx
   const text = t('mySection.myKey');
   ```

## معلومات مهمة

### اللغة الافتراضية
- **الإنجليزية** هي اللغة الافتراضية
- تُحفظ اختيارات المستخدم في `localStorage`

### البيانات من قاعدة البيانات
- أسماء المنتجات والخدمات **لا تُترجم**
- فقط الواجهة والعناوين والأزرار تُترجم

### اتجاه النص (RTL/LTR)
- تُحدّث تلقائياً عند تغيير اللغة
- العربية = RTL
- الإنجليزية = LTR

## الصفحات المتبقية للتحديث

### الداشبورد
- [ ] `app/dashboard/products/page.tsx`
- [ ] `app/dashboard/stock/page.tsx`
- [ ] `app/dashboard/users/page.tsx`
- [ ] `app/dashboard/blog/page.tsx`
- [ ] `app/dashboard/contact/page.tsx`
- [ ] `app/dashboard/pricing/page.tsx`
- [ ] `app/dashboard/cart/page.tsx`
- [ ] `app/dashboard/wishlist/page.tsx`

### صفحات أخرى
- [ ] صفحات المصادقة (auth)
- [ ] صفحة المنتجات الرئيسية
- [ ] الصفحة الرئيسية

## الخطوات التالية

### لتحديث صفحة أخرى:
```tsx
// 1. استيراد الـ Hook
import { useTranslation } from '@/app/hooks/useTranslation';

// 2. استخدم في المكون
const { t, isArabic } = useTranslation();

// 3. استبدل النصوص الثابتة
// من:
<h1>Products</h1>

// إلى:
<h1>{t('dashboard.products.title')}</h1>

// 4. أضف الترجمات في الملفات
// في locales/en.json و locales/ar.json
```

## الملفات الموجودة

```
app/
├── context/
│   └── LanguageContext.tsx          # إدارة حالة اللغة
├── hooks/
│   └── useTranslation.ts             # Hook للوصول للترجمات
├── Components/
│   └── LanguageSwitcher/
│       └── LanguageSwitcher.tsx      # مفتاح تبديل اللغة
├── providers.tsx                     # LanguageProvider مضاف
├── layout.tsx                        # محدث (suppressHydrationWarning)
└── mysite/
    └── page.tsx                      # محدث بالترجمات

locales/
├── en.json                           # الترجمات الإنجليزية
└── ar.json                           # الترجمات العربية

I18N_SETUP.md                         # توثيق شامل
```

## إذا واجهت مشكلة

### المشكلة: الترجمات لا تظهر
**الحل**: تأكد من:
1. استيراد Hook بشكل صحيح
2. المكون يستخدم `'use client'`
3. المفتاح موجود في ملفات الترجمة

### المشكلة: اللغة تتغير ولا تعود
**الحل**: افتح DevTools وتحقق من `localStorage`:
```javascript
localStorage.getItem('language')
```

### المشكلة: الاتجاه RTL لا يعمل
**الحل**: تأكد من أن الـ Tailwind CSS يدعم `dir` attribute:
```html
<div dir={isArabic ? 'rtl' : 'ltr'}>
```

## الدعم والمساعدة

- 📚 توثيق كامل في `I18N_SETUP.md`
- 🔧 جميع الأكواد مع تعليقات
- ✨ سهل الإضافة والتعديل
