import * as Yup from "yup";

// دالة للتحقق من أن المستخدم عمره 18 سنة على الأقل
const validateAge = (dob: string): boolean => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
};

// دالة لتحويل التاريخ إلى صيغة ISO (YYYY-MM-DD)
export const formatDateToISO = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // إضافة التوقيت الزمني لمنع مشاكل التوقيت
    const date = new Date(dateString + "T00:00:00");

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return dateString;
    }

    return date.toISOString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Validation Schema
export const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters")
    .required("Full name is required"),
  userName: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(25, "Username must be less than 25 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(
      /^(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      "Invalid phone number format"
    )
    .required("Phone number is required"),
  dob: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .test("age", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      return validateAge(value.toISOString());
    })
    .required("Date of birth is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.string()
    .oneOf(["admin", "user"], "Invalid role")
    .required("Role is required"),
  profileImage: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "File size is too large (max 5MB)", (value) => {
      if (!value || !(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test(
      "fileType",
      "Unsupported file format (JPEG, PNG, GIF, WebP)",
      (value) => {
        if (!value || !(value instanceof File)) return true;
        return [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ].includes(value.type);
      }
    ),
  agreeToTerms: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required("You must agree to the terms and conditions"),
});

export const initialValues = {
  fullName: "",
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user" as "admin" | "user",
  dob: "",
  phone: "",
  profileImage: null,
  agreeToTerms: false,
};