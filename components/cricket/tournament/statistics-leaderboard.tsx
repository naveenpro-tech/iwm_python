"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface PlayerStat {
  id: string
  name: string
  team: {
    name: string
    logoUrl: string
  }
  avatarUrl: string
  value: number
  matches: number
}

interface StatCategory {
  id: string
  name: string
  unit: string
  players: PlayerStat[]
}

interface StatisticsLeaderboardProps {
  categories: StatCategory[]
  title?: string
}

export default function StatisticsLeaderboard({
  categories,
  title = "Tournament Statistics",
}: StatisticsLeaderboardProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "")

  const activeStats = categories.find((cat) => cat.id === activeCategory)?.players || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? "bg-[#00BFFF] text-black font-medium"
                  : "bg-[#252525] text-gray-300 hover:bg-[#333]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {activeStats.slice(0, 5).map((player, index) => {
          const activeCategory = categories.find((cat) => cat.id === activeCategory)
          const unit = activeCategory?.unit || ""

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="bg-[#252525] rounded-lg p-4"
            >
              <Link href={`/cricket/players/${player.id}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#333] rounded-full mr-3 text-white font-bold">
                      {index + 1}
                    </div>

                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={player.avatarUrl || "/placeholder.svg"}
                        alt={player.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <div className="text-white font-medium">{player.name}</div>
                      <div className="flex items-center text-xs text-gray-400">
                        <div className="relative w-4 h-4 mr-1">
                          <Image
                            src={player.team.logoUrl || "/placeholder.svg"}
                            alt={player.team.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {player.team.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-[#00BFFF]">
                      {player.value}
                      {unit}
                    </div>
                    <div className="text-xs text-gray-400">
                      {player.matches} {player.matches === 1 ? "match" : "matches"}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 text-center">
        <button className="text-[#00BFFF] hover:underline text-sm">View Full Leaderboard</button>
      </div>
    </motion.div>
  )
}
