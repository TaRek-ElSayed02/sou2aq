import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";


export default function Goals() {
  const icon1 = "/Activity.png";

  const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // easeOut cubic-bezier
    },
  }),
};

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-16">
      
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-[#0F172A] text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10"
      >
        Our Vision & Our Goal
      </motion.h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        
        {[1, 2, 3].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.03 }}
            className="flex flex-col items-center justify-between h-[400px] text-center shadow-xl rounded-2xl p-6 gap-4 bg-white"
          >
            <motion.img
              src={icon1}
              alt="icon"
              className="w-12 h-12"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            <h3 className="text-xl font-semibold text-[#0F172A]">
              Graphic Design
            </h3>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dui mi, bibendum eu erat id, ultricies semper metus.
            </p>

            <Link
              href="/auth/login"
              className="mt-4 bg-blue-600 text-white py-2.5 px-8 rounded-lg hover:bg-blue-700 transition"
            >
              Learn More
            </Link>
          </motion.div>
        ))}

      </div>
    </div>
  );
}
