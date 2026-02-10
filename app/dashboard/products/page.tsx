// 'use client';
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//     Search, Filter, Edit,
//     Star, X, Tag, DollarSign, Package,
//     ChevronDown, ChevronUp, Upload, ImageIcon, Plus, Trash2
// } from 'lucide-react';

// // أنواع البيانات
// interface Product {
//     id: number;
//     name: string;
//     category: string;
//     price: number;
//     discount?: number;
//     rating: number;
//     reviews: number;
//     description: string;
//     image: string;
//     stock: number;
//     sizes: string[];
//     material: string;
//     seoTitle: string;
//     seoDescription: string;
//     sku: string;
// }

// interface EditModalData {
//     id?: number;
//     name: string;
//     category: string;
//     price: number;
//     discount?: number;
//     description: string;
//     imageUrl: string;
//     stock: number;
//     sizes: string[];
//     material: string;
//     seoTitle: string;
//     seoDescription: string;
//     slug: string;
// }

// const ProductsPage = () => {
//     // البيانات الأولية للمنتجات
//     const initialProducts: Product[] = [
//         {
//             id: 1,
//             name: 'Apple Watch Series 8',
//             category: 'Electronics',
//             price: 399.99,
//             discount: 20,
//             rating: 4.7,
//             reviews: 1243,
//             description: 'The latest Apple Watch with advanced health monitoring features and a stunning always-on Retina display.',
//             image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop',
//             stock: 45,
//             sizes: ['41mm', '45mm'],
//             material: 'Aluminum & Ceramic',
//             seoTitle: 'Apple Watch Series 8 - Premium Smartwatch',
//             seoDescription: 'Buy the latest Apple Watch Series 8 with advanced features and health monitoring.',
//             sku: 'AWS8-2024'
//         },
//         {
//             id: 2,
//             name: 'Nike Air Max 270',
//             category: 'Footwear',
//             price: 149.99,
//             rating: 4.5,
//             reviews: 856,
//             description: 'Revolutionary sneakers with maximum cushioning and iconic Air Max technology for all-day comfort.',
//             image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
//             stock: 120,
//             sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
//             material: 'Mesh & Synthetic Leather',
//             seoTitle: 'Nike Air Max 270 - Premium Running Shoes',
//             seoDescription: 'Experience ultimate comfort with Nike Air Max 270 running shoes.',
//             sku: 'NAM270-2024'
//         },
//         {
//             id: 3,
//             name: 'Modern Minimalist Chair',
//             category: 'Furniture',
//             price: 289.99,
//             discount: 15,
//             rating: 4.8,
//             reviews: 432,
//             description: 'Elegant minimalist design with ergonomic support, perfect for modern living spaces and offices.',
//             image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
//             stock: 25,
//             sizes: ['Standard'],
//             material: 'Oak Wood & Premium Fabric',
//             seoTitle: 'Modern Minimalist Chair - Contemporary Furniture',
//             seoDescription: 'Stylish minimalist chair for modern interiors and workspaces.',
//             sku: 'MMC-001'
//         },
//         {
//             id: 4,
//             name: 'MacBook Pro 16-inch',
//             category: 'Electronics',
//             price: 2499.99,
//             rating: 4.9,
//             reviews: 2105,
//             description: 'Powerful laptop with M2 Pro chip, stunning Liquid Retina XDR display, and all-day battery life for professionals.',
//             image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
//             stock: 18,
//             sizes: ['16-inch'],
//             material: 'Aluminum',
//             seoTitle: 'MacBook Pro 16-inch - Professional Laptop',
//             seoDescription: 'Professional-grade laptop with M2 Pro chip and stunning display.',
//             sku: 'MBP16-M2'
//         },
//         {
//             id: 5,
//             name: 'iPhone 15 Pro Max',
//             category: 'Electronics',
//             price: 1199.99,
//             discount: 10,
//             rating: 4.8,
//             reviews: 3120,
//             description: 'The most advanced iPhone with titanium design, A17 Pro chip, and revolutionary camera system.',
//             image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
//             stock: 75,
//             sizes: ['256GB', '512GB', '1TB'],
//             material: 'Titanium',
//             seoTitle: 'iPhone 15 Pro Max - Premium Smartphone',
//             seoDescription: 'Experience the latest iPhone 15 Pro Max with titanium design.',
//             sku: 'IP15PM-2024'
//         },
//         {
//             id: 6,
//             name: 'Sony WH-1000XM5',
//             category: 'Electronics',
//             price: 399.99,
//             rating: 4.9,
//             reviews: 1876,
//             description: 'Industry-leading noise cancellation headphones with exceptional sound quality and 30-hour battery life.',
//             image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop',
//             stock: 60,
//             sizes: ['One Size'],
//             material: 'Plastic & Memory Foam',
//             seoTitle: 'Sony WH-1000XM5 - Noise Cancelling Headphones',
//             seoDescription: 'Premium noise cancelling headphones with exceptional audio quality.',
//             sku: 'SONY-XM5'
//         },
//         {
//             id: 7,
//             name: 'iPad Pro 12.9-inch',
//             category: 'Electronics',
//             price: 1099.99,
//             discount: 12,
//             rating: 4.7,
//             reviews: 945,
//             description: 'Powerful tablet with M2 chip, stunning Liquid Retina display, and Apple Pencil support for creatives.',
//             image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
//             stock: 32,
//             sizes: ['128GB', '256GB', '512GB', '1TB'],
//             material: 'Aluminum',
//             seoTitle: 'iPad Pro 12.9-inch - Professional Tablet',
//             seoDescription: 'Professional tablet with M2 chip for creative work.',
//             sku: 'IPADPRO-129'
//         },
//         {
//             id: 8,
//             name: 'Samsung Galaxy S23 Ultra',
//             category: 'Electronics',
//             price: 1199.99,
//             rating: 4.6,
//             reviews: 1876,
//             description: 'Flagship smartphone with advanced camera system, S Pen integration, and powerful Snapdragon processor.',
//             image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
//             stock: 55,
//             sizes: ['256GB', '512GB', '1TB'],
//             material: 'Glass & Aluminum',
//             seoTitle: 'Samsung Galaxy S23 Ultra - Android Flagship',
//             seoDescription: 'Premium Android smartphone with advanced camera features.',
//             sku: 'SGS23U-2024'
//         },
//         {
//             id: 9,
//             name: 'Ergonomic Office Desk',
//             category: 'Furniture',
//             price: 459.99,
//             discount: 25,
//             rating: 4.4,
//             reviews: 321,
//             description: 'Height-adjustable standing desk with premium build quality and spacious work surface for home office.',
//             image: 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=400&fit=crop',
//             stock: 15,
//             sizes: ['60x30"', '72x30"'],
//             material: 'Steel & Bamboo',
//             seoTitle: 'Ergonomic Office Desk - Standing Desk',
//             seoDescription: 'Height-adjustable standing desk for home office setup.',
//             sku: 'EOD-001'
//         },
//         {
//             id: 10,
//             name: 'Premium Coffee Maker',
//             category: 'Appliances',
//             price: 299.99,
//             rating: 4.3,
//             reviews: 543,
//             description: 'Smart coffee maker with programmable settings, built-in grinder, and milk frother for barista-quality coffee.',
//             image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
//             stock: 40,
//             sizes: ['Standard'],
//             material: 'Stainless Steel & Plastic',
//             seoTitle: 'Premium Coffee Maker - Smart Coffee Machine',
//             seoDescription: 'Smart coffee maker with built-in grinder and milk frother.',
//             sku: 'PCM-500'
//         },
//         {
//             id: 11,
//             name: 'Wireless Gaming Mouse',
//             category: 'Electronics',
//             price: 89.99,
//             discount: 30,
//             rating: 4.6,
//             reviews: 765,
//             description: 'High-precision gaming mouse with ultra-fast wireless connectivity and customizable RGB lighting.',
//             image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
//             stock: 120,
//             sizes: ['One Size'],
//             material: 'Plastic & Rubber',
//             seoTitle: 'Wireless Gaming Mouse - Gaming Accessory',
//             seoDescription: 'High-performance wireless gaming mouse for gamers.',
//             sku: 'WGM-2024'
//         },
//         {
//             id: 12,
//             name: 'Designer Backpack',
//             category: 'Fashion',
//             price: 129.99,
//             rating: 4.2,
//             reviews: 432,
//             description: 'Water-resistant backpack with laptop compartment, multiple pockets, and ergonomic shoulder straps.',
//             image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
//             stock: 85,
//             sizes: ['15-inch', '17-inch'],
//             material: 'Nylon & Polyester',
//             seoTitle: 'Designer Backpack - Laptop Backpack',
//             seoDescription: 'Stylish and functional backpack for daily use and travel.',
//             sku: 'DBP-001'
//         }
//     ];

