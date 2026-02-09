# 🎯 سيناريوهات الاستخدام العملية

## السيناريو 1: ترجمة صفحة منتجات

### الحالة الحالية:
```tsx
export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <p>Welcome to our products section</p>
      <button>Add Product</button>
    </div>
  );
}
```

### بعد الترجمة:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

export default function ProductsPage() {
  const { t, isArabic, dir } = useTranslation();
  
  return (
    <div dir={dir}>
      <h1>{t('dashboard.products.title')}</h1>
      <p>{t('dashboard.products.welcome')}</p>
      <button>{t('dashboard.products.addProduct')}</button>
    </div>
  );
}
```

### الترجمات المطلوبة:
```json
// locales/en.json
{
  "dashboard": {
    "products": {
      "title": "Products",
      "welcome": "Welcome to our products section",
      "addProduct": "Add Product"
    }
  }
}

// locales/ar.json
{
  "dashboard": {
    "products": {
      "title": "المنتجات",
      "welcome": "أهلاً وسهلاً بك في قسم المنتجات",
      "addProduct": "إضافة منتج"
    }
  }
}
```

---

## السيناريو 2: رسائل خطأ مترجمة

### الحالة الحالية:
```tsx
const [error, setError] = useState('');

const handleSubmit = (formData) => {
  if (!formData.name) {
    setError('Name is required');
    return;
  }
  // ...
};

return (
  <div>
    {error && <div className="error">{error}</div>}
  </div>
);
```

### بعد الترجمة:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

const [error, setError] = useState('');

const handleSubmit = (formData) => {
  const { t } = useTranslation();
  
  if (!formData.name) {
    setError(t('validation.nameRequired'));
    return;
  }
  // ...
};

return (
  <div>
    {error && <div className="error">{error}</div>}
  </div>
);
```

### الترجمات:
```json
// locales/en.json
{
  "validation": {
    "nameRequired": "Name is required",
    "emailInvalid": "Please enter a valid email",
    "passwordTooShort": "Password must be at least 8 characters"
  }
}

// locales/ar.json
{
  "validation": {
    "nameRequired": "الاسم مطلوب",
    "emailInvalid": "يرجى إدخال بريد إلكتروني صحيح",
    "passwordTooShort": "يجب أن تكون كلمة المرور 8 أحرف على الأقل"
  }
}
```

---

## السيناريو 3: محتوى شرطي حسب اللغة

### الحالة الحالية:
```tsx
return (
  <div>
    <h1>Hello</h1>
    <p>Welcome</p>
  </div>
);
```

### بعد التحسين:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

return (
  <div dir={dir}>
    {isArabic ? (
      <>
        <h1>مرحباً</h1>
        <p>أهلاً وسهلاً</p>
      </>
    ) : (
      <>
        <h1>Hello</h1>
        <p>Welcome</p>
      </>
    )}
  </div>
);
```

### أو بشكل أفضل:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

const { t, dir } = useTranslation();

return (
  <div dir={dir}>
    <h1>{t('welcome.title')}</h1>
    <p>{t('welcome.message')}</p>
  </div>
);
```

---

## السيناريو 4: جدول مع رؤوس مترجمة

### الحالة الحالية:
```tsx
const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' }
];

return (
  <table>
    <thead>
      <tr>
        {columns.map(col => (
          <th key={col.key}>{col.label}</th>
        ))}
      </tr>
    </thead>
  </table>
);
```

### بعد الترجمة:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

export default function Table() {
  const { t } = useTranslation();
  
  const columns = [
    { key: 'name', labelKey: 'table.name' },
    { key: 'email', labelKey: 'table.email' },
    { key: 'status', labelKey: 'table.status' }
  ];
  
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{t(col.labelKey)}</th>
          ))}
        </tr>
      </thead>
    </table>
  );
}
```

### الترجمات:
```json
{
  "table": {
    "name": "Name",
    "email": "Email",
    "status": "Status"
  }
}
```

---

## السيناريو 5: نماذج مع تسميات مترجمة

### الحالة الحالية:
```tsx
<form>
  <label htmlFor="name">Full Name</label>
  <input id="name" type="text" placeholder="Enter your name" />
  
  <label htmlFor="email">Email Address</label>
  <input id="email" type="email" placeholder="Enter your email" />
  
  <button type="submit">Submit</button>
