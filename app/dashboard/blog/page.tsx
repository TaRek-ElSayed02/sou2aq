'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Search, Filter, Edit, Trash2, Plus, X, Tag, Clock,
    ChevronDown, ChevronUp, BookOpen, Calendar,
    User, Eye, MessageSquare, ArrowRight, Heart, Bookmark
} from 'lucide-react';
import { useBlog } from '../../hooks/useBlog';
import { useLanguage } from '../../context/LanguageContext';

// أنواع البيانات
interface EditModalData {
    id?: number;
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    imgAlt: string;
    category: string;
    author: string;
    tags: string[];
}

const BlogPage = () => {
    // استخدام الـ hook الخاص بالمقالات
    const {
        posts,
        selectedPost,
        loading,
        error,
        success,
        isSuperAdmin,
        hasPermission,
        getBlogPosts,
        getBlogPostById,
        createPost,
        updatePost,
        deletePost,
        setSelectedPost,
        clearError,
        clearSuccess,
        formatDate,
        generateUrlFromTitle
    } = useBlog();
    
    const { t } = useLanguage();

    // الحالات المحلية
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [showFilters, setShowFilters] = useState(false);
    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        data: EditModalData | null;
        mode: 'add' | 'edit';
    }>({
        isOpen: false,
        data: null,
        mode: 'edit'
    });
    const [sortBy, setSortBy] = useState<'date' | 'views' | 'likes'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        postId: number | null;
        postTitle: string;
    }>({
        isOpen: false,
        postId: null,
        postTitle: ''
    });
    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        show: false,
        message: '',
        type: 'success'
    });

    // جلب المقالات عند تحميل المكون
    useEffect(() => {
        const loadPosts = async () => {
            try {
                if (hasPermission) {
                    await getBlogPosts();
                }
            } catch (err: any) {
                showToast(err.message || 'Failed to load posts', 'error');
            }
        };

        loadPosts();
    }, [hasPermission, getBlogPosts]);

    // عرض إشعارات من Redux
    useEffect(() => {
        if (success) {
            showToast(success, 'success');
            clearSuccess();
        }
        if (error) {
            showToast(error, 'error');
            clearError();
        }
    }, [success, error, clearSuccess, clearError]);

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

    // فتح مودال إضافة مقال جديد
    const openAddModal = () => {
        if (!hasPermission) {
            showToast('Unauthorized: Super admin privileges required', 'error');
            return;
        }

        setEditModal({
            isOpen: true,
            data: {
                title: '',
                description: '',
                content: '',
                url: '',
                image: '',
                imgAlt: '',
                category: '',
                author: 'Admin',
                tags: []
            },
            mode: 'add'
        });
    };

    // فتح مودال التعديل
    const openEditModal = (post: any) => {
        if (!hasPermission) {
            showToast('Unauthorized: Super admin privileges required', 'error');
            return;
        }

        setEditModal({
            isOpen: true,
            data: {
                id: post.id,
                title: post.title,
                description: post.description,
                content: post.content,
                url: post.url,
                image: post.image || '', // عرض الصورة القديمة
                imgAlt: post.imgAlt || '',
                category: post.category,
                author: post.author,
                tags: post.tags || []
            },
            mode: 'edit'
        });
    };

    // فتح مودال الحذف
    const openDeleteModal = (postId: number, postTitle: string) => {
        if (!hasPermission) {
            showToast('Unauthorized: Super admin privileges required', 'error');
            return;
        }

        setDeleteModal({
            isOpen: true,
            postId,
            postTitle
        });
    };

    // حذف المقال
    const handleDeletePost = async () => {
        if (!deleteModal.postId || !hasPermission) return;

        try {
            console.log('Deleting post with ID:', deleteModal.postId);
            await deletePost(deleteModal.postId);
            showToast(`تم حذف المقال "${deleteModal.postTitle}" بنجاح`, 'success');
        } catch (err: any) {
            console.error('Delete error:', err);
            showToast(err.message || 'Failed to delete post', 'error');
        }

        setDeleteModal({
            isOpen: false,
            postId: null,
            postTitle: ''
        });
    };

    // حفظ التعديلات أو إضافة مقال جديد
    const handleSaveEdit = async (updatedData: EditModalData) => {
        try {
            if (!hasPermission) {
                throw new Error('Unauthorized: Super admin privileges required');
            }

            if (!updatedData.title.trim()) {
                throw new Error('عنوان المقال مطلوب');
            }

            if (!updatedData.description.trim()) {
                throw new Error('وصف المقال مطلوب');
            }

            if (!updatedData.content.trim()) {
                throw new Error('محتوى المقال مطلوب');
            }

            // التحقق من وجود صورة في حالة الإضافة الجديدة
            if (editModal.mode === 'add' && !updatedData.image) {
                throw new Error('صورة المقال مطلوبة');
            }

            // تحديد إذا كان هناك ملف صورة جديد
            let imageFile: File | undefined;
            const urlMatch = updatedData.image.match(/^data:(image\/[^;]+);base64,(.+)$/);
            if (urlMatch) {
                // تحويل base64 إلى File
                const mimeType = urlMatch[1];
                const base64Data = urlMatch[2];
                const byteCharacters = atob(base64Data);
                const byteArrays = [];
                
                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                
                const blob = new Blob(byteArrays, { type: mimeType });
                imageFile = new File([blob], `image_${Date.now()}.jpg`, { type: mimeType });
            }

            // تجهيز البيانات - لا نُرسل الصورة كـ string إذا كانت base64
            const { image: _, ...postDataWithoutImage } = updatedData;
            const postData = {
                ...postDataWithoutImage,
                url: updatedData.url || generateUrlFromTitle(updatedData.title)
            };

            if (editModal.mode === 'edit' && updatedData.id) {
                console.log('Updating post with ID:', updatedData.id);
                await updatePost(updatedData.id, postData, imageFile);
                showToast('تم تحديث المقال بنجاح', 'success');
            } else {
                console.log('Creating new post');
                await createPost(postData, imageFile);
                showToast('تم إنشاء المقال بنجاح', 'success');
            }

            setEditModal({ isOpen: false, data: null, mode: 'edit' });
        } catch (err: any) {
            console.error('Save error:', err);
            showToast(err.message || 'Failed to save post', 'error');
        }
    };

    // استخراج التصنيفات والتاجات الفريدة
    const allCategories = useMemo(() => {
        return ['All', ...Array.from(new Set(posts.map(p => p.category)))];
    }, [posts]);

    const allTags = useMemo(() => {
        return Array.from(new Set(posts.flatMap(p => p.tags || [])));
    }, [posts]);

    // فلترة وترتيب المقالات
    const filteredPosts = useMemo(() => {
        return posts
            .filter(post => {
                const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
                const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => {
                const multiplier = sortOrder === 'asc' ? 1 : -1;

                switch (sortBy) {
                    case 'views':
                        return (a.views - b.views) * multiplier;
                    case 'likes':
                        return (a.likes - b.likes) * multiplier;
                    case 'date':
                    default:
                        const dateA = a.created_at || a.date;
                        const dateB = b.created_at || b.date;
                        return (new Date(dateA).getTime() - new Date(dateB).getTime()) * multiplier;
                }
            });
    }, [posts, searchTerm, selectedCategory, sortBy, sortOrder]);

    // إذا لم يكن المستخدم لديه الصلاحيات
    if (!hasPermission) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <X className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h2>
                    <p className="text-gray-600 text-center max-w-md mb-8">
                        You don't have permission to access this page. Super admin privileges are required to manage blog posts.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-8 flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-700 font-medium">Loading posts...</p>
                    </div>
                </div>
            )}

            {/* العنوان الرئيسي */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">{t("dashboard.blog.title")}</h1>
                        </div>
                        <p className="text-gray-600">{t("dashboard.blog.manage")}</p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        {t("dashboard.blog.addNewPost")}
                    </button>
                </div>
            </div>

            {/* شريط البحث والفلترة */}
            <div className="bg-white rounded-xl p-4 md:p-6 mb-6 shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={t("dashboard.blog.searchByTitle")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-5 h-5" />
                            {t("dashboard.blog.filters")}
                            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'views' | 'likes')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="date">{t("dashboard.blog.sortByDate")}</option>
                            <option value="views">{t("dashboard.blog.sortByViews")}</option>
                            <option value="likes">{t("dashboard.blog.sortByLikes")}</option>
                        </select>

                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {sortOrder === 'asc' ? t("dashboard.blog.ascending") : t("dashboard.blog.descending")}
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t("dashboard.blog.category")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allCategories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${selectedCategory === category
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t("dashboard.blog.tags")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allTags.slice(0, 10).map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchTerm(tag)}
                                            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${searchTerm === tag
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">{t("dashboard.blog.quickFilters")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('All');
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full hover:from-blue-100 hover:to-blue-200 transition-colors"
                                    >
                                        {t("dashboard.blog.resetFilters")}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            try {
                                                await getBlogPosts(true);
                                                showToast('Posts refreshed successfully', 'success');
                                            } catch (err: any) {
                                                showToast(err.message || 'Failed to refresh posts', 'error');
                                            }
                                        }}
                                        className="px-3 py-1.5 text-sm bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-full hover:from-green-100 hover:to-green-200 transition-colors"
                                    >
                                        {t("dashboard.blog.refreshData")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-600">
                    {t("dashboard.blog.showing")} <span className="font-semibold">{filteredPosts.length}</span> {t("dashboard.blog.posts")}
                    {posts.length > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                            ({t("dashboard.blog.lastUpdated")}: {formatDate(new Date().toISOString())})
                        </span>
                    )}
                </p>
                <div className="text-sm text-gray-500">
                    {t("dashboard.blog.sortedBy")} {sortBy} ({sortOrder === 'desc' ? t("dashboard.blog.newestFirst") : t("dashboard.blog.oldestFirst")})
                </div>
            </div>

            {/* شبكة المقالات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-gray-200 flex flex-col"
                    >
                        {/* صورة المقال */}
                        <div
                            className="relative h-48 overflow-hidden"
                            onClick={() => setSelectedPost(post)}
                        >
                            <img
                                src={`http://localhost:5000${post.image}`}
                                alt={post.imgAlt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* محتوى المقال */}
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="mb-3">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                                    <Tag className="w-3 h-3" />
                                    {post.category}
                                </span>
                            </div>

                            <h3
                                className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer"
                                onClick={() => setSelectedPost(post)}
                            >
                                {post.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {post.description}
                            </p>

                            {/* معلومات المقال */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(post.created_at || post.date)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* التاجات */}
                            {post.tags && (Array.isArray(post.tags) ? post.tags.length > 0 : false) && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {(Array.isArray(post.tags) ? post.tags : []).slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                            +{post.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* أزرار التحكم */}
                            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                                <button
                                    onClick={() => setSelectedPost(post)}
                                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium hover:from-blue-100 hover:to-blue-200 transition-all flex items-center justify-center gap-2 group/read"
                                >
                                    Read More
                                    <ArrowRight className="w-4 h-4 group-hover/read:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(post);
                                    }}
                                    className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(post.id, post.title);
                                    }}
                                    className="px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPosts.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-600 text-center max-w-md mx-auto mb-6">
                        {posts.length === 0
                            ? "You haven't created any blog posts yet. Start by adding your first post."
                            : "Try adjusting your search or filter criteria"}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 transition-all"
                        >
                            Clear all filters
                        </button>
                        {posts.length === 0 && (
                            <button
                                onClick={openAddModal}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add Your First Post
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Post Details Modal */}
            {selectedPost && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto"
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {selectedPost.category}
                                    </span>
                                    <span className="text-sm text-gray-500">By {selectedPost.author}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="p-3 hover:bg-gray-100 rounded-full transition-all hover:scale-110"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="mb-8">
                                <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-xl mb-6">
                                    <img
                                        src={`http://localhost:5000${selectedPost.image}`}
                                        alt={selectedPost.imgAlt}
                                        className="w-full h-64 object-cover"
                                    />
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{selectedPost.description}</p>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Content</h3>
                                    <div className="prose max-w-none text-gray-700 leading-relaxed prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-lg prose-strong:font-bold prose-em:italic prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-a:text-blue-600 prose-a:hover:underline">
                                        <div dangerouslySetInnerHTML={{
                                            __html: selectedPost.content
                                                .replace(/\n/g, '<br />')
                                        }} />
                                    </div>
                                </div>

                                {selectedPost.tags && selectedPost.tags.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedPost.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-blue-300 transition-colors"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Eye className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Views</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{selectedPost.views}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Heart className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Likes</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{selectedPost.likes}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MessageSquare className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">Comments</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{selectedPost.comments}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        setSelectedPost(null);
                                        openEditModal(selectedPost);
                                    }}
                                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Edit className="w-5 h-5" />
                                    Edit Post
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedPost(null);
                                        openDeleteModal(selectedPost.id, selectedPost.title);
                                    }}
                                    className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete
                                </button>
                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit/Add Modal */}
            {editModal.isOpen && editModal.data && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editModal.mode === 'add' ? 'Add New Post' : 'Edit Post'}
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        {editModal.mode === 'add' ? 'Create a new blog post' : 'Update post details and content'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditModal({ isOpen: false, data: null, mode: 'edit' })}
                                    className="p-3 hover:bg-gray-100 rounded-xl transition-all hover:scale-110"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.title}
                                            onChange={(e) => {
                                                const title = e.target.value;
                                                const slug = title
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')
                                                    .replace(/[^a-z0-9-]/g, '')
                                                    .substring(0, 50);
                                                setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, title, url: slug }
                                                }));
                                            }}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Enter post title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            URL Slug
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.url}
                                            onChange={(e) => {
                                                const url = e.target.value
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')
                                                    .replace(/[^a-z0-9-]/g, '')
                                                    .substring(0, 50);
                                                setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, url }
                                                }));
                                            }}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="url-slug"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Category *
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.category}
                                            onChange={(e) => setEditModal(prev => ({
                                                ...prev,
                                                data: { ...prev.data!, category: e.target.value }
                                            }))}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="e.g., Technology, Design, Programming"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Author *
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.author}
                                            onChange={(e) => setEditModal(prev => ({
                                                ...prev,
                                                data: { ...prev.data!, author: e.target.value }
                                            }))}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Author name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Description *
                                    </label>
                                    <textarea
                                        value={editModal.data.description}
                                        onChange={(e) => setEditModal(prev => ({
                                            ...prev,
                                            data: { ...prev.data!, description: e.target.value }
                                        }))}
                                        rows={3}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                        placeholder="Brief description of the post"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Content *
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 mb-2">Editor</p>
                                            <textarea
                                                value={editModal.data.content}
                                                onChange={(e) => setEditModal(prev => ({
                                                    ...prev,
                                                    data: { ...prev.data!, content: e.target.value }
                                                }))}
                                                rows={8}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none font-mono"
                                                placeholder="Write your post content here..."
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 mb-2">Preview</p>
                                            <div className="prose max-w-none text-gray-700 leading-relaxed prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-lg prose-strong:font-bold prose-em:italic prose-code:bg-gray-200 prose-code:px-1 prose-code:rounded prose-a:text-blue-600 prose-a:hover:underline p-4 border-2 border-gray-200 rounded-xl bg-gray-50 overflow-auto h-96">
                                                <div dangerouslySetInnerHTML={{
                                                    __html: editModal.data.content.replace(/\n/g, '<br />')
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Post Image *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (event) => {
                                                            setEditModal(prev => ({
                                                                ...prev,
                                                                data: { ...prev.data!, image: event.target?.result as string }
                                                            }));
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                                            />
                                            <p className="mt-2 text-sm text-gray-500">
                                                Upload image (JPG, PNG, GIF, etc.)
                                            </p>
                                            
                                            {editModal.data.image && (
                                                <div className="mt-4">
                                                    <img
                                                        src={editModal.data.image.startsWith('data:') ? editModal.data.image : `http://localhost:5000${editModal.data.image}`}
                                                        alt="Preview"
                                                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Image Alt Text
                                        </label>
                                        <input
                                            type="text"
                                            value={editModal.data.imgAlt}
                                            onChange={(e) => setEditModal(prev => ({
                                                ...prev,
                                                data: { ...prev.data!, imgAlt: e.target.value }
                                            }))}
                                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Description of the image for accessibility"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        key={`tags-${editModal.mode}`}
                                        defaultValue={editModal.data.tags.join(', ')}
                                        onBlur={(e) => {
                                            const input = e.currentTarget.value;
                                            const tags = input
                                                .split(',')
                                                .map(tag => tag.trim())
                                                .filter(tag => tag.length > 0);
                                            setEditModal(prev => ({
                                                ...prev,
                                                data: { ...prev.data!, tags }
                                            }));
                                        }}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Technology, Web Development, Programming"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Separate tags with commas
                                    </p>
                                </div>

                                <div className="flex justify-end gap-4 pt-8 border-t">
                                    <button
                                        onClick={() => setEditModal({ isOpen: false, data: null, mode: 'edit' })}
                                        className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSaveEdit(editModal.data!)}
                                        className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                    >
                                        {editModal.mode === 'add' ? 'Add Post' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete <span className="font-semibold">"{deleteModal.postTitle}"</span>? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, postId: null, postTitle: '' })}
                                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Delete Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 animate-slide-in">
                    <div className={`rounded-xl shadow-2xl border-l-4 ${toast.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500' :
                        toast.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500' :
                            'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500'} p-4 min-w-80 max-w-md`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' :
                                toast.type === 'error' ? 'bg-red-100 text-red-600' :
                                    'bg-blue-100 text-blue-600'}`}>
                                {toast.type === 'success' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : toast.type === 'error' ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    {toast.type === 'success' ? 'تم بنجاح!' :
                                        toast.type === 'error' ? 'خطأ!' :
                                            'معلومة'}
                                </p>
                                <p className="text-sm text-gray-700 mt-0.5">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => setToast(prev => ({ ...prev, show: false }))}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* الأنماط المخصصة */}
            <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
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
      `}</style>
        </div>
    );
};

export default BlogPage;