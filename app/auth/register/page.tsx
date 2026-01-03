// "use client";
// import React, { useState, useRef } from "react";
// import { Eye, EyeOff, Calendar, Upload, Loader2 } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import toast, { Toaster } from "react-hot-toast";

// interface RegisterFormValues {
//   fullName: string;
//   userName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   role: "admin" | "user";
//   dob: string;
//   phone: string;
//   profileImage: File | null;
//   agreeToTerms: boolean;
// }

// interface ApiResponse {
//   success: boolean;
//   code?: number;
//   data?: Record<string, unknown>;
//   error?: {
//     message: string;
//     type?: string;
//     details?: string;
//   };
//   message?: string;
// }

// interface VerifyEmailRequest {
//   email: string;
//   otp: string;
// }

// export default function Register() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [profileImagePreview, setProfileImagePreview] = useState<string>("");
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
//   const [registeredEmail, setRegisteredEmail] = useState("");
//   const [showActivateModal, setShowActivateModal] = useState(false);
//   const [activateEmail, setActivateEmail] = useState("");
//   const [isSendingActivationOtp, setIsSendingActivationOtp] = useState(false);
//   const [showActivateOtpModal, setShowActivateOtpModal] = useState(false);
//   const [activateOtp, setActivateOtp] = useState(["", "", "", "", "", ""]);
//   const background = "/background.png";
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // دالة لتحويل التاريخ إلى صيغة ISO (YYYY-MM-DD)
//   const formatDateToISO = (dateString: string): string => {
//     if (!dateString) return "";

//     try {
//       // إضافة التوقيت الزمني لمنع مشاكل التوقيت
//       const date = new Date(dateString + "T00:00:00");

//       if (isNaN(date.getTime())) {
//         console.error("Invalid date:", dateString);
//         return dateString;
//       }

//       return date.toISOString();
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateString;
//     }
//   };

//   // دالة للتحقق من أن المستخدم عمره 18 سنة على الأقل (كما في الباكند)
//   const validateAge = (dob: string): boolean => {
//     const birthDate = new Date(dob);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();

//     if (
//       monthDiff < 0 ||
//       (monthDiff === 0 && today.getDate() < birthDate.getDate())
//     ) {
//       age--;
//     }

//     return age >= 18;
//   };

//   // Validation Schema
//   const validationSchema = Yup.object({
//     fullName: Yup.string()
//       .min(3, "Full name must be at least 3 characters")
//       .max(50, "Full name must be less than 50 characters")
//       .required("Full name is required"),
//     userName: Yup.string()
//       .min(3, "Username must be at least 3 characters")
//       .max(25, "Username must be less than 25 characters")
//       .matches(
//         /^[a-zA-Z0-9_]+$/,
//         "Username can only contain letters, numbers and underscores"
//       )
//       .required("Username is required"),
//     email: Yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//     phone: Yup.string()
//       .matches(
//         /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
//         "Invalid phone number format"
//       )
//       .required("Phone number is required"),
//     dob: Yup.date()
//       .max(new Date(), "Date of birth cannot be in the future")
//       .test("age", "You must be at least 18 years old", (value) => {
//         if (!value) return false;
//         return validateAge(value.toISOString());
//       })
//       .required("Date of birth is required"),
//     password: Yup.string()
//       .min(8, "Password must be at least 8 characters")
//       .required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password")], "Passwords must match")
//       .required("Please confirm your password"),
//     role: Yup.string()
//       .oneOf(["admin", "user"], "Invalid role")
//       .required("Role is required"),
//     profileImage: Yup.mixed<File>()
//       .nullable()
//       .test("fileSize", "File size is too large (max 5MB)", (value) => {
//         if (!value || !(value instanceof File)) return true;
//         return value.size <= 5 * 1024 * 1024;
//       })
//       .test(
//         "fileType",
//         "Unsupported file format (JPEG, PNG, GIF, WebP)",
//         (value) => {
//           if (!value || !(value instanceof File)) return true;
//           return [
//             "image/jpeg",
//             "image/png",
//             "image/gif",
//             "image/webp",
//           ].includes(value.type);
//         }
//       ),
//     agreeToTerms: Yup.boolean()
//       .oneOf([true], "You must agree to the terms and conditions")
//       .required("You must agree to the terms and conditions"),
//   });

//   // Formik Hook
//   const formik = useFormik<RegisterFormValues>({
//     initialValues: {
//       fullName: "",
//       userName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       role: "user",
//       dob: "",
//       phone: "",
//       profileImage: null,
//       agreeToTerms: false,
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       setIsSubmitting(true);

//       try {
//         const formData = new FormData();

//         // Append all form data with proper field names (matching backend)
//         formData.append("fullName", values.fullName.trim());
//         formData.append("userName", values.userName.trim());
//         formData.append("email", values.email.trim());
//         formData.append("password", values.password);

//         // Convert role to backend format
//         const apiRole = values.role;
//         formData.append("role", apiRole);

//         // Format date of birth for backend (ISO format)
//         if (values.dob) {
//           const formattedDob = formatDateToISO(values.dob);
//           formData.append("DoB", formattedDob); // Note: Backend expects 'DoB' not 'dob'
//           console.log("Date of Birth sent to backend:", formattedDob);
//         }

