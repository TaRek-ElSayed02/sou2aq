import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

// دالة helper لتحويل tags من string إلى array
const normalizeTags = (tags: any): string[] => {
    if (Array.isArray(tags)) {
        return tags;
    }
    if (typeof tags === 'string') {
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    return [];
};

// دالة helper لتطبيع بيانات المقالة
const normalizeBlogPost = (post: any): BlogPost => {
    return {
        ...post,
        tags: normalizeTags(post.tags)
    };
};

// أنواع البيانات
export interface BlogPost {
    id: number;
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    imgAlt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    views: number;
    likes: number;
    comments: number;
    tags: string[];
    created_at?: string;
}

export interface BlogState {
    posts: BlogPost[];
    selectedPost: BlogPost | null;
    loading: boolean;
    error: string | null;
    success: string | null;
    lastFetched: number | null;
}

const initialState: BlogState = {
    posts: [],
    selectedPost: null,
    loading: false,
    error: null,
    success: null,
    lastFetched: null,
};

// Thunks
export const fetchBlogPosts = createAsyncThunk(
    'blog/fetchPosts',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const { auth } = state;
            
            if (!auth.accessToken) {
                throw new Error('Authentication required');
            }

            const response = await axios.get('http://localhost:5000/api/blogs', {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch posts'
            );
        }
    }
);

export const fetchBlogPostById = createAsyncThunk(
    'blog/fetchPostById',
    async (id: number, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const { auth } = state;

            if (!auth.accessToken) {
                throw new Error('Authentication required');
            }

            const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch post'
            );
        }
    }
);

export const createBlogPost = createAsyncThunk(
    'blog/createPost',
    async (formData: FormData, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const { auth } = state;

            if (!auth.accessToken) {
                throw new Error('Authentication required');
            }

            const response = await axios.post('http://localhost:5000/api/blogs', formData, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to create post'
            );
        }
    }
);

export const updateBlogPost = createAsyncThunk(
    'blog/updatePost',
    async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const { auth } = state;

            if (!auth.accessToken) {
                throw new Error('Authentication required');
            }

            console.log('Updating blog post with ID:', id);
            
            const response = await axios.patch(`http://localhost:5000/api/blogs/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Post updated successfully:', response.data.data);
            return response.data.data;
        } catch (error: any) {
            console.error('Update error:', error);
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to update post'
            );
        }
    }
);

export const deleteBlogPost = createAsyncThunk(
    'blog/deletePost',
    async (id: number, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState;
            const { auth } = state;

            if (!auth.accessToken) {
                throw new Error('Authentication required');
            }

            console.log('Deleting blog post with ID:', id);
            
            await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.accessToken}`
                }
            });

            console.log('Post deleted successfully:', id);
            return id;
        } catch (error: any) {
            console.error('Delete error:', error);
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to delete post'
            );
        }
    }
);

// Slice
const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setSelectedPost: (state, action: PayloadAction<BlogPost | null>) => {
            state.selectedPost = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        resetBlogState: () => initialState,
        shouldRefetch: (state) => {
            // Reset last fetched timestamp to force refetch
            state.lastFetched = null;
        }
    },
    extraReducers: (builder) => {
        // Fetch Posts
        builder.addCase(fetchBlogPosts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBlogPosts.fulfilled, (state, action) => {
            state.loading = false;
            // تطبيع جميع المقالات
            state.posts = (Array.isArray(action.payload) ? action.payload : []).map(post => normalizeBlogPost(post));
            state.lastFetched = Date.now();
        });
        builder.addCase(fetchBlogPosts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Post By ID
        builder.addCase(fetchBlogPostById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchBlogPostById.fulfilled, (state, action) => {
            state.loading = false;
            // تطبيع المقالة الواحدة
            state.selectedPost = normalizeBlogPost(action.payload);
        });
        builder.addCase(fetchBlogPostById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create Post
        builder.addCase(createBlogPost.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        });
        builder.addCase(createBlogPost.fulfilled, (state, action) => {
            state.loading = false;
            // تطبيع المقالة الجديدة
            state.posts.unshift(normalizeBlogPost(action.payload));
            state.success = 'Post created successfully';
        });
        builder.addCase(createBlogPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Update Post
        builder.addCase(updateBlogPost.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        });
        builder.addCase(updateBlogPost.fulfilled, (state, action) => {
            state.loading = false;
            // تطبيع المقالة المحدثة
            const normalizedPost = normalizeBlogPost(action.payload);
            const index = state.posts.findIndex(post => post.id === normalizedPost.id);
            if (index !== -1) {
                state.posts[index] = normalizedPost;
            }
            if (state.selectedPost?.id === action.payload.id) {
                state.selectedPost = action.payload;
            }
            state.success = 'Post updated successfully';
        });
        builder.addCase(updateBlogPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Delete Post
        builder.addCase(deleteBlogPost.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        });
        builder.addCase(deleteBlogPost.fulfilled, (state, action) => {
            state.loading = false;
            state.posts = state.posts.filter(post => post.id !== action.payload);
            if (state.selectedPost?.id === action.payload) {
                state.selectedPost = null;
            }
            state.success = 'Post deleted successfully';
        });
        builder.addCase(deleteBlogPost.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const {
    setSelectedPost,
    clearError,
    clearSuccess,
    resetBlogState,
    shouldRefetch
} = blogSlice.actions;

export default blogSlice.reducer;