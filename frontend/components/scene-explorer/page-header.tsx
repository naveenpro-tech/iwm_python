"use client"

import { motion } from "framer-motion"

export default function PageHeader() {
  return (
    <motion.header
      className="py-12 md:py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 opacity-10 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="w-full h-full bg-[url('/abstract-film-strip-dark.png')] bg-center bg-no-repeat bg-cover"></div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-inter text-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Scene Explorer
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-dm-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Discover unforgettable moments from cinema's greatest stories
        </motion.p>
      </div>
    </motion.header>
  )
}
