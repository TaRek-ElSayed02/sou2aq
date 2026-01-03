import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

export default function SendEmail() {
  const EmailImage = "/Email.png"

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-16">
      <motion.h2
        className="text-[#0F172A] text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Subscribe Our Newsletter
      </motion.h2>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
        <motion.img
          src={EmailImage}
          className="w-60 sm:w-70 h-40 sm:h-70"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          className="flex flex-col w-full lg:w-1/2 gap-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3 className="text-gray-700 text-sm sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </h3>

          <input
            type="email"
            placeholder="Your Email here"
            className="border border-gray-300 rounded-4xl p-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xl "
          />

          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-md transition-all duration-300"
          >
            Subscribe Our Newsletter
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
