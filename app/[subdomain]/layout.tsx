'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Heart, User, Search, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <html lang="en" dir="ltr">
      <body className="bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <span className="font-bold text-xl text-gray-900">StoreMart</span>
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-700 hover:text-pink-500 font-medium transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Icons */}
              <div className="flex items-center gap-4">
                <button className="text-gray-700 hover:text-pink-500">
                  <Search size={20} />
                </button>
                <button className="text-gray-700 hover:text-pink-500">
                  <ShoppingCart size={20} />
                </button>
                <button className="text-gray-700 hover:text-pink-500">
                  <Heart size={20} />
                </button>
                <button className="text-gray-700 hover:text-pink-500">
                  <User size={20} />
                </button>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden text-gray-700 hover:text-pink-500"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="md:hidden pb-4 border-t">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block py-2 text-gray-700 hover:text-pink-500 font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* About */}
              <div>
                <h3 className="text-white font-bold mb-4">About StoreMart</h3>
                <p className="text-sm text-gray-400">
                  We provide the best online shopping experience with quality products and excellent customer service.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-gray-400 hover:text-pink-500">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-pink-500">Contact</Link></li>
                  <li><Link href="/products" className="text-gray-400 hover:text-pink-500">Products</Link></li>
                  <li><Link href="/blogs" className="text-gray-400 hover:text-pink-500">Blog</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-bold mb-4">Support</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/faq" className="text-gray-400 hover:text-pink-500">FAQ</Link></li>
                  <li><Link href="/shipping" className="text-gray-400 hover:text-pink-500">Shipping</Link></li>
                  <li><Link href="/returns" className="text-gray-400 hover:text-pink-500">Returns</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-pink-500">Privacy</Link></li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <h3 className="text-white font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-pink-500"><Facebook size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-pink-500"><Twitter size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-pink-500"><Instagram size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-pink-500"><Linkedin size={20} /></a>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 StoreMart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
