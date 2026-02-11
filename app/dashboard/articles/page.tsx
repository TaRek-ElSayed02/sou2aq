// 'use client';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Plus, X, Edit, Trash2, BookOpen, ArrowRight } from 'lucide-react';
// import { useUser } from '../../hooks/useUser';
// import RichTextEditor from '../../Components/RichTextEditor/Richbox';

// interface Article {
//   id: number;
//   title: string;
//   description: string;
//   content: string;
//   image?: string;
//   imgAlt?: string;
//   category?: string;
//   tags?: string[];
//   author?: string;
//   siteId?: number | string;
//   created_at?: string;
// }

// const ArticlesPage = () => {
//   const { currentUser, isAdmin } = useUser() as any;
//   const [articles, setArticles] = useState<Article[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [siteIdState, setSiteIdState] = useState<string | number | null>(null);

//   const [editModal, setEditModal] = useState<{ isOpen: boolean; data: Partial<Article> & { tagsString?: string } | null; mode: 'add' | 'edit'; }>({ isOpen: false, data: null, mode: 'add' });
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

//   // attempt to derive siteId from user object in multiple shapes
//   const getSiteIdFromUser = () => {
//     if (!currentUser) return null;
//     return (
//       // Only consider explicit site fields. DO NOT fall back to user.id/_id (that's the user id)
//       currentUser.siteId ||
//       currentUser.site?.id ||
//       currentUser.accountInfo?.siteId ||
//       currentUser.accountInfo?.site ||
//       null
//     ) as any;
//   };

//   const siteIdFromUser = getSiteIdFromUser();
//   const siteId = siteIdState ?? siteIdFromUser;

//   useEffect(() => {
//     console.log('ArticlesPage - currentUser:', currentUser);
//     console.log('ArticlesPage - resolved siteId (state):', siteIdState);
//     console.log('ArticlesPage - fallback siteId from user object:', siteIdFromUser);
//   }, [currentUser, siteId]);

//   // If we don't have a siteId from the user object, fetch sites for the user and pick the first one
//   useEffect(() => {
//     const resolveSiteForUser = async () => {
//       try {
//         if (!currentUser) return;
//         // if siteId already resolved from user object, skip
//         if (siteIdFromUser) return;
//         const userId = (currentUser.user_id || currentUser.id || currentUser._id) as string | undefined;
//         if (!userId) return;
//         const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
//         const res = await axios.get(`http://localhost:5000/api/site/user/${userId}/sites`, {
//           headers: { Authorization: token ? `Bearer ${token}` : '' }
//         });
//         const respData = res.data?.data;
//         // Expected shape: { user_id: '...', site_ids: ['id1', ...] }
//         if (respData) {
//           if (Array.isArray(respData.site_ids) && respData.site_ids.length > 0) {
//             const firstSiteId = respData.site_ids[0];
//             setSiteIdState(firstSiteId);
//             console.log('ArticlesPage - resolved siteId from API (site_ids):', firstSiteId);
//           } else if (Array.isArray(respData) && respData.length > 0) {
//             const first = respData[0];
//             const firstSiteId = first.id ?? first._id ?? first;
//             setSiteIdState(firstSiteId);
//             console.log('ArticlesPage - resolved siteId from API (array fallback):', firstSiteId);
//           } else {
//             console.warn('ArticlesPage - unexpected sites response shape:', respData);
//           }
//         } else {
//           console.warn('ArticlesPage - no data in API response for user:', userId);
//         }
//       } catch (err) {
//         console.error('ArticlesPage - failed to fetch sites for user', err);
//       }
//     };

//     resolveSiteForUser();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentUser]);

//   const fetchArticles = async () => {
//     try {
//       if (!siteId) return setError('No siteId available for current admin');
//       setLoading(true);
//       const res = await axios.get(`http://localhost:5000/api/articles/site/${siteId}`, {
//         headers: { Authorization: token ? `Bearer ${token}` : '' }
//       });
//       setArticles(res.data.data || []);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || err.message || 'Failed to fetch articles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchArticles();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [siteId]);

//   if (!isAdmin) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
//             <X className="w-10 h-10 text-red-600" />
//           </div>
//           <h2 className="text-2xl font-bold">Access Denied</h2>
//           <p className="text-gray-600 mt-2">This page is for admins only.</p>
//         </div>
//       </div>
//     );
//   }

