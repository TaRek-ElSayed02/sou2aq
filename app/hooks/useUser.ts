import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchCurrentUser,
  updateUserProfile,
  uploadProfileImage,
  deleteProfileImage,
  clearUser,
  clearError,
  clearUpdateSuccess,
  clearUploadSuccess,
  clearFetchSuccess,
} from '../../store/userStore';

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  return {
    // State
    currentUser: userState.currentUser,
    loading: userState.loading,
    error: userState.error,
    fetchSuccess: userState.fetchSuccess,
    updateSuccess: userState.updateSuccess,
    uploadSuccess: userState.uploadSuccess,
    
    // Actions
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    updateUserProfile: (data: any) => dispatch(updateUserProfile(data)),
    uploadProfileImage: (file: File) => dispatch(uploadProfileImage(file)),
    deleteProfileImage: () => dispatch(deleteProfileImage()),
    
    // Utils
    clearUser: () => dispatch(clearUser()),
    clearError: () => dispatch(clearError()),
    clearUpdateSuccess: () => dispatch(clearUpdateSuccess()),
    clearUploadSuccess: () => dispatch(clearUploadSuccess()),
    clearFetchSuccess: () => dispatch(clearFetchSuccess()),
    
    // Getters
    isAuthenticated: !!userState.currentUser,
    isAdmin: (userState.currentUser?.role || userState.currentUser?.accountInfo?.role) === 'admin' || (userState.currentUser?.role || userState.currentUser?.accountInfo?.role) === 'superAdmin',
    isSuperAdmin: (userState.currentUser?.role || userState.currentUser?.accountInfo?.role) === 'superAdmin',
  };
};