//         formData.append("phone", values.phone.trim());

//         if (values.profileImage) {
//           formData.append("profileImage", values.profileImage);
//         }

//         // Log data for debugging
//         console.log("Registration data:", {
//           fullName: values.fullName,
//           userName: values.userName,
//           email: values.email,
//           role: apiRole,
//           dob: values.dob,
//           phone: values.phone,
//           hasProfileImage: !!values.profileImage,
//         });

//         // Send registration request
//         const response = await fetch(
//           "http://localhost:5000/api/auth/register",
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         const data: ApiResponse = await response.json();

//         console.log("Registration response:", data);

//         if (!response.ok || !data.success) {
//           // Handle different error types
//           let errorMessage = "Registration failed";

//           if (data.error?.message) {
//             errorMessage = data.error.message;
//           } else if (data.message) {
//             errorMessage = data.message;
//           } else if (typeof data === "string") {
//             errorMessage = data;
//           }

//           // Show appropriate error toast
//           if (
//             errorMessage.includes("موجود مسبقاً") ||
//             errorMessage.includes("already exists") ||
//             errorMessage.includes("مسجل بالفعل")
//           ) {
//             toast.error("Email or username already exists!", {
//               duration: 5000,
//               position: "top-center",
//             });
//           } else if (
//             errorMessage.includes("تاريخ الميلاد") ||
//             errorMessage.includes("Date of birth")
//           ) {
//             toast.error(
//               "Invalid date of birth. You must be at least 18 years old.",
//               {
//                 duration: 5000,
//                 position: "top-center",
//               }
//             );
//           } else if (
//             errorMessage.includes("غير صالح") ||
//             errorMessage.includes("invalid")
//           ) {
//             toast.error("Invalid input data. Please check all fields.", {
//               duration: 5000,
//               position: "top-center",
//             });
//           } else {
//             toast.error(errorMessage, {
//               duration: 5000,
//               position: "top-center",
//             });
//           }

//           throw new Error(errorMessage);
//         }

//         // Success!
//         toast.success(
//           "Registration successful! Check your email for verification code.",
//           {
//             duration: 5000,
//             position: "top-center",
//           }
//         );

//         // Save registered email for OTP verification
//         setRegisteredEmail(values.email);
//         setShowOtpModal(true);
//       } catch (error: unknown) {
//         console.error("Registration error:", error);
//         const errorMessage =
//           error instanceof Error ? error.message : "Unknown error";

//         if (
//           !errorMessage.includes("already exists") &&
//           !errorMessage.includes("موجود مسبقاً")
//         ) {
//           toast.error("Registration failed. Please try again.", {
//             duration: 5000,
//             position: "top-center",
//           });
//         }
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//   });

//   // OTP Handlers
//   const handleOtpChange = (index: number, value: string) => {
//     if (value.length > 1) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   const handleVerifyOtp = async () => {
//     const otpCode = otp.join("");

//     if (otpCode.length !== 6) {
//       toast.error("Please enter the complete 6-digit OTP", {
//         duration: 3000,
//         position: "top-center",
//       });
//       return;
//     }

//     setIsVerifyingOtp(true);

//     try {
//       const verifyData: VerifyEmailRequest = {
//         email: registeredEmail,
//         otp: otpCode,
//       };

//       console.log("Verifying OTP for email:", registeredEmail);

//       const response = await fetch(
//         "http://localhost:5000/api/auth/verify-email",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(verifyData),
//         }
//       );

//       const data = await response.json();

//       console.log("OTP verification response:", data);

//       if (!response.ok || !data.success) {
//         let errorMessage = "OTP verification failed";

//         if (data.error?.message) {
//           errorMessage = data.error.message;
//         } else if (data.message) {
//           errorMessage = data.message;
//         }

//         toast.error(errorMessage, {
//           duration: 5000,
//           position: "top-center",
//         });

//         throw new Error(errorMessage);
//       }

//       // Success
//       toast.success("Email verified successfully! You can now login.", {
//         duration: 5000,
//         position: "top-center",
//       });

//       // Redirect to login after delay
//       setTimeout(() => {
//         window.location.href = "/auth/login";
//       }, 2000);
//     } catch (error: unknown) {
//       console.error("OTP verification error:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";

//       // Don't show error if it's already shown via toast
//       if (!errorMessage.includes("already shown")) {
//         toast.error("Invalid OTP. Please try again.", {
//           duration: 5000,
//           position: "top-center",
//         });
//       }
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/auth/resend-verification",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email: registeredEmail }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.error?.message || "Failed to resend OTP");
//       }

//       toast.success("OTP resent to your email!", {
//         duration: 3000,
//         position: "top-center",
//       });

//       // Clear OTP inputs
//       setOtp(["", "", "", "", "", ""]);
//       document.getElementById(`otp-0`)?.focus();
//     } catch (error: unknown) {
//       console.error("Resend OTP error:", error);
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "Failed to resend OTP. Please try again.";
//       toast.error(errorMessage, {
//         duration: 5000,
//         position: "top-center",
//       });
//     }
//   };

