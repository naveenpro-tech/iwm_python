"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

interface TrophyItem {
  name: string
  years: number[]
  count: number
}

interface TrophyCabinetProps {
  trophies: TrophyItem[]
}

export default function TrophyCabinet({ trophies }: TrophyCabinetProps) {
  if (trophies.length === 0) {
    return (
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Trophy Cabinet</h2>
        <p className="text-gray-400">No trophies found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center mb-6">
        <Trophy className="text-[#FFD700] mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Trophy Cabinet</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trophies.map((trophy, index) => (
          <motion.div
            key={trophy.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-[#252525] rounded-lg p-4 border border-[#333]"
          >
            <div className="flex items-center mb-3">
              <div className="bg-[#333] p-2 rounded-full mr-3">
                <Trophy size={16} className="text-[#FFD700]" />
              </div>
              <h3 className="text-lg font-medium text-white">{trophy.name}</h3>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400">Total Wins:</span>
              <span className="text-2xl font-bold text-[#FFD700]">{trophy.count}</span>
            </div>

            <div>
              <div className="text-sm text-gray-400 mb-2">Years Won:</div>
              <div className="flex flex-wrap gap-2">
                {trophy.years.map((year) => (
                  <span key={year} className="bg-[#333] text-white text-xs px-2 py-1 rounded">
                    {year}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
