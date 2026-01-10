// 'use client';
// import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
// import { Camera, Eye, EyeOff, Save, Loader2, X } from 'lucide-react';
// import { useUser } from '../../hooks/useUser';
// import toast from 'react-hot-toast';

// export const Settings = () => {
//   const {
//     currentUser,
//     loading,
//     error,
//     updateSuccess,
//     uploadSuccess,
//     fetchCurrentUser,
//     updateUserProfile,
//     uploadProfileImage,
//     deleteProfileImage,
//     clearError,
//     clearUpdateSuccess,
//     clearUploadSuccess,
//     clearFetchSuccess,
//   } = useUser();

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: '',
//     userName: '',
//     email: '',
//     password: '',
//     DoB: '',
//     phone: '',
//   });
//   const [previewImage, setPreviewImage] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [hasChanges, setHasChanges] = useState(false);

//   // Fetch user data on component mount
//   useEffect(() => {
//     fetchCurrentUser();
//   }, []);

//   // Update form data when user data is fetched
//   useEffect(() => {
//     if (currentUser) {
//       setFormData({
//         fullName: currentUser.fullName || '',
//         userName: currentUser.userName || '',
//         email: currentUser.email || '',
//         password: '',
//         DoB: currentUser.DoB?.split('T')[0] || '',
//         phone: currentUser.phone || '',
//       });
//       if (currentUser.profileImage) {
//         const imageUrl = currentUser.profileImage.startsWith('http') 
//           ? currentUser.profileImage 
//           : `http://localhost:5000${currentUser.profileImage}`;
//         setPreviewImage(imageUrl);
//       } else {
//         setPreviewImage(null);
//       }
//     }
//   }, [currentUser]);

//   // Handle success/error messages with toast notifications
//   useEffect(() => {
//     if (updateSuccess) {
//       toast.success("Profile updated successfully!", {
//         duration: 5000,
//         position: "top-center",
//       });
//       clearUpdateSuccess();
//     }
    
//     if (uploadSuccess) {
//       toast.success("Profile image updated successfully!", {
//         duration: 5000,
//         position: "top-center",
//       });
//       clearUploadSuccess();
//     }
    
//     if (error) {
//       toast.error(error, {
//         duration: 5000,
//         position: "top-center",
//       });
//       clearError();
//     }
//   }, [updateSuccess, uploadSuccess, error, clearUpdateSuccess, clearUploadSuccess, clearError]);

//   // Clear fetch success on mount
//   useEffect(() => {
//     clearFetchSuccess();
//   }, []);

//   const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         toast.error("Please select an image file only", {
//           duration: 5000,
//           position: "top-center",
//         });
//         return;
//       }

//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Image size must be less than 5MB", {
//           duration: 5000,
//           position: "top-center",
//         });
//         return;
//       }

//       setSelectedFile(file);
//       setHasChanges(true);
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);

//       toast.success("Image selected successfully!", {
//         duration: 3000,
//         position: "top-center",
//       });
//     }
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setHasChanges(true);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
    
//     // Show loading toast
//     const loadingToast = toast.loading("Saving changes...", {
//       position: "top-center",
//     });
    
//     try {
//       // Upload image first if selected
//       if (selectedFile) {
//         await uploadProfileImage(selectedFile);
//         setSelectedFile(null);
//       }