//   // Activation Email Handlers
//   const handleActivateEmail = async () => {
//     if (!activateEmail.trim()) {
//       toast.error("Please enter your email address", {
//         duration: 3000,
//         position: "top-center",
//       });
//       return;
//     }

//     setIsSendingActivationOtp(true);

//     try {
//       // التحقق أولاً من وجود المستخدم
//       const checkResponse = await fetch(
//         `http://localhost:5000/api/auth/check-email?email=${encodeURIComponent(
//           activateEmail
//         )}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const checkData = await checkResponse.json();

//       if (!checkResponse.ok || !checkData.success) {
//         throw new Error(checkData.error?.message || "Failed to check email");
//       }

//       if (!checkData.data.exists) {
//         toast.error("Email is not registered! Please sign up first.", {
//           duration: 5000,
//           position: "top-center",
//         });
//         return;
//       }

//       // إذا كان المستخدم موجوداً، إرسال رمز التحقق
//       const response = await fetch(
//         "http://localhost:5000/api/auth/resend-verification",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email: activateEmail }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         let errorMessage = "Failed to send activation code";

//         if (data.error?.message) {
//           errorMessage = data.error.message;
//         } else if (data.message) {
//           errorMessage = data.message;
//         }

//         toast.error(errorMessage, {
//           duration: 5000,
//           position: "top-center",
//         });
//         return;
//       }

//       // نجاح إرسال الرمز
//       toast.success("Activation code sent to your email!", {
//         duration: 5000,
//         position: "top-center",
//       });

//       // إظهار مودال إدخال OTP
//       setShowActivateOtpModal(true);
//       setShowActivateModal(false);
//     } catch (error: unknown) {
//       console.error("Activation error:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       if (!errorMessage.includes("Email is not registered")) {
//         toast.error("Something went wrong. Please try again.", {
//           duration: 5000,
//           position: "top-center",
//         });
//       }
//     } finally {
//       setIsSendingActivationOtp(false);
//     }
//   };

//   // دالة التحقق من OTP للتفعيل
//   const handleVerifyActivationOtp = async () => {
//     const otpCode = activateOtp.join("");

//     if (otpCode.length !== 6) {
//       toast.error("Please enter the complete 6-digit OTP", {
//         duration: 3000,
//         position: "top-center",
//       });
//       return;
//     }

//     setIsVerifyingOtp(true);

//     try {
//       const verifyData = {
//         email: activateEmail,
//         otp: otpCode,
//       };

//       const response = await fetch(
//         "http://localhost:5000/api/auth/verify-email",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(verifyData),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         let errorMessage = "OTP verification failed";

//         if (data.error?.message) {
//           errorMessage = data.error.message;
//         } else if (data.message) {
//           errorMessage = data.message;
//         }

//         toast.error(errorMessage, {
//           duration: 5000,
//           position: "top-center",
//         });
//         return;
//       }

//       // نجاح التحقق
//       toast.success("Email verified successfully! You can now login.", {
//         duration: 5000,
//         position: "top-center",
//       });

//       // إغلاق المودال وإعادة التوجيه
//       setShowActivateOtpModal(false);
//       setActivateEmail("");
//       setActivateOtp(["", "", "", "", "", ""]);

//       // إعادة التوجيه بعد تأخير
//       setTimeout(() => {
//         window.location.href = "/auth/login";
//       }, 2000);
//     } catch (error: unknown) {
//       console.error("Activation OTP error:", error);
//       toast.error("Invalid OTP. Please try again.", {
//         duration: 5000,
//         position: "top-center",
//       });
//     } finally {
//       setIsVerifyingOtp(false);
//     }
//   };

//   // Handlers للـ OTP في مودال التفعيل
//   const handleActivateOtpChange = (index: number, value: string) => {
//     if (value.length > 1) return;
//     const newOtp = [...activateOtp];
//     newOtp[index] = value;
//     setActivateOtp(newOtp);

