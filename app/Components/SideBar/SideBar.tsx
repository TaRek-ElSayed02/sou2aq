'use client';
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Heart,BookOpen, Archive, DollarSign, Users, Phone, Settings, LogOut,  X, ShoppingCart ,Globe2 } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { getMenuItemsByRole } from '@/app/utils/roleConfig';


interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard,
    Globe2,
    Package,
    Heart,
    ShoppingCart,
    Archive,
    BookOpen,
    DollarSign,
    Phone,
    Users,
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
      const dispatch = useAppDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);

    // جلب الـ auth state
    const auth = useAppSelector(state => (state as any).auth);
    const user = auth?.user;
    
    // حاول الوصول للـ role بطرق مختلفة
    const userRole = user?.role || (user as any)?.accountInfo?.role || (user as any)?.type;

    // Debug لكل شيء
    React.useEffect(() => {
      setMounted(true);
    }, [auth, user, userRole]);

    if (!mounted) {
      return null;
    }

    // الحصول على العناصر حسب الدور
    const { menuItems: rawMenuItems, pageItems: rawPageItems } = getMenuItemsByRole(userRole);

    // تحويل أسماء الـ icons إلى components
    const menuItems: MenuItem[] = rawMenuItems.map(item => ({
        ...item,
        icon: iconMap[item.icon] || LayoutDashboard,
    }));

    const pageItems: MenuItem[] = rawPageItems.map(item => ({
        ...item,
        icon: iconMap[item.icon] || DollarSign,
    }));

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
    dispatch(logout());
    router.replace("/auth/login");
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