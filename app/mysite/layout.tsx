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

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* About */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">About StoreMart</h3>
                <p className="text-sm text-gray-400">
                  A modern store offering high-quality products at competitive prices and excellent customer service.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/mysite" className="hover:text-pink-400 transition">Home</Link></li>
                  <li><Link href="/mysite/products" className="hover:text-pink-400 transition">Products</Link></li>
                  <li><Link href="/mysite/blogs" className="hover:text-pink-400 transition">Blog</Link></li>
                  <li><Link href="/mysite/contact" className="hover:text-pink-400 transition">Contact Us</Link></li>
                </ul>
              </div>

              {/* Policies */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Policies</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-pink-400 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition">Terms of Use</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition">Return Policy</a></li>
                  <li><a href="#" className="hover:text-pink-400 transition">FAQ</a></li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-pink-400 transition">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="hover:text-pink-400 transition">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="hover:text-pink-400 transition">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="hover:text-pink-400 transition">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  © 2025 StoreMart. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm">
                  <a href="#" className="hover:text-pink-400 transition">Privacy Policy</a>
                  <a href="#" className="hover:text-pink-400 transition">Terms of Use</a>
                  <a href="#" className="hover:text-pink-400 transition">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
