import Link from "next/link";
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const Logo = "/logo.png";

  return (
    <footer className="bg-gray-100 w-full mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 flex flex-col lg:flex-row justify-between gap-10">
        
        <div className="flex flex-col gap-4 lg:w-1/3">
          <img src={Logo} className="h-10 w-auto" alt="Logo" />
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

        
        </div>

        <div className="flex flex-col gap-2 text-gray-700 lg:w-1/3  items-center" >
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/" className="hover:text-blue-600 transition">About</Link>
          <Link href="/" className="hover:text-blue-600 transition">Our App</Link>
          <Link href="/" className="hover:text-blue-600 transition">Contacts</Link>
        </div>

        <div className="flex flex-col gap-2 lg:w-1/3  items-center">
          <h4 className="font-semibold mb-2">Account</h4>
          <Link href="/auth/login" className="hover:text-blue-600 transition">Log in</Link>
          <Link href="/auth/register" className=" text-center py-2 px-4 rounded-lg transition w-max">
            Sign up
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  )
}
