'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, Filter, Edit,
    Star, X, Tag, DollarSign, Package,
    ChevronDown, ChevronUp, Upload, ImageIcon, Plus, Trash2,
    Folder, Link, FileText, Percent
} from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import { useProducts } from '../../hooks/useProducts';
import { useLanguage } from '../../context/LanguageContext';

// تعريف أنواع البيانات
interface EditModalData {
    id?: number;
    name: string;
    url?: string;
    category: string;
    price: number;
    discount?: number;
    description: string;
    image?: string;
    imgAlt?: string;
    quantityInStock: number;
    availableSizes: string;
    materials: string;
    seoTitle: string;
    seoDescription: string;
}

const ProductsPage = () => {
    const { t } = useLanguage();
    const { currentUser, isAdmin } = useUser();
    const {
        userProducts,
        loading,
        error,
        fetchSuccess,
        createSuccess,
        updateSuccess,
        deleteSuccess,
        fetchProductsByUserId,
        createProduct,
        updateProduct,
        deleteProduct,
        clearAllSuccess,
        clearError
    } = useProducts();

    // الحالات المحلية
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [showFilters, setShowFilters] = useState(false);
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        data: EditModalData | null;
        mode: 'add' | 'edit';
    }>({
        isOpen: false,
        data: null,
        mode: 'edit'
    });
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [customCategories, setCustomCategories] = useState<string[]>(['Electronics', 'Footwear', 'Furniture', 'Appliances', 'Fashion']);
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        productId: number | null;
        productName: string;
    }>({
        isOpen: false,
        productId: null,
        productName: ''
    });
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        show: false,
        message: '',
        type: 'success'
    });
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // جلب المنتجات عند تحميل الصفحة أو عند تغيير المستخدم
    useEffect(() => {
        if (currentUser?.id) {
            fetchProductsByUserId(currentUser.id);
        }
    }, [currentUser?.id]);

    // إعادة جلب المنتجات عند العودة للصفحة من صفحة أخرى
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && currentUser?.id) {
                fetchProductsByUserId(currentUser.id);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // عرض إشعارات Redux
    useEffect(() => {
        if (createSuccess) {
            showToast('Product added successfully!', 'success');
            clearAllSuccess();
        }
        if (updateSuccess) {
            showToast('Product updated successfully!', 'success');
            clearAllSuccess();
        }
        if (deleteSuccess) {
            showToast('Product deleted successfully!', 'success');
            clearAllSuccess();
        }
        if (error) {
            showToast(error, 'error');
            clearError();
        }
    }, [createSuccess, updateSuccess, deleteSuccess, error]);

    // توليد slug من الاسم
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .substring(0, 50);
    };

    // تحديث slug عند تغيير الاسم
    useEffect(() => {
        if (editModal.data && editModal.data.name && editModal.mode === 'add') {
            const newSlug = generateSlug(editModal.data.name);
            setEditModal(prev => ({
                ...prev,
                data: { ...prev.data!, url: newSlug }
            }));
        }
    }, [editModal.data?.name]);

    // استخراج التصنيفات الفريدة من المنتجات
    const allCategories = useMemo(() => {
        const categories = ['All'];
        const uniqueCategories = new Set([
            ...customCategories,
            ...userProducts.map(p => p.category)
        ]);
        categories.push(...Array.from(uniqueCategories));
        return categories;
    }, [userProducts, customCategories]);

    // البيانات الافتراضية للمنتج الجديد
    const defaultNewProduct: EditModalData = {
        name: '',
        category: '',
        price: 0,
        description: '',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
        quantityInStock: 0,
        availableSizes: '',
        materials: '',
        seoTitle: '',
        seoDescription: '',
    };

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

    // فتح مودال إضافة منتج جديد
    const openAddModal = () => {
        setUploadedImage(null);
        setEditModal({
            isOpen: true,
            data: defaultNewProduct,
            mode: 'add'
        });
    };

    // فتح مودال تعديل منتج
    const openEditModal = (product: any) => {
        const url = generateSlug(product.name);

        setUploadedImage(null);

        setEditModal({
            isOpen: true,
            data: {
                id: product.id,
                name: product.name,
                url: product.url || url,
                category: product.category,
                price: product.price,
                discount: product.discount,
                description: product.description,
                image: product.image,
                imgAlt: product.imgAlt,
                quantityInStock: product.quantityInStock,
                availableSizes: product.availableSizes,
                materials: product.materials,
                seoTitle: product.seoTitle,
                seoDescription: product.seoDescription,
            },
            mode: 'edit'
        });
    };

    // فتح مودال حذف منتج
    const openDeleteModal = (productId: number, productName: string) => {
        setDeleteModal({
            isOpen: true,
            productId,
            productName
        });
    };

    // حذف المنتج
    const handleDeleteProduct = () => {
        if (!deleteModal.productId) return;

        deleteProduct(deleteModal.productId.toString());

        setDeleteModal({
            isOpen: false,
            productId: null,
            productName: ''
        });
    };

    // معالجة رفع الصورة
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file (JPEG, PNG, GIF, etc.)', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Image size should be less than 5MB', 'error');
            return;
        }

        setUploadedImage(file);
        setIsUploading(false);
    };

    // حفظ المنتج (إضافة/تحديث)
    const handleSaveEdit = () => {
        if (!editModal.data) return;

        const { id, ...productData } = editModal.data;

        // التحقق من البيانات المطلوبة
        if (!productData.name.trim()) {
            showToast('Product name is required', 'error');
            return;
        }

        if (!productData.category.trim()) {
            showToast('Category is required', 'error');
            return;
        }

        if (productData.price < 0) {
            showToast('Price cannot be negative', 'error');
            return;
        }

        if (productData.quantityInStock < 0) {
            showToast('Stock quantity cannot be negative', 'error');
            return;
        }

        if (productData.discount && productData.discount > 100) {
            showToast('Discount cannot exceed 100%', 'error');
            return;
        }

        // تحديث أو إضافة
        if (editModal.mode === 'edit' && id) {
            updateProduct(id.toString(), productData, uploadedImage || undefined);
        } else {
            createProduct(productData, uploadedImage || undefined);
        }

        setUploadedImage(null);
        setEditModal({ isOpen: false, data: null, mode: 'edit' });
    };

    // دالة حساب السعر بعد الخصم
    const calculateDiscountedPrice = (price: number | string, discount?: number | string) => {
        // تحويل القيم إلى أرقام للتأكد من النوع الصحيح
        const numPrice = typeof price === 'string' ? parseFloat(price) || 0 : (price || 0);
        const numDiscount = typeof discount === 'string' ? parseFloat(discount) || 0 : (discount || 0);
        
        if (!numDiscount || numDiscount <= 0) return numPrice;
        if (numDiscount > 100) return 0;
        return numPrice * (1 - Math.min(numDiscount, 100) / 100);
    };

    // فلترة وترتيب المنتجات
    const filteredProducts = useMemo(() => {
        return userProducts
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
                        const ratingA = a.rating || 0;
                        const ratingB = b.rating || 0;
                        return (ratingA - ratingB) * multiplier;
                    case 'name':
                    default:
                        return a.name.localeCompare(b.name) * multiplier;
                }
            });
    }, [userProducts, searchTerm, selectedCategory, priceRange, sortBy, sortOrder]);

    // دالة عرض النجوم
    const renderStars = (rating?: number) => {
        const actualRating = rating || 0;
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= actualRating ? 'text-orange-400 fill-orange-400' :
                            star - 0.5 <= actualRating ? 'text-orange-300 fill-orange-300' : 'text-gray-300 fill-gray-300'
                            }`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">{actualRating.toFixed(1)}</span>
            </div>
        );
    };

    // تحديث نطاق السعر تلقائياً
    useEffect(() => {
        if (userProducts.length > 0) {
            const minPrice = Math.min(...userProducts.map(p => p.price));
            const maxPrice = Math.max(...userProducts.map(p => p.price));

            if (maxPrice > priceRange[1]) {
                setPriceRange([priceRange[0], Math.ceil(maxPrice / 500) * 500]);
            }
        }
    }, [userProducts]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-700 font-medium">{t('dashboard.products.loading')}</p>
                    </div>
                </div>
            )}

            {/* العنوان الرئيسي */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.products.management')}</h1>
                        <p className="text-gray-600">{t('dashboard.products.manageInventory')}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <span>{t('dashboard.products.user')}: {currentUser?.fullName}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('dashboard.products.totalProducts')}: {userProducts.length}</span>
                        </div>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            {t('dashboard.products.addNewProduct')}
                        </button>
                    )}
                </div>
            </div>

            {/* شريط البحث والفلترة */}
            <div className="bg-white rounded-xl p-4 md:p-6 mb-6 shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={t('dashboard.products.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            {t('dashboard.products.filters')}
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="name">{t('dashboard.products.sortByName')}</option>
                            <option value="price">{t('dashboard.products.sortByPrice')}</option>
                            <option value="rating">{t('dashboard.products.sortByRating')}</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {sortOrder === 'asc' ? '↑ ' + t('dashboard.products.ascending') : '↓ ' + t('dashboard.products.descending')}
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.products.category')}</h3>
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

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    {t('dashboard.products.priceRange')}: ${priceRange[0]} - ${priceRange[1]}
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

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.products.quickFilters')}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedCategory('All')}
                                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        {t('dashboard.products.allProducts')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('All');
                                            setPriceRange([0, 5000]);
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 transition-colors"
                                    >
                                        {t('dashboard.products.resetFilters')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                    {t('dashboard.products.showing')} <span className="font-semibold">{filteredProducts.length}</span> {t('dashboard.products.products')}
                </p>
                <div className="text-sm text-gray-500">
                    {t('dashboard.products.sortedBy')} {sortBy} ({sortOrder})
                </div>
            </div>

            {/* شبكة المنتجات */}
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
                                    src={`http://localhost:5000${product.image}` || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'}
                                    alt={product.imgAlt || product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

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
                                    <span className="text-xs text-gray-500">({product.reviews || 0} reviews)</span>
                                </div>

                                {/* السعر والخصم */}
                                <div className="mb-5">
                                    {product.discount ? (
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${discountedPrice}
                                            </span>
                                            <span className="text-sm text-gray-400 line-through">
                                                ${product.price}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${product.price}
                                        </div>
                                    )}
                                    {product.discount && (
                                        <p className="text-xs text-green-600 font-medium">
                                            Save ${savings.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                                
                                {/* المخزون */}
                                <div className="mb-4">
                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${product.quantityInStock > 20 
                                        ? 'bg-green-100 text-green-800' 
                                        : product.quantityInStock > 5 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : 'bg-red-100 text-red-800'}`}>
                                        <Package className="w-3 h-3" />
                                        {product.quantityInStock} in stock
                                    </div>
                                </div>
                                
                                {/* أزرار التحكم */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                            {t('dashboard.products.edit')}
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => openDeleteModal(product.id, product.name)}
                                                className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                                                title={t('dashboard.products.delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.products.noProducts')}</h3>
                    <p className="text-gray-600 mb-6">{t('dashboard.products.tryAdjusting')}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                                setPriceRange([0, 5000]);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            {t('dashboard.products.clearAllFilters')}
                        </button>
                        {isAdmin && (
                            <button
                                onClick={openAddModal}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                {t('dashboard.products.addNewProduct')}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Product Details Overlay */}
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
                                    <span className="text-sm text-gray-500">SKU: {selectedProduct.id}</span>
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
                                            src={selectedProduct.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'}
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
                                                        ${selectedProduct.price}
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
                                                    ${selectedProduct.price}
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
                                            {(selectedProduct.rating || 0).toFixed(1)} ({selectedProduct.reviews || 0} reviews)
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                                        <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-sm text-gray-500 mb-1">Material</div>
                                            <div className="font-semibold text-gray-900">{selectedProduct.materials}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="text-sm text-gray-500 mb-1">Stock</div>
                                            <div className={`font-semibold inline-flex px-3 py-1 rounded-full text-sm ${selectedProduct.quantityInStock > 20 ? 'bg-green-100 text-green-800' :
                                                selectedProduct.quantityInStock > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {selectedProduct.quantityInStock} units
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Available Sizes</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.availableSizes?.split(',')?.map((size: string) => (
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
                                            SEO Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">SEO Title</div>
                                                <div className="text-gray-900 font-medium">{selectedProduct.seoTitle}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1">SEO Description</div>
                                                <div className="text-gray-700 text-sm">{selectedProduct.seoDescription}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(null);
                                                    openEditModal(selectedProduct);
                                                }}
                                                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                            >
                                                <Edit className="w-5 h-5" />
                                                Edit Product
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(null);
                                                    openDeleteModal(selectedProduct.id, selectedProduct.name);
                                                }}
                                                className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal - 75% width, black background, scrollable */}
            {editModal.isOpen && editModal.data && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-[75vw] h-[85vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {editModal.mode === 'add' ? (
                                        <Plus className="w-5 h-5 text-blue-600" />
                                    ) : (
                                        <Edit className="w-5 h-5 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {editModal.mode === 'add' ? 'Create New Product' : 'Edit Product'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Fill in all required fields (*)
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    setUploadedImage(null);
                                    setEditModal({ isOpen: false, data: null, mode: 'edit' });
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        
                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        {/* Product Name */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-blue-600" />
                                                Product Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.name || ''} 
                                                onChange={(e) => {
                                                    const newName = e.target.value;
                                                    setEditModal(prev => ({ 
                                                        ...prev, 
                                                        data: { 
                                                            ...prev.data!, 
                                                            name: newName,
                                                            url: prev.mode === 'add' ? generateSlug(newName) : prev.data!.url
                                                        } 
                                                    }));
                                                }}
                                                placeholder="Enter product name"
                                                required
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <Folder className="w-4 h-4 text-blue-600" />
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <div className="space-y-2">
                                                <select 
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white appearance-none"
                                                    value={editModal.data?.category || ''} 
                                                    onChange={(e) => setEditModal(prev => ({ 
                                                        ...prev, 
                                                        data: { ...prev.data!, category: e.target.value } 
                                                    }))}
                                                    required
                                                >
                                                    <option value="">Select category</option>
                                                    {allCategories.filter(cat => cat !== 'All').map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Or press Enter to create new..."
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                                            const newCategory = e.currentTarget.value.trim();
                                                            if (!customCategories.includes(newCategory)) {
                                                                setCustomCategories([...customCategories, newCategory]);
                                                            }
                                                            setEditModal(prev => ({
                                                                ...prev,
                                                                data: { ...prev.data!, category: newCategory }
                                                            }));
                                                            e.currentTarget.value = '';
                                                        }
                                                    }}
                                                    className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-blue-600" />
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="number"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.price || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, price: parseFloat(e.target.value) || 0 } 
                                                }))}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        {/* Discount */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <Percent className="w-4 h-4 text-blue-600" />
                                                Discount (%)
                                            </label>
                                            <input 
                                                type="number"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.discount || ''} 
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const discountValue = value ? Math.min(parseFloat(value), 100) : undefined;
                                                    setEditModal(prev => ({
                                                        ...prev,
                                                        data: { ...prev.data!, discount: discountValue }
                                                    }));
                                                }}
                                                placeholder="0"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                            />
                                            {editModal.data?.discount && editModal.data?.price > 0 && (
                                                <p className="mt-2 text-sm text-green-600 font-medium">
                                                    Final Price: ${calculateDiscountedPrice(editModal.data.price, editModal.data.discount).toFixed(2)}
                                                </p>
                                            )}
                                        </div>

                                        {/* Stock */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <Package className="w-4 h-4 text-blue-600" />
                                                Stock <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="number"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.quantityInStock || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, quantityInStock: parseInt(e.target.value) || 0 } 
                                                }))}
                                                placeholder="0"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        {/* URL Slug */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <Link className="w-4 h-4 text-blue-600" />
                                                URL Slug
                                            </label>
                                            <input
                                                type="text"
                                                value={editModal.data?.url || ''}
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, url: e.target.value } 
                                                }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white font-mono text-sm"
                                                placeholder="product-url-slug"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">/products/{editModal.data?.url}</p>
                                        </div>

                                        {/* Materials */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Materials
                                            </label>
                                            <input 
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.materials || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, materials: e.target.value } 
                                                }))}
                                                placeholder="e.g., Cotton, Leather, Wood"
                                            />
                                        </div>

                                        {/* Available Sizes */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Available Sizes
                                            </label>
                                            <input 
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.availableSizes || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, availableSizes: e.target.value } 
                                                }))}
                                                placeholder="S, M, L, XL (comma-separated)"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea 
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white resize-none"
                                                value={editModal.data?.description || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, description: e.target.value } 
                                                }))}
                                                placeholder="Detailed product description"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        {/* Image Upload */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-blue-600" />
                                                Product Image
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    <div className="flex flex-col items-center">
                                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                        <p className="text-sm text-gray-600 mb-1">Click to upload</p>
                                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                    </div>
                                                </label>
                                            </div>
                                            
                                            {editModal.data?.image && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                                                    <div className="relative">
                                                        <img 
                                                            src={typeof editModal.data?.image === 'string' && editModal.data.image.startsWith('data:') ? 
                                                                editModal.data.image : 
                                                                typeof editModal.data?.image === 'string' ? 
                                                                  editModal.data.image : 
                                                                  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'
                                                            } 
                                                            alt="preview" 
                                                            className="w-full h-40 object-cover rounded-lg border"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop';
                                                            }}
                                                        />
                                                        <button
                                                            onClick={() => setEditModal(prev => ({ 
                                                                ...prev, 
                                                                data: { ...prev.data!, image: '' } 
                                                            }))}
                                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Image Alt Text */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Image Alt Text
                                            </label>
                                            <input 
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.imgAlt || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, imgAlt: e.target.value } 
                                                }))}
                                                placeholder="Description for accessibility"
                                            />
                                        </div>

                                        {/* SEO Title */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                SEO Title
                                            </label>
                                            <input 
                                                type="text"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                                                value={editModal.data?.seoTitle || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, seoTitle: e.target.value } 
                                                }))}
                                                placeholder="SEO title for search engines"
                                                maxLength={60}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {editModal.data?.seoTitle.length || 0}/60
                                            </p>
                                        </div>

                                        {/* SEO Description */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-600" />
                                                SEO Description
                                            </label>
                                            <textarea 
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white resize-none"
                                                value={editModal.data?.seoDescription || ''} 
                                                onChange={(e) => setEditModal(prev => ({ 
                                                    ...prev, 
                                                    data: { ...prev.data!, seoDescription: e.target.value } 
                                                }))}
                                                placeholder="SEO description for search engines"
                                                maxLength={160}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {editModal.data?.seoDescription.length || 0}/160
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Fields marked with <span className="text-red-500">*</span> are required
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => {
                                                    setUploadedImage(null);
                                                    setEditModal({ isOpen: false, data: null, mode: 'edit' });
                                                }}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={handleSaveEdit}
                                                disabled={!editModal.data?.name || !editModal.data?.price}
                                                className={`px-6 py-3 rounded-lg transition-all font-medium ${
                                                    !editModal.data?.name || !editModal.data?.price
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                                                }`}
                                            >
                                                {editModal.mode === 'add' ? 'Add Product' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-semibold">{deleteModal.productName}</span>? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
                                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
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

            {/* Custom Styles */}
            <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
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
};

export default ProductsPage;