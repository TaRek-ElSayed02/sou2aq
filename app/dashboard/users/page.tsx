'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { useLanguage } from '@/app/context/LanguageContext';

interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  role: string;
  DoB: string;
  phone: string;
  isActive: boolean;
  profileImage: string;
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { accessToken, user: currentUser } = useAppSelector((state) => state.auth);
  const { t } = useLanguage();

  // جلب المستخدمين
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditFormData(user);
    setShowEditModal(true);
  };

  const handleDeleteClick = (userId: string) => {
    if (currentUser?.id === userId) {
      toast.error(t("dashboard.users.cannotDeleteOwn"));
      return;
    }
    setDeletingUserId(userId);
    setShowDeleteModal(true);
  };

  const handleEditSave = async () => {
    if (!editingUser) return;

    try {
      // تنظيف البيانات - إزالة الحقول الفارغة
      const dataToSend: Record<string, any> = {};
      
      Object.entries(editFormData).forEach(([key, value]) => {
        // تخطي profileImage - يجب استخدام upload endpoint للصور
        if (key === 'profileImage') {
          return;
        }
        
        // تخطي id - لا يمكن تغيير الـ ID
        if (key === 'id') {
          return;
        }

        // تخطي الباسورد - لا يتم تغييره من صفحة التعديل
        if (key === 'password') {
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

      const response = await fetch(`http://localhost:5000/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const data = await response.json();
      setUsers(users.map(u => u.id === editingUser.id ? data.data : u));
      setShowEditModal(false);
      toast.success('User updated successfully');
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUserId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${deletingUserId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== deletingUserId));
      setShowDeleteModal(false);
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t("dashboard.users.title")}</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">{t("dashboard.users.manage")}</p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto -mx-6 md:mx-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">{t("dashboard.users.profileImage")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">{t("dashboard.users.fullName")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">{t("dashboard.users.userName")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">{t("dashboard.users.email")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700">{t("dashboard.users.role")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">{t("dashboard.users.dateOfBirth")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">{t("dashboard.users.phone")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 hidden lg:table-cell">{t("dashboard.users.status")}</th>
              <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 sticky right-0 bg-gray-50 z-10">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="px-2 md:px-6 py-2 md:py-4">
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:5000${user.profileImage}`}
                      alt={user.fullName}
                      className="w-8 md:w-10 h-8 md:h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <ImageIcon size={16} className="md:size-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm font-medium text-gray-900">{user.fullName}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">{user.userName}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">{user.email}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                  <span className={`px-2 md:px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${
                    user.role === 'superAdmin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'superAdmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">
                  {user.DoB ? new Date(user.DoB).toLocaleDateString() : '-'}
                </td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-600 hidden lg:table-cell">{user.phone || '-'}</td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm hidden lg:table-cell">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-2 md:px-6 py-2 md:py-4 text-xs md:text-sm sticky right-0 bg-white z-10">
                  <div className="flex gap-1 md:gap-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="p-1 md:p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition"
                      title="Edit user"
                    >
                      <Edit2 size={16} className="md:size-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className={`p-1 md:p-2 rounded-lg transition ${
                        currentUser?.id === user.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'hover:bg-red-100 text-red-600'
                      }`}
                      title={currentUser?.id === user.id ? 'Cannot delete your own account' : 'Delete user'}
                      disabled={currentUser?.id === user.id}
                    >
                      <Trash2 size={16} className="md:size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-[75vw] h-[85vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit User</h2>
                  <p className="text-sm text-gray-500">{editingUser.fullName}</p>
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
                  {/* Full Name */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.fullName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  {/* Username */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                    <input
                      type="text"
                      value={editFormData.userName || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const sanitized = value.replace(/[^a-zA-Z0-9]/g, '');
                        setEditFormData({ ...editFormData, userName: sanitized });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white font-mono text-sm"
                      placeholder="letters and numbers only"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder="user@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const sanitized = value.replace(/[^0-9]/g, '');
                        setEditFormData({ ...editFormData, phone: sanitized });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      placeholder="Phone number"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={editFormData.DoB ? new Date(editFormData.DoB).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, DoB: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Role */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={editFormData.role || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                      required
                    >
                      <option value="">Select role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={editFormData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.value === 'active' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  All fields marked with * are required
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
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
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Delete User?</h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
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
