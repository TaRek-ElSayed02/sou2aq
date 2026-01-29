import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// نفس نوع البيانات من productStore
export interface WishlistProduct {
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
  rating?: number;
  reviews?: number;
  created_at?: string;
}

interface WishlistState {
  products: WishlistProduct[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: WishlistState = {
  products: [],
  loading: false,
  error: null,
  success: false,
};

const API_URL = 'http://localhost:5000/api';

// جلب بيانات الويش ليست من API
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        return rejectWithValue('Token not found');
      }

      const response = await axios.get(`${API_URL}/wishlist/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // للحذف المحلي من الويش ليست (بدون انتظار API)
    removeProductLocally: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // جلب الويش ليست
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // تحويل السعر والخصم إلى أرقام
        state.products = action.payload.map((product: any) => ({
          ...product,
          price: parseFloat(product.price) || 0,
          discount: product.discount ? parseFloat(product.discount) : undefined,
          quantityInStock: product.quantityInStock || 0,
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          inWishlist: true,
        }));
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, removeProductLocally } = wishlistSlice.actions;
export default wishlistSlice.reducer;
