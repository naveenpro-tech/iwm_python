"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

// Mock data for recent searches
const MOCK_RECENT_SEARCHES = [
  "Oppenheimer",
  "Christopher Nolan",
  "Sci-Fi movies",
  "Leonardo DiCaprio",
  "Inception",
  "Bollywood 2023",
]

export function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState(MOCK_RECENT_SEARCHES)

  const handleClearAll = () => {
    setRecentSearches([])
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-[#A0A0A0]" />
            <h2 className="text-[#E0E0E0] font-inter font-medium text-base">Recent Searches</h2>
          </div>

          {recentSearches.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-[#00BFFF] text-sm hover:underline font-dmsans focus:outline-none focus:ring-2 focus:ring-[#00BFFF] rounded-md px-1"
            >
              Clear All
            </button>
          )}
        </div>

        {recentSearches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentSearches.map((search, index) => (
              <motion.button
                key={index}
                className="text-left p-2 rounded-lg hover:bg-[#3A3A3A] text-[#E0E0E0] font-dmsans transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                {search}
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.p className="text-[#A0A0A0] font-dmsans text-center py-4" variants={itemVariants}>
            No recent searches
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