//     if (value && index < 5) {
//       document.getElementById(`activate-otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleActivateOtpKeyDown = (
//     index: number,
//     e: React.KeyboardEvent<HTMLInputElement>
//   ) => {
//     if (e.key === "Backspace" && !activateOtp[index] && index > 0) {
//       document.getElementById(`activate-otp-${index - 1}`)?.focus();
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       formik.setFieldValue("profileImage", file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const removeProfileImage = () => {
//     formik.setFieldValue("profileImage", null);
//     setProfileImagePreview("");
//   };

//   return (
//     <>
//       <Toaster
//         toastOptions={{
//           style: {
//             background: "#363636",
//             color: "#fff",
//           },
//           success: {
//             style: {
//               background: "#10B981",
//             },
//           },
//           error: {
//             style: {
//               background: "#EF4444",
//             },
//           },
//         }}
//       />

//       {/* Mobile View */}
//       <div className="block lg:hidden w-full min-h-screen bg-slate-900">
//         {/* Top Background Image (same style as login) */}
//         <div className="relative h-35">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={background}
//             alt="Background"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
//         </div>

//         {/* Mobile Form Card */}
//         <div className="px-2 pb-8">
//           <div className="bg-white rounded-3xl shadow-2xl p-6">
//             <form onSubmit={formik.handleSubmit}>
//               <h2 className="text-2xl font-bold text-slate-900 mb-2">
//                 Create Account
//               </h2>
//               <p className="text-slate-600 mb-6 text-sm">
//                 Sign up to get started
//               </p>

//               <div className="space-y-3">
//                 {/* Profile Image Upload */}
//                 <div className="flex justify-center mb-4">
//                   <div className="relative">
//                     <div
//                       className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
//                       onClick={triggerFileInput}
//                     >
//                       {profileImagePreview ? (
//                         <div className="relative w-full h-full">
//                           {/* eslint-disable-next-line @next/next/no-img-element */}
//                           <img
//                             src={profileImagePreview}
//                             alt="Profile preview"
//                             className="w-full h-full rounded-full object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               removeProfileImage();
//                             }}
//                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ) : (
//                         <>
//                           <Upload className="w-8 h-8 text-slate-400 mb-1" />
//                           <span className="text-xs text-slate-500">
//                             Upload Image
//                           </span>
//                         </>
//                       )}
//                     </div>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleImageUpload}
//                       accept="image/*"
//                       className="hidden"
//                     />
//                     {formik.touched.profileImage &&
//                       formik.errors.profileImage && (
//                         <p className="text-red-500 text-xs mt-1 text-center">
//                           {formik.errors.profileImage}
//                         </p>
//                       )}
//                   </div>
//                 </div>

//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Full Name *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={formik.values.fullName}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                         formik.touched.fullName && formik.errors.fullName
//                           ? "border-red-500"
//                           : "border-slate-200"
//                       }`}
//                       placeholder="John Doe"
//                     />
//                     <svg
//                       className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                   </div>
//                   {formik.touched.fullName && formik.errors.fullName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {formik.errors.fullName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Username */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Username *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="userName"
//                       value={formik.values.userName}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                         formik.touched.userName && formik.errors.userName
//                           ? "border-red-500"
//                           : "border-slate-200"
//                       }`}
//                       placeholder="johndoe"
//                     />
//                     <svg
//                       className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
//                       />
//                     </svg>
//                   </div>
//                   {formik.touched.userName && formik.errors.userName && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {formik.errors.userName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Email *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="email"
//                       name="email"
//                       value={formik.values.email}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                         formik.touched.email && formik.errors.email
//                           ? "border-red-500"
//                           : "border-slate-200"
//                       }`}
//                       placeholder="example@example.com"
//                     />
//                     <svg
//                       className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                       />
//                     </svg>
//                   </div>
//                   {formik.touched.email && formik.errors.email && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {formik.errors.email}
//                     </p>
//                   )}
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Phone *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formik.values.phone}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                         formik.touched.phone && formik.errors.phone
//                           ? "border-red-500"
//                           : "border-slate-200"
//                       }`}
//                       placeholder="+201000000000"
//                     />
//                     <svg
//                       className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                       />
//                     </svg>
//                   </div>
//                   {formik.touched.phone && formik.errors.phone && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {formik.errors.phone}
//                     </p>
//                   )}
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Date of Birth *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       name="dob"
//                       value={formik.values.dob}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       max={new Date().toISOString().split("T")[0]}
//                       className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                         formik.touched.dob && formik.errors.dob
//                           ? "border-red-500"
//                           : "border-slate-200"
//                       }`}
//                     />
//                     <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                   </div>
//                   <div className="min-h-[18px]">
//                     {formik.touched.dob && formik.errors.dob && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {formik.errors.dob}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Role */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Role *
//                   </label>
//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={() => formik.setFieldValue("role", "user")}
//                       className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
//                         formik.values.role === "user"
//                           ? "bg-blue-600 text-white border-blue-600"
//                           : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
//                       }`}
//                     >
//                       Buyer
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => formik.setFieldValue("role", "admin")}
//                       className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
//                         formik.values.role === "admin"
//                           ? "bg-blue-600 text-white border-blue-600"
//                           : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
//                       }`}
//                     >
//                       Seller
//                     </button>
//                   </div>
//                   {formik.touched.role && formik.errors.role && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {formik.errors.role}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Password *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={formik.values.password}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                         formik.touched.password && formik.errors.password
//                           ? "border-red-500"
//                           : "border-slate-200"
//                       }`}
//                       placeholder="Enter your password"
//                     />
//                     <svg
//                       className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                       />
//                     </svg>
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                     >
//                       {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                     </button>
//                   </div>
//                   {formik.touched.password && formik.errors.password && (
//                     <p className="text-red-500 text-xs mt-1">
//                       {formik.errors.password}
//                     </p>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Confirm Password *
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       name="confirmPassword"
//                       value={formik.values.confirmPassword}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                         formik.touched.confirmPassword &&
//                         formik.errors.confirmPassword
//                           ? "border-red-500"
//                           : "border-slate-200"
//                       }`}
//                       placeholder="Confirm your password"
//                     />
//                     <svg
//                       className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                       />
//                     </svg>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                       className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                     >
//                       {showConfirmPassword ? (
//                         <EyeOff size={16} />
//                       ) : (
//                         <Eye size={16} />
//                       )}
//                     </button>
//                   </div>
//                   {formik.touched.confirmPassword &&
//                     formik.errors.confirmPassword && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {formik.errors.confirmPassword}
//                       </p>
//                     )}
//                 </div>

