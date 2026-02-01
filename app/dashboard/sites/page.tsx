'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Site {
  id: string;
  name: string;
  subdomain: string;
  email: string;
  phone: string;
  image: string;
  imageAlt: string;
  description: string;
  about: string;
  whyUs: string;
  QandA: string;
  privacy_policy: string;
  termsOfUse: string;
  returning: string;
  isActive: string;
  user_id: string;
  createdAt: string;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Site>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { accessToken, user: currentUser } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // استخراج الـ role بطرق متعددة (مثل SideBar)
  const userRole = (currentUser as any)?.role || (currentUser as any)?.accountInfo?.role || (currentUser as any)?.type;
  
  // تحقق من أن المستخدم admin أو superAdmin
  const isAdmin = userRole === 'admin' || userRole === 'superAdmin';
  const isSuperAdmin = userRole === 'superAdmin';

  console.log('🎯 SitesPage rendered');
  console.log('   - currentUser exists:', !!currentUser);
  console.log('   - userRole:', userRole);
  console.log('   - isAdmin:', isAdmin);
  console.log('   - isSuperAdmin:', isSuperAdmin);
  console.log('   - accessToken exists:', !!accessToken);

  // التحقق من أن المستخدم admin أو superAdmin وجلب المواقع
  useEffect(() => {
    // إذا لم تحمل البيانات بعد، انتظر
    if (!currentUser || !accessToken) {
      console.log('⏳ Waiting for user data...');
      setLoading(true);
      return;
    }

    // إذا لم يكن admin أو superAdmin، redirect
    if (!isAdmin) {
      console.log('❌ Not admin. Role:', userRole);
      setLoading(false);
      toast.error('Access denied: Admin role required');
      router.push('/dashboard');
      return;
    }

    // كل شيء جيد، جلب المواقع
    console.log('✅ Authorization passed, fetching sites...');
    setLoading(false);
    fetchSites();
  }, [currentUser, accessToken]);

  const fetchSites = async () => {
    // التحقق من توفر accessToken
    if (!accessToken) {
      console.log('❌ No accessToken available');
      toast.error('No authentication token available');
      return;
    }

    try {
      console.log('🚀 Starting fetchSites...');
      console.log('📋 Token length:', accessToken?.length || 0);
      console.log('🔗 Endpoint: http://localhost:5000/api/site ');
      
      const requestHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
      
      const response = await fetch('http://localhost:5000/api/site ', {
        method: 'GET',
        headers: requestHeaders,
        credentials: 'include',
      });

      console.log('📊 Response Status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Failed to fetch sites';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
          console.error('❌ API Error Response:', errorData);
        } catch (parseErr) {
          try {
            const text = await response.text();
            errorMessage = text || 'Unknown error';
            console.error('❌ Error Response:', text);
          } catch (readErr) {
            console.error('❌ Could not read error response');
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Response Data:', data);
      
      // التحقق من بنية البيانات
      let sitesData: Site[] = [];
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          sitesData = data;
        } else if (data.data && Array.isArray(data.data)) {
          sitesData = data.data;
        } else if (data.sites && Array.isArray(data.sites)) {
          sitesData = data.sites;
        }
      }
      
      console.log('✅ Setting sites, count:', sitesData.length);
      setSites(sitesData);
    //   toast.success(`Loaded ${sitesData.length} sites`);
    } catch (err) {
      console.error('❌ Fetch Error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load sites';
      toast.error(errorMsg);
      setSites([]);
    }
  };

  const handleEditClick = (site: Site) => {
    setEditingSite(site);
    setEditFormData(site);
    setShowEditModal(true);
  };

  const handleDeleteClick = (siteId: string) => {
    setDeletingSiteId(siteId);
    setShowDeleteModal(true);
  };

  const handleEditSave = async () => {
    if (!editingSite) return;

    try {
      // تنظيف البيانات - إزالة الحقول الفارغة والحقول التي لم تتغير
      const dataToSend: Record<string, any> = {};
      
      Object.entries(editFormData).forEach(([key, value]) => {
        // تخطي الحقول التي لا يجب إرسالها
        if (['id', 'user_id', 'createdAt'].includes(key)) {
          return;
        }
        
        // تخطي القيم الفارغة والـ undefined
        if (value !== undefined && value !== null && value !== '') {
          // التأكد من أن البيانات النصية لا تكون فقط مسافات
          if (typeof value === 'string' && value.trim() === '') {
            return;
          }
          dataToSend[key] = value;
        }
      });

      // التأكد من أن هناك حقولاً للتحديث
      if (Object.keys(dataToSend).length === 0) {
        toast.error('Please make changes before saving');
        return;
      }

      console.log('Sending data:', dataToSend);

      const response = await fetch(`http://localhost:5000/api/site/${editingSite.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update site');
      }

      const data = await response.json();
      setSites(sites.map(s => s.id === editingSite.id ? data.data : s));
      setShowEditModal(false);
      toast.success('Site updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update site');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSiteId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/site/${deletingSiteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete site');
      }

      setSites(sites.filter(s => s.id !== deletingSiteId));
      setShowDeleteModal(false);
      toast.success('Site deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete site');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم admin أو superAdmin
  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Access denied</p>
          <p className="text-gray-400 text-sm mt-2">Admin role required</p>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering sites page. Sites count:', sites.length);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Sites</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Manage all created sites</p>
      </div>

      {/* Sites Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-6 md:mx-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Image</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Site Name</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">Subdomain</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">Email</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">Phone</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">Status</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 sticky right-0 bg-gray-50 z-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sites.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50 transition">
                <td className="px-2 md:px-6 py-2 md:py-4">
                  {site.image ? (
                    <img
                      src={`http://localhost:5000${site.image}`}
                      alt={site.imageAlt || site.name}
                      className="w-8 md:w-10 h-8 md:h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded bg-gray-200 flex items-center justify-center">
                      <ImageIcon size={16} className="md:size-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm font-medium text-gray-900">{site.name}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">{site.subdomain}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">{site.email || '-'}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">{site.phone || '-'}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    site.isActive === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {site.isActive === 'yes' ? 'Active' : 'InActive'}
                  </span>
                </td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm sticky right-0 bg-white z-10">
                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => handleEditClick(site)}
                      className="p-1 md:p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                      title="Edit site"
                    >
                      <Edit2 size={16} className="md:size-5" />
                    </button>
                    <a
                      href={`http://${site.subdomain}.localhost:3000`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 md:p-2 hover:bg-green-100 rounded-lg text-green-600 transition"
                      title="View site"
                    >
                      <ExternalLink size={16} className="md:size-5" />
                    </a>
                    <button
                      onClick={() => handleDeleteClick(site.id)}
                      className="p-1 md:p-2 hover:bg-red-100 rounded-lg text-red-600 transition"
                      title="Delete site"
                    >
                      <Trash2 size={16} className="md:size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No sites found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white rounded-t-xl">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Edit Site</h2>
                <p className="text-xs md:text-sm text-gray-600 mt-1">{editingSite.name}</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="md:size-6 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Site Name */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter site name"
                  />
                </div>

                {/* Subdomain */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Subdomain</label>
                  <input
                    type="text"
                    value={editFormData.subdomain || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // السماح بالحروف والأرقام فقط، بدون مسافات
                      const sanitized = value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                      setEditFormData({ ...editFormData, subdomain: sanitized });
                    }}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter subdomain (letters & numbers only)"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      // السماح بالأرقام فقط
                      const sanitized = value.replace(/[^0-9]/g, '');
                      setEditFormData({ ...editFormData, phone: sanitized });
                    }}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter phone number (numbers only)"
                    maxLength={15}
                  />
                </div>

                {/* Image Alt */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Image Alt Text</label>
                  <input
                    type="text"
                    value={editFormData.imageAlt || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, imageAlt: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter image alt text"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter description"
                  />
                </div>

                {/* About */}
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">About</label>
                  <textarea
                    value={editFormData.about || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, about: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter about text"
                    rows={3}
                  />
                </div>

                {/* Why Us */}
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Why Us</label>
                  <textarea
                    value={editFormData.whyUs || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, whyUs: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter why us text"
                    rows={3}
                  />
                </div>

                {/* Q&A */}
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Q&A</label>
                  <textarea
                    value={editFormData.QandA || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, QandA: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter Q&A text"
                    rows={3}
                  />
                </div>

                {/* Privacy Policy */}
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Privacy Policy</label>
                  <textarea
                    value={editFormData.privacy_policy || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, privacy_policy: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter privacy policy"
                    rows={3}
                  />
                </div>

                {/* Terms of Use */}
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Terms of Use</label>
                  <textarea
                    value={editFormData.termsOfUse || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, termsOfUse: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter terms of use"
                    rows={3}
                  />
                </div>

                {/* Returning */}
                <div className="md:col-span-2">
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Returning Customers</label>
                  <textarea
                    value={editFormData.returning || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, returning: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter returning customers info"
                    rows={3}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={editFormData.isActive || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="yes">Active</option>
                    <option value="no">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex gap-2 md:gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg max-w-sm w-full">
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Delete Site?</h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Are you sure you want to delete this site? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2 p-4 md:p-6 border-t">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
