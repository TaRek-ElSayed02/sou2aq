// store/productStore.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface Product {
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
  rating?: number;
  reviews?: number;
  createdAt?: string;
  modifiedAt?: string;
}

export interface ProductFormData {
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

interface ProductState {
  products: Product[];
  userProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchSuccess: boolean;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
}

const initialState: ProductState = {
  products: [],
  userProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  fetchSuccess: false,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

// API Base URL
const API_URL = 'http://localhost:5000/api';

// Async Thunks

// جلب جميع المنتجات
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// جلب منتجات مستخدم معين
export const fetchProductsByUserId = createAsyncThunk(
  'products/fetchProductsByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/user/${userId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user products');
    }
  }
);

// جلب منتج محدد
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// إنشاء منتج جديد
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async ({ productData, imageFile }: { productData: ProductFormData; imageFile?: File }, 
    { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      
      // إضافة البيانات النصية
      Object.keys(productData).forEach(key => {
        if (productData[key as keyof ProductFormData] !== undefined) {
          formData.append(key, productData[key as keyof ProductFormData] as string);
        }
      });

      // إضافة الملف إذا وجد
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post(
        `${API_URL}/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// تحديث منتج موجود
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, productData, imageFile }: 
    { productId: string; productData: Partial<ProductFormData>; imageFile?: File }, 
    { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      
      // إضافة البيانات النصية
      Object.keys(productData).forEach(key => {
        if (productData[key as keyof ProductFormData] !== undefined) {
          formData.append(key, productData[key as keyof ProductFormData] as string);
        }
      });

      // إضافة الملف إذا وجد
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.patch(
        `${API_URL}/products/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// حذف منتج
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.delete(
        `${API_URL}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { productId, message: response.data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Create slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.userProducts = [];
      state.currentProduct = null;
    },
    setCurrentProduct: (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFetchSuccess: (state) => {
      state.fetchSuccess = false;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    clearAllSuccess: (state) => {
      state.fetchSuccess = false;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.fetchSuccess = true;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Products By User ID
      .addCase(fetchProductsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userProducts = action.payload;
        state.fetchSuccess = true;
      })
      .addCase(fetchProductsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.fetchSuccess = true;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.userProducts.push(action.payload);
        state.createSuccess = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        
        // تحديث في قائمة جميع المنتجات
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        
        // تحديث في قائمة منتجات المستخدم
        const userIndex = state.userProducts.findIndex(p => p.id === action.payload.id);
        if (userIndex !== -1) {
          state.userProducts[userIndex] = action.payload;
        }
        
        // تحديث المنتج الحالي
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
        
        state.updateSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        
        // حذف من قائمة جميع المنتجات
        state.products = state.products.filter(p => p.id.toString() !== action.payload.productId);
        
        // حذف من قائمة منتجات المستخدم
        state.userProducts = state.userProducts.filter(p => p.id.toString() !== action.payload.productId);
        
        // مسح المنتج الحالي إذا كان هو المحذوف
        if (state.currentProduct?.id.toString() === action.payload.productId) {
          state.currentProduct = null;
        }
        
        state.deleteSuccess = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearProducts, 
  setCurrentProduct, 
  clearCurrentProduct,
  clearError, 
  clearFetchSuccess,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearDeleteSuccess,
  clearAllSuccess
} = productSlice.actions;
export default productSlice.reducer;