//                 {/* Terms & Conditions */}
//                 <div className="flex items-center my-3">
//                   <input
//                     type="checkbox"
//                     id="terms-mobile"
//                     name="agreeToTerms"
//                     checked={formik.values.agreeToTerms}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
//                   />
//                   <label
//                     htmlFor="terms-mobile"
//                     className="ml-2 text-sm text-slate-600"
//                   >
//                     I agree to the{" "}
//                     <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
//                       Terms & Conditions
//                     </span>
//                   </label>
//                 </div>
//                 <div className="min-h-[18px]">
//                   {formik.touched.agreeToTerms &&
//                     formik.errors.agreeToTerms && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {formik.errors.agreeToTerms}
//                       </p>
//                     )}
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm ${
//                     isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Creating Account...
//                     </>
//                   ) : (
//                     "Sign up"
//                   )}
//                 </button>

//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-slate-200"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-slate-500">or</span>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
//                 >
//                   <svg className="w-5 h-5" viewBox="0 0 24 24">
//                     <path
//                       fill="#4285F4"
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     />
//                     <path
//                       fill="#34A853"
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     />
//                     <path
//                       fill="#FBBC05"
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     />
//                     <path
//                       fill="#EA4335"
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     />
//                   </svg>
//                   Sign up with Google
//                 </button>

//                 <div className="flex flex-col gap-2 pt-2">
//                   <p className="text-center text-sm text-slate-600">
//                     Already have an account?{" "}
//                     <Link
//                       href="/auth/login"
//                       className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
//                     >
//                       Sign in
//                     </Link>
//                   </p>
//                   <p className="text-center text-sm text-slate-600">
//                     Need to activate your email?{" "}
//                     <button
//                       onClick={() => setShowActivateModal(true)}
//                       className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
//                     >
//                       Activate Email
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Desktop View */}
//       <div className="hidden lg:flex w-full min-h-[100vh] overflow-auto gap-8 p-4 py-2 bg-slate-50">
//         {/* Left Background */}
//         <div className="w-1/2 relative overflow-hidden bg-slate-900 rounded-2xl shadow-lg">
//           <Image
//             src={background}
//             alt="Background"
//             fill
//             className="object-cover rounded-2xl"
//             priority
//           />
//           <div className="absolute inset-0 flex flex-col justify-between p-12">
//             <div>
//               <h1 className="text-6xl font-bold leading-tight bg-gradient-to-b from-white via-white to-slate-300 bg-clip-text text-transparent">
//                 Start Your
//                 <br />
//                 Journey
//                 <br />
//                 with Us
//               </h1>
//             </div>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="w-1/2 flex items-center justify-center relative">
//           <div className="w-full min-h-[100vh] overflow-hidden bg-white rounded-2xl shadow-lg px-12 py-6">
//             <form onSubmit={formik.handleSubmit}>
//               <h2 className="text-3xl font-bold text-slate-900 mb-1 pt-2">
//                 Create Account
//               </h2>
//               <p className="text-slate-600 mb-6 text-base">
//                 Sign up to get started
//               </p>