//     // الحالات
//     const [products, setProducts] = useState<Product[]>(initialProducts);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState<string>('All');
//     const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
//     const [showFilters, setShowFilters] = useState(false);
//     const [editModal, setEditModal] = useState<{
//         isOpen: boolean;
//         data: EditModalData | null;
//         mode: 'add' | 'edit';
//     }>({
//         isOpen: false,
//         data: null,
//         mode: 'edit'
//     });
//     const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
//     const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//     const [customCategories, setCustomCategories] = useState<string[]>(['Electronics', 'Footwear', 'Furniture', 'Appliances', 'Fashion']);
//     const [uploadedImage, setUploadedImage] = useState<string | null>(null);
//     const [isUploading, setIsUploading] = useState(false);
//     const [deleteModal, setDeleteModal] = useState<{
//         isOpen: boolean;
//         productId: number | null;
//         productName: string;
//     }>({
//         isOpen: false,
//         productId: null,
//         productName: ''
//     });
//     const [toast, setToast] = useState<{
//         show: boolean;
//         message: string;
//         type: 'success' | 'error' | 'info';
//     }>({
//         show: false,
//         message: '',
//         type: 'success'
//     });
//     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//     // استخراج التصنيفات الفريدة
//     const allCategories = ['All', ...Array.from(new Set([...customCategories, ...products.map(p => p.category)]))];

//     // توليد ID جديد للمنتج
//     const generateNewId = () => {
//         return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
//     };

//     // البيانات الافتراضية للمنتج الجديد
//     const defaultNewProduct: EditModalData = {
//         name: '',
//         category: '',
//         price: 0,
//         discount: undefined,
//         description: '',
//         imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
//         stock: 0,
//         sizes: [],
//         material: '',
//         seoTitle: '',
//         seoDescription: '',
//         slug: ''
//     };

//     // عرض إشعار
//     const showToast = (message: string, type: 'success' | 'error' | 'info') => {
//         setToast({
//             show: true,
//             message,
//             type
//         });
//         setTimeout(() => {
//             setToast(prev => ({ ...prev, show: false }));
//         }, 3000);
//     };

//     // فتح مودال إضافة منتج جديد
//     const openAddModal = () => {
//         setUploadedImage(null);
//         setEditModal({
//             isOpen: true,
//             data: defaultNewProduct,
//             mode: 'add'
//         });
//     };

//     // فتح مودال حذف منتج
//     const openDeleteModal = (productId: number, productName: string) => {
//         setDeleteModal({
//             isOpen: true,
//             productId,
//             productName
//         });
//     };

//     // حذف المنتج
//     const handleDeleteProduct = () => {
//         if (!deleteModal.productId) return;

//         const productToDelete = products.find(p => p.id === deleteModal.productId);
//         if (!productToDelete) return;

//         setProducts(products.filter(product => product.id !== deleteModal.productId));

//         setDeleteModal({
//             isOpen: false,
//             productId: null,
//             productName: ''
//         });

//         showToast(`تم حذف المنتج "${productToDelete.name}" بنجاح`, 'success');
//     };

//     // فلترة وترتيب المنتجات
//     const filteredProducts = useMemo(() => {
//         return products
//             .filter(product => {
//                 const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     product.description.toLowerCase().includes(searchTerm.toLowerCase());
//                 const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
//                 const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

