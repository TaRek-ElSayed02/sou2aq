// نوع الأدوار المتاحة
export type UserRole = 'user' | 'admin' | 'superAdmin';

// دالة للحصول على عناصر السايد بار حسب الدور
export const getMenuItemsByRole = (role: string | null | undefined) => {
  const menuItems: Array<{ icon: string; label: string; path: string }> = [];
  const pageItems: Array<{ icon: string; label: string; path: string }> = [];

  // Dashboard متاح للجميع
  menuItems.push({
    icon: 'LayoutDashboard',
    label: 'Dashboard',
    path: '/dashboard',
  });

  // عناصر إضافية حسب الدور
  if (role === 'admin') {
    menuItems.push(
      { icon: 'Globe2', label: 'My Site', path: '/dashboard/site' },
      { icon: 'Package', label: 'Products', path: '/dashboard/products' },
      { icon: 'Archive', label: 'Product Stock', path: '/dashboard/stock' }
    );
    pageItems.push(
      { icon: 'Phone', label: 'Contact', path: '/dashboard/contact' }
    );
  } else if (role === 'superAdmin') {
    menuItems.push(
      { icon: 'BookOpen', label: 'Blogs', path: '/dashboard/blog' },
      { icon: 'Globe2', label: 'Sites', path: '/dashboard/sites' },
      { icon: 'Users', label: 'Users', path: '/dashboard/users' }
    );
  } else if (role === 'user') {
    menuItems.push(
      { icon: 'Heart', label: 'Wishlist', path: '/dashboard/wishlist' },
      { icon: 'ShoppingCart', label: 'Cart', path: '/dashboard/cart' }
    );
    pageItems.push(
      { icon: 'Phone', label: 'Contact', path: '/dashboard/contact' }
    );
  }

  // الصفحات الثابتة (متاحة للجميع)
  pageItems.push(
    { icon: 'DollarSign', label: 'Pricing', path: '/dashboard/pricing' },
    { icon: 'Users', label: 'Team', path: '/dashboard/team' }
  );

  return { menuItems, pageItems };
};

// تعريف الصفحات المسموحة لكل دور (للحماية)
export const roleAccessMap: Record<string, string[]> = {
  'user': [
    '/dashboard',
    '/dashboard/pricing',
    '/dashboard/team',
    '/dashboard/settings',
    '/dashboard/wishlist',
    '/dashboard/cart',
    '/dashboard/contact',
  ],
  'admin': [
    '/dashboard',
    '/dashboard/pricing',
    '/dashboard/team',
    '/dashboard/settings',
    '/dashboard/products',
    '/dashboard/stock',
    '/dashboard/contact',
    '/dashboard/site',
  ],
  'superAdmin': [
    '/dashboard',
    '/dashboard/pricing',
    '/dashboard/team',
    '/dashboard/settings',
    '/dashboard/blog',
    '/dashboard/sites',
    '/dashboard/users',
  ],
};

// دالة للتحقق من صلاحية الوصول
export const canAccessPage = (role: string | null | undefined, pathname: string): boolean => {
  // إذا لم يكن هناك دور، منع الوصول إلا من /dashboard
  if (!role) {
    return pathname === '/dashboard';
  }

  const allowedPaths = roleAccessMap[role];
  
  if (!allowedPaths) {
    return pathname === '/dashboard';
  }

  return allowedPaths.includes(pathname);
};
