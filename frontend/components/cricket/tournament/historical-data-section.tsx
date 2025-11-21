"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Star, Calendar } from "lucide-react"
import Image from "next/image"

interface HistoricalWinner {
  year: number
  team: {
    name: string
    logoUrl: string
  }
  captain: string
  venue: string
  result: string
}

interface HistoricalRecord {
  type: string
  player: {
    name: string
    team: string
  }
  value: string
  year: number
}

interface HistoricalDataSectionProps {
  winners: HistoricalWinner[]
  records: HistoricalRecord[]
  title?: string
}

export default function HistoricalDataSection({
  winners,
  records,
  title = "Tournament History",
}: HistoricalDataSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-4">
            <Trophy className="text-[#FFD700] mr-2" size={20} />
            <h3 className="text-xl font-medium text-white">Past Winners</h3>
          </div>

          <div className="space-y-4">
            {winners.slice(0, 5).map((winner, index) => (
              <motion.div
                key={winner.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="bg-[#252525] rounded-lg p-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-[#333] px-2 py-1 rounded mr-3 text-white font-medium">{winner.year}</div>

                    <div className="flex items-center">
                      <div className="relative w-8 h-8 mr-2">
                        <Image
                          src={winner.team.logoUrl || "/placeholder.svg"}
                          alt={winner.team.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-white">{winner.team.name}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 text-right">
                    <div>{winner.venue}</div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                  <span className="text-[#FFD700]">Captain:</span> {winner.captain}
                </div>

                <div className="mt-1 text-xs text-gray-400">{winner.result}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-4">
            <Award className="text-[#00BFFF] mr-2" size={20} />
            <h3 className="text-xl font-medium text-white">Tournament Records</h3>
          </div>

          <div className="space-y-4">
            {records.slice(0, 5).map((record, index) => (
              <motion.div
                key={`${record.type}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="bg-[#252525] rounded-lg p-3"
              >
                <div className="flex items-center mb-1">
                  <Star size={14} className="text-[#FFD700] mr-1" />
                  <span className="text-gray-300 text-sm">{record.type}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">{record.player.name}</div>
                    <div className="text-xs text-gray-400">{record.player.team}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[#00BFFF] font-bold">{record.value}</div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar size={10} className="mr-1" />
                      {record.year}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
