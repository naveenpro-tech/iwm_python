"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export interface AwardHighlightsProps {
  highlights: string[]
}

export function AwardHighlights({ highlights }: AwardHighlightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <Star className="text-[#FFD700] mr-2" />
        Highlights
      </h2>

      <ul className="space-y-3">
        {highlights.map((highlight, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex items-start"
          >
            <div className="w-2 h-2 rounded-full bg-[#FFD700] mt-2 mr-3"></div>
            <p className="text-gray-300">{highlight}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
