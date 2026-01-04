import React from 'react'
import { Menu, Bell, ChevronDown ,Search } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Search className='w-5' /></div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">2</span>
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="w-6 h-4" />
          <span className="text-sm text-gray-600 hidden sm:inline">English</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
        
        <div className="flex items-center gap-2">
          <img src="https://i.pravatar.cc/150?img=5" alt="Admin" className="w-9 h-9 rounded-full" />
          <div className="hidden sm:block">
            <div className="text-sm font-semibold">Moni Roy</div>
            <div className="text-xs text-gray-500">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};
