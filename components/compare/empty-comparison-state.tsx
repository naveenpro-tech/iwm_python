{
  ;`'use client'

import { Film } from 'lucide-react'
import { motion } from "framer-motion"

export function EmptyComparisonState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-lg shadow-xl"
    >
      <Film className="h-16 w-16 text-siddu-electric-blue mb-6" />
      <h2 className="text-2xl font-semibold text-white mb-3">Ready to Compare?</h2>
      <p className="text-gray-400 max-w-md">
        Add movies using the search bar above to see their details side-by-side.
        Uncover differences in ratings, runtime, box office performance, and more!
      </p>
    </motion.div>
  )
}`
}
