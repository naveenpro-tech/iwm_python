"use client"

import { motion } from "framer-motion"

export function CalendarHeader() {
  return (
    <div className="mb-6">
      <motion.h2
        className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Movie Calendar
      </motion.h2>
      <motion.p
        className="text-[#A0A0A0] font-dmsans mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Discover upcoming releases and never miss a premiere
      </motion.p>
    </div>
  )
}
