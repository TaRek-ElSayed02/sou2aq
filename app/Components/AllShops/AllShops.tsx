import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Star } from 'lucide-react';

const AllShops = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // بيانات المحلات
  const shops = [
    {
      id: '00001',
      name: 'Fresh Market Store',
      category: 'Grocery',
      address: '089 Kutch Green Apt. 448',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=100&h=100&fit=crop'
    },
    {
      id: '00002',
      name: 'Fashion Boutique',
      category: 'Clothing',
      address: '979 Immanuel Ferry Suite 526',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop'
    },
    {
      id: '00003',
      name: 'Tech Electronics',
      category: 'Electronics',
      address: '8587 Frida Ports',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop'
    },
    {
      id: '00004',
      name: 'Healthy Bites',
      category: 'Restaurant',
      address: '768 Destiny Lake Suite 600',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop'
    },
    {
      id: '00005',
      name: 'Book Haven',
      category: 'Books',
      address: '042 Mylene Throughway',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=100&h=100&fit=crop'
    },
    {
      id: '00006',
      name: 'Fitness Hub',
      category: 'Sports',
      address: '543 Weimann Mountain',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop'
    },
    {
      id: '00007',
      name: 'Beauty Salon',
      category: 'Beauty',
      address: 'New Scottsberg',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop'
    },
    {
      id: '00008',
      name: 'Coffee Corner',
      category: 'Restaurant',
      address: 'New Jon',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop'
    },
    {
      id: '00009',
      name: 'Kids World',
      category: 'Toys',
      address: '124 Lyla Forge Suite 975',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=100&h=100&fit=crop'
    },
    {
      id: '00010',
      name: 'Home Decor Plus',
      category: 'Furniture',
      address: '456 Design Avenue',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'
    },
    {
      id: '00011',
      name: 'Organic Farm',
      category: 'Grocery',
      address: '789 Green Valley Road',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=100&h=100&fit=crop'
    },
    {
      id: '00012',
      name: 'Smart Gadgets',
      category: 'Electronics',
      address: '321 Tech Street',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=100&h=100&fit=crop'
    }
  ];

  // التصنيفات المتاحة
  const categories = ['All', ...new Set(shops.map(shop => shop.category))];

  // فلترة وترتيب المحلات
  const filteredAndSortedShops = useMemo(() => {
    let filtered = shops;

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // التصنيف
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(shop => shop.category === selectedCategory);
    }

    // الترتيب
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || sortBy !== 'name';

  return (
    <div className="min-h-screen bg-gray-50 p-0 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Shops</h1>
          <p className="text-gray-600">Browse and search through all available shops</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, category, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Button - Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="name">Sort: A-Z</option>
                <option value="rating">Sort: Rating</option>
              </select>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="name">A-Z</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Reset Filters</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredAndSortedShops.length} of {shops.length} shops
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">SHOP NAME</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">CATEGORY</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">ADDRESS</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">RATING</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedShops.map((shop) => (
                  <tr key={shop.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600">{shop.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">{shop.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {shop.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{shop.address}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-gray-900">{shop.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedShops.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No shops found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredAndSortedShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{shop.name}</h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {shop.category}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{shop.rating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">ID</span>
                  <span className="text-sm text-gray-900">{shop.id}</span>
                </div>

                <div className="flex justify-between items-start py-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">Address</span>
                  <span className="text-sm text-gray-900 text-right max-w-[200px]">{shop.address}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredAndSortedShops.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500">No shops found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllShops;