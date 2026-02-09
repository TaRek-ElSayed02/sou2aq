# 🌍 نظام i18n - الدليل الفوري

## ⚡ البدء الفوري (في 30 ثانية)

### الخطوة 1: استيراد Hook
```tsx
import { useTranslation } from '@/app/hooks/useTranslation';
```

### الخطوة 2: استخدام في مكونك
```tsx
'use client';

export default function MyPage() {
  const { t, isArabic, setLanguage, dir } = useTranslation();
  
  return (
    <div dir={dir}>
      <h1>{t('your.key.here')}</h1>
      {isArabic && <p>محتوى عربي</p>}
    </div>
  );
}
```

### الخطوة 3: أضف الترجمة
```json
// locales/en.json و locales/ar.json
{
  "your": {
    "key": {
      "here": "Your text"
    }
  }
}
```

---

## 🎯 الاستخدامات الشائعة

### ترجمة عنوان
```tsx
<h1>{t('dashboard.site.title')}</h1>
```

### ترجمة زر
```tsx
<button>{t('common.save')}</button>
```

### محتوى شرطي
```tsx
{isArabic ? <p>نص عربي</p> : <p>English text</p>}
```

### تبديل اللغة
```tsx
<button onClick={() => setLanguage('ar')}>العربية</button>
```

### محاذاة تلقائية
```tsx
<div dir={dir}>محتوى يتم محاذاته تلقائياً</div>
```

---

## 📁 الملفات المهمة

| الملف | الغرض |
|------|--------|
| `app/context/LanguageContext.tsx` | محرك الترجمة |
| `app/hooks/useTranslation.ts` | الوصول السهل |
| `app/Components/LanguageSwitcher/LanguageSwitcher.tsx` | زر التبديل |
| `locales/en.json` | ترجمات إنجليزية |
| `locales/ar.json` | ترجمات عربية |

---

## 🔑 المفاتيح المتاحة

```
common.*
dashboard.site.*
dashboard.mysite.*
validation.*
messages.*
form.*
table.*
nav.*
footer.*
```

---

## 💡 نصائح سريعة

✅ **استخدم دائماً 'use client'**
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';
```

✅ **أضف dir للعناصر الكبيرة**
```tsx
<main dir={dir}>محتوى رئيسي</main>
```

✅ **استخدم isArabic للحالات الخاصة**
```tsx
className={isArabic ? 'ar-class' : 'en-class'}
```

❌ **لا تستخدم hardcoded text**
```tsx
// ❌ خطأ
<h1>Hello</h1>

// ✅ صحيح
<h1>{t('page.title')}</h1>
```

---

## 🐛 حل المشاكل

### الترجمات لا تظهر
- تأكد من `'use client'` في الملف
- تحقق من المفتاح في `locales/en.json` و `locales/ar.json`
- استيراد Hook صحيح

### اللغة لا تتغير
- افتح Console في المتصفح
- اكتب: `localStorage.setItem('language', 'ar')`
- أعد تحميل الصفحة

### الاتجاه RTL لا يعمل
- أضف `dir={dir}` صراحة
- استخدم Tailwind RTL: `text-right`/`text-left`

---

## 📚 التوثيق الكامل

- **البداية السريعة:** [I18N_QUICK_START.md](./I18N_QUICK_START.md)
- **الشرح المفصل:** [I18N_SETUP.md](./I18N_SETUP.md)
- **الأمثلة العملية:** [I18N_SCENARIOS.md](./I18N_SCENARIOS.md)
- **البنية الكاملة:** [I18N_ARCHITECTURE.md](./I18N_ARCHITECTURE.md)
- **الملخص الشامل:** [I18N_SUMMARY.md](./I18N_SUMMARY.md)

---

## ✅ ما الذي تحتاجه؟

**للاستخدام الفوري:**
- ✅ الملفات جاهزة
- ✅ الترجمات مضافة
- ✅ الـ Hook موجود
- ✅ جاهز للعمل

**ما لا تحتاجه:**
- ❌ تثبيت إضافي
- ❌ إعدادات معقدة
- ❌ ملفات تكوين

---

## 🎉 جاهز!

الآن أنت جاهز لاستخدام النظام!

ابدأ من أي صفحة وطبق الخطوات الثلاث:
1. استيراد Hook
2. استخدام في المكون
3. إضافة الترجمات

**مجرد هذا! 🚀**

---

**كل ما تحتاجه موجود ومجهز!**

آخر تحديث: 4 فبراير 2026
