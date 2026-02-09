'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, ChevronDown, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Heart, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '@/app/hooks/useTranslation';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

// Social Media Icons Component
const SocialIcon = ({ name }: { name: string }): React.ReactElement => {
  const iconName = name.toLowerCase();
  
  const icons: Record<string, React.ReactElement> = {
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
    pinterest: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
      </svg>
    ),
    whatsapp: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    telegram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  };

  return icons[iconName] || (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
      <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
    </svg>
  );
};

// Types
interface SiteData {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  description: string;
  phone: string;
  user_id: string;
  about: string;
  whyUs: string;
  QandA: string;
  privacy_policy: string;
  termsOfUse: string;
  returning: string;
  subdomain: string;
  email: string;
  isActive: string;
  createdAt: string;
  modifiedAt: string;
}

interface MapData {
  id: string;
  siteId: string;
  url: string;
  address: string;
  phone: string;
  email: string;
  periodOpen: string;
  createdAt: string;
  modifiedAt: string;
}

interface SocialData {
  id: string;
  name: string;
  icon: string;
  link: string;
  siteId: string;
  createdAt: string;
  modifiedAt: string;
}

interface Product {
  id: number;
  user_id: string;
  name: string;
  url: string;
  category: string;
  price: string;
  discount: string;
  image: string;
  imgAlt: string;
  quantityInStock: number;
  availableSizes: string;
  materials: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  created_at: string;
}

interface Comment {
  id: string;
  siteId: string;
  comment: string;
  rate: number | null;
  customerName: string;
  createdAt: string;
  modifiedAt: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function MysitePage() {
  const { t, isArabic, dir } = useTranslation();
  const params = useParams();
  const subdomain = params?.subdomain as string || 'rest';

  // Data states
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [mapData, setMapData] = useState<MapData[]>([]);
  const [socialData, setSocialData] = useState<SocialData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

  // UI states
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // New comment form
  const [newComment, setNewComment] = useState({ 
    customerName: '', 
    rate: 5, 
    comment: '' 
  });

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const siteIdResponse = await fetch(`http://localhost:5000/api/site/idBySubdomain/${subdomain}`);
        const siteIdData = await siteIdResponse.json();
        
        if (!siteIdData.success) {
          throw new Error('Site not found');
        }
        
        const siteId = siteIdData.data.id;
        
        const [siteRes, mapRes, socialRes, userRes, commentsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/site/${siteId}`),
          fetch(`http://localhost:5000/api/maps/public/${siteId}`),
          fetch(`http://localhost:5000/api/social/public/${siteId}`),
          fetch(`http://localhost:5000/api/site/${siteId}/user`),
          fetch(`http://localhost:5000/api/comment/public/${siteId}`),
        ]);
        
        const [siteDataRes, mapDataRes, socialDataRes, userDataRes, commentsDataRes] = await Promise.all([
          siteRes.json(),
          mapRes.json(),
          socialRes.json(),
          userRes.json(),
          commentsRes.json(),
        ]);
        
        if (siteDataRes.success) setSiteData(siteDataRes.data);
        if (mapDataRes.success) setMapData(mapDataRes.data);
        if (socialDataRes.success) setSocialData(socialDataRes.data);
        if (commentsDataRes.success) setComments(commentsDataRes.data);
        
