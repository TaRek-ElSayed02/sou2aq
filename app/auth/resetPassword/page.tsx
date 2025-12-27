'use client';
import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const background = "/left.png";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSuccess(true);
  };

  const handleSignIn = () => {
    window.location.href = '/auth/login';
  };

  if (isSuccess) {
    return (
      <>
        <div className="hidden lg:flex w-full h-screen overflow-hidden gap-8 p-4 py-2 bg-slate-50">

          <div className="w-1/2 rounded-2xl overflow-hidden">
            <img src={background} className="w-full h-full object-cover" />
          </div>

          <div className="w-1/2 flex items-center justify-center">
            <div className="w-full bg-white rounded-2xl shadow-lg px-20 py-56 text-left">
              <div className="flex justify-center mb-6">
                <CheckCircle size={80} className="text-green-500" />
              </div>

              <h2 className="text-3xl font-bold mb-2">Password Reset Successful!</h2>
              <p className="text-slate-600 mb-8">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>

              <button
                onClick={handleSignIn}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        <div className="block lg:hidden min-h-screen bg-slate-900">
          <div className="h-48 relative">
            <img src={background} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/60" />
          </div>

          <div className="mt-2 px-4">
            <div className="bg-white rounded-3xl p-6 shadow-xl text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle size={60} className="text-green-500" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
              <p className="text-slate-600 mb-6 text-sm">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>

              <button
                onClick={handleSignIn}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden lg:flex w-full h-screen overflow-hidden gap-8 p-4 py-2 bg-slate-50">

        <div className="w-1/2 rounded-2xl overflow-hidden">
          <img src={background} className="w-full h-full object-cover" />
        </div>

        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full bg-white rounded-2xl shadow-lg px-20 py-41">
            <a href="/auth/verifycode" className="flex items-center gap-2 mb-6 cursor-pointer hover:text-blue-600">
              <ArrowLeft size={20} /> Back
            </a>

            <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
            <p className="text-slate-600 mb-8">
              Enter your new password below
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </form>
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
            <a href="/auth/verifycode" className="flex items-center gap-2 mb-4 cursor-pointer hover:text-blue-600">
              <ArrowLeft size={20} /> Back
            </a>

            <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Enter your new password below
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}