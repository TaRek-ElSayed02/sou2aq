'use client';
import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

// بيانات المنتجات مع روابط صور حقيقية
const initialProducts = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1559819774-e3cc10ee5062?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    name: 'Apple Watch Series 4', 
    category: 'Digital Product', 
    price: 999.00, 
    piece: 63, 
    colors: 3, 
    status: true 
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1559819774-e3cc10ee5062?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    name: 'Apple Watch Series 5', 
    category: 'Digital Product', 
    price: 1090.00, 
    piece: 45, 
    colors: 3, 
    status: true 
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=150&fit=crop', 
    name: 'iPhone 13', 
    category: 'Mobile', 
    price: 999.00, 
    piece: 89, 
    colors: 5, 
    status: true 
  },
  { 
    id: 4, 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop', 
    name: 'MacBook Pro', 
    category: 'Digital Product', 
    price: 1299.00, 
    piece: 23, 
    colors: 2, 
    status: true 
  },
  { 
    id: 5, 
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&h=150&fit=crop', 
    name: 'Smart Watch', 
    category: 'Digital Product', 
    price: 299.00, 
    piece: 120, 
    colors: 6, 
    status: true 
  },
  { 
    id: 6, 
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&h=150&fit=crop', 
    name: 'Camera DSLR', 
    category: 'Electronic', 
    price: 899.00, 
    piece: 34, 
    colors: 3, 
    status: true 
  },
  { 
    id: 7, 
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop', 
    name: "Women's Dress", 
    category: 'Fashion', 
    price: 640.00, 
    piece: 635, 
    colors: 4, 
    status: true 
  },
  { 
    id: 8, 
    image: 'https://plus.unsplash.com/premium_photo-1711044006683-a9c3bbcf2f15?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
    name: 'Microsoft Headsquare', 
    category: 'Digital Product', 
    price: 190.00, 
    piece: 13, 
    colors: 4, 
    status: true 
  },
  { 
    id: 9, 
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w-150&h=150&fit=crop', 
    name: 'Samsung A50', 
    category: 'Mobile', 
    price: 400.00, 
    piece: 67, 
    colors: 4, 
    status: true 
  },
  { 
    id: 10, 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&h=150&fit=crop', 
    name: 'Camera', 
    category: 'Electronic', 
    price: 420.00, 
    piece: 52, 
    colors: 4, 
    status: true 
  },
];

const ITEMS_PER_PAGE = 9;

export default function StockPage() {
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId:null,
    productName: ''
  });
  
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // حساب المنتجات للصفحة الحالية
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  // دالة فتح مودال الحذف
  const openDeleteModal = (id:number, name:string) => {
    setDeleteModal({
      isOpen: true,
      productId: id,
      productName: name
    });
  };

  // دالة إغلاق مودال الحذف
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      productId: null,
      productName: ''
    });
  };

  // دالة الحذف الفعلية
  const handleDeleteProduct = () => {
    if (deleteModal.productId) {
      setProducts(products.filter(product => product.id !== deleteModal.productId));
      closeDeleteModal();
    }
  };

  // دالة تغيير الصفحة
  const handlePageChange = (page:number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // عرض نقاط الألوان
  const renderColorDots = (count:number) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      dots.push(
        <span
          key={i}
          className="inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-gray-300 mr-1"
          style={{ backgroundColor: getColorByIndex(i) }}
          title={`Color ${i + 1}`}
        ></span>
      );
    }
    return dots;
  };

  // ألوان مختلفة للنقاط
  const getColorByIndex = (index:number) => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
    return colors[index % colors.length];
  };

  // توليد أرقام الصفحات
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 5;
    
    // زر الصفحة الأولى
    pageNumbers.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-md text-xs sm:text-sm md:text-base ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="First page"
      >
        «
      </button>
    );

    // زر الصفحة السابقة
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-md text-xs sm:text-sm md:text-base ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Previous page"
      >
        ‹
      </button>
    );

    // أرقام الصفحات
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <span key="start-ellipsis" className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-md text-xs sm:text-sm md:text-base ${currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(
        <span key="end-ellipsis" className="px-1 sm:px-2 text-gray-500 text-xs sm:text-sm">
          ...
        </span>
      );
    }

    // زر الصفحة التالية
    pageNumbers.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-md text-xs sm:text-sm md:text-base ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Next page"
      >
        ›
      </button>
    );

    // زر الصفحة الأخيرة
    pageNumbers.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-md text-xs sm:text-sm md:text-base ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
        aria-label="Last page"
      >
        »
      </button>
    );

    return pageNumbers;
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Product Stock</h1>
      
      {/* جدول المنتجات للشاشات المتوسطة والكبيرة */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Piece
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Colors
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e:any) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`;
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-6 md:py-4">
                    <div className="text-sm md:text-base font-medium text-gray-900 truncate max-w-[150px] md:max-w-[200px]">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs md:text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900 font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap text-sm md:text-base text-gray-900">
                    <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${product.piece > 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {product.piece} pcs
                    </span>
                  </td>
                  <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap">
                    <div className="flex items-center" title={`${product.colors} colors available`}>
                      {renderColorDots(product.colors)}
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-6 md:py-4 whitespace-nowrap text-sm md:text-base font-medium">
                    <button
                      onClick={() => openDeleteModal(product.id, product.name)}
                      className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
                      title="Delete product"
                      aria-label={`Delete ${product.name}`}
                    >
                      <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* عرض للموبايل */}
      <div className="block md:hidden">
        <div className="grid grid-cols-1 gap-3">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
              {/* الصف العلوي: الصورة والمعلومات الأساسية */}
              <div className="flex items-start">
                {/* الصورة */}
                <div className="flex-shrink-0 mr-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e:any) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`;
                      }}
                    />
                  </div>
                </div>
                
                {/* معلومات المنتج */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <div className="flex items-center">
                          {renderColorDots(product.colors)}
                        </div>
                      </div>
                    </div>
                    
                    {/* السعر وعدد القطع مكان الأيقونة */}
                    <div className="text-right ml-2">
                      <div className="text-sm font-bold text-gray-900">${product.price.toFixed(2)}</div>
                      <div className={`mt-1 px-2 py-0.5 rounded-full text-xs ${product.piece > 50 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {product.piece} pcs
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* زر الحذف - بالعرض الكامل */}
              <div className="mt-4">
                <button
                  onClick={() => openDeleteModal(product.id, product.name)}
                  className="w-full py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow hover:shadow-lg flex items-center justify-center gap-2"
                  title="Delete product"
                  aria-label={`Delete ${product.name}`}
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete Product</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* مودال الحذف */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-md mx-3 sm:mx-auto shadow-xl sm:shadow-2xl p-4 sm:p-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <FiTrash2 className="w-5 h-5 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Delete Product</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{deleteModal.productName}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow hover:shadow-lg text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* الباجينيشن */}
      <div className="mt-3 sm:mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        <div className="text-xs sm:text-sm text-gray-700">
          Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
          <span className="font-semibold">
            {Math.min(endIndex, products.length)}
          </span>{' '}
          of <span className="font-semibold">{products.length}</span> results
        </div>
        
        <div className="flex items-center flex-wrap justify-center gap-1 sm:gap-2">
          {renderPageNumbers()}
        </div>
      </div>
    </div>
  );
}