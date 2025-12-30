"use client";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  title?: string;
  description?: string;
  onVerify: (otp: string, email: string) => Promise<void>;
  onResend?: (email: string) => Promise<void>;
  verifyButtonText?: string;
  resendButtonText?: string;
  isVerifying?: boolean;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  email,
  title = "Verify Your Email",
  description = "We have sent a 6-character verification code to",
  onVerify,
  onResend,
  verifyButtonText = "Verify & Continue",
  resendButtonText = "Resend",
  isVerifying = false,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    // Convert to uppercase and filter: only allow numbers (0-9) and capital letters (A-Z)
    const filteredValue = value.toUpperCase().replace(/[^0-9A-Z]/g, "");

    // Handle paste: if value is longer than 1, it's likely a paste
    if (filteredValue.length > 1) {
      const characters = filteredValue.slice(0, 6).split("");
      const newOtp = [...otp];

      // Fill the OTP array starting from current index
      characters.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });

      setOtp(newOtp);

      // Focus on the next empty field or the last field
      const nextEmptyIndex = newOtp.findIndex(
        (val, i) => i >= index && val === ""
      );
      const focusIndex =
        nextEmptyIndex !== -1
          ? nextEmptyIndex
          : Math.min(index + characters.length, 5);
      document.getElementById(`otp-${focusIndex}`)?.focus();
      return;
    }

    // Handle single character input
    if (filteredValue.length === 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = filteredValue;
    setOtp(newOtp);

    if (filteredValue && index < 5) {
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

  const handleVerify = async () => {
    // Filter out empty strings and join
    const otpCode = otp.filter((char) => char !== "").join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-character verification code", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    try {
      await onVerify(otpCode, email);
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  const handleResend = async () => {
    if (!onResend) return;

    setIsResending(true);
    try {
      await onResend(email);
      toast.success("OTP resent to your email!", {
        duration: 3000,
        position: "top-center",
      });
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
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 text-lg"
          aria-label="Close modal"
        >
          ×
        </button>
        <div className="text-center mb-8">
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">
            {description}
            <br />
            <span className="font-medium text-slate-900">{email}</span>
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          {otp.map((char, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={6}
              value={char}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={(e) => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData("text");
                handleOtpChange(index, pastedData);
              }}
              style={{ textTransform: "uppercase" }}
              className="w-12 h-12 text-center text-xl font-semibold border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none uppercase"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 ${
            isVerifying ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            verifyButtonText
          )}
        </button>

        {onResend && (
          <p className="text-center text-sm text-slate-600">
            Did not receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {isResending ? "Sending..." : resendButtonText}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
