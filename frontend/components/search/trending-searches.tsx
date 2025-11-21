"use client"

import { motion } from "framer-motion"
import { TrendingUp, Flame } from "lucide-react"

// Mock data for trending searches
const MOCK_TRENDING_SEARCHES = [
  { text: "Oppenheimer", isHot: true },
  { text: "Barbie movie", isHot: true },
  { text: "Dune: Part Two", isHot: false },
  { text: "India vs Australia", isHot: false },
  { text: "Christopher Nolan", isHot: false },
  { text: "Killers of the Flower Moon", isHot: false },
]

export function TrendingSearches() {
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div
      className="bg-[#282828] rounded-xl overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="p-4 md:p-5">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-4 h-4 mr-2 text-[#A0A0A0]" />
          <h2 className="text-[#E0E0E0] font-inter font-medium text-base">Trending Now</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {MOCK_TRENDING_SEARCHES.map((search, index) => (
            <motion.button
              key={index}
              className="text-left p-2 rounded-lg hover:bg-[#3A3A3A] text-[#E0E0E0] font-dmsans transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.15 }}
            >
              <span className="truncate">{search.text}</span>
              {search.isHot && (
                <span className="ml-2 flex items-center text-[#FFD700] text-xs">
                  <Flame className="w-3 h-3 mr-0.5" />
                  Hot
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
