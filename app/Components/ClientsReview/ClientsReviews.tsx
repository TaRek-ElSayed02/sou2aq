import React from "react";
import { motion, Transition } from "framer-motion";
import { Variants } from "framer-motion";


export default function ClientsReviews() {
  const clients = [
    {
      img: "/Clients/client1.png",
      text: "Get a fully retina ready site when you build with Startup Framework. Websites look sharper and more gorgeous on devices with retina display support",
      name: "Rayhan Curran",
    },
    {
      img: "/Clients/client2.png",
      text: "As a business targeting high net worth individuals, we were looking for a slick, cool and mini-malistic design for our website",
      name: "Kayley Frame",
    },
    {
      img: "/Clients/client3.png",
      text: "The most important part of the Startup Framework is the samples",
      name: "Gene Whitfield",
    },
    {
      img: "/Clients/client4.png",
      text: "I’ve built my website with Startup just in one day, and it was ready-to-go.",
      name: "Allan Kim",
    },
  ];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.6,
        ease: [0.42, 0, 0.58, 1], // استخدم array بدل string "easeOut"
      } as Transition,
    }),
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-16">
      <h2 className="text-[#0F172A] text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10">
        What Clients say about us
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {clients.map((client, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            className="flex gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={client.img}
              alt={client.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
            />
            <div className="flex flex-col justify-between gap-2">
              <p className="text-sm sm:text-base text-[#0B1B35]">{client.text}</p>
              <h4 className="font-semibold text-[#0B1B35] mt-2">{client.name}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
