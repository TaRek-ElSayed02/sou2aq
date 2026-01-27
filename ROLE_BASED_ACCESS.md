# نظام التحكم بالأدوار (Role-Based Access Control)

## الوصف
نظام يتحكم في الصفحات التي يمكن لكل مستخدم رؤيتها في السايد بار ويمنع الوصول المباشر للصفحات من خلال الـ URL.

## الأدوار المتاحة

### 1. User (مستخدم عادي)
**الصفحات المتاحة:**
- Dashboard
- Wishlist
- Cart
- Contact
- Pricing
- Team
- Settings
- Logout

### 2. Admin
**الصفحات المتاحة:**
- Dashboard
- My Site
- Products
- Product Stock
- Contact
- Pricing
- Team
- Settings
- Logout

### 3. SuperAdmin
**الصفحات المتاحة:**
- Dashboard
- Blogs
- Pricing
- Team
- Settings
- Logout

## الملفات المتعلقة

### 1. `app/utils/roleConfig.ts`
يحتوي على:
- خريطة الأدوار والصفحات المسموحة (`roleAccessMap`)
- دالة `canAccessPage()` للتحقق من صلاحية الوصول
- دالة `getMenuItemsByRole()` للحصول على عناصر السايد بار حسب الدور

### 2. `app/Components/SideBar/SideBar.tsx`
تم تحديثه للقيام بـ:
- جلب الدور من الـ Redux store
- عرض العناصر المسموحة فقط حسب الدور

### 3. `app/Components/ProtectedRoute.tsx`
مكون جديد يقوم بـ:
- التحقق من صلاحية المستخدم قبل عرض الصفحة
- إعادة التوجيه إلى Dashboard إذا حاول الوصول لصفحة ليس له صلاحية فيها

### 4. `app/dashboard/layout.tsx`
تم تحديثه لـ:
- استخدام ProtectedRoute كـ wrapper للمحتوى

## كيفية الاستخدام

### إضافة صفحة جديدة
1. أضف المسار والـ icon في `roleConfig.ts`
2. أضفه للدور المناسب في `roleAccessMap`
3. السايد بار سيتحدث تلقائياً

### التحقق من الصلاحيات برمجياً
```typescript
import { canAccessPage } from '@/app/utils/roleConfig';

// التحقق من صلاحية وصول المستخدم
if (canAccessPage(userRole, '/dashboard/products')) {
  // يمكنه الوصول
}
```

## ملاحظات أمان
- الـ ProtectedRoute يمنع الوصول من خلال الـ URL بكل الأحوال
- الـ middleware.ts يتحقق من وجود التوكن
- يجب التأكد من أن كل صفحة محمية داخل `/dashboard`

## الاختبار
1. سجل دخول بحساب مختلف الأدوار
2. حاول الوصول لصفحة ليس لديك صلاحية فيها
3. تأكد من إعادة التوجيه إلى Dashboard
4. تحقق من ظهور الصفحات الصحيحة فقط في السايد بار
