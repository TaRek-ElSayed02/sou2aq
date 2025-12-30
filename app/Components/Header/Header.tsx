"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const Logo = "/logo.png";
  const [open, setOpen] = useState(false);

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

        <div className="hidden md:flex gap-6 items-center">
          <Link href="/auth/login">Log in</Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign up
          </Link>
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
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
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
          <Link onClick={() => setOpen(false)} href="/">Home</Link>
          <Link onClick={() => setOpen(false)} href="/">About</Link>
          <Link onClick={() => setOpen(false)} href="/">Our App</Link>
          <Link onClick={() => setOpen(false)} href="/">Contacts</Link>
        </nav>

        <div className="mt-auto px-6 pb-8 flex flex-col gap-4">
          <Link
            href="/auth/login"
            className="text-center"
            onClick={() => setOpen(false)}
          >
            Log in
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 text-white text-center py-2 rounded-lg"
            onClick={() => setOpen(false)}
          >
            Sign up
          </Link>
        </div>
      </aside>
    </>
  );
}
