"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { OtpModal } from "../OtpModal/OtpModal";

interface ActivateEmailProps {
  onEmailActivated?: () => void;
  checkEmailEndpoint?: string;
  sendOtpEndpoint?: string;
  verifyOtpEndpoint?: string;
}

export const ActivateEmail: React.FC<ActivateEmailProps> = ({
  onEmailActivated,
  checkEmailEndpoint = "http://localhost:5000/api/auth/check-email",
  sendOtpEndpoint = "http://localhost:5000/api/auth/resend-verification",
  verifyOtpEndpoint = "http://localhost:5000/api/auth/verify-email",
}) => {
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showActivateOtpModal, setShowActivateOtpModal] = useState(false);
  const [activateEmail, setActivateEmail] = useState("");
  const [isSendingActivationOtp, setIsSendingActivationOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleActivateEmail = async () => {
    if (!activateEmail.trim()) {
      toast.error("Please enter your email address", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    setIsSendingActivationOtp(true);

    try {
      // التحقق أولاً من وجود المستخدم
      const checkResponse = await fetch(
        `${checkEmailEndpoint}?email=${encodeURIComponent(activateEmail)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const checkData = await checkResponse.json();

      if (!checkResponse.ok || !checkData.success) {
        throw new Error(checkData.error?.message || "Failed to check email");
      }

      if (!checkData.data.exists) {
        toast.error("Email is not registered! Please sign up first.", {
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      // إذا كان المستخدم موجوداً، إرسال رمز التحقق
      const response = await fetch(sendOtpEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: activateEmail }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        let errorMessage = "Failed to send activation code";

        if (data.error?.message) {
          errorMessage = data.error.message;
        } else if (data.message) {
          errorMessage = data.message;
        }

        toast.error(errorMessage, {
          duration: 5000,
          position: "top-center",
        });
        return;
      }

      // نجاح إرسال الرمز
      toast.success("Activation code sent to your email!", {
        duration: 5000,
        position: "top-center",
      });

      // إظهار مودال إدخال OTP
      setShowActivateOtpModal(true);
      setShowActivateModal(false);
    } catch (error: unknown) {
      console.error("Activation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (!errorMessage.includes("Email is not registered")) {
        toast.error("Something went wrong. Please try again.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } finally {
      setIsSendingActivationOtp(false);
    }
  };

  const handleVerifyActivationOtp = async (otp: string, email: string) => {
    setIsVerifyingOtp(true);

    try {
      const verifyData = {
        email,
        otp,
      };

      const response = await fetch(verifyOtpEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verifyData),
      });

      const data = await response.json();

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
        throw new Error(errorMessage);
      }

      // نجاح التحقق
      toast.success("Email verified successfully! login Now!.", {
        duration: 5000,
        position: "top-center",
      });

      // إغلاق المودال وإعادة التوجيه
      setShowActivateOtpModal(false);
      setActivateEmail("");

      if (onEmailActivated) {
        onEmailActivated();
      }

      // إعادة التوجيه بعد تأخير
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (error: unknown) {
      console.error("Activation OTP error:", error);
      throw error;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendActivationOtp = async (email: string) => {
    const response = await fetch(sendOtpEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || "Failed to resend OTP");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowActivateModal(true)}
        className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
      >
        Activate Email
      </button>

      {/* مودال إدخال البريد الإلكتروني للتفعيل */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              type="button"
              onClick={() => {
                setShowActivateModal(false);
                setActivateEmail("");
              }}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 text-lg"
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Activate Your Email
              </h3>
              <p className="text-slate-600">
                Enter your email address to receive activation code
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={activateEmail}
                  onChange={(e) => setActivateEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="example@example.com"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
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
            </div>

            <button
              onClick={handleActivateEmail}
              disabled={isSendingActivationOtp}
              className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 ${
                isSendingActivationOtp ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSendingActivationOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Activation Code...
                </>
              ) : (
                "Send Activation Code"
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              We will send a 6-character verification code to your email
            </p>
          </div>
        </div>
      )}

      {/* مودال OTP للتفعيل */}
      <OtpModal
        isOpen={showActivateOtpModal}
        onClose={() => {
          setShowActivateOtpModal(false);
        }}
        email={activateEmail}
        title="Verify Your Email"
        description="We have sent a 6-character verification code to"
        verifyButtonText="Verify & Activate Email"
        resendButtonText="Resend"
        isVerifying={isVerifyingOtp}
        onVerify={handleVerifyActivationOtp}
        onResend={handleResendActivationOtp}
      />
    </>
  );
};
