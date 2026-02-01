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
    // تخزين في localStorage (لـ Redux persist)
    localStorage.setItem('accessToken', accessToken)
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }
    
    // تخزين في الكوكيز (للميدل وير)
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`
    if (refreshToken) {
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`
    }
  }
}

export const removeTokensFromCookies = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

export const getTokenFromCookies = () => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'accessToken') {
        return value
      }
    }
  }
  return null
}

export const { logout } = authSlice.actions;
export default authSlice.reducer;
