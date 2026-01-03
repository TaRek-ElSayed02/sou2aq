
"use client";

import Header from "./Components/Header/Header";
import Footer from "./Components/Footer.tsx/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Slider } from "./Components/Carousel/Carousel";
import Goals from "./Components/Goals/Goals";
import ClientsReviews from "./Components/ClientsReview/ClientsReviews";
import SendEmail from "./Components/SendEmail/SendEmail";

export default function Home() {
  const Hero = "/Hero.png";
  const BackArrow = "/backarrow.png";

  return (
    <div className="bg-[#F8FAFC] overflow-hidden">
      <Header />

      <section className="
        w-full
        px-6 md:px-10 lg:px-16
        py-10
        flex flex-col lg:flex-row
        items-center
        justify-between
        gap-12
      ">

        {/* ===== Left Content ===== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="
            w-full lg:w-[70%]
            flex flex-col gap-6
            text-center lg:text-left
          "
        >
          <h2 className="
          w-[70%]
            text-3xl sm:text-4xl lg:text-5xl
            font-bold
            text-[#0F172A]
          ">
            We boost growth for your startup business
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto lg:mx-0">
            Our goal is top at the heart of creativity services industry as a digital creator.
          </p>

          <Link
            href="/auth/login"
            className="
              bg-blue-600
              text-white
              py-3 px-8
              rounded-lg
              w-fit
              mx-auto lg:mx-0
            "
          >
            Get Started
          </Link>
        </motion.div>

        {/* ===== Right Content ===== */}
        <div className="
          w-full lg:w-[50%]
          flex justify-center
          relative
        ">

          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="
              hidden md:block
              absolute top-20 left-10
              z-10
              bg-white shadow-2xl
              rounded-lg px-4 py-2
            "
          >
            <h2 className="font-bold text-sm">100% Business Growth</h2>
            <h3 className="text-xs text-gray-500">(1520 Reviews)</h3>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="
              hidden md:block
              absolute bottom-10 left-0
              z-20
              bg-white shadow-2xl
              rounded-lg px-4 py-2
            "
          >
            <h2 className="font-bold text-sm">100% Business Growth</h2>
            <h3 className="text-xs text-gray-500">(1520 Reviews)</h3>
          </motion.div>

          {/* Hero Image */}
          <motion.img
            src={Hero}
            alt="Hero"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              w-[280px] sm:w-[320px] lg:w-[380px]
              h-auto
              relative z-20
            "
          />

          {/* Back Arrow */}
          <motion.img
            src={BackArrow}
            alt="Arrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="
              hidden lg:block
              w-[460px]
              h-auto
              absolute top-20 right-40
              z-10
            "
          />
        </div>
      </section>

      <Goals/>

      <Slider/>

      <ClientsReviews/>

      <SendEmail/>

      <Footer />
    </div>
  )
} 