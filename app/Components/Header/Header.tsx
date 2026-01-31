"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const Logo = "/logo.png";
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const { user, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(user?.accountInfo.role)
    console.log(accessToken)
    // Get language from localStorage
    const savedLang = localStorage.getItem('language') as 'en' | 'ar' || 'en';
    setLanguage(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  }, [accessToken])

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/auth/login");
  };

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    setLangMenuOpen(false);
  };

  const profileImage = `http://localhost:5000${user?.accountInfo?.profileImage}`

  console.log("Profile Image:", profileImage);

  return (
    <>
      <header className="w-full px-6 md:px-12 py-4 flex items-center justify-between">
        <img src={Logo} className="h-8 w-auto" alt="Logo" />

        <nav className="hidden md:flex gap-10 items-center">
          <Link href="/">Home</Link>
          <Link href="/About">About</Link>
          <Link href="/Blogs">Blogs</Link>
          <Link href="/">Our App</Link>
          <Link href="/contacts">Contacts</Link>
        </nav>

        <div className="hidden md:flex gap-6 items-center relative">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition text-gray-700"
            >
              <Globe size={18} />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition ${
                    language === 'en'
                      ? 'bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition border-t border-gray-100 ${
                    language === 'ar'
                      ? 'bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>

          {!accessToken ? (
            <>
              <Link href="/auth/login">Log in</Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <img
                  src={profileImage}
                  alt="User"
                  width={35}
                  height={35}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  {/* User Info Header */}
                  <div className="bg-gray-50 px-5 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={profileImage}
                        alt="User"
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{user?.personalInfo?.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.personalInfo?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-5 py-3 hover:bg-gray-50 transition text-gray-700 hover:text-gray-900 flex items-center gap-3 text-sm group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium">Profile</span>
                    </Link>
                    
                    <Link
                      href="/dashboard"
                      className="block px-5 py-3 hover:bg-gray-50 transition text-gray-700 hover:text-gray-900 flex items-center gap-3 text-sm group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Dashboard</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 hover:bg-red-50 transition text-red-600 hover:text-red-700 flex items-center gap-3 text-sm group"
                    >
                      <svg className="w-4 h-4 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={28} />
        </button>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl
        transform transition-all duration-300 ease-out
        ${open ? "translate-x-0 scale-100" : "translate-x-full scale-95"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <img src={Logo} className="h-7" />
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={26} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6 py-8 text-lg">
          <Link onClick={() => setOpen(false)} href="/">
            Home
          </Link>
          <Link onClick={() => setOpen(false)} href="/">
            About
          </Link>
          <Link onClick={() => setOpen(false)} href="/">
            Our App
          </Link>
          <Link onClick={() => setOpen(false)} href="/">
            Contacts
          </Link>

          {/* Mobile Language Switcher */}
          <div className="border-t pt-6 mt-6">
            <p className="text-sm font-medium text-gray-600 mb-3">Language</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  language === 'en'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  language === 'ar'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                AR
              </button>
            </div>
          </div>
        </nav>

        <div className="mt-auto px-6 pb-8 flex flex-col gap-4">
          {!accessToken ? (
            <>
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white text-center py-2 rounded-lg"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {user?.accountInfo?.profileImage && (
                  <img
                    src={`http://localhost:5000${user.accountInfo.profileImage}`}
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                )}

                <div>
                  <p className="font-semibold">
                    {user?.personalInfo?.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.personalInfo?.email}
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-left"
              >
                Profile
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="text-left"
              >
                Dashboard
              </Link>

              <button onClick={handleLogout} className="text-left text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
