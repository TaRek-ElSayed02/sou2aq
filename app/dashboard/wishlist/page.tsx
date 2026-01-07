'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, Filter, Heart, Edit,
    Star, X, Tag, DollarSign, Package,
    ChevronDown, ChevronUp, Upload, ImageIcon, Plus, Trash2, ShoppingCart
} from 'lucide-react';

// أنواع البيانات (نفس الأنواع من صفحة المنتجات)
interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    discount?: number;
    rating: number;
    reviews: number;
    description: string;
    image: string;
    stock: number;
    sizes: string[];
    material: string;
    seoTitle: string;
    seoDescription: string;
    inWishlist: boolean;
    sku: string;
}

export default function FavouritePage() {
    // بيانات المنتجات من صفحة المنتجات الرئيسية
    const initialProducts: Product[] = [
        {
            id: 1,
            name: 'Apple Watch Series 8',
            category: 'Electronics',
            price: 399.99,
            discount: 20,
            rating: 4.7,
            reviews: 1243,
            description: 'The latest Apple Watch with advanced health monitoring features and a stunning always-on Retina display.',
            image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop',
            stock: 45,
            sizes: ['41mm', '45mm'],
            material: 'Aluminum & Ceramic',
            seoTitle: 'Apple Watch Series 8 - Premium Smartwatch',
            seoDescription: 'Buy the latest Apple Watch Series 8 with advanced features and health monitoring.',
            inWishlist: false,
            sku: 'AWS8-2024'
        },
        {
            id: 2,
            name: 'Nike Air Max 270',
            category: 'Footwear',
            price: 149.99,
            rating: 4.5,
            reviews: 856,
            description: 'Revolutionary sneakers with maximum cushioning and iconic Air Max technology for all-day comfort.',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
            stock: 120,
            sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
            material: 'Mesh & Synthetic Leather',
            seoTitle: 'Nike Air Max 270 - Premium Running Shoes',
            seoDescription: 'Experience ultimate comfort with Nike Air Max 270 running shoes.',
            inWishlist: true,
            sku: 'NAM270-2024'
        },
        {
            id: 3,
            name: 'Modern Minimalist Chair',
            category: 'Furniture',
            price: 289.99,
            discount: 15,
            rating: 4.8,
            reviews: 432,
            description: 'Elegant minimalist design with ergonomic support, perfect for modern living spaces and offices.',
            image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
            stock: 25,
            sizes: ['Standard'],
            material: 'Oak Wood & Premium Fabric',
            seoTitle: 'Modern Minimalist Chair - Contemporary Furniture',
            seoDescription: 'Stylish minimalist chair for modern interiors and workspaces.',
            inWishlist: false,
            sku: 'MMC-001'
        },
        {
            id: 4,
            name: 'MacBook Pro 16-inch',
            category: 'Electronics',
            price: 2499.99,
            rating: 4.9,
            reviews: 2105,
            description: 'Powerful laptop with M2 Pro chip, stunning Liquid Retina XDR display, and all-day battery life for professionals.',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
            stock: 18,
            sizes: ['16-inch'],
            material: 'Aluminum',
            seoTitle: 'MacBook Pro 16-inch - Professional Laptop',
            seoDescription: 'Professional-grade laptop with M2 Pro chip and stunning display.',
            inWishlist: true,
            sku: 'MBP16-M2'
        },
        {
            id: 5,
            name: 'iPhone 15 Pro Max',
            category: 'Electronics',
            price: 1199.99,
            discount: 10,
            rating: 4.8,
            reviews: 3120,
            description: 'The most advanced iPhone with titanium design, A17 Pro chip, and revolutionary camera system.',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
            stock: 75,
            sizes: ['256GB', '512GB', '1TB'],
            material: 'Titanium',
            seoTitle: 'iPhone 15 Pro Max - Premium Smartphone',
            seoDescription: 'Experience the latest iPhone 15 Pro Max with titanium design.',
            inWishlist: false,
            sku: 'IP15PM-2024'
        },
        {
            id: 6,
            name: 'Sony WH-1000XM5',
            category: 'Electronics',
            price: 399.99,
            rating: 4.9,
            reviews: 1876,
            description: 'Industry-leading noise cancellation headphones with exceptional sound quality and 30-hour battery life.',
            image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
            stock: 60,
            sizes: ['One Size'],
            material: 'Plastic & Memory Foam',
            seoTitle: 'Sony WH-1000XM5 - Noise Cancelling Headphones',
            seoDescription: 'Premium noise cancelling headphones with exceptional audio quality.',
            inWishlist: false,
            sku: 'SONY-XM5'
        },
        {
            id: 7,
            name: 'iPad Pro 12.9-inch',
            category: 'Electronics',
            price: 1099.99,
            discount: 12,
            rating: 4.7,
            reviews: 945,
            description: 'Powerful tablet with M2 chip, stunning Liquid Retina display, and Apple Pencil support for creatives.',
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
            stock: 32,
            sizes: ['128GB', '256GB', '512GB', '1TB'],
            material: 'Aluminum',
            seoTitle: 'iPad Pro 12.9-inch - Professional Tablet',
            seoDescription: 'Professional tablet with M2 chip for creative work.',
            inWishlist: true,
            sku: 'IPADPRO-129'
        },
        {
            id: 8,
            name: 'Samsung Galaxy S23 Ultra',
            category: 'Electronics',
            price: 1199.99,
            rating: 4.6,
            reviews: 1876,
            description: 'Flagship smartphone with advanced camera system, S Pen integration, and powerful Snapdragon processor.',
            image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
            stock: 55,
            sizes: ['256GB', '512GB', '1TB'],
            material: 'Glass & Aluminum',
            seoTitle: 'Samsung Galaxy S23 Ultra - Android Flagship',
            seoDescription: 'Premium Android smartphone with advanced camera features.',
            inWishlist: false,
            sku: 'SGS23U-2024'
        },
        {
            id: 9,
            name: 'Ergonomic Office Desk',
            category: 'Furniture',
            price: 459.99,
            discount: 25,
            rating: 4.4,
            reviews: 321,
            description: 'Height-adjustable standing desk with premium build quality and spacious work surface for home office.',
            image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=400&fit=crop',
            stock: 15,
            sizes: ['60x30"', '72x30"'],
            material: 'Steel & Bamboo',
            seoTitle: 'Ergonomic Office Desk - Standing Desk',
            seoDescription: 'Height-adjustable standing desk for home office setup.',
            inWishlist: false,
            sku: 'EOD-001'
        },
        {
            id: 10,
            name: 'Premium Coffee Maker',
            category: 'Appliances',
            price: 299.99,
            rating: 4.3,
            reviews: 543,
            description: 'Smart coffee maker with programmable settings, built-in grinder, and milk frother for barista-quality coffee.',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
            stock: 40,
            sizes: ['Standard'],
            material: 'Stainless Steel & Plastic',
            seoTitle: 'Premium Coffee Maker - Smart Coffee Machine',
            seoDescription: 'Smart coffee maker with built-in grinder and milk frother.',
            inWishlist: false,
            sku: 'PCM-500'
        },
        {
            id: 11,
            name: 'Wireless Gaming Mouse',
            category: 'Electronics',
            price: 89.99,
            discount: 30,
            rating: 4.6,
            reviews: 765,
            description: 'High-precision gaming mouse with ultra-fast wireless connectivity and customizable RGB lighting.',
            image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
            stock: 120,
            sizes: ['One Size'],
            material: 'Plastic & Rubber',
            seoTitle: 'Wireless Gaming Mouse - Gaming Accessory',
            seoDescription: 'High-performance wireless gaming mouse for gamers.',
            inWishlist: true,
            sku: 'WGM-2024'
        },
        {
            id: 12,
            name: 'Designer Backpack',
            category: 'Fashion',
            price: 129.99,
            rating: 4.2,
            reviews: 432,
            description: 'Water-resistant backpack with laptop compartment, multiple pockets, and ergonomic shoulder straps.',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
            stock: 85,
            sizes: ['15-inch', '17-inch'],
            material: 'Nylon & Polyester',
            seoTitle: 'Designer Backpack - Laptop Backpack',
            seoDescription: 'Stylish and functional backpack for daily use and travel.',
            inWishlist: false,
            sku: 'DBP-001'
        }
    ];

    // الحالات - نستخدم useState للتحكم في المنتجات
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [customCategories] = useState<string[]>(['Electronics', 'Footwear', 'Furniture', 'Appliances', 'Fashion']);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        show: false,
        message: '',
        type: 'success'
    });

    // استخراج التصنيفات الفريدة من المنتجات في الويشليست
    const allCategories = ['All', ...Array.from(new Set([...customCategories, ...products.filter(p => p.inWishlist).map(p => p.category)]))];

    // عرض إشعار
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({
            show: true,
            message,
            type
        });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // فلترة وترتيب المنتجات - فقط المنتجات في الويشليست
    const filteredProducts = useMemo(() => {
        return products
            .filter(product => product.inWishlist) // فقط المنتجات في الويشليست
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
                const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

                return matchesSearch && matchesCategory && matchesPrice;
            })
            .sort((a, b) => {
                const multiplier = sortOrder === 'asc' ? 1 : -1;

                switch (sortBy) {
                    case 'price':
                        return (a.price - b.price) * multiplier;
                    case 'rating':
                        return (a.rating - b.rating) * multiplier;
                    case 'name':
                    default:
                        return a.name.localeCompare(b.name) * multiplier;
                }
            });
    }, [products, searchTerm, selectedCategory, priceRange, sortBy, sortOrder]);

    // دالة حساب السعر بعد الخصم
    const calculateDiscountedPrice = (price: number, discount?: number) => {
        if (!discount || discount <= 0) return price;
        if (discount > 100) return 0;
        return price * (1 - Math.min(discount, 100) / 100);
    };

    // إضافة منتج إلى السلة
    const handleAddToCart = (productId: number, productName: string) => {
        // محاكاة إضافة المنتج إلى السلة
        showToast(`"${productName}" has been added to cart`, 'success');
        
        // هنا يمكنك إضافة منطق إضافة المنتج إلى السلة الفعلية
        console.log(`Product ${productId} added to cart`);
    };

    // إزالة منتج من المفضلة - تحديث الحالة المحلية
    const handleRemoveFromWishlist = (productId: number, productName: string) => {
        // تحديث حالة المنتج ليكون غير موجود في الويشليست
        setProducts(prevProducts => 
            prevProducts.map(product => 
                product.id === productId 
                    ? { ...product, inWishlist: false }
                    : product
            )
        );

        showToast(`"${productName}" has been removed from favorites`, 'success');
        
        // في تطبيق حقيقي، هنا ستقوم بإرسال طلب API لتحديث قاعدة البيانات
        console.log(`Product ${productId} removed from wishlist`);
        
        // محاكاة استدعاء API
        // await removeFromWishlistAPI(productId);
    };

    // إزالة جميع المنتجات من المفضلة
    const handleClearAllFavorites = () => {
        setProducts(prevProducts => 
            prevProducts.map(product => ({ ...product, inWishlist: false }))
        );
        
        showToast('All products have been removed from favorites', 'success');
    };

    // دالة عرض النجوم
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rating ? 'text-orange-400 fill-orange-400' :
                            star - 0.5 <= rating ? 'text-orange-300 fill-orange-300' : 'text-gray-300 fill-gray-300'
                            }`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
        );
    };

    // تحديث نطاق السعر تلقائياً ليشمل جميع المنتجات
    useEffect(() => {
        const wishlistProducts = products.filter(p => p.inWishlist);
        if (wishlistProducts.length > 0) {
            const minPrice = Math.min(...wishlistProducts.map(p => p.price));
            const maxPrice = Math.max(...wishlistProducts.map(p => p.price));
            
            if (maxPrice > priceRange[1]) {
                setPriceRange([priceRange[0], Math.ceil(maxPrice / 500) * 500]);
            }
        }
    }, [products]);

    // عدد المنتجات في المفضلة
    const favoriteCount = products.filter(p => p.inWishlist).length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* العنوان الرئيسي */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
                        <p className="text-gray-600">Your favorite products and wishlist items</p>
                    </div>
                    
                    {/* إحصائيات المفضلة وأزرار التحكم */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                <span className="font-bold text-gray-900">{favoriteCount}</span>
                                <span className="text-gray-600">Favorite Products</span>
                            </div>
                        </div>
                        
                        {favoriteCount > 0 && (
                            <button
                                onClick={handleClearAllFavorites}
                                className="px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-xl font-medium hover:from-red-100 hover:to-red-200 transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All Favorites
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* شريط البحث والفلترة */}
            <div className="bg-white rounded-xl p-4 md:p-6 mb-6 shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* حقل البحث */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search in your favorites..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* أزرار التحكم */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price">Sort by Price</option>
                            <option value="rating">Sort by Rating</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                        </button>
                    </div>
                </div>

                {/* الفلاتر المتقدمة */}
                {showFilters && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* فلترة التصنيف */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allCategories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategory === category
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* فلترة السعر */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                        className="w-full"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="10"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>$0</span>
                                        <span>$2500</span>
                                        <span>$5000</span>
                                    </div>
                                </div>
                            </div>

                            {/* فلترة سريعة */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('All');
                                            setPriceRange([0, 5000]);
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                    <button
                                        onClick={() => {
                                            // يمكنك إضافة منطق فلترة المنتجات المعروضة للبيع
                                            const onSaleProducts = products.filter(p => p.inWishlist && p.discount);
                                            console.log('On sale products:', onSaleProducts);
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        On Sale Only
                                    </button>
                                    <button
                                        onClick={() => {
                                            // يمكنك إضافة منطق فلترة المنتجات المتوفرة بالمخزون
                                            const inStockProducts = products.filter(p => p.inWishlist && p.stock > 0);
                                            console.log('In stock products:', inStockProducts);
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        In Stock Only
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* عرض عدد النتائج */}
            <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                    Showing <span className="font-semibold">{filteredProducts.length}</span> favorite {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                {filteredProducts.length > 0 && (
                    <div className="text-sm text-gray-500">
                        Sorted by {sortBy} ({sortOrder})
                    </div>
                )}
            </div>

            {/* شبكة المنتجات المفضلة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
                    const savings = product.price - discountedPrice;

                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col relative group"
                        >

                            {/* صورة المنتج مع شارة المفضلة */}
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                
                                {/* شارة المفضلة (ثابتة) */}
                                <div className="absolute top-3 right-3 w-9 h-9 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg z-10">
                                    <Heart className="w-5 h-5 fill-white" />
                                </div>

                                {/* شارة الخصم */}
                                {product.discount && (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                        -{product.discount}% OFF
                                    </div>
                                )}
                            </div>

                            {/* محتوى المنتج */}
                            <div className="p-5 flex-grow flex flex-col">
                                {/* التصنيف والاسم */}
                                <div className="mb-3">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {product.category}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1">
                                    {product.name}
                                </h3>

                                {/* التقييم */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        {renderStars(product.rating)}
                                        <span className="text-sm text-gray-500">({product.reviews})</span>
                                    </div>
                                </div>

                                {/* السعر مع تصميم محسّن */}
                                <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
                                    <div className="flex flex-col gap-2">
                                        {product.discount ? (
                                            <>
                                                <div className="flex items-baseline gap-3">
                                                    <div className="relative">
                                                        <span className="text-3xl font-bold text-gray-900">
                                                            ${discountedPrice.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-lg text-gray-400 line-through">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                        <span className="text-xs text-red-600 font-semibold">
                                                            {product.discount}% OFF
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-lg border border-green-100">
                                                    <Package className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium text-green-700">
                                                        Save ${savings.toFixed(2)}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-gray-500">USD</span>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-4 mt-5 rounded-lg border border-green-100">
                                                    {/* مساحة فارغة للحفاظ على التصميم */}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* التفاصيل */}
                                <p className="text-gray-600 text-sm mb-5 line-clamp-2 flex-grow">
                                    {product.description}
                                </p>

                                {/* المعلومات الإضافية */}
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Material:</span>
                                        <span className="font-semibold text-gray-700">{product.material}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500">Stock:</span>
                                        <span className={`font-semibold px-3 py-1 rounded-full ${product.stock > 20 ? 'bg-green-100 text-green-800' :
                                            product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.stock} units
                                        </span>
                                    </div>
                                </div>

                                {/* المقاسات */}
                                <div className="mb-5">
                                    <p className="text-sm text-gray-500 mb-2">Available Sizes:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <span
                                                key={size}
                                                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* أزرار الإضافة إلى السلة في أسفل الكارد */}
                                <div className="mt-auto flex gap-3">
                                    <button
                                        onClick={() => handleAddToCart(product.id, product.name)}
                                        className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                                        className="w-12 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        title="Remove from favorites"
                                    >
                                        <Heart className="w-5 h-5 fill-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* رسالة عدم وجود منتجات في المفضلة */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {favoriteCount === 0 ? 'No favorite products yet' : 'No matching products found'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {favoriteCount === 0 
                            ? 'Your favorite products will appear here when you add them' 
                            : 'Try adjusting your search or filter criteria'}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                // هنا يمكنك إضافة منطق للذهاب إلى صفحة المنتجات
                                console.log('Go to products page');
                            }}
                            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium hover:from-gray-900 hover:to-black transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Go Shopping
                        </button>
                    </div>
                </div>
            )}

            {/* إشعارات Toast */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 animate-slide-in">
                    <div className={`rounded-xl shadow-2xl border-l-4 ${toast.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' :
                        toast.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500' :
                        'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500'} p-4 min-w-80 max-w-md`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' :
                                toast.type === 'error' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'}`}>
                                {toast.type === 'success' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : toast.type === 'error' ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    {toast.type === 'success' ? 'Success!' : 
                                     toast.type === 'error' ? 'Error!' : 
                                     'Info'}
                                </p>
                                <p className="text-sm text-gray-700 mt-0.5">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* الأنماط المخصصة */}
            <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          background: linear-gradient(to right, #e5e7eb, #3b82f6);
          border-radius: 3px;
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}