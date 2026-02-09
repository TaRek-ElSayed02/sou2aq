'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from '../Components/SideBar/SideBar';
import { Navbar } from '../Components/Navbar/Navbar';
import { useAppSelector } from '@/store/hooks'
import { useRouter, usePathname } from 'next/navigation';
import { setupMainSiteTokenResponder } from '@/app/utils/tokenSync';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)
  const [contentToRender, setContentToRender] = useState(children)
  
  const router = useRouter()
  const pathname = usePathname()
  const { accessToken, user } = useAppSelector((state) => state.auth)
  
  // Setup token responder for subdomains
  useEffect(() => {
    const cleanup = setupMainSiteTokenResponder();
    console.log('🎯 Main site token responder activated');
    return cleanup;
  }, []);
  
  // التحقق الفوري من الصلاحيات
  useEffect(() => {
    // إذا لا يوجد token، أعد التوجيه للـ login
    if (!accessToken) {
      router.replace('/auth/login')
      return
    }

    // إذا كان pathname = /dashboard، دع الكل يمرر
    if (pathname === '/dashboard') {
      setContentToRender(children)
      setShouldRender(true)
      return
    }

    // للصفحات الأخرى، تحقق من الـ role
    if (!user) {
      // إذا لم يحمل الـ user بعد، عرض المحتوى بدون تحقق
      setContentToRender(children)
      setShouldRender(true)
      return
    }

    // جرب الوصول للـ role من طرق مختلفة
    const userRole = user?.role || (user as any)?.accountInfo?.role || (user as any)?.type;
    
    // خريطة الصفحات المسموحة
    const rolePages = {
      'admin': [
        '/dashboard/site',
        '/dashboard/products',
        '/dashboard/stock',
        '/dashboard/contact',
      ],
      'superAdmin': [
        '/dashboard/blog',
        '/dashboard/users',
        '/dashboard/sites',
      ],
      'user': [
        '/dashboard/wishlist',
        '/dashboard/cart',
        '/dashboard/contact',
      ],
    };

    // الصفحات المتاحة للجميع
    const commonPages = [
      '/dashboard',
      '/dashboard/pricing',
      '/dashboard/team',
      '/dashboard/settings',
    ];

    // تحقق إذا كانت الصفحة في الصفحات المشتركة
    if (commonPages.includes(pathname)) {
      setContentToRender(children)
      setShouldRender(true)
      return
    }

    // تحقق إذا كانت الصفحة مسموحة للدور الحالي
    const allowedPages = (rolePages as any)[userRole] || [];
    const isAllowed = allowedPages.includes(pathname);

    if (isAllowed) {
      setContentToRender(children)
      setShouldRender(true)
    } else {
      // أعد التوجيه في الخلفية بدون إخفاء الـ layout
      router.replace('/dashboard')
      // عرض محتوى فارغ بدلاً من المحتوى غير المصرح
      setContentToRender(null)
      setShouldRender(true)
    }
  }, [accessToken, user, pathname, router, children])
  
  // دائماً عرض الـ layout
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <div className="sticky top-0 h-screen flex-shrink-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-0 z-10 bg-white shadow-sm flex-shrink-0">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
          </div>

          <div className="flex-1 overflow-y-auto lg:p-6 p-0 min-w-0">
            {shouldRender ? contentToRender : null}
          </div>
        </div>
      </div>
    </div>
  );
}