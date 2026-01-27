'use client';
import React, { useState } from 'react'
import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';

export const Navbar = ({ onMenuClick }) => {
  const { currentUser } = useUser();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [language, setLanguage] = useState('English');
  const [flagSrc, setFlagSrc] = useState('https://flagcdn.com/w40/gb.png');

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  const handleLanguageChange = (lang, flag) => {
    setLanguage(lang);
    setFlagSrc(flag);
    setShowLanguageDropdown(false);
  };

  const userImage = currentUser?.accountInfo?.profileImage 
    ? (currentUser.accountInfo.profileImage.startsWith('http') 
      ? currentUser.accountInfo.profileImage 
      : `http://localhost:5000${currentUser.accountInfo.profileImage}`)
    : currentUser?.profileImage
    ? (currentUser.profileImage.startsWith('http') 
      ? currentUser.profileImage 
      : `http://localhost:5000${currentUser.profileImage}`)
    : 'https://i.pravatar.cc/150?img=5';
  const userName = currentUser?.personalInfo?.fullName || currentUser?.fullName || 'User';
  const userRole = currentUser?.accountInfo?.role || currentUser?.role || 'User';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Language Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <img src={flagSrc} alt="Language" className="w-6 h-4" />
            <span className="text-sm text-gray-600 hidden sm:inline">{language}</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <button
                onClick={() => handleLanguageChange('English', 'https://flagcdn.com/w40/gb.png')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <img src="https://flagcdn.com/w40/gb.png" alt="English" className="w-5 h-4" />
                <span className="text-sm">English</span>
              </button>
              <button
                onClick={() => handleLanguageChange('العربية', 'https://flagcdn.com/w40/eg.png')}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-2 transition-colors border-t border-gray-200"
              >
                <img src="https://flagcdn.com/w40/eg.png" alt="Arabic" className="w-5 h-4" />
                <span className="text-sm">العربية</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
          >
            <img src={userImage} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
              {/* User Info */}
              <div className="px-4 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img src={userImage} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 transition-colors text-red-600 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
