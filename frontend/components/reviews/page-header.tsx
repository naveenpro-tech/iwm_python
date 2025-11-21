"use client"

import { motion } from "framer-motion"

export function PageHeader() {
  return (
    <motion.div
      className="mb-8 pt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-siddu-text-light mb-2 font-inter">Voice of Siddu Verse</h1>
      <p className="text-siddu-text-subtle text-lg font-dm-sans">
        Discover authentic community and critic insights on movies from around the world
      </p>
    </motion.div>
  )
}