//                 return matchesSearch && matchesCategory && matchesPrice;
//             })
//             .sort((a, b) => {
//                 const multiplier = sortOrder === 'asc' ? 1 : -1;

//                 switch (sortBy) {
//                     case 'price':
//                         return (a.price - b.price) * multiplier;
//                     case 'rating':
//                         return (a.rating - b.rating) * multiplier;
//                     case 'name':
//                     default:
//                         return a.name.localeCompare(b.name) * multiplier;
//                 }
//             });
//     }, [products, searchTerm, selectedCategory, priceRange, sortBy, sortOrder]);

//     // توليد slug من الاسم
//     const generateSlug = (name: string) => {
//         return name
//             .toLowerCase()
//             .replace(/\s+/g, '-')
//             .replace(/[^a-z0-9-]/g, '')
//             .substring(0, 50);
//     };

//     // تحديث slug عند تغيير الاسم
//     useEffect(() => {
//         if (editModal.data && editModal.data.name && editModal.mode === 'add') {
//             const newSlug = generateSlug(editModal.data.name);
//             setEditModal(prev => ({
//                 ...prev,
//                 data: { ...prev.data!, slug: newSlug }
//             }));
//         }
//     }, [editModal.data?.name]);

//     // دالة حساب السعر بعد الخصم
//     const calculateDiscountedPrice = (price: number, discount?: number) => {
//         if (!discount || discount <= 0) return price;
//         if (discount > 100) return 0;
//         return price * (1 - Math.min(discount, 100) / 100);
//     };

//     // فتح مودال التعديل
//     const openEditModal = (product: Product) => {
//         const slug = generateSlug(product.name);

//         setUploadedImage(null);

//         setEditModal({
//             isOpen: true,
//             data: {
//                 id: product.id,
//                 name: product.name,
//                 category: product.category,
//                 price: product.price,
//                 discount: product.discount,
//                 description: product.description,
//                 imageUrl: product.image,
//                 stock: product.stock,
//                 sizes: product.sizes,
//                 material: product.material,
//                 seoTitle: product.seoTitle,
//                 seoDescription: product.seoDescription,
//                 slug: slug
//             },
//             mode: 'edit'
//         });
//     };

//     // محاكاة رفع صورة
//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (!file) return;

//         if (!file.type.startsWith('image/')) {
//             alert('Please upload an image file (JPEG, PNG, GIF, etc.)');
//             return;
//         }

//         if (file.size > 5 * 1024 * 1024) {
//             alert('Image size should be less than 5MB');
//             return;
//         }

//         setIsUploading(true);

//         setTimeout(() => {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const base64String = reader.result as string;
//                 setUploadedImage(base64String);

//                 if (editModal.data) {
//                     setEditModal(prev => ({
//                         ...prev,
//                         data: { ...prev.data!, imageUrl: base64String }
//                     }));
//                 }

//                 setIsUploading(false);
//             };
//             reader.readAsDataURL(file);
//         }, 1000);
//     };

//     // حفظ التعديلات أو إضافة منتج جديد
//     const handleSaveEdit = (updatedData: EditModalData) => {
//         if (!updatedData.name.trim()) {
//             showToast('اسم المنتج مطلوب', 'error');
//             return;
//         }

//         if (!updatedData.category.trim()) {
//             showToast('التصنيف مطلوب', 'error');
//             return;
//         }

//         if (updatedData.price < 0) {
//             showToast('السعر لا يمكن أن يكون سالباً', 'error');
//             return;
//         }

//         if (updatedData.stock < 0) {
//             showToast('الكمية لا يمكن أن تكون سالبة', 'error');
//             return;
//         }

//         if (updatedData.discount && updatedData.discount > 100) {
//             showToast('الخصم لا يمكن أن يتجاوز 100%', 'error');
//             return;
//         }

//         if (!customCategories.includes(updatedData.category)) {
//             setCustomCategories([...customCategories, updatedData.category]);
//         }

//         if (editModal.mode === 'edit' && updatedData.id) {
//             const imageToUse = uploadedImage || updatedData.imageUrl;

//             setProducts(products.map(product =>
//                 product.id === updatedData.id
//                     ? {
//                         ...product,
//                         name: updatedData.name,
//                         category: updatedData.category,
//                         price: updatedData.price,
//                         discount: updatedData.discount && updatedData.discount <= 100 ? updatedData.discount : undefined,
//                         description: updatedData.description,
//                         image: imageToUse,
//                         stock: updatedData.stock,
//                         sizes: updatedData.sizes,
//                         material: updatedData.material,
//                         seoTitle: updatedData.seoTitle,
//                         seoDescription: updatedData.seoDescription,
//                         sku: `${updatedData.category.substring(0, 3).toUpperCase()}-${updatedData.slug.substring(0, 6).toUpperCase()}`
//                     }
//                     : product
//             ));

//             showToast(`تم تعديل المنتج "${updatedData.name}" بنجاح`, 'success');
//         } else {
//             const newId = generateNewId();
//             const imageToUse = uploadedImage || updatedData.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop';

//             const newProduct: Product = {
//                 id: newId,
//                 name: updatedData.name,
//                 category: updatedData.category,
//                 price: updatedData.price,
//                 discount: updatedData.discount && updatedData.discount <= 100 ? updatedData.discount : undefined,
//                 rating: 4.5,
//                 reviews: 0,
//                 description: updatedData.description,
//                 image: imageToUse,
//                 stock: updatedData.stock,
//                 sizes: updatedData.sizes,
//                 material: updatedData.material,
//                 seoTitle: updatedData.seoTitle || `${updatedData.name} - ${updatedData.category}`,
//                 seoDescription: updatedData.seoDescription || `Buy ${updatedData.name} - High quality ${updatedData.category.toLowerCase()} product`,
//                 sku: `${updatedData.category.substring(0, 3).toUpperCase()}-${updatedData.slug.substring(0, 6).toUpperCase() || 'NEW'}`
//             };

//             setProducts([...products, newProduct]);
//             showToast(`تم إضافة المنتج "${updatedData.name}" بنجاح`, 'success');
//         }

//         setUploadedImage(null);
//         setEditModal({ isOpen: false, data: null, mode: 'edit' });
//     };