//   const openAdd = () => setEditModal({ isOpen: true, data: { title: '', description: '', content: '', image: '', imgAlt: '', category: '', url: '', tagsString: '', author: currentUser?.fullName || 'Admin' }, mode: 'add' });
//   const openEdit = (a: Article) => setEditModal({ isOpen: true, data: { ...a, tagsString: Array.isArray(a.tags) ? a.tags.join(', ') : (typeof a.tags === 'string' ? a.tags : ''), url: a.url || '' }, mode: 'edit' });

//   const handleSave = async (data: Partial<Article>) => {
//     try {
//       setLoading(true);
//       const form = new FormData();
//       // attach fields
//       // support tags as comma-separated string via tagsString
//       const copy: any = { ...data } as any;
//       if (copy.tagsString !== undefined) {
//         copy.tags = copy.tagsString; // backend expects comma-separated string or array; preserve as string
//         delete copy.tagsString;
//       }
//       const fields: any = { ...copy, siteId };
//       Object.keys(fields).forEach(key => {
//         const val = (fields as any)[key];
//         if (val === undefined || val === null) return;
//         if (key === 'tags' && Array.isArray(val)) {
//           form.append('tags', val.join(','));
//           return;
//         }
//         if (key === 'image' && val instanceof File) {
//           form.append('image', val);
//           return;
//         }
//         form.append(key, String(val));
//       });

//       if (editModal.mode === 'add') {
//         const res = await axios.post('http://localhost:5000/api/articles', form, { headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'multipart/form-data' } });
//         setArticles(prev => [res.data.data, ...prev]);
//       } else if (editModal.mode === 'edit' && data.id) {
//         const res = await axios.patch(`http://localhost:5000/api/articles/${data.id}`, form, { headers: { Authorization: token ? `Bearer ${token}` : '', 'Content-Type': 'multipart/form-data' } });
//         setArticles(prev => prev.map(p => (p.id === res.data.data.id ? res.data.data : p)));
//       }

//       setEditModal({ isOpen: false, data: null, mode: 'add' });
//     } catch (err: any) {
//       setError(err?.response?.data?.message || err.message || 'Save failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       setLoading(true);
//       await axios.delete(`http://localhost:5000/api/articles/${id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
//       setArticles(prev => prev.filter(p => p.id !== id));
//       setDeleteId(null);
//     } catch (err: any) {
//       setError(err?.response?.data?.message || err.message || 'Delete failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
//       <div className="mb-6 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <BookOpen className="w-8 h-8 text-blue-600" />
//           <div>
//               <h1 className="text-2xl font-bold">Articles (Admin)</h1>
//               <p className="text-gray-600 text-sm">Manage articles for your site</p>
//               <p className="text-xs text-gray-400 mt-1">Debug siteId: {siteId ?? 'none'}</p>
//             </div>
//         </div>
//         <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
//           <Plus className="w-4 h-4" /> New Article
//         </button>
//       </div>

