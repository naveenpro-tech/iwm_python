"use client"

import { motion } from "framer-motion"
import { BarChart, PieChart } from "lucide-react"

interface TeamStatistics {
  team: string
  runs: number
  wickets: number
  runRate: number
  boundaries: {
    fours: number
    sixes: number
  }
  dotBalls: number
  partnerships: {
    highest: number
    players: string[]
  }
}

export interface MatchStatisticsProps {
  homeTeam: TeamStatistics
  awayTeam: TeamStatistics
}

export function MatchStatistics({ homeTeam, awayTeam }: MatchStatisticsProps) {
  // Calculate percentages for visualization
  const totalRuns = homeTeam.runs + awayTeam.runs
  const homeTeamRunsPercentage = Math.round((homeTeam.runs / totalRuns) * 100) || 0
  const awayTeamRunsPercentage = Math.round((awayTeam.runs / totalRuns) * 100) || 0

  const totalBoundaries = {
    fours: homeTeam.boundaries.fours + awayTeam.boundaries.fours,
    sixes: homeTeam.boundaries.sixes + awayTeam.boundaries.sixes,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center mb-6">
        <BarChart className="text-[#00BFFF] mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Match Statistics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Runs Comparison</h3>
          <div className="bg-[#252525] p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-white">{homeTeam.team}</span>
              <span className="text-white font-medium">{homeTeam.runs}</span>
            </div>
            <div className="w-full bg-[#333] rounded-full h-4 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${homeTeamRunsPercentage}%` }}
                transition={{ duration: 1 }}
                className="h-4 rounded-full bg-blue-500"
              />
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-white">{awayTeam.team}</span>
              <span className="text-white font-medium">{awayTeam.runs}</span>
            </div>
            <div className="w-full bg-[#333] rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${awayTeamRunsPercentage}%` }}
                transition={{ duration: 1 }}
                className="h-4 rounded-full bg-red-500"
              />
            </div>
          </div>

          <h3 className="text-lg font-medium text-white mt-6 mb-4">Run Rate</h3>
          <div className="bg-[#252525] p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-white">{homeTeam.team}</span>
              <span className="text-white font-medium">{homeTeam.runRate.toFixed(2)}</span>
            </div>
            <div className="w-full bg-[#333] rounded-full h-4 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(homeTeam.runRate / 12) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-4 rounded-full bg-blue-500"
              />
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-white">{awayTeam.team}</span>
              <span className="text-white font-medium">{awayTeam.runRate.toFixed(2)}</span>
            </div>
            <div className="w-full bg-[#333] rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(awayTeam.runRate / 12) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-4 rounded-full bg-red-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white mb-4">Boundaries</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#252525] p-4 rounded-lg">
              <h4 className="text-white text-center mb-2">Fours</h4>
              <div className="flex justify-center">
                <PieChart size={100} className="text-[#333]" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-300 text-sm">{homeTeam.team}</span>
                  </div>
                  <span className="text-white">{homeTeam.boundaries.fours}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-300 text-sm">{awayTeam.team}</span>
                  </div>
                  <span className="text-white">{awayTeam.boundaries.fours}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#252525] p-4 rounded-lg">
              <h4 className="text-white text-center mb-2">Sixes</h4>
              <div className="flex justify-center">
                <PieChart size={100} className="text-[#333]" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-300 text-sm">{homeTeam.team}</span>
                  </div>
                  <span className="text-white">{homeTeam.boundaries.sixes}</span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-300 text-sm">{awayTeam.team}</span>
                  </div>
                  <span className="text-white">{awayTeam.boundaries.sixes}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-white mt-6 mb-4">Highest Partnership</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#252525] p-4 rounded-lg">
              <h4 className="text-white text-center mb-2">{homeTeam.team}</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{homeTeam.partnerships.highest}</div>
                <div className="text-gray-300 text-sm">{homeTeam.partnerships.players.join(" & ")}</div>
              </div>
            </div>

            <div className="bg-[#252525] p-4 rounded-lg">
              <h4 className="text-white text-center mb-2">{awayTeam.team}</h4>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{awayTeam.partnerships.highest}</div>
                <div className="text-gray-300 text-sm">{awayTeam.partnerships.players.join(" & ")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
