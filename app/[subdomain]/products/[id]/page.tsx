'use client';

import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/app/hooks/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description?: string;
}

// بيانات المنتجات
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 199.99,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'electronics',
    description: 'High-quality audio experience with noise cancellation and premium comfort features.'
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 299.99,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'electronics',
    description: 'Advanced fitness tracking and health monitoring smartwatch with long battery life.'
  },
  {
    id: 3,
    name: 'Digital Camera',
    price: 599.99,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=500&fit=crop',
    category: 'electronics',
    description: 'Professional-grade digital camera with 4K recording and advanced features.'
  },
  {
    id: 4,
    name: 'Leather Jacket',
    price: 149.99,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
    category: 'fashion',
    description: 'Classic leather jacket with premium quality and timeless design.'
  },
  {
    id: 5,
    name: 'Classic T-Shirt',
    price: 29.99,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    category: 'fashion',
    description: 'Comfortable and durable classic t-shirt made from organic cotton.'
  },
  {
    id: 6,
    name: 'Sports Shoes',
    price: 89.99,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'shoes',
    description: 'High-performance sports shoes with enhanced comfort and durability.'
  },
  {
    id: 7,
    name: 'Modern Lamp',
    price: 79.99,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop',
    category: 'furniture',
    description: 'Contemporary design lamp with adjustable brightness.'
  },
  {
    id: 8,
    name: 'Luxury Watch',
    price: 449.99,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop',
    category: 'electronics',
    description: 'Premium luxury watch with Swiss movement and elegant design.'
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const productId = parseInt(id);
  const product = PRODUCTS.find(p => p.id === productId);
  
  const { t, isArabic } = useTranslation();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isArabic ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {isArabic ? 'عذراً، المنتج الذي تبحث عنه غير موجود.' : 'Sorry, the product you are looking for does not exist.'}
          </p>
          <Link href="/mysite" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition">
            {isArabic ? 'العودة للمتجر' : 'Back to Store'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-semibold"
        >
          <ChevronLeft size={20} />
          {isArabic ? 'العودة' : 'Back'}
        </button>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Wishlist button */}
              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition z-10"
              >
                <Heart
                  size={24}
                  className={isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className={`space-y-8 ${isArabic ? 'text-right' : ''}`}>
            {/* Category */}
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{product.rating}/5</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{isArabic ? 'السعر' : 'Price'}</p>
                  <p className="text-5xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-600">
                  {isArabic ? 'تشمل جميع الرسوم والضرائب' : 'Includes all fees and taxes'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {isArabic ? 'الوصف' : 'Description'}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description || (isArabic ? 'منتج عالي الجودة مع ميزات استثنائية.' : 'High-quality product with exceptional features.')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button className="flex-1 py-4 text-white rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 shadow-lg" style={{ backgroundColor: '#101828' }} onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                <ShoppingCart size={24} />
                {isArabic ? 'أضف إلى السلة' : 'Add to Cart'}
              </button>
              <button
                onClick={() => setIsInWishlist(!isInWishlist)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3 shadow-lg ${
                  isInWishlist
                    ? 'bg-red-100 hover:bg-red-200 text-red-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <Heart size={24} className={isInWishlist ? 'fill-current' : ''} />
                {isInWishlist ? (isArabic ? 'مضافة' : 'Added') : (isArabic ? 'أضف' : 'Add')}
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">{isArabic ? 'التوصيل' : 'Shipping'}</p>
                <p className="font-semibold text-gray-900">
                  {isArabic ? 'توصيل مجاني' : 'Free Shipping'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">{isArabic ? 'الضمان' : 'Warranty'}</p>
                <p className="font-semibold text-gray-900">
                  {isArabic ? '12 شهر' : '1 Year'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="bg-gray-50 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <h2 className={`text-4xl font-bold text-gray-900 mb-12 ${isArabic ? 'text-right' : 'text-center'}`}>
            {isArabic ? 'منتجات ذات صلة' : 'Related Products'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4).map((relatedProduct) => (
              <Link 
                key={relatedProduct.id}
                href={`/mysite/products/${relatedProduct.id}`}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-200 h-full cursor-pointer">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < relatedProduct.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    
                    <p className="text-2xl font-bold text-gray-900">${relatedProduct.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
