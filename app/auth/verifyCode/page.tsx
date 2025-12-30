'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const background = "/left.png";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];

    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 6);

    const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''));
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/auth/resetPassword`;
  };

  const handleResend = () => {
    setTimer(59);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (s: number) =>
    `00:${s.toString().padStart(2, '0')}`;

  return (
    <>
      <div className="hidden lg:flex w-full h-screen overflow-hidden gap-8 p-4 py-2 bg-slate-50">

        <div className="w-1/2 rounded-2xl overflow-hidden">
          <img src={background} className="w-full h-full object-cover" />
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full bg-white rounded-2xl shadow-lg px-21 py-51.5 flex flex-col justify-center">


            <Link href="/auth/forgetPassword" className="flex items-center gap-2 mb-6">
              <ArrowLeft size={20} /> Back
            </Link>

            <h2 className="text-3xl font-bold mb-2">OTP Verification</h2>
            <p className="text-slate-600 mb-8">
              Check your email to see the verification code
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  value={v}
                  maxLength={1}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-xl border-2 rounded-lg"
                />
              ))}
            </div>

            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg">
              Verify
            </button>

            <p className="text-center mt-4 text-sm">
              {timer > 0 ? `Resend in ${formatTime(timer)}` : (
                <button onClick={handleResend} className="text-blue-600">
                  Resend
                </button>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="block lg:hidden min-h-screen bg-slate-900">

        <div className="h-48 relative">
          <img src={background} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>

        <div className="mt-2 px-4">
          <div className="bg-white rounded-3xl p-6 shadow-xl">

            <Link href="/auth/forgetPassword" className="flex items-center gap-2 mb-4">
              <ArrowLeft size={20} /> Back
            </Link>

            <h2 className="text-2xl font-bold mb-2">OTP Verification</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Enter the 6-character code sent to your email
            </p>

            <div className="flex justify-between mb-6">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  value={v}
                  maxLength={1}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg border-2 rounded-xl"
                />
              ))}
            </div>

            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-xl">
              Verify
            </button>

            <p className="text-center mt-4 text-sm">
              {timer > 0 ? `Resend in ${formatTime(timer)}` : (
                <button onClick={handleResend} className="text-blue-600 font-medium">
                  Resend
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