//               <div className="space-y-3">
//                 {/* Profile Image Upload */}
//                 <div className="flex justify-center mb-4">
//                   <div className="relative">
//                     <div
//                       className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
//                       onClick={triggerFileInput}
//                     >
//                       {profileImagePreview ? (
//                         <div className="relative w-full h-full">
//                           {/* eslint-disable-next-line @next/next/no-img-element */}
//                           <img
//                             src={profileImagePreview}
//                             alt="Profile preview"
//                             className="w-full h-full rounded-full object-cover"
//                           />
//                           <button
//                             type="button"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               removeProfileImage();
//                             }}
//                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ) : (
//                         <>
//                           <Upload className="w-8 h-8 text-slate-400 mb-1" />
//                           <span className="text-xs text-slate-500">
//                             Upload Image
//                           </span>
//                         </>
//                       )}
//                     </div>
//                     <input
//                       type="file"
//                       ref={fileInputRef}
//                       onChange={handleImageUpload}
//                       accept="image/*"
//                       className="hidden"
//                     />
//                     {formik.touched.profileImage &&
//                       formik.errors.profileImage && (
//                         <p className="text-red-500 text-xs mt-1 text-center">
//                           {formik.errors.profileImage}
//                         </p>
//                       )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   {/* Full Name */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Full Name *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         name="fullName"
//                         value={formik.values.fullName}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                           formik.touched.fullName && formik.errors.fullName
//                             ? "border-red-500"
//                             : "border-slate-200"
//                         }`}
//                         placeholder="John Doe"
//                       />
//                       <svg
//                         className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.fullName && formik.errors.fullName && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {formik.errors.fullName}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Username */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Username *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         name="userName"
//                         value={formik.values.userName}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                           formik.touched.userName && formik.errors.userName
//                             ? "border-red-500"
//                             : "border-slate-200"
//                         }`}
//                         placeholder="johndoe"
//                       />
//                       <svg
//                         className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
//                         />
//                       </svg>
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.userName && formik.errors.userName && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {formik.errors.userName}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   {/* Email */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Email *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="email"
//                         name="email"
//                         value={formik.values.email}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                           formik.touched.email && formik.errors.email
//                             ? "border-red-500"
//                             : "border-slate-200"
//                         }`}
//                         placeholder="example@example.com"
//                       />
//                       <svg
//                         className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.email && formik.errors.email && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {formik.errors.email}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Phone *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formik.values.phone}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                           formik.touched.phone && formik.errors.phone
//                             ? "border-red-500"
//                             : "border-slate-200"
//                         }`}
//                         placeholder="+201000000000"
//                       />
//                       <svg
//                         className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.phone && formik.errors.phone && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {formik.errors.phone}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   {/* Date of Birth */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Date of Birth *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="date"
//                         name="dob"
//                         value={formik.values.dob}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         max={new Date().toISOString().split("T")[0]}
//                         className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                           formik.touched.dob && formik.errors.dob
//                             ? "border-red-500"
//                             : "border-slate-200"
//                         }`}
//                       />
//                       <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.dob && formik.errors.dob && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {formik.errors.dob}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Role */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Role *
//                     </label>
//                     <div className="flex gap-2">
//                       <button
//                         type="button"
//                         onClick={() => formik.setFieldValue("role", "user")}
//                         className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
//                           formik.values.role === "user"
//                             ? "bg-blue-600 text-white border-blue-600"
//                             : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
//                         }`}
//                       >
//                         Buyer
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => formik.setFieldValue("role", "admin")}
//                         className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
//                           formik.values.role === "admin"
//                             ? "bg-blue-600 text-white border-blue-600"
//                             : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
//                         }`}
//                       >
//                         Seller
//                       </button>
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.role && formik.errors.role && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {formik.errors.role}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   {/* Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Password *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={formik.values.password}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                           formik.touched.password && formik.errors.password
//                             ? "border-red-500"
//                             : "border-slate-200"
//                         }`}
//                         placeholder="Enter your password"
//                       />
//                       <svg
//                         className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                         />
//                       </svg>
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                       >
//                         {showPassword ? (
//                           <EyeOff size={16} />
//                         ) : (
//                           <Eye size={16} />
//                         )}
//                       </button>
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.password && formik.errors.password && (
//                         <p className="text-red-500 text-xs mt-1">
//                           {formik.errors.password}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Confirm Password */}
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-1">
//                       Confirm Password *
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         name="confirmPassword"
//                         value={formik.values.confirmPassword}
//                         onChange={formik.handleChange}
//                         onBlur={formik.handleBlur}
//                         className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
//                           formik.touched.confirmPassword &&
//                           formik.errors.confirmPassword
//                             ? "border-red-500"
//                             : "border-slate-200"
//                         }`}
//                         placeholder="Confirm your password"
//                       />
//                       <svg
//                         className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                         />
//                       </svg>
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setShowConfirmPassword(!showConfirmPassword)
//                         }
//                         className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff size={16} />
//                         ) : (
//                           <Eye size={16} />
//                         )}
//                       </button>
//                     </div>
//                     <div className="min-h-[18px]">
//                       {formik.touched.confirmPassword &&
//                         formik.errors.confirmPassword && (
//                           <p className="text-red-500 text-xs mt-1">
//                             {formik.errors.confirmPassword}
//                           </p>
//                         )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Terms & Conditions */}
//                 <div className="flex items-center my-3">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     name="agreeToTerms"
//                     checked={formik.values.agreeToTerms}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
//                   />
//                   <label
//                     htmlFor="terms"
//                     className="ml-2 text-sm text-slate-600"
//                   >
//                     I agree to the{" "}
//                     <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
//                       Terms & Conditions
//                     </span>
//                   </label>
//                 </div>
//                 {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
//                   <p className="text-red-500 text-xs mt-1">
//                     {formik.errors.agreeToTerms}
//                   </p>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm ${
//                     isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Creating Account...
//                     </>
//                   ) : (
//                     "Sign up"
//                   )}
//                 </button>

//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-slate-200"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-slate-500">or</span>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
//                 >
//                   <svg className="w-5 h-5" viewBox="0 0 24 24">
//                     <path
//                       fill="#4285F4"
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     />
//                     <path
//                       fill="#34A853"
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     />
//                     <path
//                       fill="#FBBC05"
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     />
//                     <path
//                       fill="#EA4335"
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     />
//                   </svg>
//                   Sign up with Google
//                 </button>

//                 <div className="flex flex-row justify-between">
//                   <p className="text-center text-sm text-slate-600">
//                     Already have an account?{" "}
//                     <Link
//                       href="/auth/login"
//                       className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
//                     >
//                       Sign in
//                     </Link>
//                   </p>
//                   <p className="text-center text-sm text-slate-600">
//                     Need to activate your email?{" "}
//                     <button
//                       onClick={() => setShowActivateModal(true)}
//                       className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
//                     >
//                       Activate Email
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
//             <button
//               type="button"
//               onClick={() => setShowOtpModal(false)}
//               className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 text-lg"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-blue-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-slate-900 mb-2">
//                 Verify Your Email
//               </h3>
//               <p className="text-slate-600">
//                 We have sent a 6-digit verification code to
//                 <br />
//                 <span className="font-medium text-slate-900">
//                   {registeredEmail}
//                 </span>
//               </p>
//             </div>

