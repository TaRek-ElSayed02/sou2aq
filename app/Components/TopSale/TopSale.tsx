import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Edit } from 'lucide-react';

export const TopSale = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const products = [
    {
      id: 1,
      name: 'Apple Watch Series 4',
      price: 120.00,
      rating: 4.5,
      reviews: 131,
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Air-Max-270',
      price: 60.00,
      rating: 4.8,
      reviews: 64,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Minimal Chair Tool',
      price: 24.59,
      rating: 4.7,
      reviews: 83,
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      name: 'MacBook Pro 16"',
      price: 2399.00,
      rating: 4.9,
      reviews: 256,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
    },
    {
      id: 5,
      name: 'iPhone 13 Pro Max',
      price: 1199.00,
      rating: 4.8,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    },
    {
      id: 6,
      name: 'Sony WH-1000XM4',
      price: 349.99,
      rating: 4.9,
      reviews: 512,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop'
    },
    {
      id: 7,
      name: 'iPad Pro 12.9"',
      price: 1099.00,
      rating: 4.7,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'
    },
    {
      id: 8,
      name: 'Samsung Galaxy S22',
      price: 899.00,
      rating: 4.6,
      reviews: 278,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop'
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('products-container');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(rating) ? 'text-orange-400 fill-orange-400' : 'text-gray-300 fill-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Top Sale</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollContainer('left')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scrollContainer('right')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div
        id="products-container"
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <div className="relative bg-white rounded-lg mb-4 overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart
                  className={`w-4 h-4 ${
                    favorites.includes(product.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            {/* Product Info */}
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
                {product.name}
              </h3>
              <div className="text-lg font-bold text-blue-600 mb-2">
                ${product.price.toFixed(2)}
              </div>
              <div className="flex items-center gap-2">
                {renderStars(product.rating)}
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
            </div>

            {/* Edit Button */}
            <button className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Product
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TopSale;