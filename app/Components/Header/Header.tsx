"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const Logo = "/logo.png";
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log(user?.accountInfo.role)
    console.log(accessToken)

  }, [accessToken])

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/auth/login");
  };

  const profileImage = `http://localhost:5000${user?.accountInfo?.profileImage}`

  console.log("Profile Image:", profileImage);

  return (
    <>
      <header className="w-full px-6 md:px-12 py-4 flex items-center justify-between">
        <img src={Logo} className="h-8 w-auto" alt="Logo" />

        <nav className="hidden md:flex gap-10 items-center">
          <Link href="/">Home</Link>
          <Link href="/About">About</Link>
          <Link href="/Blogs">Blogs</Link>
          <Link href="/">Our App</Link>
          <Link href="/">Contacts</Link>
        </nav>

        <div className="hidden md:flex gap-6 items-center relative">
          {!accessToken ? (
            <>
              <Link href="/auth/login">Log in</Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2"
              >
                <img
                  src={profileImage}
                  alt="User"
                  width={35}
                  height={35}
                  className="w-10 h-10 rounded-full object-cover border"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={28} />
        </button>
      </header>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl
        transform transition-all duration-300 ease-out
        ${open ? "translate-x-0 scale-100" : "translate-x-full scale-95"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <img src={Logo} className="h-7" />
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={26} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6 py-8 text-lg">
          <Link onClick={() => setOpen(false)} href="/">
            Home
          </Link>
          <Link onClick={() => setOpen(false)} href="/">
            About
          </Link>
          <Link onClick={() => setOpen(false)} href="/">
            Our App
          </Link>
          <Link onClick={() => setOpen(false)} href="/">
            Contacts
          </Link>
        </nav>

        <div className="mt-auto px-6 pb-8 flex flex-col gap-4">
          {!accessToken ? (
            <>
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white text-center py-2 rounded-lg"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                {user?.accountInfo?.profileImage && (
                  <img
                    src={`http://localhost:5000${user.accountInfo.profileImage}`}
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                )}

                <div>
                  <p className="font-semibold">
                    {user?.personalInfo?.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.personalInfo?.email}
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-left"
              >
                Profile
              </Link>

              <button onClick={handleLogout} className="text-left text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
