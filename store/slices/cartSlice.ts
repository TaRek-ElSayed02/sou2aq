import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// نوع البيانات من API
export interface CartProduct {
  cart_id: number;
  quantity: number;
  id: number;
  user_id: string;
  name: string;
  url: string;
  category: string;
  price: string | number;
  discount?: string | number;
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

interface CartState {
  items: CartProduct[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  success: false,
};

const API_URL = 'http://localhost:5000/api';

// جلب بيانات السلة من API
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        return rejectWithValue('Token not found');
      }

      const response = await axios.get(`${API_URL}/cart/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);

// تحديث كمية المنتج في السلة
export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ cartId, quantity }: { cartId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.error('No token found in localStorage');
        return rejectWithValue('Token not found');
      }

      console.log('[CART] Updating quantity:', { cartId, quantity, endpoint: `${API_URL}/cart/${cartId}` });

      const response = await axios.put(
        `${API_URL}/cart/${cartId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('[CART] Update response success:', response.data);
      return { cartId, quantity };
    } catch (error: any) {
      console.error('[CART] Update error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart quantity'
      );
    }
  }
);

// حذف منتج من السلة
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        return rejectWithValue('Token not found');
      }

      const response = await axios.delete(`${API_URL}/cart/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return cartId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove from cart'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // تحديث الكمية محلياً (Optimistic Update)
    updateQuantityLocally: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find((item) => item.cart_id === cartId);
      if (item && quantity >= 1 && quantity <= item.quantityInStock) {
        item.quantity = quantity;
      }
    },
    // إزالة المنتج محلياً
    removeItemLocally: (state, action) => {
      state.items = state.items.filter((item) => item.cart_id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب السلة
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // تحويل الكمية والسعر إلى أرقام
        state.items = action.payload.map((item: any) => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          discount: item.discount ? (typeof item.discount === 'string' ? parseFloat(item.discount) : item.discount) : undefined,
          quantityInStock: item.quantityInStock || 0,
          quantity: item.quantity || 1,
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // حذف من السلة
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.cart_id !== action.payload);
        state.success = true;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // تحديث الكمية
      .addCase(updateCartQuantity.pending, (state) => {
        console.log('[CART] updateQuantity pending...');
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { cartId, quantity } = action.payload;
        console.log('[CART] updateQuantity fulfilled:', { cartId, quantity });
        const item = state.items.find((item) => item.cart_id === cartId);
        if (item) {
          item.quantity = quantity;
          console.log('[CART] Item updated:', { cart_id: item.cart_id, new_quantity: item.quantity });
        } else {
          console.warn('[CART] Item not found with cartId:', cartId);
        }
        state.success = true;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        console.error('[CART] updateQuantity rejected:', action.payload);
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateQuantityLocally, removeItemLocally } = cartSlice.actions;
export default cartSlice.reducer;
