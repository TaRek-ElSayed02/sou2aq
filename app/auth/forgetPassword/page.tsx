'use client';
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const background = "/left.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/auth/verifyCode`;
    console.log('Reset password submitted');
  };

  return (
    <>
      <div className="hidden lg:flex w-full h-screen overflow-hidden gap-8 p-4 py-2 bg-slate-50">
        <div className="w-1/2 relative overflow-hidden bg-slate-900 rounded-2xl shadow-lg">
          <img 
            src={background} 
            alt="Background" 
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-12">
            <div className="flex items-center gap-3 text-white">
              <p className="text-sm">

              </p>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center relative">
          <div className="w-full bg-white rounded-2xl shadow-lg px-21 py-37 flex flex-col justify-center">
            <div>
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium"
              >
                <ArrowLeft size={20} />
                Back to Login
              </Link>

              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
              <p className="text-slate-600 mb-8 text-base">Enter your email to reset your password</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-base"
                      placeholder="domat@example.com"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base"
                >
                  Send OTP
                </button>

                <p className="text-center text-sm text-slate-600">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block lg:hidden w-full min-h-screen bg-slate-900">
        <div className="relative h-35">
          <img 
            src={background} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
        </div>

        <div className="px-2 pb-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium"
            >
              <ArrowLeft size={20} />
              Back
            </Link>

            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password?</h2>
            <p className="text-slate-600 mb-8 text-base">Enter your email to reset your password</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-11 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-base"
                    placeholder="domat@example.com"
                  />
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base shadow-lg shadow-blue-600/30"
              >
                Send OTP
              </button>

              <p className="text-center text-sm text-slate-600 pt-2">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}