</form>
```

### بعد الترجمة:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

export default function Form() {
  const { t } = useTranslation();
  
  return (
    <form>
      <label htmlFor="name">{t('form.fullName')}</label>
      <input 
        id="name" 
        type="text" 
        placeholder={t('form.enterName')} 
      />
      
      <label htmlFor="email">{t('form.email')}</label>
      <input 
        id="email" 
        type="email" 
        placeholder={t('form.enterEmail')} 
      />
      
      <button type="submit">{t('common.submit')}</button>
    </form>
  );
}
```

### الترجمات:
```json
{
  "form": {
    "fullName": "Full Name",
    "enterName": "Enter your name",
    "email": "Email Address",
    "enterEmail": "Enter your email"
  },
  "common": {
    "submit": "Submit"
  }
}
```

---

## السيناريو 6: قائمة ملاحة مترجمة

### الحالة الحالية:
```tsx
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

return (
  <nav>
    {navItems.map(item => (
      <a key={item.href} href={item.href}>{item.label}</a>
    ))}
  </nav>
);
```

### بعد الترجمة:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';

export default function Navigation() {
  const { t, isArabic } = useTranslation();
  
  const navItems = [
    { labelKey: 'nav.home', href: '/' },
    { labelKey: 'nav.products', href: '/products' },
    { labelKey: 'nav.about', href: '/about' },
    { labelKey: 'nav.contact', href: '/contact' }
  ];
  
  return (
    <nav dir={isArabic ? 'rtl' : 'ltr'}>
      {navItems.map(item => (
        <a key={item.href} href={item.href}>
          {t(item.labelKey)}
        </a>
      ))}
    </nav>
  );
}
```

---

## السيناريو 7: رسائل التنبيه (Toast)

### الحالة الحالية:
```tsx
const handleSuccess = () => {
  toast.success('Data saved successfully');
};

const handleError = () => {
  toast.error('An error occurred');
};
```

### بعد الترجمة:
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';
import toast from 'react-hot-toast';

export default function MyComponent() {
  const { t } = useTranslation();
  
  const handleSuccess = () => {
    toast.success(t('messages.savedSuccessfully'));
  };
  
  const handleError = () => {
    toast.error(t('messages.errorOccurred'));
  };
  
  return (
    // ...
  );
}
```

### الترجمات:
```json
{
  "messages": {
    "savedSuccessfully": "Data saved successfully",
    "errorOccurred": "An error occurred",
    "deletedSuccessfully": "Item deleted successfully",
    "loadingData": "Loading data..."
  }
}
```

---

## السيناريو 8: صفحة كاملة مترجمة

```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';
import { LanguageSwitcher } from '@/app/Components/LanguageSwitcher/LanguageSwitcher';

export default function CompletePage() {
  const { t, isArabic, dir } = useTranslation();
  
  return (
    <div dir={dir}>
      {/* Language Switcher */}
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>
      
      {/* Header */}
      <header className={isArabic ? 'text-right' : 'text-left'}>
        <h1>{t('page.title')}</h1>
        <p>{t('page.subtitle')}</p>
      </header>
      
      {/* Content */}
      <main>
        <section>
          <h2>{t('page.section1.title')}</h2>
          <p>{t('page.section1.content')}</p>
        </section>
      </main>
      
      {/* Footer */}
      <footer className={isArabic ? 'text-right' : 'text-left'}>
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
}
```

---

## نصائح سريعة

✅ **افصل بين النصوص والمنطق**
```tsx
// ✅ صحيح
const { t } = useTranslation();
const title = t('page.title');

// ❌ خطأ
const title = isArabic ? 'العنوان' : 'Title';
```

✅ **استخدم dir دائماً للعناصر الرئيسية**
```tsx
<main dir={dir}>
  محتوى يتم محاذاته تلقائياً
</main>
```

✅ **نظم الترجمات بشكل منطقي**
```json
{
  "dashboard": {
    "site": { ... },
    "products": { ... }
  }
}
```

✅ **أضف 'use client' قبل استخدام Hook**
```tsx
'use client';
import { useTranslation } from '@/app/hooks/useTranslation';
```

---

## الخلاصة

جميع السيناريوهات أعلاه توضح كيفية:
1. استيراد Hook
2. استخراج الخصائص المطلوبة
3. استخدام t() للترجمة
4. إضافة المفاتيح في ملفات الترجمة
5. الحفاظ على الكود نظيف وسهل الصيانة

**النتيجة: نظام ترجمة احترافي وسهل الاستخدام! 🎉**