//       {error && <div className="mb-4 text-red-600">{error}</div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {articles.map(a => (
//           <div key={a.id} className="bg-white rounded-2xl overflow-hidden shadow border border-gray-200 flex flex-col">
//             <div className="relative h-44 overflow-hidden">
//               {a.image ? <img src={a.image.startsWith('http') ? a.image : `http://localhost:5000${a.image}`} alt={a.imgAlt} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center">No image</div>}
//             </div>
//             <div className="p-4 flex flex-col flex-grow">
//               <h3 className="font-bold text-lg mb-1">{a.title}</h3>
//               <p className="text-sm text-gray-600 mb-3 line-clamp-2">{a.description}</p>
//               <div className="mt-auto flex gap-2 pt-4 border-t">
//                 <button onClick={() => openEdit(a)} className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
//                   <Edit className="w-4 h-4" /> Edit
//                 </button>
//                 <button onClick={() => setDeleteId(a.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center">
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add/Edit Modal */}
//       {editModal.isOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl w-[90vw] max-w-4xl max-h-[95vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
//               <h2 className="text-xl font-bold">{editModal.mode === 'add' ? 'Add Article' : 'Edit Article'}</h2>
//               <button onClick={() => setEditModal({ isOpen: false, data: null, mode: 'add' })} className="p-2"><X /></button>
//             </div>
//             <div className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Title *</label>
//                 <input className="w-full px-4 py-3 border rounded-lg" value={editModal.data?.title || ''} onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data!, title: e.target.value } }))} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea className="w-full px-4 py-3 border rounded-lg" value={editModal.data?.description || ''} onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data!, description: e.target.value } }))} />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Content *</label>
//                 <div className="border rounded-lg">
//                   <RichTextEditor value={editModal.data?.content || ''} onChange={(html: string) => setEditModal(prev => ({ ...prev, data: { ...prev.data!, content: html } }))} />
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Image</label>
//                   <input type="file" accept="image/*" onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) setEditModal(prev => ({ ...prev, data: { ...prev!.data!, image: file } }));
//                   }} />
//                   {editModal.data?.image && typeof editModal.data.image === 'string' && (
//                     <img src={editModal.data.image.startsWith('data:') ? editModal.data.image : `http://localhost:5000${editModal.data.image}`} alt="preview" className="mt-2 w-full h-36 object-cover rounded" />
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Image Alt</label>
//                   <input className="w-full px-4 py-3 border rounded-lg" value={editModal.data?.imgAlt || ''} onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev!.data!, imgAlt: e.target.value } }))} />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">URL Slug</label>
//                   <input
//                     type="text"
//                     value={editModal.data?.url || ''}
//                     onChange={(e) => {
//                       const raw = e.target.value;
//                       const slug = raw
//                         .toLowerCase()
//                         .trim()
//                         .replace(/\s+/g, '-')
//                         .replace(/[^a-z0-9-]/g, '')
//                         .replace(/-+/g, '-');
//                       setEditModal(prev => ({ ...prev, data: { ...prev!.data!, url: slug } }));
//                     }}
//                     className="w-full px-4 py-3 border rounded-lg"
//                     placeholder="to-be-like-that"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
//                   <input
//                     type="text"
//                     value={editModal.data?.tagsString || ''}
//                     onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev!.data!, tagsString: e.target.value } }))}
//                     className="w-full px-4 py-3 border rounded-lg"
//                     placeholder="tag1, tag2, tag3"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-3 justify-end mt-6">
//                 <button onClick={() => setEditModal({ isOpen: false, data: null, mode: 'add' })} className="px-4 py-2 border rounded-lg">Cancel</button>
//                 <button onClick={() => handleSave(editModal.data || {})} className="px-4 py-2 bg-slate-800 text-white rounded-lg">{editModal.mode === 'add' ? 'Add' : 'Save'}</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete confirm */}
//       {deleteId !== null && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-lg font-bold mb-2">Delete Article</h3>
//             <p className="text-gray-600 mb-4">Are you sure you want to delete this article?</p>
//             <div className="flex gap-3 justify-end">
//               <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg">Cancel</button>
//               <button onClick={() => handleDelete(deleteId!)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow">Loading...</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArticlesPage;
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, X, Edit, Trash2, BookOpen, Image as ImageIcon, Tag, User, Folder, Link, FileText } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import RichTextEditor from '../../Components/RichTextEditor/Richbox';

interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  image?: string;
  imgAlt?: string;
  category?: string;
  tags?: string[] | string;
  author?: string;
  url?: string;
  siteId?: number | string;
  created_at?: string;
}

// دالة مساعدة لتحويل التاجات
const normalizeTags = (tags: string[] | string | undefined): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
  }
  return [];
};

