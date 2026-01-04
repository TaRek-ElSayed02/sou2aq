'use client';
import React, { useState } from 'react';
import { Sidebar } from '../Components/SideBar/SideBar';
import { Navbar } from '../Components/Navbar/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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