"use client"

import { motion } from "framer-motion"
import { User, TrendingUp } from "lucide-react"
import Image from "next/image"

interface PlayerPerformance {
  id: string
  name: string
  team: string
  avatarUrl: string
  role: string
  stats: {
    batting?: {
      runs: number
      balls: number
      fours: number
      sixes: number
      strikeRate: number
    }
    bowling?: {
      overs: number
      maidens: number
      runs: number
      wickets: number
      economy: number
    }
  }
}

export interface MatchPlayerStatsProps {
  playerOfTheMatch: PlayerPerformance
  topPerformers: PlayerPerformance[]
}

export function MatchPlayerStats({ playerOfTheMatch, topPerformers }: MatchPlayerStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center mb-6">
        <User className="text-[#00BFFF] mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Player Performances</h2>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Player of the Match</h3>
        <div className="bg-[#252525] p-4 rounded-lg border border-[#FFD700]">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex flex-col items-center mb-4 md:mb-0 md:mr-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden mb-2 border-2 border-[#FFD700]">
                <Image
                  src={playerOfTheMatch.avatarUrl || "/placeholder.svg"}
                  alt={playerOfTheMatch.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-white font-bold">{playerOfTheMatch.name}</h4>
              <p className="text-gray-400 text-sm">{playerOfTheMatch.team}</p>
              <p className="text-[#FFD700] text-sm">{playerOfTheMatch.role}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {playerOfTheMatch.stats.batting && (
                <div>
                  <h5 className="text-white font-medium mb-2">Batting</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Runs</span>
                      <span className="text-white font-medium">{playerOfTheMatch.stats.batting.runs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balls</span>
                      <span className="text-white">{playerOfTheMatch.stats.batting.balls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">4s / 6s</span>
                      <span className="text-white">
                        {playerOfTheMatch.stats.batting.fours} / {playerOfTheMatch.stats.batting.sixes}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Strike Rate</span>
                      <span className="text-white">{playerOfTheMatch.stats.batting.strikeRate.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {playerOfTheMatch.stats.bowling && (
                <div>
                  <h5 className="text-white font-medium mb-2">Bowling</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Overs</span>
                      <span className="text-white">{playerOfTheMatch.stats.bowling.overs.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wickets</span>
                      <span className="text-white font-medium">{playerOfTheMatch.stats.bowling.wickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Runs</span>
                      <span className="text-white">{playerOfTheMatch.stats.bowling.runs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Economy</span>
                      <span className="text-white">{playerOfTheMatch.stats.bowling.economy.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-4">Top Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPerformers.map((performer) => (
            <motion.div
              key={performer.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#252525] p-4 rounded-lg"
            >
              <div className="flex items-center mb-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src={performer.avatarUrl || "/placeholder.svg"}
                    alt={performer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-white font-medium">{performer.name}</h4>
                  <p className="text-gray-400 text-xs">{performer.team}</p>
                </div>
              </div>

              <div className="space-y-2">
                {performer.stats.batting && (
                  <div className="flex items-center">
                    <TrendingUp size={14} className="text-[#00BFFF] mr-1" />
                    <span className="text-gray-400 text-sm mr-1">Batting:</span>
                    <span className="text-white text-sm">
                      {performer.stats.batting.runs} runs ({performer.stats.batting.balls} balls)
                    </span>
                  </div>
                )}

                {performer.stats.bowling && (
                  <div className="flex items-center">
                    <TrendingUp size={14} className="text-[#00BFFF] mr-1" />
                    <span className="text-gray-400 text-sm mr-1">Bowling:</span>
                    <span className="text-white text-sm">
                      {performer.stats.bowling.wickets}/{performer.stats.bowling.runs} ({performer.stats.bowling.overs}{" "}
                      overs)
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
