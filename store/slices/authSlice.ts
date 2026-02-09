import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "@/app/utils/types";


interface AuthState {
  user:User| null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    data: { identifier: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data
      );
      
      console.log('=== Login Response ===');
      console.log('Full response:', res.data);
      console.log('response.data.data:', res.data.data);
      console.log('user object:', res.data.data.user);
      console.log('user.role:', res.data.data.user?.role);

      return res.data.data; 
    } catch (err: any) {
      console.error('Login error:', err);
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        console.log('=== Login Fulfilled ===');
        console.log('action.payload:', action.payload);
        console.log('action.payload.user:', action.payload.user);
        console.log('setting state.user to:', action.payload.user);

        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        
        console.log('state.user after set:', state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// app/utils/authHelpers.ts
export const saveTokensToCookies = (accessToken: string, refreshToken?: string) => {
  if (typeof window !== 'undefined') {
    try {
      // تخزين في localStorage (لـ Redux persist)
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // تخزين في sessionStorage (بديل إذا cookies ما اشتغلت)
      sessionStorage.setItem('accessToken', accessToken)
      if (refreshToken) {
        sessionStorage.setItem('refreshToken', refreshToken)
      }
      
      console.log('💾 Tokens saved to localStorage and sessionStorage');
      
      // محاولة حفظ في الكوكيز أيضاً
      // لـ localhost with subdomains، جرّب بدون domain attribute أولاً
      const cookieOptions = `path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      
      document.cookie = `accessToken=${encodeURIComponent(accessToken)}; ${cookieOptions}`;
      console.log('🍪 Cookie set (method 1 - no domain):', document.cookie.substring(0, 50));
      
      // جرّب أيضاً مع domain=.localhost
      const cookieOptionsWithDomain = `path=/; domain=.localhost; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      document.cookie = `accessToken=${encodeURIComponent(accessToken)}; ${cookieOptionsWithDomain}`;
      console.log('🍪 Cookie set (method 2 - with .localhost):', document.cookie.substring(0, 50));
      
      if (refreshToken) {
        document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; ${cookieOptions}`;
      }
    } catch (error) {
      console.error('❌ Error saving tokens:', error);
    }
  }
}

export const removeTokensFromCookies = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    let domain = window.location.hostname;
    if (domain === 'localhost' || domain.endsWith('.localhost')) {
      domain = '.localhost';
    }
    
    document.cookie = `accessToken=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `refreshToken=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export const { logout } = authSlice.actions;
export default authSlice.reducer;
