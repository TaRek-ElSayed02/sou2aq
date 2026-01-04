'use client';
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Heart, Inbox, List, Archive, DollarSign, Calendar, CheckSquare, Users, Phone, FileText, Grid3x3, User, Settings, LogOut, Menu, X, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { 
            icon: LayoutDashboard, 
            label: 'Dashboard', 
            path: '/dashboard' 
        },
        { 
            icon: Package, 
            label: 'Products', 
            path: '/dashboard/products' 
        },
        { 
            icon: Heart, 
            label: 'Favorites', 
            path: '/dashboard/favorites' 
        },
        { 
            icon: List, 
            label: 'Order Lists', 
            path: '/dashboard/orders' 
        },
        { 
            icon: Archive, 
            label: 'Product Stock', 
            path: '/dashboard/stock' 
        }
    ];

    const pageItems = [
        { 
            icon: DollarSign, 
            label: 'Pricing', 
            path: '/dashboard/pricing' 
        },
        { 
            icon: Phone, 
            label: 'Contact', 
            path: '/dashboard/contact' 
        },
        { 
            icon: FileText, 
            label: 'Invoice', 
            path: '/dashboard/invoice' 
        },
        { 
            icon: Users, 
            label: 'Team', 
            path: '/dashboard/team' 
        }
    ];

    // دالة للتحقق إذا كان الرابط نشطاً
    const isActive = (path: string) => {
        // إذا كان الرابط الحالي يساوي المسار تماماً
        if (pathname === path) return true;
        
        // للصفحات الفرعية في الداشبورد
        if (path !== '/dashboard' && path.startsWith('/dashboard') && 
            pathname.startsWith('/dashboard') && pathname !== '/dashboard') {
            // تحقق إذا كان المسار الحالي يبدأ بنفس المسار الأساسي
            return pathname.startsWith(path);
        }
        
        return false;
    };

    const handleLogout = () => {
        // هنا منطق تسجيل الخروج
        console.log('Logout clicked');
        // مثال: router.push('/login');
        
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    const handleItemClick = () => {
        if (window.innerWidth < 1024) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
                    onClick={onClose}
                    aria-hidden="true"
                ></div>
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col h-screen overflow-y-auto`}>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
                        <span className="text-xl font-bold">Dash<span className="font-normal">Stack</span></span>
                    </Link>
                    <button 
                        onClick={onClose} 
                        className="lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-0 p-4">
                    {menuItems.map((item, index) => (
                        <Link 
                            href={item.path} 
                            key={index}
                            onClick={handleItemClick}
                        >
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                                    isActive(item.path) 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        </Link>
                    ))}

                    <div className="text-xs text-gray-400 font-semibold mt-6 mb-2 px-4">PAGES</div>

                    {pageItems.map((item, index) => (
                        <Link 
                            href={item.path} 
                            key={index}
                            onClick={handleItemClick}
                        >
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                                    isActive(item.path) 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <Link 
                        href="/dashboard/settings"
                        onClick={handleItemClick}
                    >
                        <div
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                                isActive('/dashboard/settings') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="text-sm font-medium">Settings</span>
                        </div>
                    </Link>
                    <button 
                        className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors w-full"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};