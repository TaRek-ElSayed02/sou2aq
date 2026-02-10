'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, Heart, User, Search, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { requestTokenFromMainSite, listenForTokenMessage } from '@/app/utils/tokenSync';

// Helper function to get token from cookies/storage
const getTokenFromCookies = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  try {
    // أولاً جرّب sessionStorage (الأفضل للـ cross-subdomain)
    const sessionToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
    if (sessionToken) {
      console.log('✅ Found token in sessionStorage');
      return sessionToken;
    }
    
    // جرّب localStorage
    const localToken = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (localToken) {
      console.log('✅ Found token in localStorage');
      return localToken;
    }
    
    // أخيراً جرّب الـ cookies
    const cookieString = document.cookie;
    console.log('🍪 All cookies:', cookieString || 'EMPTY');
    
    const cookies = cookieString.split(';');
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith('accessToken=')) {
        const value = trimmed.substring('accessToken='.length);
        console.log('✅ Found token in cookie');
        return decodeURIComponent(value);
      }
    }
    
    console.log('❌ No token found anywhere');
  } catch (error) {
    console.error('Error reading tokens:', error);
  }
  
  return null;
};

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, setLanguage, isArabic } = useLanguage();
  const params = useParams();
  const subdomain = params?.subdomain as string;
  const [isOpen, setIsOpen] = useState(false);
  const [siteData, setSiteData] = useState<any>(null);
  const [socialData, setSocialData] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch site data
  useEffect(() => {
    if (!subdomain) return;

    const fetchSiteData = async () => {
      try {
        const siteIdResponse = await fetch(`http://localhost:5000/api/site/idBySubdomain/${subdomain}`);
        
        if (!siteIdResponse.ok) {
          console.warn(`⚠️ Site not found for subdomain: ${subdomain}`);
          setSiteData(null);
          setSocialData([]);
          return;
        }
        
        const siteIdData = await siteIdResponse.json();
        
        // Check if response has data and id
        if (!siteIdData.data || !siteIdData.data.id) {
          console.warn(`⚠️ Invalid site data structure:`, siteIdData);
          setSiteData(null);
          setSocialData([]);
          return;
        }
        
        const siteId = siteIdData.data.id;

        const [siteRes, socialRes] = await Promise.all([
          fetch(`http://localhost:5000/api/site/${siteId}`),
          fetch(`http://localhost:5000/api/social/public/${siteId}`),
        ]);

        const [siteData, socialData] = await Promise.all([
          siteRes.json(),
          socialRes.json(),
        ]);

        if (siteData.success) setSiteData(siteData.data);
        if (socialData.success) setSocialData(socialData.data || []);
      } catch (error) {
        console.error('Error fetching site data:', error);
      }
    };

    fetchSiteData();
  }, [subdomain]);

  // Check if user is logged in and fetch user data (from cookies or localStorage)
  useEffect(() => {
    const checkAuthentication = async () => {
      let token = getTokenFromCookies();
      
      // إذا ما حصلنا على token من storage، جرّب طلب من main site عبر postMessage
      if (!token) {
        console.log('🔄 Trying to get token from main site...');
        token = await requestTokenFromMainSite();
      }
      
      // إذا حصلنا على token من main site، احفظه في localStorage الـ subdomain
      if (token && typeof localStorage !== 'undefined') {
        localStorage.setItem('accessToken', token);
        if (typeof token === 'object' && 'refreshToken' in token) {
          localStorage.setItem('refreshToken', (token as any).refreshToken);
          token = (token as any).accessToken;
        }
        console.log('✅ Token saved to subdomain localStorage');
      }
      
      if (token) {
        // Verify token is still valid by fetching user data
        const fetchCurrentUser = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/user/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                // Token is valid, user is logged in
                setIsLoggedIn(true);
                
                if (data.data?.accountInfo?.profileImage) {
                  const imageUrl = data.data.accountInfo.profileImage.startsWith('http')
                    ? data.data.accountInfo.profileImage
                    : `http://localhost:5000${data.data.accountInfo.profileImage}`;
                  setUserImage(imageUrl);
                } else if (data.data?.profileImage) {
                  const imageUrl = data.data.profileImage.startsWith('http')
                    ? data.data.profileImage
                    : `http://localhost:5000${data.data.profileImage}`;
                  setUserImage(imageUrl);
                }
              } else {
                // Token is invalid, clear it
                setIsLoggedIn(false);
              }
            } else {
              // Token is invalid, clear it
              setIsLoggedIn(false);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // On error, still consider user logged in if token exists (offline mode)
            setIsLoggedIn(true);
          }
        };
        
        fetchCurrentUser();
      }
    };
    
    checkAuthentication();
    
    // استمع لـ رسائل token من main site
    const cleanup = listenForTokenMessage((tokenData) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('accessToken', tokenData.accessToken);
        if (tokenData.refreshToken) {
          localStorage.setItem('refreshToken', tokenData.refreshToken);
        }
        console.log('💬 Token received via postMessage and saved');
        // أعد تحميل الـ user data بـ token الجديد
        checkAuthentication();
      }
    });
    
    return cleanup;
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.error(isArabic ? 'يجب تسجيل الدخول أولاً كمشتري' : 'You must log in as a buyer first', {
        duration: 5000,
        position: 'top-center',
      });
      return;
    }
    window.location.href = 'http://localhost:3000/dashboard/cart';
  };

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      toast.error(isArabic ? 'يجب تسجيل الدخول أولاً كمشتري' : 'You must log in as a buyer first', {
        duration: 5000,
        position: 'top-center',
      });
      return;
    }
    window.location.href = 'http://localhost:3000/dashboard/wishlist';
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      window.location.href = 'http://localhost:3000/auth/login';
    } else {
      window.location.href = 'http://localhost:3000/dashboard';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <html lang="en" dir="ltr">
      <body className="bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex justify-between items-center h-20">
              {/* Logo / Site Name */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {siteData?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <span className="font-bold text-xl text-gray-900">{siteData?.name || 'StoreMart'}</span>
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

              {/* Search Bar */}
              <form 
                onSubmit={handleSearch}
                className="hidden lg:flex items-center bg-gray-100 rounded-lg px-4 py-2"
              >
                <input
                  type="text"
                  placeholder={isArabic ? 'ابحث عن منتج...' : 'Search products...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-40"
                />
                <button type="submit" className="text-gray-700 hover:text-pink-500 ml-2">
                  <Search size={18} />
                </button>
              </form>

              {/* Icons */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
                  className="flex items-center gap-1 px-3 py-1 text-white rounded-lg text-sm font-medium transition hover:opacity-80"
                  style={{ backgroundColor: '#101828' }}
                >
                  <Globe size={18} />
                  {language.toUpperCase()}
                </button>
                <button 
                  onClick={handleCartClick}
                  className="text-gray-700 hover:text-pink-500 transition relative"
                  title={isArabic ? 'السلة' : 'Cart'}
                >
                  <ShoppingCart size={20} />
                </button>
                <button 
                  onClick={handleWishlistClick}
                  className="text-gray-700 hover:text-pink-500 transition relative"
                  title={isArabic ? 'قائمة الرغبات' : 'Wishlist'}
                >
                  <Heart size={20} />
                </button>
                <button 
                  onClick={handleUserClick}
                  className="text-gray-700 hover:text-pink-500 transition relative"
                  title={isArabic ? 'حسابي' : 'My Account'}
                >
                  {isLoggedIn && userImage ? (
                    <img 
                      src={userImage} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full object-cover border-2 border-pink-500"
                    />
                  ) : (
                    <User size={20} />
                  )}
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
                <h3 className="text-white font-bold mb-4">{siteData?.name || 'StoreMart'}</h3>
                <p className="text-sm text-gray-400">
                  {siteData?.description ? siteData.description.substring(0, 120) : 'We provide the best online shopping experience with quality products and excellent customer service.'}
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
                  {socialData && socialData.length > 0 ? (
                    socialData.map((social, idx) => (
                      <a 
                        key={idx}
                        href={social.link} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pink-500"
                      >
                        {social.platform === 'facebook' && <Facebook size={20} />}
                        {social.platform === 'twitter' && <Twitter size={20} />}
                        {social.platform === 'instagram' && <Instagram size={20} />}
                        {social.platform === 'linkedin' && <Linkedin size={20} />}
                      </a>
                    ))
                  ) : (
                    <>
                      <a href="#" className="text-gray-400 hover:text-pink-500"><Facebook size={20} /></a>
                      <a href="#" className="text-gray-400 hover:text-pink-500"><Twitter size={20} /></a>
                      <a href="#" className="text-gray-400 hover:text-pink-500"><Instagram size={20} /></a>
                      <a href="#" className="text-gray-400 hover:text-pink-500"><Linkedin size={20} /></a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 {siteData?.name || 'StoreMart'}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