//     // دالة عرض النجوم
//     const renderStars = (rating: number) => {
//         return (
//             <div className="flex items-center gap-0.5">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <svg
//                         key={star}
//                         className={`w-3.5 h-3.5 ${star <= rating ? 'text-orange-400 fill-orange-400' :
//                             star - 0.5 <= rating ? 'text-orange-300 fill-orange-300' : 'text-gray-300 fill-gray-300'
//                             }`}
//                         viewBox="0 0 20 20"
//                     >
//                         <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
//                     </svg>
//                 ))}
//                 <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
//             </div>
//         );
//     };

//     // تحديث نطاق السعر تلقائياً ليشمل جميع المنتجات
//     useEffect(() => {
//         if (products.length > 0) {
//             const minPrice = Math.min(...products.map(p => p.price));
//             const maxPrice = Math.max(...products.map(p => p.price));

//             if (maxPrice > priceRange[1]) {
//                 setPriceRange([priceRange[0], Math.ceil(maxPrice / 500) * 500]);
//             }
//         }
//     }, [products]);

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             {/* العنوان الرئيسي */}
//             <div className="mb-8">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
//                         <p className="text-gray-600">Manage your products, inventory, and pricing</p>
//                     </div>

//                     <button
//                         onClick={openAddModal}
//                         className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
//                     >
//                         <Plus className="w-5 h-5" />
//                         Add New Product
//                     </button>
//                 </div>
//             </div>

//             {/* شريط البحث والفلترة */}
//             <div className="bg-white rounded-xl p-4 md:p-6 mb-6 shadow-sm border border-gray-200">
//                 <div className="flex flex-col md:flex-row gap-4">
//                     <div className="flex-1">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                             <input
//                                 type="text"
//                                 placeholder="Search products by name or description..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap gap-3">
//                         <button
//                             onClick={() => setShowFilters(!showFilters)}
//                             className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                             <Filter className="w-5 h-5" />
//                             Filters
//                             {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                         </button>

//                         <select
//                             value={sortBy}
//                             onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
//                             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                             <option value="name">Sort by Name</option>
//                             <option value="price">Sort by Price</option>
//                             <option value="rating">Sort by Rating</option>
//                         </select>

//                         <button
//                             onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//                             className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                             {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
//                         </button>
//                     </div>
//                 </div>

//                 {showFilters && (
//                     <div className="mt-6 pt-6 border-t border-gray-200">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div>
//                                 <h3 className="text-sm font-medium text-gray-700 mb-3">Category</h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {allCategories.map((category) => (
//                                         <button
//                                             key={category}
//                                             onClick={() => setSelectedCategory(category)}
//                                             className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategory === category
//                                                 ? 'bg-blue-600 text-white'
//                                                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                                 }`}
//                                         >
//                                             {category}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div>
//                                 <h3 className="text-sm font-medium text-gray-700 mb-3">
//                                     Price Range: ${priceRange[0]} - ${priceRange[1]}
//                                 </h3>
//                                 <div className="space-y-3">
//                                     <input
//                                         type="range"
//                                         min="0"
//                                         max="5000"
//                                         step="10"
//                                         value={priceRange[0]}
//                                         onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
//                                         className="w-full"
//                                     />
//                                     <input
//                                         type="range"
//                                         min="0"
//                                         max="5000"
//                                         step="10"
//                                         value={priceRange[1]}
//                                         onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
//                                         className="w-full"
//                                     />
//                                     <div className="flex justify-between text-sm text-gray-500">
//                                         <span>$0</span>
//                                         <span>$2500</span>
//                                         <span>$5000</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div>
//                                 <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     <button
//                                         onClick={() => setProducts(initialProducts)}
//                                         className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
//                                     >
//                                         All Products
//                                     </button>
//                                     <button
//                                         onClick={() => setProducts(products.filter(p => p.discount))}
//                                         className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
//                                     >
//                                         On Sale
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             setSearchTerm('');
//                                             setSelectedCategory('All');
//                                             setPriceRange([0, 5000]);
//                                         }}
//                                         className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 transition-colors"
//                                     >
//                                         Reset Filters
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div className="mb-4 flex items-center justify-between">
//                 <p className="text-gray-600">
//                     Showing <span className="font-semibold">{filteredProducts.length}</span> products
//                 </p>
//                 <div className="text-sm text-gray-500">
//                     Sorted by {sortBy} ({sortOrder})
//                 </div>
//             </div>

//             {/* شبكة المنتجات */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
//                 {filteredProducts.map((product) => {
//                     const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
//                     const savings = product.price - discountedPrice;

//                     return (
//                         <div
//                             key={product.id}
//                             className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full group border border-gray-200"
//                         >
//                             {/* صورة المنتج مع شارات */}
//                             <div
//                                 className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
//                                 onClick={() => setSelectedProduct(product)}
//                             >
//                                 <img
//                                     src={product.image}
//                                     alt={product.name}
//                                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                                 />

//                                 {/* شارة الخصم */}
//                                 {product.discount && (
//                                     <div className="absolute top-4 left-4 z-10">
//                                         <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-xl">
//                                             <div className="flex items-center gap-1">
//                                                 <span className="text-sm">-{product.discount}%</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* محتوى الكارد */}
//                             <div className="p-5 flex flex-col flex-grow">
//                                 {/* التصنيف */}
//                                 <div className="mb-2">
//                                     <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
//                                         <Tag className="w-3 h-3" />
//                                         {product.category}
//                                     </span>
//                                 </div>

//                                 {/* اسم المنتج */}
//                                 <h3
//                                     className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
//                                     onClick={() => setSelectedProduct(product)}
//                                 >
//                                     {product.name}
//                                 </h3>
//                                 {/* التقييم */}
//                                 <div className="flex items-center gap-2 mb-4">
//                                     {renderStars(product.rating)}
//                                     <span className="text-xs text-gray-500">({product.reviews})</span>
//                                 </div>