//             <div className="flex gap-3 justify-center mb-8">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-${index}`}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                   onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                   className="w-12 h-12 text-center text-xl font-semibold border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//                 />
//               ))}
//             </div>

//             <button
//               onClick={handleVerifyOtp}
//               disabled={isVerifyingOtp}
//               className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 ${
//                 isVerifyingOtp ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isVerifyingOtp ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Verifying...
//                 </>
//               ) : (
//                 "Verify & Continue"
//               )}
//             </button>

//             <p className="text-center text-sm text-slate-600">
//               Did not receive the code?{" "}
//               <button
//                 onClick={handleResendOtp}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Resend
//               </button>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* مودال إدخال البريد الإلكتروني للتفعيل */}
//       {showActivateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowActivateModal(false);
//                 setActivateEmail("");
//               }}
//               className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 text-lg"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-blue-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-slate-900 mb-2">
//                 Activate Your Email
//               </h3>
//               <p className="text-slate-600">
//                 Enter your email address to receive activation code
//               </p>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Email Address *
//               </label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   value={activateEmail}
//                   onChange={(e) => setActivateEmail(e.target.value)}
//                   className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//                   placeholder="example@example.com"
//                 />
//                 <svg
//                   className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//             </div>

//             <button
//               onClick={handleActivateEmail}
//               disabled={isSendingActivationOtp}
//               className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 ${
//                 isSendingActivationOtp ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isSendingActivationOtp ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Sending Activation Code...
//                 </>
//               ) : (
//                 "Send Activation Code"
//               )}
//             </button>

//             <p className="text-center text-sm text-slate-500">
//               We will send a 6-digit verification code to your email
//             </p>
//           </div>
//         </div>
//       )}

//       {/* مودال OTP للتفعيل - نفس تصميم مودال التسجيل */}
//       {showActivateOtpModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
//             <button
//               type="button"
//               onClick={() => {
//                 setShowActivateOtpModal(false);
//                 setActivateOtp(["", "", "", "", "", ""]);
//               }}
//               className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 text-lg"
//               aria-label="Close modal"
//             >
//               ×
//             </button>
//             <div className="text-center mb-8">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-8 h-8 text-blue-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-slate-900 mb-2">
//                 Verify Your Email
//               </h3>
//               <p className="text-slate-600">
//                 We have sent a 6-digit verification code to
//                 <br />
//                 <span className="font-medium text-slate-900">
//                   {activateEmail}
//                 </span>
//               </p>
//             </div>

//             <div className="flex gap-3 justify-center mb-8">
//               {activateOtp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`activate-otp-${index}`}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) =>
//                     handleActivateOtpChange(index, e.target.value)
//                   }
//                   onKeyDown={(e) => handleActivateOtpKeyDown(index, e)}
//                   className="w-12 h-12 text-center text-xl font-semibold border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//                 />
//               ))}
//             </div>

//             <button
//               onClick={handleVerifyActivationOtp}
//               disabled={isVerifyingOtp}
//               className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 ${
//                 isVerifyingOtp ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isVerifyingOtp ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Verifying...
//                 </>
//               ) : (
//                 "Verify & Activate Email"
//               )}
//             </button>

