'use client';
import React, { useState, useMemo, useEffect } from 'react';
import {
    Search, Filter, Heart, Edit,
    Star, X, Tag, DollarSign, Package,
    ChevronDown, ChevronUp, Upload, ImageIcon, 
    Plus, Trash2, ShoppingCart, Minus, Eye,
    Check, CreditCard, Truck, Shield, RefreshCw
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart, removeFromCart, updateQuantityLocally, updateCartQuantity, removeItemLocally } from '@/store/slices/cartSlice';
import { useRouter } from 'next/navigation';

// أنواع البيانات
interface CartItem {
    cart_id: number;
    quantity: number;
    id: number;
    user_id: string;
    name: string;
    url: string;
    category: string;
    price: number;
    discount?: number;
    image?: string;
    imgAlt?: string;
    quantityInStock: number;
    availableSizes: string;
    materials: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
    created_at?: string;
}



export default function CartPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { items: cartItems, loading, error } = useAppSelector(state => state.cart);
    const { user } = useAppSelector(state => state.auth);

    // جلب السلة عند تحميل الصفحة
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCart(user.id) as any);
        } else {
            // إذا لم يكن هناك مستخدم، أعد التوجيه إلى صفحة تسجيل الدخول
            router.push('/auth/login');
        }
    }, [user?.id, dispatch, router]);
    // الحالات
    const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        show: false,
        message: '',
        type: 'success'
    });

    // الكشف عن حجم الشاشة
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // حساب الإجماليات
    const { subtotal, discount, shipping, tax, total } = useMemo(() => {
        const subtotal = cartItems.reduce((sum, item) => {
            const itemPrice = item.discount 
                ? item.price * (1 - item.discount / 100)
                : item.price;
            return sum + (itemPrice * item.quantity);
        }, 0);

        const discount = cartItems.reduce((sum, item) => {
            return item.discount 
                ? sum + (item.price * (item.discount / 100) * item.quantity)
                : sum;
        }, 0);

        const shipping = subtotal > 500 ? 0 : 29.99;
        const tax = subtotal * 0.08; // 8% ضريبة
        const total = subtotal + shipping + tax;

        return {
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            shipping: Number(shipping.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            total: Number(total.toFixed(2))
        };
    }, [cartItems]);

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

    // زيادة كمية المنتج
    const increaseQuantity = async (cartId: number, currentQuantity: number, stock: number) => {
        console.log('🔼 Increase clicked - cartId:', cartId, 'current:', currentQuantity, 'stock:', stock);
        if (currentQuantity < stock) {
            const newQuantity = currentQuantity + 1;
            console.log('📤 Dispatching updateCartQuantity:', { cartId, quantity: newQuantity });
            try {
                const result = await dispatch(updateCartQuantity({ cartId, quantity: newQuantity }) as any);
                console.log('✅ Dispatch result:', result);
                showToast(`Quantity increased to ${newQuantity}`, 'success');
            } catch (error) {
                console.error('❌ Dispatch error:', error);
                showToast('Failed to update quantity', 'error');
            }
        } else {
            showToast(`Cannot exceed available stock of ${stock}`, 'error');
        }
    };

    // تقليل كمية المنتج
    const decreaseQuantity = async (cartId: number, currentQuantity: number) => {
        console.log('🔽 Decrease clicked - cartId:', cartId, 'current:', currentQuantity);
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            console.log('📤 Dispatching updateCartQuantity:', { cartId, quantity: newQuantity });
            try {
                const result = await dispatch(updateCartQuantity({ cartId, quantity: newQuantity }) as any);
                console.log('✅ Dispatch result:', result);
                showToast(`Quantity decreased to ${newQuantity}`, 'success');
            } catch (error) {
                console.error('❌ Dispatch error:', error);
                showToast('Failed to update quantity', 'error');
            }
        } else {
            showToast('Quantity cannot be less than 1', 'error');
        }
    };

    // إزالة منتج من العربة
    const removeItem = async (cartId: number, itemName: string) => {
        try {
            await dispatch(removeFromCart(cartId) as any);
            showToast(`"${itemName}" has been removed from cart`, 'success');
        } catch (error) {
            showToast('Failed to remove item from cart', 'error');
        }
    };

    // دالة حساب السعر بعد الخصم
    const calculateDiscountedPrice = (price: number, discount?: number) => {
        if (!discount || discount <= 0) return price;
        return price * (1 - discount / 100);
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

    // تأكيد الشراء
    const handleCheckout = () => {
        showToast('Your order has been placed successfully!', 'success');
        console.log('Checkout processed:', cartItems);
    };

    // إعادة تعيين العربة
    const clearCart = () => {
        // سيتم حذف من Redux عند حذف جميع المنتجات
        showToast('Cart has been cleared', 'info');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
            {/* العنوان الرئيسي */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Shopping Cart</h1>
                        <p className="text-sm sm:text-base text-gray-600">Review your items and proceed to checkout</p>
                    </div>
                    
                    {/* إحصائيات العربة */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 sm:px-4 py-2 rounded-xl w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                <span className="font-bold text-gray-900">{cartItems.length}</span>
                                <span className="text-gray-600 text-sm sm:text-base">Items in Cart</span>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {cartItems.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-700 rounded-xl font-medium hover:from-red-100 hover:to-red-200 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none text-sm sm:text-base"
                                >
                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden xs:inline">Clear Cart</span>
                                    <span className="xs:hidden">Clear</span>
                                </button>
                            )}
                            {cartItems.length === 0 && !loading && (
                                <button
                                    onClick={() => router.push('/mysite/products')}
                                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl font-medium hover:from-blue-100 hover:to-blue-200 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none text-sm sm:text-base"
                                >
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden xs:inline">Browse Products</span>
                                    <span className="xs:hidden">Browse</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {/* القسم الأيسر: قائمة المنتجات */}
                <div className="lg:col-span-2">
                    {/* جدول المنتجات */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* عنوان الجدول - مخفي على الجوال */}
                        <div className="hidden md:block border-b border-gray-200">
                            <div className="grid grid-cols-12 gap-4 p-4 md:p-6">
                                <div className="col-span-5">
                                    <h3 className="font-semibold text-gray-900">Product</h3>
                                </div>
                                <div className="col-span-2 text-center">
                                    <h3 className="font-semibold text-gray-900">Price</h3>
                                </div>
                                <div className="col-span-3 text-center">
                                    <h3 className="font-semibold text-gray-900">Quantity</h3>
                                </div>
                                <div className="col-span-2 text-right">
                                    <h3 className="font-semibold text-gray-900">Total</h3>
                                </div>
                            </div>
                        </div>

                        {/* قائمة المنتجات */}
                        <div className="divide-y divide-gray-100">
                            {cartItems.length > 0 ? (
                                cartItems.map((item) => {
                                    const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
                                    const itemTotal = discountedPrice * item.quantity;
                                    const savings = item.discount ? (item.price - discountedPrice) * item.quantity : 0;

                                    return (
                                        <div key={item.cart_id} className="p-4 sm:p-5 md:p-6 hover:bg-gray-50 transition-colors">
                                            {/* تصميم للأجهزة المحمولة */}
                                            {isMobile ? (
                                                <div className="space-y-4">
                                                    {/* صورة المنتج واسمه */}
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            onClick={() => setSelectedProduct(item)}
                                                            className="cursor-pointer w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                                                        >
                                                            <img
                                                                src={`http://localhost:5000${item.image}`}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <button
                                                                onClick={() => setSelectedProduct(item)}
                                                                className="text-left w-full"
                                                            >
                                                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                                                    {item.name}
                                                                </h4>
                                                            </button>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                                                    {item.category}
                                                                </span>
                                                                <span className="text-xs text-gray-500 truncate">ID: {item.id}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* السعر والكمية */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <div className="text-gray-500 text-xs mb-1">Price</div>
                                                            {item.discount ? (
                                                                <div>
                                                                    <div className="text-base font-bold text-gray-900">
                                                                        ${discountedPrice.toFixed(2)}
                                                                    </div>
                                                                    <div className="text-xs text-gray-400 line-through">
                                                                        ${item.price.toFixed(2)}
                                                                    </div>
                                                                    <div className="text-xs font-medium text-red-600">
                                                                        Save {item.discount}%
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-base font-bold text-gray-900">
                                                                    ${item.price.toFixed(2)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div>
                                                            <div className="text-gray-500 text-xs mb-1">Quantity</div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => decreaseQuantity(item.cart_id, item.quantity)}
                                                                    className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className="w-3 h-3 text-gray-600" />
                                                                </button>
                                                                
                                                                <div className="w-12 text-center">
                                                                    <div className="font-bold text-gray-900">{item.quantity}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        Max: {item.quantityInStock}
                                                                    </div>
                                                                </div>
                                                                
                                                                <button
                                                                    onClick={() => increaseQuantity(item.cart_id, item.quantity, item.quantityInStock)}
                                                                    className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                                    disabled={item.quantity >= item.quantityInStock}
                                                                    disabled={item.quantity >= item.quantityInStock}
                                                                >
                                                                    <Plus className="w-3 h-3 text-gray-600" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* الإجمالي والإجراءات */}
                                                    <div className="border-t border-gray-100 pt-3">
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <div className="text-gray-500 text-xs mb-1">Total</div>
                                                                <div className="text-lg font-bold text-gray-900">
                                                                    ${itemTotal.toFixed(2)}
                                                                </div>
                                                                {savings > 0 && (
                                                                    <div className="text-xs font-medium text-green-600">
                                                                        Saved: ${savings.toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(item.cart_id, item.name)}
                                                                className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* المقاسات المتاحة */}
                                                    <div className="border-t border-gray-100 pt-3">
                                                        <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.availableSizes.split(',').map((size) => (
                                                                <span
                                                                    key={size.trim()}
                                                                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                                                                >
                                                                    {size.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* تصميم للأجهزة اللوحية والكمبيوتر */
                                                <div className="grid grid-cols-12 gap-3 md:gap-4 items-center">
                                                    {/* معلومات المنتج */}
                                                    <div className="col-span-12 sm:col-span-5">
                                                        <div className="flex items-start gap-3 md:gap-4">
                                                            {/* صورة المنتج */}
                                                            <div
                                                                onClick={() => setSelectedProduct(item)}
                                                                className="cursor-pointer w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0"
                                                            >
                                                                <img
                                                                    src={`http://localhost:5000${item.image}`}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            
                                                            {/* تفاصيل المنتج */}
                                                            <div className="flex-1 min-w-0">
                                                                <button
                                                                    onClick={() => setSelectedProduct(item)}
                                                                    className="text-left group w-full"
                                                                >
                                                                    <h4 className="cursor-pointer font-semibold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors truncate">
                                                                        {item.name}
                                                                    </h4>
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                                                                            {item.category}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500 truncate">ID: {item.id}</span>
                                                                    </div>
                                                                </button>
                                                                
                                                                {/* المقاسات المتاحة - مخفي على الشاشات الصغيرة */}
                                                                <div className="hidden sm:block mt-3">
                                                                    <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {item.availableSizes.split(',').map((size) => (
                                                                            <span
                                                                                key={size.trim()}
                                                                                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                                                                            >
                                                                                {size.trim()}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* السعر */}
                                                    <div className="col-span-6 sm:col-span-2">
                                                        <div className="space-y-1">
                                                            {item.discount ? (
                                                                <>
                                                                    <div className="text-base sm:text-lg font-bold text-gray-900">
                                                                        ${discountedPrice.toFixed(2)}
                                                                    </div>
                                                                    <div className="text-xs sm:text-sm text-gray-400 line-through">
                                                                        ${item.price.toFixed(2)}
                                                                    </div>
                                                                    <div className="text-xs font-medium text-red-600">
                                                                        Save {item.discount}%
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="text-base sm:text-lg font-bold text-gray-900">
                                                                    ${item.price.toFixed(2)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* الكمية */}
                                                    <div className="col-span-6 sm:col-span-3">
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <button
                                                                onClick={() => decreaseQuantity(item.cart_id, item.quantity)}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                                            </button>
                                                            
                                                            <div className="w-12 sm:w-16 text-center">
                                                                <div className="font-bold text-gray-900 text-sm sm:text-base">{item.quantity}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    Max: {item.quantityInStock}
                                                                </div>
                                                            </div>
                                                            
                                                            <button
                                                                onClick={() => increaseQuantity(item.cart_id, item.quantity, item.quantityInStock)}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                                disabled={item.quantity >= item.quantityInStock}
                                                            >
                                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* الإجمالي والإجراءات */}
                                                    <div className="col-span-12 sm:col-span-2">
                                                        <div className="text-right space-y-2">
                                                            <div className="text-lg sm:text-xl font-bold text-gray-900">
                                                                ${itemTotal.toFixed(2)}
                                                            </div>
                                                            {savings > 0 && (
                                                                <div className="text-xs sm:text-sm font-medium text-green-600">
                                                                    Saved: ${savings.toFixed(2)}
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() => removeItem(item.cart_id, item.name)}
                                                                className="cursor-pointer inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 sm:p-12 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {loading ? 'Loading cart...' : 'Your cart is empty'}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {loading ? 'Please wait...' : 'Add some products to your cart to see them here'}
                                    </p>
                                    {!loading && (
                                        <button
                                            onClick={() => router.push('/mysite/products')}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Browse Products
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    
                </div>

                {/* القسم الأيمن: ملخص الطلب */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 sm:top-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h3>
                            
                            {/* تفاصيل الطلب */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                <div className="flex justify-between">
                                    <span className="text-sm sm:text-base text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">${subtotal.toFixed(2)}</span>
                                </div>
                                
                                {discount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-sm sm:text-base text-gray-600">Discount</span>
                                        <span className="font-semibold text-green-600 text-sm sm:text-base">-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between">
                                    <span className="text-sm sm:text-base text-gray-600">Shipping</span>
                                    <span className={`font-semibold text-sm sm:text-base ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between">
                                    <span className="text-sm sm:text-base text-gray-600">Tax (8%)</span>
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">${tax.toFixed(2)}</span>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-xl sm:text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* معلومات التوصيل */}
                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Estimated Delivery</h4>
                                        <p className="text-xs sm:text-sm text-gray-600">5-7 business days after payment</p>
                                    </div>
                                </div>
                            </div>

                            {/* تأكيد الشراء */}
                            <button
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                                className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                            >
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Proceed to Checkout</span>
                            </button>

                            {/* ضمانات إضافية */}
                            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                    <span>Secure SSL encryption</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                    <span>30-day return policy</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                    <span>Money-back guarantee</span>
                                </div>
                            </div>
                        </div>

                        {/* رمز الخصم */}
                        {cartItems.length > 0 && (
                            <div className="mt-3 sm:mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3">Apply Discount Code</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter promo code"
                                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                                    />
                                    <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all text-sm sm:text-base">
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* مودال تفاصيل المنتج */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-4 sm:p-6 md:p-8">
                            {/* العنوان وإغلاق المودال */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="max-w-[80%]">
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{selectedProduct.name}</h2>
                                    <p className="text-gray-500 text-sm sm:text-base mt-1">{selectedProduct.category}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="p-2 sm:p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {/* صورة المنتج */}
                                <div>
                                    <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100">
                                        <img
                                            src={`http://localhost:5000${selectedProduct.image}`}
                                            alt={selectedProduct.name}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                    
                                    {/* السعر */}
                                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                                        <div className="mb-4">
                                            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                                                ${calculateDiscountedPrice(selectedProduct.price, selectedProduct.discount).toFixed(2)}
                                            </div>
                                            {selectedProduct.discount && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-base sm:text-lg text-gray-400 line-through">
                                                        ${selectedProduct.price.toFixed(2)}
                                                    </span>
                                                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs sm:text-sm font-bold">
                                                        -{selectedProduct.discount}% OFF
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* المخزون */}
                                        {/* <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                                            <span className="font-medium text-gray-700 text-sm sm:text-base">Stock Available:</span>
                                            <span className={`font-bold text-sm sm:text-base ${selectedProduct.quantityInStock > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {selectedProduct.quantityInStock} units
                                            </span>
                                        </div> */}
                                    </div>
                                </div>

                                {/* تفاصيل المنتج */}
                                <div>
                                    {/* الوصف */}
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Description</h3>
                                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                            {selectedProduct.description}
                                        </p>
                                    </div>

                                    {/* المقاسات المتاحة */}
                                    {selectedProduct.availableSizes && (
                                        <div className="mb-4 sm:mb-6">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Available Sizes</h3>
                                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                                {selectedProduct.availableSizes.split(',').map((size) => (
                                                    <div
                                                        key={size.trim()}
                                                        className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg font-medium border border-blue-100 text-xs sm:text-sm"
                                                    >
                                                        {size.trim()}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* المواد */}
                                    {selectedProduct.materials && (
                                        <div className="mb-6">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Materials</h3>
                                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium text-gray-900 text-sm sm:text-base">{selectedProduct.materials}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* معرف المنتج */}
                                    <div className="mb-6">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Stock Quantity</h3>
                                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium text-gray-900 text-sm sm:text-base">{selectedProduct.quantityInStock} Piece</span>
                                        </div>
                                    </div>

                                    {/* زر إغلاق */}
                                    {/* <div className="mt-6">
                                        <button
                                            onClick={() => setSelectedProduct(null)}
                                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                                        >
                                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                            Close
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* إشعارات Toast */}
            {toast.show && (
                <div className="fixed top-4 sm:top-6 right-2 sm:right-4 left-2 sm:left-auto z-50 animate-slide-in">
                    <div className={`rounded-xl shadow-2xl border-l-4 ${toast.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' :
                        toast.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500' :
                        'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500'} p-3 sm:p-4 max-w-full sm:min-w-80 sm:max-w-md mx-auto`}>
                        <div className="flex items-start gap-2 sm:gap-3">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' :
                                toast.type === 'error' ? 'bg-red-100 text-red-600' :
                                'bg-blue-100 text-blue-600'}`}>
                                {toast.type === 'success' ? (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : toast.type === 'error' ? (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                    {toast.type === 'success' ? 'Success!' : 
                                     toast.type === 'error' ? 'Error!' : 
                                     'Info'}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-700 mt-0.5 truncate">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* الأنماط المخصصة */}
            <style>{`
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
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* تحسينات للمسافات على الشاشات الصغيرة */
                @media (max-width: 640px) {
                    .p-mobile-safe {
                        padding: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
}