//                                 {/* السعر والخصم */}
//                                 <div className="mb-5">
//                                     {product.discount ? (
//                                         <div className="flex items-baseline gap-2 mb-1">
//                                             <span className="text-2xl font-bold text-gray-900">
//                                                 ${discountedPrice.toFixed(2)}
//                                             </span>
//                                             <span className="text-sm text-gray-400 line-through">
//                                                 ${product.price}
//                                             </span>
//                                         </div>
//                                     ) : (
//                                         <div className="text-2xl font-bold text-gray-900">
//                                             ${product.price}
//                                         </div>
//                                     )}
//                                     {product.discount && (
//                                         <p className="text-xs text-green-600 font-medium">
//                                             Save ${savings.toFixed(2)}
//                                         </p>
//                                     )}
//                                 </div>
//                                 {/* أزرار التحكم - في أسفل الكارد */}
//                                 <div className="mt-auto pt-4 border-t border-gray-100">
//                                     <div className="flex gap-2">
//                                         <button
//                                             onClick={() => openEditModal(product)}
//                                             className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
//                                         >
//                                             <Edit className="w-4 h-4" />
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => openDeleteModal(product.id, product.name)}
//                                             className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
//                                             title="Delete"
//                                         >
//                                             <Trash2 className="w-4 h-4" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {filteredProducts.length === 0 && (
//                 <div className="text-center py-12">
//                     <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                         <Search className="w-8 h-8 text-gray-400" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
//                     <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
//                     <div className="flex gap-4 justify-center">
//                         <button
//                             onClick={() => {
//                                 setSearchTerm('');
//                                 setSelectedCategory('All');
//                                 setPriceRange([0, 5000]);
//                             }}
//                             className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
//                         >
//                             Clear all filters
//                         </button>
//                         <button
//                             onClick={openAddModal}
//                             className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
//                         >
//                             <Plus className="w-5 h-5" />
//                             Add New Product
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Product Details Overlay */}
//             {selectedProduct && (
//                 <div
//                     className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
//                     onClick={() => setSelectedProduct(null)}
//                 >
//                     <div
//                         className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
//                             <div>
//                                 <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
//                                 <div className="flex items-center gap-3 mt-2">
//                                     <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
//                                         <Tag className="w-3 h-3" />
//                                         {selectedProduct.category}
//                                     </span>
//                                     <span className="text-sm text-gray-500">SKU: {selectedProduct.sku}</span>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setSelectedProduct(null)}
//                                 className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
//                             >
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>

//                         <div className="p-8">
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                                 <div className="space-y-6">
//                                     <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
//                                         <img
//                                             src={selectedProduct.image}
//                                             alt={selectedProduct.name}
//                                             className="w-full h-96 object-cover"
//                                         />
//                                         {selectedProduct.discount && (
//                                             <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
//                                                 -{selectedProduct.discount}% OFF
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100">
//                                         {selectedProduct.discount ? (
//                                             <div className="space-y-3">
//                                                 <div className="flex items-baseline gap-3">
//                                                     <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                                                         ${calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount).toFixed(2)}
//                                                     </span>
//                                                     <span className="text-2xl text-gray-400 line-through">
//                                                         ${selectedProduct.price.toFixed(2)}
//                                                     </span>
//                                                 </div>
//                                                 <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full">
//                                                     <Package className="w-5 h-5" />
//                                                     <span className="text-sm font-bold">
//                                                         You Save ${(selectedProduct.price - calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount)).toFixed(2)}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-baseline gap-2">
//                                                 <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                                                     ${selectedProduct.price.toFixed(2)}
//                                                 </span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div className="space-y-6">
//                                     <div className="flex items-center gap-4">
//                                         <div className="flex items-center gap-2">
//                                             {renderStars(selectedProduct.rating)}
//                                         </div>
//                                         <span className="text-gray-600">
//                                             {selectedProduct.rating.toFixed(1)} ({selectedProduct.reviews} reviews)
//                                         </span>
//                                     </div>