//             <p className="text-center text-sm text-slate-600">
//               Didnt receive the code?{" "}
//               <button
//                 onClick={handleActivateEmail}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Resend
//               </button>
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import React, { useRef } from "react";
import { Eye, EyeOff, Calendar, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { useOtpVerification } from "../../hooks/useOtpVerification";
import { ActivateEmail } from "../../Components/ActivateEmail/ActivateEmail";
import { OtpModal } from "../../Components/OtpModal/OtpModal";

export default function Register() {
  const background = "/background.png";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    formik,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    profileImagePreview,
    handleImageUpload,
    removeProfileImage,
    isSubmitting,
    registeredEmail,
  } = useRegisterForm();

  const {
    showOtpModal,
    setShowOtpModal,
    isVerifyingOtp,
    handleVerifyOtp,
    handleResendOtp,
  } = useOtpVerification();

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = (await formik.submitForm()) as {
      success?: boolean;
      email?: string;
      error?: string;
    };
    if (result && result.success) {
      setShowOtpModal(true);
    }
  };

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
            },
          },
        }}
      />

      {/* Mobile View */}
      <div className="block lg:hidden w-full min-h-screen bg-slate-900">
        {/* Top Background Image (same style as login) */}
        <div className="relative h-35">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={background}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>

        {/* Mobile Form Card */}
        <div className="px-2 pb-8">
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Create Account
              </h2>
              <p className="text-slate-600 mb-6 text-sm">
                Sign up to get started
              </p>

              <div className="space-y-3">
                {/* Profile Image Upload */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
                      onClick={triggerFileInput}
                    >
                      {profileImagePreview ? (
                        <div className="relative w-full h-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="w-full h-full rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProfileImage();
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">
                            Upload Image
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {formik.touched.profileImage &&
                      formik.errors.profileImage && (
                        <p className="text-red-500 text-xs mt-1 text-center">
                          {formik.errors.profileImage}
                        </p>
                      )}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                        formik.touched.fullName && formik.errors.fullName
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="John Doe"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.fullName}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Username *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="userName"
                      value={formik.values.userName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                        formik.touched.userName && formik.errors.userName
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="johndoe"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  {formik.touched.userName && formik.errors.userName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.userName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="example@example.com"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                        formik.touched.phone && formik.errors.phone
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="+201000000000"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.phone}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dob"
                      value={formik.values.dob}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                        formik.touched.dob && formik.errors.dob
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                    />
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-h-[18px]">
                    {formik.touched.dob && formik.errors.dob && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors.dob}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Role *
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue("role", "user")}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formik.values.role === "user"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue("role", "admin")}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formik.values.role === "admin"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Seller
                    </button>
                  </div>
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.role}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="Enter your password"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                          ? "border-red-500"
                          : "border-slate-200"
                      }`}
                      placeholder="Confirm your password"
                    />
                    <svg
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-center my-3">
                  <input
                    type="checkbox"
                    id="terms-mobile"
                    name="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="terms-mobile"
                    className="ml-2 text-sm text-slate-600"
                  >
                    I agree to the{" "}
                    <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                      Terms & Conditions
                    </span>
                  </label>
                </div>
                <div className="min-h-[18px]">
                  {formik.touched.agreeToTerms &&
                    formik.errors.agreeToTerms && (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors.agreeToTerms}
                      </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>

                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Sign in
                    </Link>
                  </p>
                  <p className="text-center text-sm text-slate-600">
                    Need to activate your email? <ActivateEmail />
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex w-full min-h-[100vh] overflow-auto gap-8 p-4 py-2 bg-slate-50">
        {/* Left Background */}
        <div className="w-1/2 relative overflow-hidden bg-slate-900 rounded-2xl shadow-lg">
          <Image
            src={background}
            alt="Background"
            fill
            className="object-cover rounded-2xl"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-between p-12">
            <div>
              <h1 className="text-6xl font-bold leading-tight bg-gradient-to-b from-white via-white to-slate-300 bg-clip-text text-transparent">
                Start Your
                <br />
                Journey
                <br />
                with Us
              </h1>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-1/2 flex items-center justify-center relative">
          <div className="w-full min-h-[100vh] overflow-hidden bg-white rounded-2xl shadow-lg px-12 py-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-3xl font-bold text-slate-900 mb-1 pt-2">
                Create Account
              </h2>
              <p className="text-slate-600 mb-6 text-base">
                Sign up to get started
              </p>

              <div className="space-y-3">
                {/* Profile Image Upload */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div
                      className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
                      onClick={triggerFileInput}
                    >
                      {profileImagePreview ? (
                        <div className="relative w-full h-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={profileImagePreview}
                            alt="Profile preview"
                            className="w-full h-full rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProfileImage();
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mb-1" />
                          <span className="text-xs text-slate-500">
                            Upload Image
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {formik.touched.profileImage &&
                      formik.errors.profileImage && (
                        <p className="text-red-500 text-xs mt-1 text-center">
                          {formik.errors.profileImage}
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                          formik.touched.fullName && formik.errors.fullName
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="John Doe"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.fullName && formik.errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.fullName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Username *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="userName"
                        value={formik.values.userName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                          formik.touched.userName && formik.errors.userName
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="johndoe"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.userName && formik.errors.userName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.userName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                          formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="example@example.com"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                          formik.touched.phone && formik.errors.phone
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="+201000000000"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.phone && formik.errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        max={new Date().toISOString().split("T")[0]}
                        className={`w-full px-3 py-2 pl-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                          formik.touched.dob && formik.errors.dob
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                      />
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.dob && formik.errors.dob && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.dob}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Role *
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => formik.setFieldValue("role", "user")}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          formik.values.role === "user"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Buyer
                      </button>
                      <button
                        type="button"
                        onClick={() => formik.setFieldValue("role", "admin")}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          formik.values.role === "admin"
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Seller
                      </button>
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.role && formik.errors.role && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                          formik.touched.password && formik.errors.password
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="Enter your password"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {formik.errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-3 py-2 pl-9 pr-9 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm ${
                          formik.touched.confirmPassword &&
                          formik.errors.confirmPassword
                            ? "border-red-500"
                            : "border-slate-200"
                        }`}
                        placeholder="Confirm your password"
                      />
                      <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <div className="min-h-[18px]">
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {formik.errors.confirmPassword}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-center my-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeToTerms"
                    checked={formik.values.agreeToTerms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm text-slate-600"
                  >
                    I agree to the{" "}
                    <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                      Terms & Conditions
                    </span>
                  </label>
                </div>
                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.agreeToTerms}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">or</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>

                <div className="flex flex-row justify-between">
                  <p className="text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Sign in
                    </Link>
                  </p>
                  <p className="text-center text-sm text-slate-600">
                    Need to activate your email? <ActivateEmail />
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={registeredEmail}
        title="Verify Your Email"
        description="We have sent a 6-character verification code to"
        verifyButtonText="Verify & Continue"
        resendButtonText="Resend"
        isVerifying={isVerifyingOtp}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </>
  );
}
