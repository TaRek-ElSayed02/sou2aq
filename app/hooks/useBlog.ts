import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
    fetchBlogPosts,
    fetchBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    setSelectedPost,
    clearError,
    clearSuccess,
    resetBlogState,
    shouldRefetch,
    BlogPost
} from '../../store/blogStore';
import { useEffect, useCallback } from 'react';

// دالة لفحص صلاحيات المستخدم
const checkSuperAdminPermission = (user: any) => {
    // تفحص في أماكن مختلفة لأن البنية قد تكون مختلفة
    const role = user?.role || user?.accountInfo?.role;
    const hasPermission = role === 'superAdmin' || role === 'superadmin' || role === 'super_admin' || role === 'SUPERADMIN';
    console.log('checkSuperAdminPermission - user:', user);
    console.log('checkSuperAdminPermission - role found:', role);
    console.log('checkSuperAdminPermission - hasPermission:', hasPermission);
    return hasPermission;
};

export const useBlog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const blogState = useSelector((state: RootState) => state.blog);
    const authState = useSelector((state: RootState) => state.auth);
    const userState = useSelector((state: RootState) => state.user);

    // التحقق من صلاحيات المستخدم - جرب auth.user أولاً، ثم user.currentUser
    const isSuperAdmin = checkSuperAdminPermission(authState.user) || checkSuperAdminPermission(userState.currentUser);
    
    // تشخيص المشكلة
    useEffect(() => {
        console.log('=== Blog Auth Debug ===');
        console.log('authState.user:', authState.user);
        console.log('authState.user?.role:', authState.user?.role);
        console.log('userState.currentUser:', userState.currentUser);
        console.log('userState.currentUser?.role:', userState.currentUser?.role);
        console.log('authState.accessToken:', authState.accessToken);
        console.log('isSuperAdmin:', isSuperAdmin);
    }, [authState.user, userState.currentUser, isSuperAdmin]);

    // جلب المقالات مع caching
    const getBlogPosts = useCallback(async (forceRefresh = false) => {
        if (!authState.accessToken) {
            throw new Error('Authentication required');
        }

        if (!isSuperAdmin) {
            throw new Error('Unauthorized: Super admin privileges required');
        }

        // Check cache - refresh every 5 minutes (300000 ms)
        const shouldFetch = forceRefresh || 
            !blogState.lastFetched || 
            Date.now() - blogState.lastFetched > 300000;

        if (shouldFetch || blogState.posts.length === 0) {
            await dispatch(fetchBlogPosts());
        }
    }, [dispatch, authState.accessToken, isSuperAdmin, blogState.lastFetched, blogState.posts.length]);

    // جلب مقال بواسطة ID
    const getBlogPostById = useCallback(async (id: number) => {
        if (!authState.accessToken) {
            throw new Error('Authentication required');
        }

        if (!isSuperAdmin) {
            throw new Error('Unauthorized: Super admin privileges required');
        }

        await dispatch(fetchBlogPostById(id));
    }, [dispatch, authState.accessToken, isSuperAdmin]);

    // إنشاء مقال جديد
    const createPost = useCallback(async (postData: any, imageFile?: File) => {
        if (!authState.accessToken) {
            throw new Error('Authentication required');
        }

        if (!isSuperAdmin) {
            throw new Error('Unauthorized: Super admin privileges required');
        }

        const formData = new FormData();
        
        // إضافة البيانات النصية
        Object.keys(postData).forEach(key => {
            if (postData[key] !== null && postData[key] !== undefined && postData[key] !== '') {
                if (Array.isArray(postData[key])) {
                    formData.append(key, postData[key].join(','));
                } else {
                    formData.append(key, postData[key]);
                }
            }
        });

        // إضافة الصورة إذا كانت موجودة
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const result = await dispatch(createBlogPost(formData));
        
        // تحقق من نجاح العملية
        if (result.type === createBlogPost.rejected.type) {
            throw new Error(result.payload as string);
        }
        
        // تحديث cache
        dispatch(shouldRefetch());
    }, [dispatch, authState.accessToken, isSuperAdmin]);

    // تحديث مقال
    const updatePost = useCallback(async (id: number, postData: any, imageFile?: File) => {
        if (!authState.accessToken) {
            throw new Error('Authentication required');
        }

        if (!isSuperAdmin) {
            throw new Error('Unauthorized: Super admin privileges required');
        }

        const formData = new FormData();
        
        // إضافة البيانات النصية
        Object.keys(postData).forEach(key => {
            // تخطي الحقول الفارغة والـ image القديم إذا كان empty string
            if (postData[key] !== null && postData[key] !== undefined && postData[key] !== '') {
                if (key === 'image' && typeof postData[key] === 'string' && postData[key].trim() === '') {
                    // تخطي الصورة القديمة إذا كانت empty string
                    return;
                }
                if (Array.isArray(postData[key])) {
                    formData.append(key, postData[key].join(','));
                } else {
                    formData.append(key, postData[key]);
                }
            }
        });

        // إضافة الصورة الجديدة إذا كانت موجودة
        if (imageFile) {
            formData.append('image', imageFile);
        }

        const result = await dispatch(updateBlogPost({ id, formData }));
        
        // تحقق من نجاح العملية
        if (result.type === updateBlogPost.rejected.type) {
            throw new Error(result.payload as string);
        }
        
        // تحديث cache
        dispatch(shouldRefetch());
    }, [dispatch, authState.accessToken, isSuperAdmin]);

    // حذف مقال
    const deletePost = useCallback(async (id: number) => {
        if (!authState.accessToken) {
            throw new Error('Authentication required');
        }

        if (!isSuperAdmin) {
            throw new Error('Unauthorized: Super admin privileges required');
        }

        const result = await dispatch(deleteBlogPost(id));
        
        // تحقق من نجاح العملية
        if (result.type === deleteBlogPost.rejected.type) {
            throw new Error(result.payload as string);
        }
        
        // تحديث cache
        dispatch(shouldRefetch());
    }, [dispatch, authState.accessToken, isSuperAdmin]);

    return {
        // State
        posts: blogState.posts,
        selectedPost: blogState.selectedPost,
        loading: blogState.loading,
        error: blogState.error,
        success: blogState.success,
        lastFetched: blogState.lastFetched,
        
        // Actions
        getBlogPosts,
        getBlogPostById,
        createPost,
        updatePost,
        deletePost,
        setSelectedPost: (post: BlogPost | null) => dispatch(setSelectedPost(post)),
        
        // Utils
        clearError: () => dispatch(clearError()),
        clearSuccess: () => dispatch(clearSuccess()),
        resetBlogState: () => dispatch(resetBlogState()),
        
        // Permissions
        isSuperAdmin,
        isAuthenticated: !!authState.accessToken,
        hasPermission: isSuperAdmin,
        
        // Helpers
        formatDate: (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        generateUrlFromTitle: (title: string) => {
            return title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .substring(0, 50);
        }
    };
};