//       // Filter out empty values and unchanged fields
//       const updateData: any = {};
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value && key !== 'password') {
//           const currentValue = currentUser?.[key as keyof typeof currentUser];
//           if (value !== currentValue) {
//             updateData[key] = value;
//           }
//         }
//       });

//       // If password is provided, include it
//       if (formData.password.trim()) {
//         updateData.password = formData.password;
//       }

//       // Update user profile if there are changes
//       if (Object.keys(updateData).length > 0 || selectedFile) {
//         await updateUserProfile(updateData);
//         setHasChanges(false);
        
//         // Dismiss loading toast
//         toast.dismiss(loadingToast);
//       } else {
//         // Dismiss loading toast and show info
//         toast.dismiss(loadingToast);
//         toast("No changes were made to save", {
//           icon: 'ℹ️',
//           duration: 5000,
//           position: "top-center",
//         });
//       }

//       // Clear password field
//       setFormData(prev => ({ ...prev, password: '' }));
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       // Dismiss loading toast and show error
//       toast.dismiss(loadingToast);
//       toast.error("Failed to save changes. Please try again.", {
//         duration: 5000,
//         position: "top-center",
//       });
//     }
//   };

//   const handleRemoveImage = async () => {
//     if (currentUser?.profileImage) {
//       const loadingToast = toast.loading("Removing profile image...", {
//         position: "top-center",
//       });
      
//       try {
//         await deleteProfileImage();
//         setPreviewImage(null);
//         setHasChanges(true);
        
//         toast.dismiss(loadingToast);
//         toast.success("Profile image removed successfully!", {
//           duration: 5000,
//           position: "top-center",
//         });
//       } catch (error) {
//         toast.dismiss(loadingToast);
//         toast.error("Failed to remove profile image. Please try again.", {
//           duration: 5000,
//           position: "top-center",
//         });
//       }
//     }
//   };

//   const handleCancelImage = () => {
//     // Restore original image
//     if (currentUser?.profileImage) {
//       const imageUrl = currentUser.profileImage.startsWith('http') 
//         ? currentUser.profileImage 
//         : `http://localhost:5000${currentUser.profileImage}`;
//       setPreviewImage(imageUrl);
//     } else {
//       setPreviewImage(null);
//     }
//     setSelectedFile(null);
//     setHasChanges(false);
    
//     toast("Image change canceled", {
//       icon: '↶',
//       duration: 3000,
//       position: "top-center",
//     });
//   };

//   if (loading && !currentUser) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <div className="flex-1">
//         <div className="p-4 lg:p-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

//           {/* Remove old success/error message elements */}

//           <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
//             <div className="p-6 md:p-8">
//               {/* Profile Image Upload */}
//               <div className="flex flex-col items-center mb-8">
//                 <div className="relative mb-4">
//                   <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
//                     {previewImage ? (
//                       <img 
//                         src={previewImage} 
//                         alt="Profile" 
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src = '/default-avatar.png';
//                           toast.error("Failed to load profile image", {
//                             duration: 5000,
//                             position: "top-center",
//                           });
//                         }}
//                       />
//                     ) : (
//                       <div className="flex flex-col items-center">
//                         <Camera className="w-12 h-12 text-gray-400 mb-2" />
//                         <span className="text-sm text-gray-500">No image</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Upload Button */}
//                   <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
//                     aria-label="Upload image"
//                   >
//                     <Camera className="w-5 h-5 text-white" />
//                   </button>
                  
//                   {/* Cancel Button (if new image selected) */}
//                   {selectedFile && (
//                     <button
//                       type="button"
//                       onClick={handleCancelImage}
//                       className="absolute top-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
//                       aria-label="Cancel image upload"
//                     >
//                       <X className="w-4 h-4 text-white" />
//                     </button>
//                   )}
                  
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </div>
                
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
//                   >
//                     {currentUser?.profileImage ? 'Change Photo' : 'Upload Photo'}
//                   </button>
                  
//                   {currentUser?.profileImage && !selectedFile && (
//                     <button
//                       type="button"
//                       onClick={handleRemoveImage}
//                       className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-colors"
//                     >
//                       Remove Photo
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Form Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
//                     placeholder="Enter your full name"
//                     required
//                   />
//                 </div>

//                 {/* User Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     User Name
//                   </label>
//                   <input
//                     type="text"
//                     name="userName"
//                     value={formData.userName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
//                     placeholder="Enter your username"
//                     required
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password (leave empty to keep current)
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors pr-12"
//                       placeholder="Enter new password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       aria-label={showPassword ? 'Hide password' : 'Show password'}
//                     >
//                       {showPassword ? (
//                         <EyeOff className="w-5 h-5" />
//                       ) : (
//                         <Eye className="w-5 h-5" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date of Birth
//                   </label>
//                   <input
//                     type="date"
//                     name="DoB"
//                     value={formData.DoB}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//               </div>

//               {/* Save Button */}
//               <div className="mt-8 flex justify-center">
//                 <button
//                   type="submit"
//                   disabled={loading || (!hasChanges && !selectedFile)}
//                   className={`px-12 py-3 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors ${
//                     loading || (!hasChanges && !selectedFile)
//                       ? 'bg-blue-400 text-white cursor-not-allowed'
//                       : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
//                   }`}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-5 h-5" />
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { Camera, Eye, EyeOff, Save, Loader2, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import toast from 'react-hot-toast';

export const Settings = () => {
  const {
    currentUser,
    loading,
    error,
    updateSuccess,
    uploadSuccess,
    fetchCurrentUser,
    updateUserProfile,
    uploadProfileImage,
    deleteProfileImage,
    clearError,
    clearUpdateSuccess,
    clearUploadSuccess,
    clearFetchSuccess,
  } = useUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    DoB: '',
    phone: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Validation rules
  const validationRules = {
    fullName: {
      required: true,
      minLength: 3,
      pattern: /^[a-zA-Z\s]{3,}$/,
      message: 'Full name must be at least 3 letters (English only, no numbers)',
    },
    userName: {
      required: true,
      pattern: /^(?=.*[a-zA-Z]{3,})(?=.*\d)[a-zA-Z\d]+$/,
      noSpaces: true,
      message: 'Username must be at least 3 letters and include at least 1 number (no spaces)',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
    password: {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    },
    phone: {
      required: true,
      pattern: /^[\d\s\+\-\(\)]{10,}$/,
      message: 'Phone number must contain only numbers (at least 10 digits)',
    },
    DoB: {
      required: true,
      message: 'Date of birth is required',
    },
  };

  // Validate a single field
  const validateField = (name: string, value: string): string => {
    const rules = validationRules[name as keyof typeof validationRules];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return 'This field is required';
    }

    if (name === 'userName' && rules.noSpaces && /\s/.test(value)) {
      return 'Username cannot contain spaces';
    }

    if (name === 'userName') {
      const englishOnly = /^[a-zA-Z0-9]+$/;
      if (!englishOnly.test(value)) {
        return 'Username must contain only English letters and numbers';
      }
    }

    if (name === 'fullName') {
      const englishOnly = /^[a-zA-Z\s]+$/;
      if (!englishOnly.test(value)) {
        return 'Full name must contain only English letters';
      }
      if (value.length < 3) {
        return 'Full name must be at least 3 characters';
      }
    }

    if (name === 'phone') {
      const numbersOnly = value.replace(/[^\d]/g, '');
      if (numbersOnly.length < 10) {
        return 'Phone number must be at least 10 digits';
      }
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }

    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    Object.keys(formData).forEach((key) => {
      if (key === 'password' && !formData.password) {
        // Password is optional, only validate if provided
        return;
      }
      
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        errors[key] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Update form data when user data is fetched
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        userName: currentUser.userName || '',
        email: currentUser.email || '',
        password: '',
        DoB: currentUser.DoB?.split('T')[0] || '',
        phone: currentUser.phone || '',
      });
      if (currentUser.profileImage) {
        const imageUrl = currentUser.profileImage.startsWith('http') 
          ? currentUser.profileImage 
          : `http://localhost:5000${currentUser.profileImage}`;
        setPreviewImage(imageUrl);
      } else {
        setPreviewImage(null);
      }
    }
  }, [currentUser]);

  // Handle success/error messages with toast notifications
  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully!", {
        duration: 5000,
        position: "top-center",
      });
      clearUpdateSuccess();
    }
    
    if (uploadSuccess) {
      toast.success("Profile image updated successfully!", {
        duration: 5000,
        position: "top-center",
      });
      clearUploadSuccess();
    }
    
    if (error) {
      toast.error(error, {
        duration: 5000,
        position: "top-center",
      });
      clearError();
    }
  }, [updateSuccess, uploadSuccess, error, clearUpdateSuccess, clearUploadSuccess, clearError]);

  // Clear fetch success on mount
  useEffect(() => {
    clearFetchSuccess();
  }, []);

  // Validate on form data change
  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      validateForm();
    }
  }, [formData]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file only", {
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB", {
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      setSelectedFile(file);
      setHasChanges(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      toast.success("Image selected successfully!", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number - only allow numbers and common phone characters
    if (name === 'phone') {
      const phoneValue = value.replace(/[^\d\s\+\-\(\)]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue
      }));
    }
    // Special handling for username - no spaces
    else if (name === 'userName') {
      const userNameValue = value.replace(/\s/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: userNameValue
      }));
    }
    // Special handling for full name - only letters and spaces
    else if (name === 'fullName') {
      const fullNameValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: fullNameValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    
    setHasChanges(true);
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['fullName', 'userName', 'email', 'DoB', 'phone'];
    const newTouchedFields: Record<string, boolean> = {};
    allFields.forEach(field => {
      newTouchedFields[field] = true;
    });
    if (formData.password) {
      newTouchedFields['password'] = true;
    }
    setTouchedFields(newTouchedFields);
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving", {
        duration: 5000,
        position: "top-center",
      });
      return;
    }
    
    // Show loading toast
    const loadingToast = toast.loading("Saving changes...", {
      position: "top-center",
    });
    
    try {
      // Upload image first if selected
      if (selectedFile) {
        await uploadProfileImage(selectedFile);
        setSelectedFile(null);
      }

      // Filter out empty values and unchanged fields
      const updateData: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'password') {
          const currentValue = currentUser?.[key as keyof typeof currentUser];
          if (value !== currentValue) {
            updateData[key] = value;
          }
        }
      });

      // If password is provided, include it
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }

      // Update user profile if there are changes
      if (Object.keys(updateData).length > 0 || selectedFile) {
        await updateUserProfile(updateData);
        setHasChanges(false);
        
        // Clear password field after successful update
        setFormData(prev => ({ ...prev, password: '' }));
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);
      } else {
        // Dismiss loading toast and show info
        toast.dismiss(loadingToast);
        toast("No changes were made to save", {
          icon: 'ℹ️',
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error("Failed to save changes. Please try again.", {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  const handleRemoveImage = async () => {
    if (currentUser?.profileImage) {
      const loadingToast = toast.loading("Removing profile image...", {
        position: "top-center",
      });
      
      try {
        await deleteProfileImage();
        setPreviewImage(null);
        setHasChanges(true);
        
        toast.dismiss(loadingToast);
        toast.success("Profile image removed successfully!", {
          duration: 5000,
          position: "top-center",
        });
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to remove profile image. Please try again.", {
          duration: 5000,
          position: "top-center",
        });
      }
    }
  };

  const handleCancelImage = () => {
    // Restore original image
    if (currentUser?.profileImage) {
      const imageUrl = currentUser.profileImage.startsWith('http') 
        ? currentUser.profileImage 
        : `http://localhost:5000${currentUser.profileImage}`;
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
    setSelectedFile(null);
    setHasChanges(false);
    
    toast("Image change canceled", {
      icon: '↶',
      duration: 3000,
      position: "top-center",
    });
  };

  // Helper function to check if field is valid
  const isFieldValid = (fieldName: string) => {
    return !validationErrors[fieldName] && touchedFields[fieldName];
  };

  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1">
        <div className="p-4 lg:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 md:p-8">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                          toast.error("Failed to load profile image", {
                            duration: 5000,
                            position: "top-center",
                          });
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                    aria-label="Upload image"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  
                  {/* Cancel Button (if new image selected) */}
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleCancelImage}
                      className="absolute top-0 right-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
                      aria-label="Cancel image upload"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {currentUser?.profileImage ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  
                  {currentUser?.profileImage && !selectedFile && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        validationErrors.fullName && touchedFields.fullName
                          ? 'border-red-500 focus:ring-red-500'
                          : isFieldValid('fullName')
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your full name (English only)"
                      required
                    />
                    {isFieldValid('fullName') && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {validationErrors.fullName && touchedFields.fullName && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.fullName}</span>
                    </div>
                  )}
                  {!validationErrors.fullName && touchedFields.fullName && (
                    <div className="mt-1 text-xs text-green-600">
                      ✓ Valid full name
                    </div>
                  )}
                </div>

                {/* User Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        validationErrors.userName && touchedFields.userName
                          ? 'border-red-500 focus:ring-red-500'
                          : isFieldValid('userName')
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      placeholder="Enter username (letters + numbers, no spaces)"
                      required
                    />
                    {isFieldValid('userName') && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {validationErrors.userName && touchedFields.userName && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.userName}</span>
                    </div>
                  )}
                  {!validationErrors.userName && touchedFields.userName && (
                    <div className="mt-1 text-xs text-green-600">
                      ✓ Valid username (contains letters and numbers)
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        validationErrors.email && touchedFields.email
                          ? 'border-red-500 focus:ring-red-500'
                          : isFieldValid('email')
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      placeholder="Enter your email"
                      required
                    />
                    {isFieldValid('email') && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {validationErrors.email && touchedFields.email && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.email}</span>
                    </div>
                  )}
                  {!validationErrors.email && touchedFields.email && (
                    <div className="mt-1 text-xs text-green-600">
                      ✓ Valid email format
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password (leave empty to keep current)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors pr-12 ${
                        validationErrors.password && touchedFields.password && formData.password
                          ? 'border-red-500 focus:ring-red-500'
                          : isFieldValid('password') && formData.password
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      placeholder="Enter new password (min 8 chars with special characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {isFieldValid('password') && formData.password && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {validationErrors.password && touchedFields.password && formData.password && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.password}</span>
                    </div>
                  )}
                  {!validationErrors.password && touchedFields.password && formData.password && (
                    <div className="mt-1 text-xs text-green-600">
                      ✓ Strong password
                    </div>
                  )}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className={`text-xs ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[a-z]/.test(formData.password) ? '✓' : '○'} At least one lowercase letter
                      </div>
                      <div className={`text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[A-Z]/.test(formData.password) ? '✓' : '○'} At least one uppercase letter
                      </div>
                      <div className={`text-xs ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/\d/.test(formData.password) ? '✓' : '○'} At least one number
                      </div>
                      <div className={`text-xs ${/[@$!%*?&]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                        {/[@$!%*?&]/.test(formData.password) ? '✓' : '○'} At least one special character (@$!%*?&)
                      </div>
                      <div className={`text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                        {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters long
                      </div>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="DoB"
                      value={formData.DoB}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        validationErrors.DoB && touchedFields.DoB
                          ? 'border-red-500 focus:ring-red-500'
                          : isFieldValid('DoB')
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      required
                    />
                    {isFieldValid('DoB') && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {validationErrors.DoB && touchedFields.DoB && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.DoB}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-colors ${
                        validationErrors.phone && touchedFields.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : isFieldValid('phone')
                          ? 'border-green-500 focus:ring-green-500'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      placeholder="Enter phone number (digits only)"
                      required
                    />
                    {isFieldValid('phone') && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                  {validationErrors.phone && touchedFields.phone && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors.phone}</span>
                    </div>
                  )}
                  {!validationErrors.phone && touchedFields.phone && (
                    <div className="mt-1 text-xs text-green-600">
                      ✓ Valid phone number ({formData.phone.replace(/[^\d]/g, '').length} digits)
                    </div>
                  )}
                </div>
              </div>

              {/* Required fields note */}
              <div className="mt-4 text-sm text-gray-500">
                * Required fields
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={loading || (!hasChanges && !selectedFile) || Object.keys(validationErrors).length > 0}
                  className={`px-12 py-3 rounded-lg font-medium flex items-center gap-2 shadow-md transition-colors ${
                    loading || (!hasChanges && !selectedFile) || Object.keys(validationErrors).length > 0
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;