'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Image as ImageIcon, X, ExternalLink } from 'lucide-react';
import RichTextEditor from '../../Components/RichTextEditor/Richbox';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/app/context/LanguageContext';

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
  const [qaList, setQaList] = useState<Array<{ id: number; question: string; answer: string }>>([]);

  const { accessToken, user: currentUser } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { t, language } = useLanguage();

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
      toast.error(t("dashboard.sites.accessDenied"));
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
      toast.error(t("dashboard.sites.accessDenied"));
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

    // Initialize QA list from site's QandA string if possible.
    try {
      if (site.QandA) {
        // Expected format: "question1|answer1,question2|answer2"
        const pairs = site.QandA.split(',').map(p => p.trim()).filter(Boolean);
        const parsed = pairs.map((pair, idx) => {
          const [q, a] = pair.split('|');
          return { id: idx + 1, question: (q || '').trim(), answer: (a || '').trim() };
        });
        setQaList(parsed.length ? parsed : [{ id: 1, question: '', answer: '' }]);
      } else {
        setQaList([{ id: 1, question: '', answer: '' }]);
      }
    } catch (e) {
      setQaList([{ id: 1, question: '', answer: site.QandA || '' }]);
    }

    setShowEditModal(true);
  };

  const handleDeleteClick = (siteId: string) => {
    setDeletingSiteId(siteId);
    setShowDeleteModal(true);
  };

  // Q&A helpers for edit modal
  const addQA = () => {
    const newId = qaList.length ? Math.max(...qaList.map(q => q.id)) + 1 : 1;
    setQaList(prev => [...prev, { id: newId, question: '', answer: '' }]);
  };

  const updateQA = (id: number, field: 'question' | 'answer', value: string) => {
    setQaList(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQA = (id: number) => {
    setQaList(prev => prev.filter(q => q.id !== id));
  };

  const handleEditSave = async () => {
    if (!editingSite) return;

    try {
      // تنظيف البيانات - إزالة الحقول الفارغة والحقول التي لم تتغير
      const dataToSend: Record<string, any> = {};

      // Prepare Q&A string from qaList: "question|answer,question2|answer2"
      const qaPairs = qaList
        .filter(q => q.question && q.answer)
        .map(q => `${q.question.toString().trim()}|${q.answer.toString().trim()}`)
        .join(',');

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

      // Attach Q&A if present
      if (qaPairs) {
        dataToSend['QandA'] = qaPairs;
      }

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
      toast.success(t('dashboard.sites.updateSuccess'));
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
      toast.success(t('dashboard.sites.deleteSuccess'));
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
          <p className="text-gray-500 text-lg">{t("dashboard.sites.accessDenied")}</p>
          <p className="text-gray-400 text-sm mt-2">Admin role required</p>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering sites page. Sites count:', sites.length);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t("dashboard.sites.title")}</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">{t("dashboard.sites.manage")}</p>
      </div>

      {/* Sites Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-6 md:mx-0">
        <table className={`w-full ${language === 'ar' ? 'rtl' : ''}`}>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className={language === 'ar' ? 'flex flex-row-reverse' : ''}>
              <th className={`px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 text-right`}>{t("dashboard.sites.image")}</th>
              <th className={`px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 text-right`}>{t("dashboard.sites.siteName")}</th>
              <th className={`px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell text-right`}>{t("dashboard.sites.subdomain")}</th>
              <th className={`px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell text-right`}>{t("dashboard.sites.email")}</th>
              <th className={`px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell text-right`}>{t("dashboard.sites.phone")}</th>
              <th className={`px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 text-right`}>{t("dashboard.sites.status")}</th>
              <th className={`px-2 md:px-6 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-700 sticky ${language === 'ar' ? 'left-0' : 'right-0'} bg-gray-50 z-10 text-right`}>{t("dashboard.sites.actions")}</th>
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
                    {site.isActive === 'yes' ? t("dashboard.sites.active") : t("dashboard.sites.inactive")}
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
            <p className="text-gray-500 text-lg">{t("dashboard.sites.noSitesFound")}</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingSite && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-[75vw] h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{t("dashboard.sites.editSite")}</h2>
                  <p className="text-sm text-gray-500">{editingSite.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
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
                <div className="space-y-4">
                  {/* Site Name */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.siteName")}</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder={t("dashboard.sites.siteName")}
                      required
                    />
                  </div>

                  {/* Subdomain */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.subdomain")}</label>
                    <input
                      type="text"
                      value={editFormData.subdomain || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const sanitized = value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        setEditFormData({ ...editFormData, subdomain: sanitized });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white font-mono text-sm"
                      placeholder={t("dashboard.sites.subdomain")}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.email")}</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder={t("dashboard.sites.email")}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.phone")}</label>
                    <input
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const sanitized = value.replace(/[^0-9]/g, '');
                        setEditFormData({ ...editFormData, phone: sanitized });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder={t("dashboard.sites.phone")}
                      maxLength={15}
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.status")}</label>
                    <select
                      value={editFormData.isActive || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    >
                      <option value="yes">{t("dashboard.sites.active")}</option>
                      <option value="no">{t("dashboard.sites.inactive")}</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Image Alt */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.siteImage")}</label>
                    <input
                      type="text"
                      value={editFormData.imageAlt || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, imageAlt: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder={t("dashboard.sites.siteImage")}
                    />
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.description")}</label>
                    <input
                      type="text"
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder={t("dashboard.sites.description")}
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Sections */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.about")}</label>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <RichTextEditor
                      value={editFormData.about || ''}
                      onChange={(html) => setEditFormData({ ...editFormData, about: html })}
                    />
                  </div>
                </div>

                {/* Why Us */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.whyUs")}</label>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <RichTextEditor
                      value={editFormData.whyUs || ''}
                      onChange={(html) => setEditFormData({ ...editFormData, whyUs: html })}
                    />
                  </div>
                </div>

                {/* Q&A */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">{t("dashboard.sites.qAndA")}</label>
                    <button
                      type="button"
                      onClick={addQA}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                      + {t('common.add')}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {qaList.map((qa) => (
                      <div key={qa.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t('dashboard.site.question')}</label>
                          <input
                            type="text"
                            value={qa.question}
                            onChange={(e) => updateQA(qa.id, 'question', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                            placeholder={t('dashboard.site.whatReturnPolicy')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t('dashboard.site.answer')}</label>
                          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                            <RichTextEditor
                              value={qa.answer}
                              onChange={(html) => updateQA(qa.id, 'answer', html)}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end mt-3">
                          <button
                            type="button"
                            onClick={() => removeQA(qa.id)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('common.delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                    {qaList.length === 0 && (
                      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">{t('dashboard.sites.noQandA')}</div>
                    )}
                  </div>
                </div>

                {/* Privacy Policy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.privacyPolicy")}</label>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <RichTextEditor
                      value={editFormData.privacy_policy || ''}
                      onChange={(html) => setEditFormData({ ...editFormData, privacy_policy: html })}
                    />
                  </div>
                </div>

                {/* Terms of Use */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.termsOfUse")}</label>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <RichTextEditor
                      value={editFormData.termsOfUse || ''}
                      onChange={(html) => setEditFormData({ ...editFormData, termsOfUse: html })}
                    />
                  </div>
                </div>

                {/* Returning Customers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("dashboard.sites.returningCustomers")}</label>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <RichTextEditor
                      value={editFormData.returning || ''}
                      onChange={(html) => setEditFormData({ ...editFormData, returning: html })}
                    />
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Footer - Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  All fields are important for site configuration
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    {t("dashboard.sites.cancel")}
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    {t("dashboard.sites.save")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      )}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-lg max-w-sm w-full">
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{t("dashboard.sites.deleteSite")}</h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                {t("dashboard.sites.deleteConfirm")}
              </p>
            </div>

            <div className="flex gap-2 p-4 md:p-6 border-t">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {t("dashboard.sites.cancel")}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t("dashboard.sites.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
