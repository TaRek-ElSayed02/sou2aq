'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Filter, Loader, Heart } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { t } = useLanguage();
  const { user } = useAppSelector((state) => state.auth);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products for logged-in user
  useEffect(() => {
    if (!user?.id) {
      console.log('⏳ Waiting for user...');
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(`📦 Fetching products for userId: ${user.id}`);
        // جلب منتجات هذا الـ user
        const response = await fetch(`http://localhost:5000/api/products/user/${user.id}`);
        const data = await response.json();
        
        console.log(`📋 Products response:`, data);
        if (data.success && data.data) {
          console.log(`✅ Found ${data.data.length} products`);
          setProducts(data.data);
        } else {
          console.error('❌ Failed to load products:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?.id]);

  // Get unique categories from products
  const getCategoriesFromProducts = () => {
    const categories = [{ id: 'all', name: t('dashboard.products.allCategories') || 'All Categories' }];
    
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(p => p.category || 'uncategorized'))];
      uniqueCategories.forEach(category => {
        categories.push({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1)
        });
      });
    }
    
    return categories;
  };

  const categories = getCategoriesFromProducts();

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t('dashboard.products.title')}</h1>
          <p className="text-xl text-gray-600">{t('dashboard.products.browseCollection')}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter size={20} /> {t('dashboard.products.categories')}
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">{t('dashboard.products.sortBy')}</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="newest">{t('dashboard.products.newest')}</option>
                <option value="price-low">{t('dashboard.products.priceLowToHigh')}</option>
                <option value="price-high">{t('dashboard.products.priceHighToLow')}</option>
                <option value="rating">{t('dashboard.products.highestRated')}</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <Loader size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <p className="text-gray-600 text-lg">No products found</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map(product => (
                  <div key={product._id || product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
                    <div className="relative overflow-hidden h-48 bg-gray-100">
                      <img
                        src={product.image ? `http://localhost:5000${product.image}` : product.imageUrl || 'https://via.placeholder.com/500x500?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition duration-300"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Heart size={18} className="text-red-600" />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < (product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                        {product.rating && <span className="text-sm text-gray-600 ml-1">({product.rating})</span>}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">${product.price || 0}</span>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition">
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
