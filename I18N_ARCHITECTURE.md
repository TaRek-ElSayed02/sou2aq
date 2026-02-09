# شرح نظام i18n المطبق

## 🎯 الهدف
إنشاء نظام ترجمة كامل يدعم:
- ✅ اللغة الإنجليزية والعربية
- ✅ تبديل اللغة بدون إعادة تحميل
- ✅ دعم RTL/LTR تلقائي
- ✅ حفظ اختيار المستخدم

## 📁 البنية الكاملة للملفات

```
project/
├── app/
│   ├── context/
│   │   └── LanguageContext.tsx          ⭐ القلب (إدارة الحالة)
│   │
│   ├── hooks/
│   │   └── useTranslation.ts            ⭐ الـ Hook (الوصول السهل)
│   │
│   ├── Components/
│   │   └── LanguageSwitcher/
│   │       └── LanguageSwitcher.tsx     ⭐ الواجهة (تبديل اللغة)
│   │
│   ├── providers.tsx                    ⭐ تفعيل Provider
│   ├── layout.tsx                       ⭐ إضافة HTML attributes
│   │
│   └── (pages محدثة)
│       ├── mysite/page.tsx              ✅ محدث بالترجمات
│       ├── dashboard/site/page.tsx      ✅ محدث جزئياً
│       └── ...
│
└── locales/
    ├── en.json                          ⭐ الترجمات الإنجليزية
    └── ar.json                          ⭐ الترجمات العربية
```

## 🔄 كيفية عمل النظام

### 1️⃣ البداية: LanguageContext

```tsx
// app/context/LanguageContext.tsx

// ينشئ Context للغة
const LanguageContext = createContext<LanguageContextType>();

// يوفر Provider يغلف التطبيق
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  
  // يحفظ اللغة في localStorage
  const setLanguage = (lang) => {
    localStorage.setItem('language', lang);
    // يحدث HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };
  
  // يترجم المفاتيح
  const t = (key) => getNestedValue(translations[language], key);
  
  return (
    <LanguageContext.Provider value={{ ... }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

### 2️⃣ الوصول: useTranslation Hook

```tsx
// app/hooks/useTranslation.ts

export function useTranslation() {
  const context = useContext(LanguageContext);
  return {
    t,              // دالة الترجمة
    language,       // اللغة الحالية
    setLanguage,    // تغيير اللغة
    isArabic,       // هل عربي؟
    dir,            // الاتجاه (rtl/ltr)
  };
}
```

### 3️⃣ الاستخدام: في أي مكون

```tsx
// في أي صفحة أو مكون
'use client';

const { t, isArabic, setLanguage } = useTranslation();

return (
  <h1>{t('dashboard.site.title')}</h1>
  {isArabic && <p>نص عربي فقط</p>}
  <button onClick={() => setLanguage('ar')}>العربية</button>
);
```

## 📋 هيكل ملفات الترجمة

### locales/en.json
```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "dashboard": {
    "site": {
      "title": "Site Management",
      "basicInfo": "Basic Info"
    }
  }
}
```

### locales/ar.json
```json
{
  "common": {
    "save": "حفظ",
    "cancel": "إلغاء"
  },
  "dashboard": {
    "site": {
      "title": "إدارة الموقع",
      "basicInfo": "المعلومات الأساسية"
    }
  }
}
```

## 🔄 تدفق العمل

```
المستخدم يضغط على زر اللغة
           ↓
setLanguage('ar') يُستدعى
           ↓
localStorage يُحدّث
           ↓
HTML attributes يتغير
           ↓
Context يُعدل الحالة
           ↓
جميع المكونات تُعاد الرسم
           ↓
النص يتغير إلى العربية ✅
```

## 💾 ما الذي يُحفظ

```javascript
// في localStorage
{
  language: 'ar'  // أو 'en'
}

// في HTML
<html lang="ar" dir="rtl">
  // للعربية
</html>

<html lang="en" dir="ltr">
  // للإنجليزية
</html>
```

## 📊 خريطة المفاتيح

| المسار | الاستخدام | مثال |
|--------|-----------|------|
| `common.save` | أزرار عامة | حفظ، إلغاء، حذف |
| `dashboard.site.*` | صفحة إدارة الموقع | العنوان، الحقول |
| `dashboard.mysite.*` | صفحة عرض الموقع | الفئات، المنتجات |

## 🛠️ كيفية التوسع

### إضافة لغة جديدة

1. **أنشئ ملف الترجمة الجديد**
   ```
   locales/fr.json (للفرنسية)
   locales/de.json (للألمانية)
   ```

2. **عدّل LanguageContext**
   ```tsx
   type Language = 'en' | 'ar' | 'fr' | 'de';
   
   const translations: Record<Language, any> = {
     en, ar, fr, de
   };
   ```

3. **عدّل LanguageSwitcher**
   ```tsx
   <button onClick={() => setLanguage('fr')}>
     Français
   </button>
   ```

### إضافة مفاتيح ترجمة جديدة

1. **أضف المفتاح في en.json**
   ```json
   {
     "newFeature": {
       "title": "New Feature Title"
     }
   }
   ```

2. **أضف نفس المفتاح في ar.json**
   ```json
   {
     "newFeature": {
       "title": "عنوان الميزة الجديدة"
     }
   }
   ```

3. **استخدمه في المكون**
   ```tsx
   const title = t('newFeature.title');
   ```

## ⚙️ الإعدادات

### اللغة الافتراضية
```tsx
// في LanguageContext
const [language, setLanguageState] = useState<Language>('en');
```
غيّرها إلى `'ar'` إذا أردت اللغة العربية الافتراضية

### مفتاح التخزين المحلي
```tsx
localStorage.setItem('language', lang);
localStorage.getItem('language');
```

## 🐛 حل المشاكل

### الترجمات لا تظهر
- تأكد من `'use client'` في المكون
- تأكد من استيراد Hook صحيح
- تحقق من المفتاح في ملفات الترجمة

### اللغة لا تتغير
```javascript
// افتح Console وتحقق
localStorage.getItem('language')
document.documentElement.lang
document.documentElement.dir
```

### الاتجاه RTL لا يعمل
```tsx
// أضف dir صراحة
<div dir={isArabic ? 'rtl' : 'ltr'}>
  المحتوى
</div>
```

## 📈 الأداء

| المقياس | القيمة |
|---------|--------|
| حجم الترجمات | ~5-10 KB (بدون ضغط) |
| وقت تغيير اللغة | < 100ms |
| تأثير الأداء | صفر تقريباً |

## ✅ قائمة التحقق

- [x] تثبيت المكتبة
- [x] إنشاء Context
- [x] إنشاء Hook
- [x] إنشاء Switcher
- [x] إضافة ملفات الترجمة
- [x] دمج في app/providers.tsx
- [x] تحديث app/layout.tsx
- [x] ترجمة صفحات رئيسية
- [ ] ترجمة جميع الصفحات
- [ ] ترجمة رسائل الخطأ
- [ ] اختبار شامل

## 📚 المراجع

- [ملف الإعداد الكامل](./I18N_SETUP.md)
- [البداية السريعة](./I18N_QUICK_START.md)
- [أمثلة عملية](./I18N_EXAMPLE.md)

## 🎓 الدروس المستفادة

1. **Context API كافٍ** - لا تحتاج إلى مكتبات معقدة
2. **localStorage للحفظ** - يعمل بشكل موثوق
3. **HTML attributes مهمة** - للدعم الكامل
4. **RTL يحتاج عناية خاصة** - استخدم dir دائماً
