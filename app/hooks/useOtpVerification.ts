// hooks/useOtpVerification.ts
import { useState } from "react";
import toast from "react-hot-toast";
import { VerifyEmailRequest } from "../utils/types";

export const useOtpVerification = () => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // This handler is only used if you wire the inputs from this hook directly.
  // For the reusable OtpModal (which manages its own local state), the OTP code
  // is passed directly to handleVerifyOtp as the first argument.
  const handleOtpChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (
    otpOrEmail: string,
    maybeEmail?: string
  ): Promise<void> => {
    // Support both signatures:
    // 1) handleVerifyOtp(email) when using hook-managed OTP inputs
    // 2) handleVerifyOtp(otpCode, email) when called from OtpModal
    let email: string;
    let otpCode: string;

    if (typeof maybeEmail === "undefined") {
      // Old usage: first argument is email, OTP comes from hook state
      email = otpOrEmail;
      otpCode = otp.join("");
    } else {
      // New usage: otpCode passed as first arg, email as second
      otpOrEmail = (otpOrEmail || "") as string;
      email = (maybeEmail || "") as string;
      otpCode = otpOrEmail;
    }

    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter the complete 6-character verification code", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const verifyData: VerifyEmailRequest = {
        email,
        otp: otpCode,
      };

      console.log("Verifying OTP for email:", email);

      const response = await fetch(
        "http://localhost:5000/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyData),
        }
      );

      const data = await response.json();

      console.log("OTP verification response:", data);

      if (!response.ok || !data.success) {
        let errorMessage = "OTP verification failed";

        if (data.error?.message) {
          errorMessage = data.error.message;
        } else if (data.message) {
          errorMessage = data.message;
        }

        toast.error(errorMessage, {
          duration: 5000,
          position: "top-center",
        });
      } else {
        // Success
        toast.success("Email verified successfully! You can now login.", {
          duration: 5000,
          position: "top-center",
        });

        // Redirect to login after delay
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 2000);
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      // Don't show error if it's already shown via toast
      if (!errorMessage.includes("already shown")) {
        toast.error("Invalid OTP. Please try again.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async (email: string): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to resend OTP");
      }

      toast.success("OTP resent to your email!", {
        duration: 3000,
        position: "top-center",
      });

      // Clear OTP inputs (used when inputs are managed by this hook)
      setOtp(["", "", "", "", "", ""]);
      document.getElementById(`otp-0`)?.focus();
    } catch (error: unknown) {
      console.error("Resend OTP error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  return {
    showOtpModal,
    setShowOtpModal,
    otp,
    setOtp,
    isVerifyingOtp,
    handleOtpChange,
    handleOtpKeyDown,
    handleVerifyOtp,
    handleResendOtp,
  };
};