        if (userDataRes.success && userDataRes.data.user_id) {
          const userId = userDataRes.data.user_id;
          const productsRes = await fetch(`http://localhost:5000/api/products/user/${userId}`);
          const productsData = await productsRes.json();
          
          if (productsData.success) {
            setProducts(productsData.data);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };
    
    if (subdomain) {
      fetchData();
    }
  }, [subdomain]);

  // Auto-rotate comments every 10 seconds
  useEffect(() => {
    if (comments.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentCommentIndex((prev) => (prev + 1) % comments.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [comments.length]);

  // Submit comment to API
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.customerName.trim() || !newComment.comment.trim()) {
      toast.error(isArabic ? 'يجب ملء جميع الحقول' : 'Please fill all fields', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    if (!siteData || !siteData.id) {
      toast.error(isArabic ? 'لم يتم تحميل بيانات الموقع بعد' : 'Site data not loaded yet', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await fetch('http://localhost:5000/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId: siteData.id,
          comment: newComment.comment,
          customerName: newComment.customerName,
          rate: newComment.rate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComments([data.data, ...comments]);
        setNewComment({ customerName: '', rate: 5, comment: '' });
        toast.success(isArabic ? 'تم إضافة التعليق بنجاح!' : 'Comment added successfully!', {
          duration: 5000,
          position: 'top-center',
        });
      } else {
        toast.error(data.message || (isArabic ? 'فشل إضافة التعليق' : 'Failed to add comment'), {
          duration: 5000,
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error(isArabic ? 'حدث خطأ. حاول مرة أخرى.' : 'Failed to add comment. Please try again.', {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  // Comment carousel navigation
  const goToPreviousComment = () => {
    setCurrentCommentIndex((prev) => (prev === 0 ? comments.length - 1 : prev - 1));
  };

  const goToNextComment = () => {
    setCurrentCommentIndex((prev) => (prev === comments.length - 1 ? 0 : prev + 1));
  };

  // Parse whyUs data
  const getWhyUsItems = (): string[] => {
    if (!siteData?.whyUs) return [];
    return siteData.whyUs.split(',').map(item => item.trim()).filter(item => item);
  };

  // Parse Q&A data
  const getFAQItems = (): FAQItem[] => {
    if (!siteData?.QandA) return [];
    const pairs = siteData.QandA.split(',');
    return pairs.map(pair => {
      const [question, answer] = pair.split('|');
      return {
        question: question?.trim() || '',
        answer: answer?.trim() || '',
      };
    }).filter(faq => faq.question && faq.answer);
  };

  // Get unique categories
  const getCategories = () => {
    const categories = new Set(products.map(p => p.category));
    return ['all', ...Array.from(categories)];
  };

  // Filter products
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">
            {isArabic ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <p className="text-red-600 text-xl mb-4">{isArabic ? 'حدث خطأ' : 'Error'}</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const whyUsItems = getWhyUsItems();
  const faqItems = getFAQItems();
  const categories = getCategories();

  // Map navigation functions
  const goToPreviousMap = () => {
    setCurrentMapIndex((prev) => (prev === 0 ? mapData.length - 1 : prev - 1));
  };

  const goToNextMap = () => {
    setCurrentMapIndex((prev) => (prev === mapData.length - 1 ? 0 : prev + 1));
  };
  const phoneNumber = siteData?.phone || mapData[currentMapIndex]?.phone || '';

  return (
    <div className="bg-white min-h-screen" dir={dir}>
      {/* Hero Section */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
            {/* Text Content */}
            <div className={isArabic ? 'text-right' : ''}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {siteData?.name || (isArabic ? 'متجرنا' : 'Our Store')}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {siteData?.description || (isArabic 
                  ? 'اكتشف مجموعتنا المميزة من المنتجات عالية الجودة.'
                  : 'Discover our premium collection of quality products.'
                )}
              </p>
              
              {/* Social Media Icons */}
              {socialData.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    {isArabic ? 'تابعنا على:' : 'Follow us:'}
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {socialData.map((social) => (
                      <a
                        key={social.id}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-10 h-10 bg-white border border-gray-200 rounded-lg hover:border-gray-900 hover:shadow-md transition-all flex items-center justify-center"
                        title={social.name}
                      >
                        <div className="text-gray-600 group-hover:text-gray-900 transition-colors">
                          <SocialIcon name={social.icon} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 flex-wrap">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  {isArabic ? 'تسوق الآن' : 'Shop Now'}
                </button>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium border-2 border-gray-900 hover:bg-gray-50 transition-colors">
                  {isArabic ? 'اعرف المزيد' : 'Learn More'}
                </button>
              </div>
            </div>

            {/* Image */}
            <div className={isArabic ? 'order-first lg:order-last' : ''}>
              <div className="relative">
                <img
                  src={siteData?.image ? `http://localhost:5000${siteData.image}` : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'}
                  alt={siteData?.imageAlt || siteData?.name || 'Hero'}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                />
                {/* Stats Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                      {products.length}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{isArabic ? 'منتج متاح' : 'Products Available'}</p>
                      <p className="font-semibold text-gray-900">{isArabic ? 'تسوق الآن' : 'Shop Now'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isArabic ? 'منتجاتنا' : 'Our Products'}
            </h2>
            <p className="text-gray-600">
              {isArabic 
                ? 'اختر من بين مجموعة واسعة من المنتجات'
                : 'Choose from our wide range of products'
              }
            </p>
          </div>

          {/* Categories - Centered with Dropdown for 5+ */}
          {categories.length > 1 && (
            <div className="flex justify-center mb-8">
              {categories.length <= 5 ? (
                // Show all categories as buttons if 5 or less
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setCurrentProductIndex(0);
                      }}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        activeCategory === cat
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {cat === 'all' ? (isArabic ? 'الكل' : 'All') : cat}
                    </button>
                  ))}
                </div>
              ) : (
                // Show dropdown if more than 5 categories
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-900 rounded-lg font-medium text-gray-900 hover:bg-gray-50 transition-colors min-w-[200px] justify-between"
                  >
                    <span>{activeCategory === 'all' ? (isArabic ? 'الكل' : 'All') : activeCategory}</span>
                    <ChevronDown size={20} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setCurrentProductIndex(0);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                            activeCategory === cat ? 'bg-gray-100 font-semibold' : ''
                          }`}
                        >
                          {cat === 'all' ? (isArabic ? 'الكل' : 'All') : cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Products Display - Carousel for 4+ products */}
          {filteredProducts.length > 0 ? (
            filteredProducts.length > 4 ? (
              // Carousel with 4 visible products
              <div className="relative">
                {/* Navigation Buttons */}
                <button
                  onClick={() => setCurrentProductIndex(Math.max(0, currentProductIndex - 1))}
                  disabled={currentProductIndex === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 w-12 h-12 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isArabic ? 'rotate-180' : ''}`}
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={() => setCurrentProductIndex(Math.min(filteredProducts.length - 4, currentProductIndex + 1))}
                  disabled={currentProductIndex >= filteredProducts.length - 4}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 w-12 h-12 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isArabic ? 'rotate-180' : ''}`}
                >
                  <ChevronRight size={24} />
                </button>

                {/* Products Container */}
                <div className="overflow-hidden">
                  <div 
                    className="flex gap-6 transition-all duration-500"
                    style={{
                      transform: `translateX(${isArabic ? (currentProductIndex * 25) : (-currentProductIndex * 25)}%)`,
                    }}
                  >
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="flex-shrink-0 w-1/4 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        {/* Product Image */}
                        <div 
                          onClick={() => window.location.href = `/products/${product.url || product.id}`}
                          className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
                        >
                          <img
                            src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/400'}
                            alt={product.imgAlt || product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Wishlist */}
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 hover:opacity-100"
                          >
                            <Heart size={18} className="text-gray-600" />
                          </button>
                          
                          {/* Discount Badge */}
                          {parseFloat(product.discount) > 0 && (
                            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                              -{product.discount}%
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Category */}
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {product.category}
                          </span>

                          {/* Name */}
                          <h3 
                            onClick={() => window.location.href = `/products/${product.url || product.id}`}
                            className="text-lg font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 cursor-pointer hover:text-gray-600 transition-colors"
                          >
                            {product.name}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Stock */}
                          <div className="mb-3">
                            {product.quantityInStock > 0 ? (
                              <span className="text-xs text-green-600 font-medium">
                                {isArabic ? 'متوفر' : 'In Stock'} ({product.quantityInStock})
                              </span>
                            ) : (
                              <span className="text-xs text-red-600 font-medium">
                                {isArabic ? 'نفذت الكمية' : 'Out of Stock'}
                              </span>
                            )}
                          </div>

                          {/* Price & Cart */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-xl font-bold text-gray-900">
                                ${parseFloat(product.price).toFixed(2)}
                              </p>
                            </div>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              disabled={product.quantityInStock === 0}
                              className="p-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: Math.max(0, filteredProducts.length - 3) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentProductIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentProductIndex === idx
                          ? 'bg-gray-900 w-8'
                          : 'bg-gray-300 w-2 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              // Regular grid for 8 or fewer products
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div 
                      onClick={() => window.location.href = `/products/${product.url || product.id}`}
                      className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/400'}
                        alt={product.imgAlt || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Wishlist */}
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Heart size={18} className="text-gray-600" />
                      </button>
                      
                      {/* Discount Badge */}
                      {parseFloat(product.discount) > 0 && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Category */}
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {product.category}
                      </span>

                      {/* Name */}
                      <h3 
                        onClick={() => window.location.href = `/products/${product.url || product.id}`}
                        className="text-lg font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 cursor-pointer hover:text-gray-600 transition-colors"
                      >
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Stock */}
                      <div className="mb-3">
                        {product.quantityInStock > 0 ? (
                          <span className="text-xs text-green-600 font-medium">
                            {isArabic ? 'متوفر' : 'In Stock'} ({product.quantityInStock})
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">
                            {isArabic ? 'نفذت الكمية' : 'Out of Stock'}
                          </span>
                        )}
                      </div>

                      {/* Price & Cart */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          disabled={product.quantityInStock === 0}
                          className="p-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {isArabic ? 'لا توجد منتجات متاحة' : 'No products available'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      {whyUsItems.length > 0 && (
        <section className="py-16 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isArabic ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyUsItems.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center text-lg font-bold mb-4">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      {siteData?.about && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isArabic ? 'من نحن' : 'About Us'}
              </h2>
              <div className="w-20 h-1 bg-gray-900 mx-auto mt-4"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-0 ${isArabic ? '' : ''}`}>
                {/* Image Side Panel */}
                <div className={`relative overflow-hidden ${isArabic ? 'lg:order-2' : ''}`}>
                  <img
                    src={siteData?.image ? `http://localhost:5000${siteData.image}` : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'}
                    alt={siteData?.imageAlt || siteData?.name || 'About Us'}
                    className="w-full h-full object-cover min-h-[400px] lg:min-h-full"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{siteData?.name}</h3>
                    <p className="text-white/90 text-sm">
                      {isArabic ? 'قصتنا' : 'Our Story'}
                    </p>
                  </div>
                </div>
                
                {/* Content */}
                <div className={`lg:col-span-2 p-8 lg:p-12 ${isArabic ? 'lg:order-1' : ''}`}>
                  <div 
                    className={`text-gray-700 leading-relaxed prose prose-lg max-w-none ${isArabic ? 'text-right' : 'text-left'}`}
                    dangerouslySetInnerHTML={{ __html: siteData.about }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h2>
            </div>
            
            <div className="space-y-4">
              {faqItems.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className={`w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors ${isArabic ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <ChevronDown 
                      size={20} 
                      className={`text-gray-500 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${expandedFaq === idx ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className={`px-6 py-4 bg-gray-50 text-gray-700 border-t border-gray-200 ${isArabic ? 'text-right' : ''}`}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isArabic ? 'آراء العملاء' : 'Customer Reviews'}
            </h2>
            <p className="text-gray-600">
              {isArabic ? 'شاركنا رأيك وتجربتك معنا' : 'Share your opinion and experience with us'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Comment Form - Always Visible */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-6 min-h-96 flex flex-col">
                <h3 className={`text-xl font-bold text-gray-900 mb-6 ${isArabic ? 'text-right' : ''}`}>
                  {isArabic ? 'أضف تعليقك' : 'Add Your Review'}
                </h3>

                <form onSubmit={submitComment} className="space-y-4 flex-1 flex flex-col">
                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isArabic ? 'text-right' : ''}`}>
                      {isArabic ? 'الاسم' : 'Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newComment.customerName}
                      onChange={(e) => setNewComment({...newComment, customerName: e.target.value})}
                      placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent ${isArabic ? 'text-right' : ''}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isArabic ? 'text-right' : ''}`}>
                      {isArabic ? 'التقييم' : 'Rating'}
                    </label>
                    <div className={`flex gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewComment({...newComment, rate: star})}
                          className="transition transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={star <= newComment.rate ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium text-gray-700 mb-2 ${isArabic ? 'text-right' : ''}`}>
                      {isArabic ? 'التعليق' : 'Comment'} *
                    </label>
                    <textarea
                      required
                      value={newComment.comment}
                      onChange={(e) => setNewComment({...newComment, comment: e.target.value})}
                      placeholder={isArabic ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
                      rows={4}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none ${isArabic ? 'text-right' : ''}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingComment || !newComment.customerName.trim() || !newComment.comment.trim()}
                    className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {submittingComment ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send size={18} />
                    )}
                    {isArabic ? 'إرسال التعليق' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>

            {/* Comments List - Carousel */}
            <div className="lg:col-span-2">
              {comments.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-lg">
                    {isArabic ? 'لا توجد تعليقات بعد. كن أول من يعلق!' : 'No reviews yet. Be the first to review!'}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Navigation Buttons */}
                  {comments.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousComment}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 w-12 h-12 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all ${isArabic ? 'rotate-180' : ''}`}
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <button
                        onClick={goToNextComment}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 w-12 h-12 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all ${isArabic ? 'rotate-180' : ''}`}
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Comment Display */}
                  <div className="overflow-hidden min-h-96">
                    <div className="transition-all duration-500 h-96">
                      {comments[currentCommentIndex] && (
                        <div 
                          className="bg-white border border-gray-200 rounded-lg p-8 h-full flex flex-col"
                        >
                          <div className={`flex items-start gap-4 mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                              {comments[currentCommentIndex].customerName.charAt(0).toUpperCase()}
                            </div>
                            <div className={`flex-1 ${isArabic ? 'text-right' : ''}`}>
                              <p className="font-semibold text-gray-900 text-lg">{comments[currentCommentIndex].customerName}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(comments[currentCommentIndex].createdAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                              </p>
                            </div>
                          </div>
                          
                          {comments[currentCommentIndex].rate && (
                            <div className={`flex gap-1 mb-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={20}
                                  className={i < comments[currentCommentIndex].rate! ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          )}
                          
                          <p className={`text-gray-700 leading-relaxed text-lg flex-1 ${isArabic ? 'text-right' : ''}`}>
                            {comments[currentCommentIndex].comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dots Indicator */}
                  {comments.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {comments.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentCommentIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            currentCommentIndex === idx
                              ? 'bg-gray-900 w-8'
                              : 'bg-gray-300 w-2 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      {mapData.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isArabic ? 'موقعنا' : 'Our Location'}
              </h2>
              <p className="text-gray-600">
                {isArabic ? 'زر متجرنا أو تواصل معنا' : 'Visit our store or get in touch'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
                  {mapData[currentMapIndex]?.url ? (
                    <iframe
                      src={mapData[currentMapIndex].url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.1848894825364!2d46.6771311!3d24.7745312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03d6d7d7d7d7%3A0x7d7d7d7d7d7d7d7d!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  )}

                  {/* Navigation Arrows */}
                  {mapData.length > 1 && (
                    <>
                      {/* Left Arrow */}
                      <button
                        onClick={goToPreviousMap}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${isArabic ? 'right-4' : 'left-4'} z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors`}
                        aria-label={isArabic ? 'الخريطة السابقة' : 'Previous map'}
                      >
                        <ChevronLeft size={24} className="text-gray-900" />
                      </button>

                      {/* Right Arrow */}
                      <button
                        onClick={goToNextMap}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${isArabic ? 'left-4' : 'right-4'} z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors`}
                        aria-label={isArabic ? 'الخريطة التالية' : 'Next map'}
                      >
                        <ChevronRight size={24} className="text-gray-900" />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
                        {mapData.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentMapIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentMapIndex ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                            aria-label={`Go to map ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className={isArabic ? 'text-right' : ''}>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {isArabic ? 'معلومات التواصل' : 'Contact Information'}
                  </h3>
                  
                  <div className="space-y-4">
                    {mapData[currentMapIndex]?.address && (
                      <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{isArabic ? 'العنوان' : 'Address'}</p>
                          <p className="text-gray-900 font-medium">{mapData[currentMapIndex].address}</p>
                        </div>
                      </div>
                    )}
                    
                    {(mapData[currentMapIndex]?.phone || siteData?.phone) && (
                      <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Phone size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{isArabic ? 'الهاتف' : 'Phone'}</p>
                          <p className="text-gray-900 font-medium">{mapData[currentMapIndex]?.phone || siteData?.phone}</p>
                          {mapData[currentMapIndex]?.periodOpen && (
                            <p className="text-sm text-gray-500">{mapData[currentMapIndex].periodOpen}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {(mapData[currentMapIndex]?.email || siteData?.email) && (
                      <div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">{isArabic ? 'البريد الإلكتروني' : 'Email'}</p>
                          <p className="text-gray-900 font-medium">{mapData[currentMapIndex]?.email || siteData?.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* WhatsApp Floating Button */}
      {phoneNumber && (
        <a
          href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-6 z-50 group ${isArabic ? 'left-6' : 'right-6'}`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
          </div>
        </a>
      )}
    </div>
  );
}