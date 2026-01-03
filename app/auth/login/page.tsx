"use client";
import React, { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { login } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const background = "/background.png";

  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error,accessToken } = useAppSelector((state) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      login({
        identifier,
        password,
      })
    );
  };

  useEffect(() => {
  if (accessToken) {
    router.replace("/"); 
  }
}, [accessToken, router]);

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
            <div>
              <h1 className="text-6xl font-bold leading-tight bg-gradient-to-b from-white via-white to-slate-300 bg-clip-text text-transparent">
                Start Your
                <br />
                Journey
                <br />
                with Us
              </h1>
            </div>
            <div className="flex items-center gap-3 text-white">
              <p className="text-sm"></p>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center relative">
          <div className="w-full bg-white rounded-2xl shadow-lg p-21 flex flex-col justify-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-600 mb-8 text-base">
                Sign in to your account
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email or Username"
                       className="w-full px-4 py-3 pl-11 pr-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-base"
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-11 pr-11 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-base"
                      placeholder="Enter your password"
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    href="/auth/forgetPassword"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot Password
                  </Link>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                {error && (
                  <p className="text-red-600 text-sm text-center mt-2">
                    {error}
                  </p>
                )}

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
                  className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors text-base"
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
                  Sign in with Google
                </button>

                <p className="text-center text-sm text-slate-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
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
          <div className="bg-white  rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl z-100000000 font-bold text-slate-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600 mb-8 text-base">
              Sign in to your account
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Username"
                     className="w-full px-4 py-3 pl-11 pr-11 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-base"
                  />
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
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

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-11 pr-11 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-base"
                    placeholder="Enter your password"
                  />
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/auth/forgetPassword"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password
                </Link>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {error && (
                <p className="text-red-600 text-sm text-center mt-2">{error}</p>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-500">or</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition-colors text-base"
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
                Sign in with Google
              </button>

              <p className="text-center text-sm text-slate-600 pt-2">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
