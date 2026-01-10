import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  password?: string;
  DoB?: string;
  phone?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'superAdmin';
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  fetchSuccess: boolean; // نجاح جلب البيانات
  updateSuccess: boolean; // نجاح التحديث
  uploadSuccess: boolean; // نجاح رفع الصورة
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  fetchSuccess: false,
  updateSuccess: false,
  uploadSuccess: false,
};

// API Base URL
const API_URL = 'http://localhost:5000/api';

// Async Thunks
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updateData: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const state = getState() as { user: UserState };
      const userId = state.user.currentUser?.id;

      if (!userId) {
        throw new Error('No user ID found');
      }

      const response = await axios.patch(
        `${API_URL}/users/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('profileImage', file);

      const response = await axios.post(
        `${API_URL}/users/upload-profile-image`,
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
      return rejectWithValue(error.response?.data?.message || 'Failed to upload image');
    }
  }
);

export const deleteProfileImage = createAsyncThunk(
  'user/deleteProfileImage',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.delete(
        `${API_URL}/users/delete-profile-image`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete image');
    }
  }
);

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.fetchSuccess = false;
      state.updateSuccess = false;
      state.uploadSuccess = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearUploadSuccess: (state) => {
      state.uploadSuccess = false;
    },
    clearFetchSuccess: (state) => {
      state.fetchSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.fetchSuccess = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.fetchSuccess = false;
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })
      
      // Upload Profile Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser.profileImage = action.payload.profileImage;
        }
        state.uploadSuccess = true;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadSuccess = false;
      })
      
      // Delete Profile Image
      .addCase(deleteProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfileImage.fulfilled, (state) => {
        state.loading = false;
        if (state.currentUser) {
          state.currentUser.profileImage = undefined;
        }
        state.uploadSuccess = true;
      })
      .addCase(deleteProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.uploadSuccess = false;
      });
  },
});

export const { 
  clearUser, 
  setUser, 
  clearError, 
  clearUpdateSuccess, 
  clearUploadSuccess,
  clearFetchSuccess 
} = userSlice.actions;
export default userSlice.reducer;