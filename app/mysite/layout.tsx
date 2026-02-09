'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Heart, User, Search, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function MysiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/mysite' },
    { name: 'Products', href: '/mysite/products' },
    { name: 'Blog', href: '/mysite/blogs' },
    { name: 'Contact', href: '/mysite/contact' },
  ];

  return (
    <html lang="en" dir="ltr">
      <body className="bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/mysite" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  SM
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">SM Store</span>
              </Link>

              {/* Search Bar - Desktop */}
              <div className="hidden md:flex flex-1 mx-8">
                <div className="w-full max-w-md relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              {/* Icons & Menu */}
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6">
                  <button className="relative">
                    <Heart size={24} className="text-gray-600 hover:text-pink-500 transition" />
                    <span className="absolute -top-2 -left-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                  </button>
                  <button className="relative">
                    <ShoppingCart size={24} className="text-gray-600 hover:text-pink-500 transition" />
                    <span className="absolute -top-2 -left-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
                  </button>
                  <button>
                    <User size={24} className="text-gray-600 hover:text-pink-500 transition" />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex border-t border-gray-100 py-3">
              <div className="flex gap-8 mx-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 hover:text-pink-500 font-medium transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
              <div className="md:hidden pb-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
