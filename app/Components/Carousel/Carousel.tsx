import * as React from "react";
import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, Variants } from "framer-motion";

const data = [
  { label: "pro1", img: "/Products/c1.jpg" },
  { label: "pro2", img: "/Products/c2.jpg" },
  { label: "pro3", img: "/Products/c3.jpg" },
  { label: "pro4", img: "/Products/c4.jpg" },
  { label: "pro5", img: "/Products/c5.jpg" },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function Slider() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex justify-center w-full flex-col items-center mb-8"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-[#0F172A] text-3xl sm:text-4xl mb-8 font-bold"
      >
        Our Projects
      </motion.h2>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full max-w-6xl"
      >
        <Carousel opts={{ align: "center" }}>
          <CarouselContent className="-ml-6">
            {data.map((item, index) => (
              <CarouselItem
                key={index}
                className="pl-6 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CardContent className="p-0 overflow-hidden rounded-xl">
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-[300px] object-cover"
                    />
                  </CardContent>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </motion.div>
    </motion.section>
  );
}
