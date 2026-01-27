'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { canAccessPage } from '@/app/utils/roleConfig';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const authState = useAppSelector(state => (state as any).auth);
  const user = authState?.user;
  const userRole = user?.role || null;
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // انتظر قليلاً لضمان أن البيانات تحملت
    const timer = setTimeout(() => {
      if (user) {
        const canAccess = canAccessPage(userRole, pathname);
        setHasAccess(canAccess);

        if (!canAccess) {
          // إعادة التوجيه إلى لوحة التحكم إذا لم يكن لديه صلاحية
          router.push('/dashboard');
        }
      } else {
        // إذا كان في user، نعرض المحتوى
        setHasAccess(true);
      }
      setIsCheckingAccess(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, userRole, router, user]);

  // أثناء التحقق، عرض المحتوى (سيتم إعادة التوجيه إذا لزم الحال)
  if (isCheckingAccess && user) {
    return null;
  }

  // إذا لم يكن له صلاحية، لا نعرض شيء
  if (!hasAccess && user) {
    return null;
  }

  return <>{children}</>;
};