//                                     <div>
//                                         <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
//                                         <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="bg-gray-50 rounded-xl p-4">
//                                             <div className="text-sm text-gray-500 mb-1">Material</div>
//                                             <div className="font-semibold text-gray-900">{selectedProduct.material}</div>
//                                         </div>
//                                         <div className="bg-gray-50 rounded-xl p-4">
//                                             <div className="text-sm text-gray-500 mb-1">Stock</div>
//                                             <div className={`font-semibold inline-flex px-3 py-1 rounded-full text-sm ${selectedProduct.stock > 20 ? 'bg-green-100 text-green-800' :
//                                                 selectedProduct.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
//                                                 }`}>
//                                                 {selectedProduct.stock} units
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <h3 className="text-lg font-bold text-gray-900 mb-3">Available Sizes</h3>
//                                         <div className="flex flex-wrap gap-2">
//                                             {selectedProduct.sizes.map((size) => (
//                                                 <span
//                                                     key={size}
//                                                     className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border-2 border-blue-100 hover:border-blue-300 transition-colors"
//                                                 >
//                                                     {size}
//                                                 </span>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
//                                         <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
//                                             <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                             </svg>
//                                             SEO Information
//                                         </h3>
//                                         <div className="space-y-3">
//                                             <div>
//                                                 <div className="text-sm text-gray-500 mb-1">SEO Title</div>
//                                                 <div className="text-gray-900 font-medium">{selectedProduct.seoTitle}</div>
//                                             </div>
//                                             <div>
//                                                 <div className="text-sm text-gray-500 mb-1">SEO Description</div>
//                                                 <div className="text-gray-700 text-sm">{selectedProduct.seoDescription}</div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="flex gap-3 pt-4">
//                                         <button
//                                             onClick={() => {
//                                                 setSelectedProduct(null);
//                                                 openEditModal(selectedProduct);
//                                             }}
//                                             className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                                         >
//                                             <Edit className="w-5 h-5" />
//                                             Edit Product
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 setSelectedProduct(null);
//                                                 openDeleteModal(selectedProduct.id, selectedProduct.name);
//                                             }}
//                                             className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                                         >
//                                             <Trash2 className="w-5 h-5" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* مودال التعديل/الإضافة */}
//             {editModal.isOpen && editModal.data && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
//                         <div className="p-8">
//                             <div className="flex items-center justify-between mb-8">
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-900">
//                                         {editModal.mode === 'add' ? 'Add New Product' : 'Edit Product'}
//                                     </h2>
//                                     <p className="text-gray-500 mt-1">
//                                         {editModal.mode === 'add' ? 'Create a new product entry' : 'Update product details and settings'}
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => {
//                                         setUploadedImage(null);
//                                         setEditModal({ isOpen: false, data: null, mode: 'edit' });
//                                     }}
//                                     className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
//                                 >
//                                     <X className="w-6 h-6" />
//                                 </button>
//                             </div>

//                             <div className="space-y-8">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             Product Name *
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={editModal.data.name}
//                                             onChange={(e) => {
//                                                 const newName = e.target.value;
//                                                 setEditModal(prev => ({
//                                                     ...prev,
//                                                     data: {
//                                                         ...prev.data!,
//                                                         name: newName,
//                                                         slug: prev.mode === 'add' ? generateSlug(newName) : prev.data!.slug
//                                                     }
//                                                 }));
//                                             }}
//                                             className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                                             placeholder="Enter product name"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             URL Slug *
//                                         </label>
//                                         <div className="relative">
//                                             <input
//                                                 type="text"
//                                                 value={editModal.data.slug}
//                                                 onChange={(e) => setEditModal(prev => ({
//                                                     ...prev,
//                                                     data: { ...prev.data!, slug: e.target.value }
//                                                 }))}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
//                                             />
//                                             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
//                                                 /products/{editModal.data.slug}
//                                             </span>
//                                         </div>
//                                         <p className="mt-2 text-sm text-gray-500">
//                                             This will be used in the product URL
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             Category *
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 value={editModal.data.category}
//                                                 onChange={(e) => setEditModal(prev => ({
//                                                     ...prev,
//                                                     data: { ...prev.data!, category: e.target.value }
//                                                 }))}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
//                                             >
//                                                 <option value="">Select or type category</option>
//                                                 {allCategories
//                                                     .filter(cat => cat !== 'All')
//                                                     .map((category) => (
//                                                         <option key={category} value={category}>
//                                                             {category}
//                                                         </option>
//                                                     ))}
//                                             </select>
//                                             <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//                                         </div>
//                                         <input
//                                             type="text"
//                                             placeholder="Or enter new category..."
//                                             onKeyDown={(e) => {
//                                                 if (e.key === 'Enter' && e.currentTarget.value.trim()) {
//                                                     const newCategory = e.currentTarget.value.trim();
//                                                     if (!customCategories.includes(newCategory)) {
//                                                         setCustomCategories([...customCategories, newCategory]);
//                                                     }
//                                                     setEditModal(prev => ({
//                                                         ...prev,
//                                                         data: { ...prev.data!, category: newCategory }
//                                                     }));
//                                                     e.currentTarget.value = '';
//                                                 }
//                                             }}
//                                             className="w-full mt-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             SKU *
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={`${editModal.data.category.substring(0, 3).toUpperCase()}-${editModal.data.slug.substring(0, 6).toUpperCase() || 'NEW'}`}
//                                             readOnly
//                                             className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 font-mono text-gray-700"
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             Price ($) *
//                                         </label>
//                                         <div className="relative">
//                                             <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
//                                                 $
//                                             </span>
//                                             <input
//                                                 type="number"
//                                                 value={editModal.data.price}
//                                                 onChange={(e) => setEditModal(prev => ({
//                                                     ...prev,
//                                                     data: { ...prev.data!, price: parseFloat(e.target.value) || 0 }
//                                                 }))}
//                                                 className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                                                 step="0.01"
//                                                 min="0"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             Discount (%)
//                                         </label>
//                                         <div className="relative">
//                                             <input
//                                                 type="number"
//                                                 value={editModal.data.discount || ''}
//                                                 onChange={(e) => {
//                                                     const value = e.target.value;
//                                                     const discountValue = value ? Math.min(parseFloat(value), 100) : undefined;
//                                                     setEditModal(prev => ({
//                                                         ...prev,
//                                                         data: { ...prev.data!, discount: discountValue }
//                                                     }));
//                                                 }}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                                                 min="0"
//                                                 max="100"
//                                                 placeholder="0"
//                                                 step="0.1"
//                                             />
//                                             <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
//                                                 %
//                                             </span>
//                                         </div>
//                                         {editModal.data.discount && editModal.data.price > 0 && (
//                                             <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
//                                                 <div className="flex items-center justify-between">
//                                                     <span className="text-sm font-medium text-gray-700">Final Price:</span>
//                                                     <div className="flex items-baseline gap-2">
//                                                         <span className="text-2xl font-bold text-gray-900">
//                                                             ${calculateDiscountedPrice(editModal.data.price, editModal.data.discount).toFixed(2)}
//                                                         </span>
//                                                         <span className="text-sm text-green-600 font-semibold">
//                                                             Save ${(editModal.data.price - calculateDiscountedPrice(editModal.data.price, editModal.data.discount)).toFixed(2)}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                         Product Image
//                                     </label>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
//                                                 <input
//                                                     type="file"
//                                                     id="image-upload"
//                                                     accept="image/*"
//                                                     onChange={handleImageUpload}
//                                                     className="hidden"
//                                                 />
//                                                 <label htmlFor="image-upload" className="cursor-pointer">
//                                                     {isUploading ? (
//                                                         <div className="flex flex-col items-center justify-center">
//                                                             <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
//                                                             <p className="text-gray-700 font-medium">Uploading image...</p>
//                                                             <p className="text-sm text-gray-500 mt-1">Please wait</p>
//                                                         </div>
//                                                     ) : uploadedImage ? (
//                                                         <div className="flex flex-col items-center justify-center">
//                                                             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
//                                                                 <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                                                                 </svg>
//                                                             </div>
//                                                             <p className="text-gray-700 font-medium">Image uploaded successfully!</p>
//                                                             <p className="text-sm text-gray-500 mt-1">Click to upload a different image</p>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="flex flex-col items-center justify-center">
//                                                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                                                                 <Upload className="w-8 h-8 text-gray-400" />
//                                                             </div>
//                                                             <p className="text-gray-700 font-medium">Click to upload product image</p>
//                                                             <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
//                                                             <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
//                                                                 <ImageIcon className="w-4 h-4" />
//                                                                 Browse files
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </label>
//                                             </div>
//                                             <p className="text-sm text-gray-500 mt-3">
//                                                 Or enter image URL:
//                                             </p>
//                                             <input
//                                                 type="url"
//                                                 value={editModal.data.imageUrl}
//                                                 onChange={(e) => setEditModal(prev => ({
//                                                     ...prev,
//                                                     data: { ...prev.data!, imageUrl: e.target.value }
//                                                 }))}
//                                                 className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                                 placeholder="https://example.com/image.jpg"
//                                             />
//                                         </div>

//                                         <div className="flex flex-col items-center">
//                                             <div className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
//                                                 <img
//                                                     src={uploadedImage || editModal.data.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'}
//                                                     alt="Preview"
//                                                     className="w-full h-full object-cover"
//                                                     onError={(e) => {
//                                                         (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop';
//                                                     }}
//                                                 />
//                                             </div>
//                                             <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
//                                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                                 </svg>
//                                                 <span>Preview shows current product image</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             Stock Quantity *
//                                         </label>
//                                         <div className="relative">
//                                             <input
//                                                 type="number"
//                                                 value={editModal.data.stock}
//                                                 onChange={(e) => setEditModal(prev => ({
//                                                     ...prev,
//                                                     data: { ...prev.data!, stock: parseInt(e.target.value) || 0 }
//                                                 }))}
//                                                 className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                                                 min="0"
//                                             />
//                                         </div>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                                             Available Sizes (comma-separated)
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={editModal.data.sizes.join(',')}
//                                             onChange={(e) => setEditModal(prev => ({
//                                                 ...prev,
//                                                 data: { ...prev.data!, sizes: e.target.value.split(',').map(s => s.trim()) }
//                                             }))}
//                                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             placeholder="S, M, L, XL"
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                         Material
//                                     </label>
//                                     <input
//                                         type="text"
//                                         value={editModal.data.material}
//                                         onChange={(e) => setEditModal(prev => ({
//                                             ...prev,
//                                             data: { ...prev.data!, material: e.target.value }
//                                         }))}
//                                         className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                                         placeholder="e.g., Cotton, Leather, Wood"
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                         Description *
//                                     </label>
//                                     <textarea
//                                         value={editModal.data.description}
//                                         onChange={(e) => setEditModal(prev => ({
//                                             ...prev,
//                                             data: { ...prev.data!, description: e.target.value }
//                                         }))}
//                                         rows={4}
//                                         className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
//                                         placeholder="Enter detailed product description..."
//                                     />
//                                 </div>

//                                 <div className="space-y-6">
//                                     <div className="border-l-4 border-blue-500 pl-4">
//                                         <h3 className="text-lg font-bold text-gray-900">SEO Settings</h3>
//                                         <p className="text-gray-500 text-sm">Optimize for search engines</p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             SEO Title
//                                         </label>
//                                         <input
//                                             type="text"
//                                             value={editModal.data.seoTitle}
//                                             onChange={(e) => setEditModal(prev => ({
//                                                 ...prev,
//                                                 data: { ...prev.data!, seoTitle: e.target.value }
//                                             }))}
//                                             className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
//                                         />
//                                         <p className="mt-2 text-sm text-gray-500">
//                                             {editModal.data.seoTitle.length}/60 characters
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                                             SEO Description
//                                         </label>
//                                         <textarea
//                                             value={editModal.data.seoDescription}
//                                             onChange={(e) => setEditModal(prev => ({
//                                                 ...prev,
//                                                 data: { ...prev.data!, seoDescription: e.target.value }
//                                             }))}
//                                             rows={3}
//                                             className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
//                                         />
//                                         <p className="mt-2 text-sm text-gray-500">
//                                             {editModal.data.seoDescription.length}/160 characters
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex justify-end gap-4 pt-8 border-t">
//                                     <button
//                                         onClick={() => {
//                                             setUploadedImage(null);
//                                             setEditModal({ isOpen: false, data: null, mode: 'edit' });
//                                         }}
//                                         className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={() => handleSaveEdit(editModal.data!)}
//                                         className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
//                                     >
//                                         {editModal.mode === 'add' ? 'Add Product' : 'Save Changes'}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* مودال الحذف */}
//             {deleteModal.isOpen && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
//                     <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
//                         <div className="text-center mb-6">
//                             <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
//                                 <Trash2 className="w-8 h-8 text-red-600" />
//                             </div>
//                             <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h3>
//                             <p className="text-gray-600">
//                                 Are you sure you want to delete <span className="font-semibold">{deleteModal.productName}</span>? This action cannot be undone.
//                             </p>
//                         </div>

//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
//                                 className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleDeleteProduct}
//                                 className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
//                             >
//                                 Delete Product
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* إشعارات Toast */}
//             {toast.show && (
//                 <div className="fixed top-6 right-6 z-50 animate-slide-in">
//                     <div className={`rounded-xl shadow-2xl border-l-4 ${toast.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' :
//                         toast.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500' :
//                             'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500'} p-4 min-w-80 max-w-md`}>
//                         <div className="flex items-start gap-3">
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' :
//                                 toast.type === 'error' ? 'bg-red-100 text-red-600' :
//                                     'bg-blue-100 text-blue-600'}`}>
//                                 {toast.type === 'success' ? (
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                                     </svg>
//                                 ) : toast.type === 'error' ? (
//                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                     </svg>
//                                 ) : (
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                                     </svg>
//                                 )}
//                             </div>
//                             <div className="flex-1">
//                                 <p className="font-semibold text-gray-900">
//                                     {toast.type === 'success' ? 'تم بنجاح!' :
//                                         toast.type === 'error' ? 'خطأ!' :
//                                             'معلومة'}
//                                 </p>
//                                 <p className="text-sm text-gray-700 mt-0.5">{toast.message}</p>
//                             </div>
//                             <button
//                                 onClick={() => setToast(prev => ({ ...prev, show: false }))}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* الأنماط المخصصة */}
//             <style>{`
//         .line-clamp-1 {
//           display: -webkit-box;
//           -webkit-line-clamp: 1;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//         input[type="range"] {
//           -webkit-appearance: none;
//           height: 6px;
//           background: linear-gradient(to right, #e5e7eb, #3b82f6);
//           border-radius: 3px;
//           outline: none;
//         }
//         input[type="range"]::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           width: 20px;
//           height: 20px;
//           background: #2563eb;
//           border-radius: 50%;
//           cursor: pointer;
//           border: 3px solid white;
//           box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
//         }
//         input[type="range"]::-moz-range-thumb {
//           width: 20px;
//           height: 20px;
//           background: #2563eb;
//           border-radius: 50%;
//           cursor: pointer;
//           border: 3px solid white;
//           box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
//         }
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//         </div>
//     );
// };

