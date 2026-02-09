'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, Filter, Heart, Edit,
    Star, X, Tag, DollarSign, Package,
    ChevronDown, ChevronUp, Upload, ImageIcon, Plus, ShoppingCart, Trash2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWishlist, removeProductLocally } from '@/store/slices/wishlistSlice';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

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
    quantityInStock: number;
    availableSizes: string;
    materials: string;
    seoTitle: string;
    seoDescription: string;
    inWishlist: boolean;
    sku?: string;
    url?: string;
}

export default function FavouritePage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { products: wishlistProducts, loading, error } = useAppSelector(state => state.wishlist);
    const { user } = useAppSelector(state => state.auth);
    const { t } = useLanguage();
    
    // تحويل بيانات الويشليست من API إلى صيغة Product
    const initialProducts: Product[] = wishlistProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        discount: product.discount ? (typeof product.discount === 'string' ? parseFloat(product.discount) : product.discount) : undefined,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        description: product.description,
        image: product.image || '/placeholder.jpg',
        quantityInStock: product.quantityInStock,
        availableSizes: product.availableSizes,
        materials: product.materials,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        inWishlist: true,
        sku: `${product.name}-${product.id}`,
        url: product.url,
    }));

    // جلب الويشليست عند تحميل الصفحة
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchWishlist(user.id) as any);
        } else {
            // إذا لم يكن هناك مستخدم، أعد التوجيه إلى صفحة تسجيل الدخول
            router.push('/auth/login');
        }
    }, [user?.id, dispatch, router]);

    // الحالات
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
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // تحديث products من Redux wishlist products
    useEffect(() => {
        setProducts(initialProducts);
    }, [wishlistProducts]);

    // استخراج التصنيفات الفريدة من المنتجات في الويشليست
    const allCategories = ['All', ...Array.from(new Set([...customCategories, ...products.map(p => p.category)]))];

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

    // إزالة منتج من المفضلة - استدعاء API
    const handleRemoveFromWishlist = async (productId: number, productName: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                showToast('Please login to remove items from wishlist', 'error');
                return;
            }

            const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // تحديث Redux
                dispatch(removeProductLocally(productId));
                
                // تحديث الحالة المحلية
                setProducts(prevProducts =>
                    prevProducts.filter(product => product.id !== productId)
                );

                showToast(`"${productName}" has been removed from favorites`, 'success');
            } else {
                const errorData = await response.json();
                showToast(errorData.message || 'Failed to remove from wishlist', 'error');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            showToast('An error occurred while removing from wishlist', 'error');
        }
    };

    // إزالة جميع المنتجات من المفضلة
    const handleClearAllFavorites = () => {
        setProducts([]);
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
        const wishlistProducts = products;
        if (wishlistProducts.length > 0) {
            const minPrice = Math.min(...wishlistProducts.map(p => p.price));
            const maxPrice = Math.max(...wishlistProducts.map(p => p.price));

            if (maxPrice > priceRange[1]) {
                setPriceRange([priceRange[0], Math.ceil(maxPrice / 500) * 500]);
            }
        }
    }, [products]);

    // عدد المنتجات في المفضلة
    const favoriteCount = products.length;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* العنوان الرئيسي */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.wishlist.title')}</h1>
                        <p className="text-gray-600">{t('dashboard.wishlist.description')}</p>
                    </div>

                    {/* إحصائيات المفضلة وأزرار التحكم */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="bg-gradient-to-r from-pink-50 to-rose-100 px-6 py-2.5 rounded-xl border border-pink-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className='flex justify-center items-center gap-2'>
                                    <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
                                    <div className="text-[18px] font-bold text-gray-900">{favoriteCount}</div>
                                    <div className="text-sm text-gray-600">{t('dashboard.wishlist.itemsInWishlist')}</div>
                                </div>
                            </div>
                        </div>

                        {favoriteCount > 0 && (
                            <button
                                onClick={handleClearAllFavorites}
                                className="px-6 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-xl font-semibold hover:from-red-100 hover:to-red-200 transition-all duration-300 flex items-center gap-3 shadow-sm hover:shadow-md border border-red-200"
                            >
                                <Trash2 className="w-5 h-5" />
                                {t('dashboard.wishlist.removeFromWishlist')}
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
                                placeholder={t('dashboard.wishlist.searchPlaceholder')}
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
                            {t('dashboard.wishlist.filters')}
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="name">{t('dashboard.wishlist.sortBy')} {t('dashboard.wishlist.name')}</option>
                            <option value="price">{t('dashboard.wishlist.sortBy')} {t('dashboard.wishlist.price')}</option>
                            <option value="rating">{t('dashboard.wishlist.sortBy')} {t('dashboard.wishlist.rating')}</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {sortOrder === 'asc' ? `↑ ${t('dashboard.wishlist.ascending')}` : `↓ ${t('dashboard.wishlist.descending')}`}
                        </button>
                    </div>
                </div>

                {/* الفلاتر المتقدمة */}
                {showFilters && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* فلترة التصنيف */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.wishlist.category')}</h3>
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
                                    {t('dashboard.wishlist.priceRange')}: ${priceRange[0]} - ${priceRange[1]}
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
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.wishlist.quickActions')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('All');
                                            setPriceRange([0, 5000]);
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 transition-colors"
                                    >
                                        {t('dashboard.wishlist.resetFilters')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            // فلترة المنتجات المعروضة للبيع
                                            const onSaleProducts = products.filter(p => p.inWishlist && p.discount);
                                            console.log('On sale products:', onSaleProducts);
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        {t('dashboard.wishlist.onSaleOnly')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            // فلترة المنتجات المتوفرة بالمخزون
                                            const inStockProducts = products.filter(p => p.inWishlist && p.stock > 0);
                                            console.log('In stock products:', inStockProducts);
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        {t('dashboard.wishlist.inStockOnly')}
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
                    {t('dashboard.wishlist.filters')} <span className="font-semibold">{filteredProducts.length}</span> favorite {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                {filteredProducts.length > 0 && (
                    <div className="text-sm text-gray-500">
                        {t('dashboard.wishlist.sortBy')} {sortBy} ({sortOrder})
                    </div>
                )}
            </div>

            {/* شبكة المنتجات المفضلة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
                    const savings = product.price - discountedPrice;

                    return (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full group border border-gray-200"
                        >
                            {/* صورة المنتج مع شارات */}
                            <div
                                className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <img
                                    src={`http://localhost:5000${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* شارة المفضلة (قلب مملوء) */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveFromWishlist(product.id, product.name);
                                    }}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 hover:bg-rose-50"
                                    title="Remove from wishlist"
                                >
                                    <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                                </button>

                                {/* شارة الخصم */}
                                {product.discount && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-xl">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm">-{product.discount}%</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* محتوى الكارد */}
                            <div className="p-5 flex flex-col flex-grow">
                                {/* التصنيف */}
                                <div className="mb-2">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                                        <Tag className="w-3 h-3" />
                                        {product.category}
                                    </span>
                                </div>

                                {/* اسم المنتج */}
                                <h3
                                    className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    {product.name}
                                </h3>

                                {/* التقييم */}
                                <div className="flex items-center gap-2 mb-4">
                                    {renderStars(product.rating)}
                                    <span className="text-xs text-gray-500">({product.reviews})</span>
                                </div>

                                {/* السعر والخصم */}
                                <div className="mb-5">
                                    {product.discount ? (
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${discountedPrice.toFixed(2)}
                                            </span>
                                            <span className="text-sm text-gray-400 line-through">
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    )}
                                    {product.discount && (
                                        <p className="text-xs text-green-600 font-medium">
                                            Save ${savings.toFixed(2)}
                                        </p>
                                    )}
                                </div>

                                {/* أزرار التحكم - في أسفل الكارد */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => handleAddToCart(product.id, product.name)}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        {t('dashboard.wishlist.addToCart')}
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
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-rose-50 to-pink-100 rounded-full flex items-center justify-center">
                        <Heart className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {loading ? t('dashboard.wishlist.loadingCart') : favoriteCount === 0 ? t('dashboard.wishlist.noItems') : t('dashboard.wishlist.noProductsFound')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {loading ? t('dashboard.wishlist.loadingCart') : 
                            favoriteCount === 0
                            ? t('dashboard.wishlist.browseToAdd')
                            : t('dashboard.wishlist.tryDifferentFilters')}
                    </p>
                    {!loading && (
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    // هنا يمكنك إضافة منطق للذهاب إلى صفحة المنتجات
                                    console.log('Go to products page');
                                }}
                                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {t('dashboard.cart.browseProducts')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Product Details Overlay - نفس تصميم صفحة المنتجات */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {selectedProduct.category}
                                    </span>
                                    <span className="text-sm text-gray-500">SKU: {selectedProduct.sku}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                                        <img
                                            src={`http://localhost:5000${selectedProduct.image}`}
                                            alt={selectedProduct.name}
                                            className="w-full h-96 object-cover"
                                        />
                                        {selectedProduct.discount && (
                                            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                                -{selectedProduct.discount}% OFF
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
                                        {selectedProduct.discount ? (
                                            <div className="space-y-3">
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                        ${calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount).toFixed(2)}
                                                    </span>
                                                    <span className="text-2xl text-gray-400 line-through">
                                                        ${selectedProduct.price.toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full">
                                                    <Package className="w-5 h-5" />
                                                    <span className="text-sm font-bold">
                                                        You Save ${(selectedProduct.price - calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount)).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                    ${selectedProduct.price.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            {renderStars(selectedProduct.rating)}
                                        </div>
                                        <span className="text-gray-600">
                                            {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviews} reviews)
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">{t('dashboard.cart.description')}</h3>
                                        <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-sm text-gray-500 mb-1">{t('dashboard.wishlist.material')}</div>
                                            <div className="font-semibold text-gray-900">{selectedProduct.materials}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-sm text-gray-500 mb-1">{t('dashboard.wishlist.stock')}</div>
                                            <div className={`font-semibold inline-flex px-3 py-1 rounded-full text-sm ${selectedProduct.quantityInStock > 20 ? 'bg-green-100 text-green-800' :
                                                selectedProduct.quantityInStock > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {selectedProduct.quantityInStock} units
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">{t('dashboard.cart.availableSizes')}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.availableSizes?.split(',').map((size) => (
                                                <span
                                                    key={size.trim()}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border-2 border-blue-100 hover:border-blue-300 transition-colors"
                                                >
                                                    {size.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            {t('dashboard.wishlist.seoInformation')}
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">{t('dashboard.wishlist.seoTitle')}</div>
                                                <div className="text-gray-900 font-medium">{selectedProduct.seoTitle}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">{t('dashboard.wishlist.seoDescription')}</div>
                                                <div className="text-gray-700 text-sm">{selectedProduct.seoDescription}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(selectedProduct.id, selectedProduct.name)}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        {t('dashboard.wishlist.addToCart')}
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                    {toast.type === 'success' ? t('dashboard.wishlist.success') :
                                        toast.type === 'error' ? t('dashboard.wishlist.error') :
                                            t('dashboard.wishlist.info')}
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