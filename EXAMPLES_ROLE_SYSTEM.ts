/**
 * مثال على كيفية استخدام نظام التحكم بالأدوار
 * 
 * المستخدمون الثلاثة والصفحات المتاحة:
 */

// ============================================
// 1. User (مستخدم عادي)
// ============================================
/*
user: {
  id: '123',
  role: 'user',
  fullName: 'أحمد محمد'
}

الصفحات المتاحة في السايد بار:
✓ Dashboard
✓ Wishlist
✓ Cart
✓ Contact
✓ Pricing
✓ Team
✓ Settings
✓ Logout

محاولة الوصول للصفحات غير المسموحة:
❌ /dashboard/blog → يعاد التوجيه إلى Dashboard
❌ /dashboard/products → يعاد التوجيه إلى Dashboard
❌ /dashboard/stock → يعاد التوجيه إلى Dashboard
❌ /dashboard/site → يعاد التوجيه إلى Dashboard
*/

// ============================================
// 2. Admin
// ============================================
/*
user: {
  id: '456',
  role: 'admin',
  fullName: 'سارة علي'
}

الصفحات المتاحة في السايد بار:
✓ Dashboard
✓ My Site
✓ Products
✓ Product Stock
✓ Contact
✓ Pricing
✓ Team
✓ Settings
✓ Logout

محاولة الوصول للصفحات غير المسموحة:
❌ /dashboard/blog → يعاد التوجيه إلى Dashboard
❌ /dashboard/wishlist → يعاد التوجيه إلى Dashboard
❌ /dashboard/cart → يعاد التوجيه إلى Dashboard
*/

// ============================================
// 3. SuperAdmin
// ============================================
/*
user: {
  id: '789',
  role: 'superAdmin',
  fullName: 'محمود خالد'
}

الصفحات المتاحة في السايد بار:
✓ Dashboard
✓ Blogs
✓ Pricing
✓ Team
✓ Settings
✓ Logout

محاولة الوصول للصفحات غير المسموحة:
❌ /dashboard/products → يعاد التوجيه إلى Dashboard
❌ /dashboard/stock → يعاد التوجيه إلى Dashboard
❌ /dashboard/site → يعاد التوجيه إلى Dashboard
❌ /dashboard/wishlist → يعاد التوجيه إلى Dashboard
❌ /dashboard/cart → يعاد التوجيه إلى Dashboard
❌ /dashboard/contact → يعاد التوجيه إلى Dashboard (not available for superAdmin)
*/

// ============================================
// أمثلة استخدام في المكونات
// ============================================

/*
import { canAccessPage } from '@/app/utils/roleConfig';

// مثال 1: التحقق من الصلاحيات
function MyComponent() {
  const user = useAppSelector(state => state.auth.user);
  const hasAccess = canAccessPage(user?.role || null, '/dashboard/products');
  
  return (
    <div>
      {hasAccess ? <ProductsList /> : <AccessDenied />}
    </div>
  );
}

// مثال 2: الحصول على عناصر السايد بار حسب الدور
import { getMenuItemsByRole } from '@/app/utils/roleConfig';

function SidebarMenu() {
  const user = useAppSelector(state => state.auth.user);
  const { menuItems, pageItems } = getMenuItemsByRole(user?.role || null);
  
  return (
    <nav>
      {menuItems.map(item => (
        <Link key={item.path} href={item.path}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
*/

// ============================================
// كيفية إضافة دور جديد أو صفحة جديدة
// ============================================

/*
1. إضافة صفحة جديدة للـ admin:
   - اذهب إلى: app/utils/roleConfig.ts
   - ابحث عن: roleAccessMap
   - أضف المسار الجديد:
   
   admin: [
     // ... الصفحات الحالية ...
     '/dashboard/new-page',  // صفحة جديدة
   ]

2. إضافة عنصر في السايد بار:
   - في noonction getMenuItemsByRole
   - أضف العنصر للدور المناسب:
   
   if (role === 'admin') {
     menuItems.push({
       icon: 'NewIcon',
       label: 'New Page',
       path: '/dashboard/new-page'
     });
   }

3. لا تنسى إضافة الـ icon للـ iconMap:
   const iconMap: Record<string, React.ComponentType...> = {
     // ... icons الحالية ...
     NewIcon,
   };
*/
