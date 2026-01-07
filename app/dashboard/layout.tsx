'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from '../Components/SideBar/SideBar';
import { Navbar } from '../Components/Navbar/Navbar';
import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { accessToken, user } = useAppSelector((state) => state.auth)
  
  useEffect(() => {
    // التحقق من تسجيل الدخول
    if (!accessToken) {
      router.replace('/auth/login')
    }
  }, [accessToken, router])
  
  if (!accessToken) {
    // يمكنك عرض spinner أثناء التحقق
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* تخطيط الشاشة */}
      <div className="flex h-screen overflow-hidden">
        {/* السايدبار - ثابت */}
        <div className="sticky top-0 h-screen flex-shrink-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 مهم لمنع التوسع */}
          {/* النافبار - في أعلى المحتوى */}
          <div className="sticky top-0 z-10 bg-white shadow-sm flex-shrink-0">
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
          </div>

          {/* المحتوى - قابل للتمرير */}
          <div className="flex-1 overflow-y-auto lg:p-6 p-0 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}