// export default ProductsPage;


'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, Filter, Edit,
    Star, X, Tag, DollarSign, Package,
    ChevronDown, ChevronUp, Upload, ImageIcon, Plus, Trash2
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

            {/* Edit/Add Modal */}
            {editModal.isOpen && editModal.data && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editModal.mode === 'add' ? 'Add New Product' : 'Edit Product'}
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        {editModal.mode === 'add' ? 'Create a new product entry' : 'Update product details and settings'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setUploadedImage(null);
                                        setEditModal({ isOpen: false, data: null, mode: 'edit' });
                                    }}
                                    className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.name}
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
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            URL Slug
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={editModal.data.url || ''}
                                                onChange={(e) => setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, url: e.target.value }
                                                }))}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50"
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                /products/{editModal.data.url}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                            This will be used in the product URL
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Category *
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={editModal.data.category}
                                                onChange={(e) => setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, category: e.target.value }
                                                }))}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                                            >
                                                <option value="">Select or type category</option>
                                                {allCategories
                                                    .filter(cat => cat !== 'All')
                                                    .map((category) => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Or enter new category..."
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
                                            className="w-full mt-2 px-4 py-2.5 border border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Price ($) *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={editModal.data.price}
                                                onChange={(e) => setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, price: parseFloat(e.target.value) || 0 }
                                                }))}
                                                className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                step="0.01"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Discount (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={editModal.data.discount || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const discountValue = value ? Math.min(parseFloat(value), 100) : undefined;
                                                    setEditModal(prev => ({
                                                        ...prev,
                                                        data: { ...prev.data!, discount: discountValue }
                                                    }));
                                                }}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                min="0"
                                                max="100"
                                                placeholder="0"
                                                step="0.1"
                                            />
                                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
                                                %
                                            </span>
                                        </div>
                                        {editModal.data.discount && editModal.data.price > 0 && (
                                            <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">Final Price:</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            ${calculateDiscountedPrice(editModal.data.price, editModal.data.discount).toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-green-600 font-semibold">
                                                            Save ${(editModal.data.price - calculateDiscountedPrice(editModal.data.price, editModal.data.discount)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Stock Quantity *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={editModal.data.quantityInStock}
                                                onChange={(e) => setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, quantityInStock: parseInt(e.target.value) || 0 }
                                                }))}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Available Sizes (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.availableSizes}
                                            onChange={(e) => setEditModal(prev => ({
                                                ...prev,
                                                data: { ...prev.data!, availableSizes: e.target.value }
                                            }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="S, M, L, XL"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Materials
                                    </label>
                                    <input
                                        type="text"
                                        value={editModal.data.materials}
                                        onChange={(e) => setEditModal(prev => ({
                                            ...prev,
                                            data: { ...prev.data!, materials: e.target.value }
                                        }))}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="e.g., Cotton, Leather, Wood"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Product Image
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="image-upload"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    {uploadedImage ? (
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            </div>
                                                            <p className="text-gray-700 font-medium">Image ready to upload!</p>
                                                            <p className="text-sm text-gray-500 mt-1">{uploadedImage.name}</p>
                                                            <p className="text-sm text-gray-500 mt-1">Click to upload a different image</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                                <Upload className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                            <p className="text-gray-700 font-medium">Click to upload product image</p>
                                                            <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                                            <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-medium">
                                                                <ImageIcon className="w-4 h-4" />
                                                                Browse files
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-3">
                                                Or enter image URL:
                                            </p>
                                            <input
                                                type="url"
                                                value={editModal.data.image || ''}
                                                onChange={(e) => setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, image: e.target.value }
                                                }))}
                                                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="relative w-full h-64 rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg">
                                                <img
                                                    src={editModal.data.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop'}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop';
                                                    }}
                                                />
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span>Preview shows current product image</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Description *
                                    </label>
                                    <textarea
                                        value={editModal.data.description}
                                        onChange={(e) => setEditModal(prev => ({
                                            ...prev,
                                            data: { ...prev.data!, description: e.target.value }
                                        }))}
                                        rows={4}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        placeholder="Enter detailed product description..."
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h3 className="text-lg font-bold text-gray-900">SEO Settings</h3>
                                        <p className="text-gray-500 text-sm">Optimize for search engines</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            SEO Title
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.seoTitle}
                                            onChange={(e) => setEditModal(prev => ({
                                                ...prev,
                                                data: { ...prev.data!, seoTitle: e.target.value }
                                            }))}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                        <p className="mt-2 text-sm text-gray-500">
                                            {editModal.data.seoTitle.length}/60 characters
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            SEO Description
                                        </label>
                                        <textarea
                                            value={editModal.data.seoDescription}
                                            onChange={(e) => setEditModal(prev => ({
                                                ...prev,
                                                data: { ...prev.data!, seoDescription: e.target.value }
                                            }))}
                                            rows={3}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        />
                                        <p className="mt-2 text-sm text-gray-500">
                                            {editModal.data.seoDescription.length}/160 characters
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-8 border-t">
                                    <button
                                        onClick={() => {
                                            setUploadedImage(null);
                                            setEditModal({ isOpen: false, data: null, mode: 'edit' });
                                        }}
                                        className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                    >
                                        {editModal.mode === 'add' ? 'Add Product' : 'Save Changes'}
                                    </button>
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