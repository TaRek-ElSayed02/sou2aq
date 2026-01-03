export interface RegisterFormValues {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "admin" | "user";
    dob: string;
    phone: string;
    profileImage: File | null;
    agreeToTerms: boolean;
  }
  
  export interface ApiResponse {
    success: boolean;
    code?: number;
    data?: Record<string, unknown>;
    error?: {
      message: string;
      type?: string;
      details?: string;
    };
    message?: string;
  }
  
  export interface VerifyEmailRequest {
    email: string;
    otp: string;
  }

  export interface User {
  id: string;
  personalInfo: {
    fullName: string;
    userName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  accountInfo: {
    role: string;
    status: string;
    profileImage: string;
    emailVerified: boolean;
  };
}
