// hooks/useRegisterForm.ts
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useState } from "react";
import { validationSchema, initialValues, formatDateToISO } from "../validation/validationSchema";
import { RegisterFormValues, ApiResponse } from "../utils/types";

export const useRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const formik = useFormik<RegisterFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const formData = new FormData();

        // Append all form data with proper field names (matching backend)
        formData.append("fullName", values.fullName.trim());
        formData.append("userName", values.userName.trim());
        formData.append("email", values.email.trim());
        formData.append("password", values.password);

        // Convert role to backend format
        const apiRole = values.role;
        formData.append("role", apiRole);

        // Format date of birth for backend (ISO format)
        if (values.dob) {
          const formattedDob = formatDateToISO(values.dob);
          formData.append("DoB", formattedDob);
          console.log("Date of Birth sent to backend:", formattedDob);
        }

        formData.append("phone", values.phone.trim());

        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        // Log data for debugging
        console.log("Registration data:", {
          fullName: values.fullName,
          userName: values.userName,
          email: values.email,
          role: apiRole,
          dob: values.dob,
          phone: values.phone,
          hasProfileImage: !!values.profileImage,
        });

        // Send registration request
        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            body: formData,
          }
        );

        const data: ApiResponse = await response.json();

        console.log("Registration response:", data);

        if (!response.ok || !data.success) {
          // Handle different error types
          let errorMessage = "Registration failed";

          if (data.error?.message) {
            errorMessage = data.error.message;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (typeof data === "string") {
            errorMessage = data;
          }

          // Show appropriate error toast
          if (
            errorMessage.includes("موجود مسبقاً") ||
            errorMessage.includes("already exists") ||
            errorMessage.includes("مسجل بالفعل")
          ) {
            toast.error("Email or username already exists!", {
              duration: 5000,
              position: "top-center",
            });
          } else if (
            errorMessage.includes("تاريخ الميلاد") ||
            errorMessage.includes("Date of birth")
          ) {
            toast.error(
              "Invalid date of birth. You must be at least 18 years old.",
              {
                duration: 5000,
                position: "top-center",
              }
            );
          } else if (
            errorMessage.includes("غير صالح") ||
            errorMessage.includes("invalid")
          ) {
            toast.error("Invalid input data. Please check all fields.", {
              duration: 5000,
              position: "top-center",
            });
          } else {
            toast.error(errorMessage, {
              duration: 5000,
              position: "top-center",
            });
          }

          throw new Error(errorMessage);
        }

        // Success!
        toast.success(
          "Registration successful! Check your email for verification code.",
          {
            duration: 5000,
            position: "top-center",
          }
        );

        // Save registered email for OTP verification
        setRegisteredEmail(values.email);
        return { success: true, email: values.email };
      } catch (error: unknown) {
        console.error("Registration error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        if (
          !errorMessage.includes("already exists") &&
          !errorMessage.includes("موجود مسبقاً")
        ) {
          toast.error("Registration failed. Please try again.", {
            duration: 5000,
            position: "top-center",
          });
        }
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("profileImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    formik.setFieldValue("profileImage", null);
    setProfileImagePreview("");
  };

  return {
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
    setRegisteredEmail,
  };
};