const ArticlesPage = () => {
  const { currentUser, isAdmin } = useUser() as any;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteIdState, setSiteIdState] = useState<string | number | null>(null);

  const [editModal, setEditModal] = useState<{ 
    isOpen: boolean; 
    data: Partial<Article> & { tagsString?: string } | null; 
    mode: 'add' | 'edit'; 
  }>({ 
    isOpen: false, 
    data: null, 
    mode: 'add' 
  });
  
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const getSiteIdFromUser = () => {
    if (!currentUser) return null;
    return (
      currentUser.siteId ||
      currentUser.site?.id ||
      currentUser.accountInfo?.siteId ||
      currentUser.accountInfo?.site ||
      null
    ) as any;
  };

  const siteIdFromUser = getSiteIdFromUser();
  const siteId = siteIdState ?? siteIdFromUser;

  useEffect(() => {
    const resolveSiteForUser = async () => {
      try {
        if (!currentUser) return;
        if (siteIdFromUser) return;
        const userId = (currentUser.user_id || currentUser.id || currentUser._id) as string | undefined;
        if (!userId) return;
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const res = await axios.get(`http://localhost:5000/api/site/user/${userId}/sites`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        const respData = res.data?.data;
        if (respData) {
          if (Array.isArray(respData.site_ids) && respData.site_ids.length > 0) {
            const firstSiteId = respData.site_ids[0];
            setSiteIdState(firstSiteId);
          } else if (Array.isArray(respData) && respData.length > 0) {
            const first = respData[0];
            const firstSiteId = first.id ?? first._id ?? first;
            setSiteIdState(firstSiteId);
          }
        }
      } catch (err) {
        console.error('ArticlesPage - failed to fetch sites for user', err);
      }
    };

    resolveSiteForUser();
  }, [currentUser, siteIdFromUser]);

  const fetchArticles = async () => {
    try {
      if (!siteId) return setError('No siteId available for current admin');
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/articles/site/${siteId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      
      // معالجة التاجات قبل حفظها في state
      const articlesWithProcessedTags = (res.data.data || []).map((article: Article) => ({
        ...article,
        // نعرض التاجات كمصفوفة مهيأة للعرض
        _displayTags: normalizeTags(article.tags)
      }));
      
      setArticles(articlesWithProcessedTags);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [siteId]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-600 mt-2">This page is for admins only.</p>
        </div>
      </div>
    );
  }

  const openAdd = () => setEditModal({ 
    isOpen: true, 
    data: { 
      title: '', 
      description: '', 
      content: '', 
      image: '', 
      imgAlt: '', 
      category: '',
      url: '', 
      tagsString: '', 
      author: currentUser?.fullName || '' 
    }, 
    mode: 'add' 
  });
  
  const openEdit = (a: Article) => {
    const tagsArray = normalizeTags(a.tags);
    setEditModal({ 
      isOpen: true, 
      data: { 
        ...a, 
        tagsString: tagsArray.join(', '),
        url: a.url || '' 
      }, 
      mode: 'edit' 
    });
  };

  const handleSave = async (data: Partial<Article>) => {
    try {
      setLoading(true);
      const form = new FormData();
      const copy: any = { ...data };
      
      // تحويل التاجات من string إلى array مع تنظيف
      if (copy.tagsString !== undefined) {
        if (copy.tagsString.trim() === '') {
          copy.tags = [];
        } else {
          copy.tags = copy.tagsString
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag !== '')
            .filter((tag: string, index: number, self: string[]) => 
              self.indexOf(tag) === index
            );
        }
        delete copy.tagsString;
      }
      
      // إضافة siteId
      copy.siteId = siteId;
      
      // إضافة جميع الحقول المطلوبة إلى الفورم
      const fieldsToSend = ['title', 'content', 'description', 'category', 'author', 'imgAlt', 'url', 'tags', 'siteId'];
      
      fieldsToSend.forEach(key => {
        const val = copy[key];
        if (val !== undefined && val !== null) {
          if (key === 'tags' && Array.isArray(val)) {
            form.append('tags', val.join(','));
          } else {
            form.append(key, String(val));
          }
        }
      });
      
      // إضافة الصورة إذا كانت موجودة
      if (copy.image instanceof File) {
        form.append('image', copy.image);
      } else if (copy.image && typeof copy.image === 'string' && copy.image !== '') {
        form.append('image', copy.image);
      }

      if (editModal.mode === 'add') {
        const res = await axios.post('http://localhost:5000/api/articles', form, { 
          headers: { 
            Authorization: token ? `Bearer ${token}` : '', 
            'Content-Type': 'multipart/form-data' 
          } 
        });
        setArticles(prev => [res.data.data, ...prev]);
      } else if (editModal.mode === 'edit' && data.id) {
        const res = await axios.patch(`http://localhost:5000/api/articles/${data.id}`, form, { 
          headers: { 
            Authorization: token ? `Bearer ${token}` : '', 
            'Content-Type': 'multipart/form-data' 
          } 
        });
        setArticles(prev => prev.map(p => (p.id === res.data.data.id ? res.data.data : p)));
      }

      setEditModal({ isOpen: false, data: null, mode: 'add' });
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/articles/${id}`, { 
        headers: { Authorization: token ? `Bearer ${token}` : '' } 
      });
      setArticles(prev => prev.filter(p => p.id !== id));
      setDeleteId(null);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Articles Management</h1>
            <p className="text-gray-600 text-sm">Create and manage articles for your site</p>
          </div>
        </div>
        <button 
          onClick={openAdd} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No articles yet</h3>
          <p className="text-gray-500 mb-6">Start by creating your first article</p>
          <button 
            onClick={openAdd} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create First Article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(a => {
            const displayTags = normalizeTags(a.tags);
            
            return (
              <div key={a.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {a.image ? (
                    <img 
                      src={a.image.startsWith('http') ? a.image : `http://localhost:5000${a.image}`} 
                      alt={a.imgAlt || a.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {a.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      {a.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{a.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{a.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {a.author && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{a.author}</span>
                      </div>
                    )}
                    
                    {a.category && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Folder className="w-3 h-3" />
                        <span>{a.category}</span>
                      </div>
                    )}
                  </div>
                  
                  {displayTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {displayTags.slice(0, 2).map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                        >
                          {tag}
                        </span>
                      ))}
                      {displayTags.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{displayTags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => openEdit(a)} 
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button 
                      onClick={() => setDeleteId(a.id)} 
                      className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Add/Edit Modal - 75% width, black background, scrollable */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-[75vw] h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  {editModal.mode === 'add' ? (
                    <Plus className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Edit className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editModal.mode === 'add' ? 'Create New Article' : 'Edit Article'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Fill in all required fields (*)
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditModal({ isOpen: false, data: null, mode: 'add' })} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Title */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        value={editModal.data?.title || ''} 
                        onChange={(e) => setEditModal(prev => ({ 
                          ...prev, 
                          data: { ...prev.data!, title: e.target.value } 
                        }))}
                        placeholder="Enter article title"
                        required
                      />
                    </div>

                    {/* Author & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          Author
                        </label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                          value={editModal.data?.author || ''} 
                          onChange={(e) => setEditModal(prev => ({ 
                            ...prev, 
                            data: { ...prev.data!, author: e.target.value } 
                          }))}
                          placeholder="Author name"
                        />
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Folder className="w-4 h-4 text-blue-600" />
                          Category
                        </label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                          value={editModal.data?.category || ''} 
                          onChange={(e) => setEditModal(prev => ({ 
                            ...prev, 
                            data: { ...prev.data!, category: e.target.value } 
                          }))}
                          placeholder="e.g., Technology, Health"
                        />
                      </div>
                    </div>

                    {/* URL Slug */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Link className="w-4 h-4 text-blue-600" />
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={editModal.data?.url || ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const slug = raw
                            .toLowerCase()
                            .trim()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9-]/g, '')
                            .replace(/-+/g, '-');
                          setEditModal(prev => ({ 
                            ...prev, 
                            data: { ...prev.data!, url: slug } 
                          }));
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white font-mono"
                        placeholder="article-url-slug"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Will be formatted automatically. Spaces become hyphens. Example: "my article" → "my-article"
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-600" />
                        Tags
                      </label>
                      <input
                        type="text"
                        value={editModal.data?.tagsString || ''}
                        onChange={(e) => setEditModal(prev => ({ 
                          ...prev, 
                          data: { ...prev.data!, tagsString: e.target.value } 
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        placeholder="tag1, tag2, tag3"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Separate tags with commas
                      </p>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <textarea 
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white resize-none"
                        value={editModal.data?.description || ''} 
                        onChange={(e) => setEditModal(prev => ({ 
                          ...prev, 
                          data: { ...prev.data!, description: e.target.value } 
                        }))}
                        placeholder="Brief description of the article"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-600" />
                        Featured Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setEditModal(prev => ({ 
                                ...prev, 
                                data: { ...prev.data!, image: file } 
                              }));
                            }
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600 mb-1">Click to upload image</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </label>
                      </div>
                      
                      {editModal.data?.image && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <div className="relative">
                            <img 
                              src={editModal.data.image instanceof File ? 
                                URL.createObjectURL(editModal.data.image) : 
                                editModal.data.image.startsWith('data:') ? 
                                  editModal.data.image : 
                                  `http://localhost:5000${editModal.data.image}`
                              } 
                              alt="preview" 
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => setEditModal(prev => ({ 
                                ...prev, 
                                data: { ...prev.data!, image: '' } 
                              }))}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Image Alt Text */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Alt Text
                      </label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                        value={editModal.data?.imgAlt || ''} 
                        onChange={(e) => setEditModal(prev => ({ 
                          ...prev, 
                          data: { ...prev.data!, imgAlt: e.target.value } 
                        }))}
                        placeholder="Description for accessibility and SEO"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Important for SEO and accessibility. Describe what's in the image.
                      </p>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <RichTextEditor 
                          value={editModal.data?.content || ''} 
                          onChange={(html: string) => setEditModal(prev => ({ 
                            ...prev, 
                            data: { ...prev.data!, content: html } 
                          }))} 
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Main article content. This field is required.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Fields marked with <span className="text-red-500">*</span> are required
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setEditModal({ isOpen: false, data: null, mode: 'add' })} 
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSave(editModal.data || {})}
                        disabled={!editModal.data?.title || !editModal.data?.content}
                        className={`px-6 py-3 rounded-lg transition-all ${
                          !editModal.data?.title || !editModal.data?.content
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                        }`}
                      >
                        {editModal.mode === 'add' ? 'Create Article' : 'Update Article'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Black background */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-3">Delete Article</h3>
            <p className="text-gray-600 text-center mb-8">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteId!)} 
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;