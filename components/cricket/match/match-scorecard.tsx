"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

interface BattingEntry {
  playerName: string
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dismissal: string
}

interface BowlingEntry {
  playerName: string
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
}

interface Innings {
  team: string
  totalRuns: number
  wickets: number
  overs: number
  extras: number
  battingScorecard: BattingEntry[]
  bowlingScorecard: BowlingEntry[]
}

export interface MatchScorecardProps {
  innings: Innings[]
}

export function MatchScorecard({ innings }: MatchScorecardProps) {
  const [activeInnings, setActiveInnings] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center mb-6">
        <TrendingUp className="text-[#00BFFF] mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Scorecard</h2>
      </div>

      <div className="flex mb-6 border-b border-[#333]">
        {innings.map((inning, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-medium ${
              activeInnings === index ? "text-[#00BFFF] border-b-2 border-[#00BFFF]" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveInnings(index)}
          >
            {inning.team} - {inning.totalRuns}/{inning.wickets}
          </button>
        ))}
      </div>

      {innings[activeInnings] && (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-white">{innings[activeInnings].team}</h3>
              <div className="text-white">
                {innings[activeInnings].totalRuns}/{innings[activeInnings].wickets} ({innings[activeInnings].overs}{" "}
                overs)
              </div>
            </div>
            <p className="text-gray-400 text-sm">Extras: {innings[activeInnings].extras}</p>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-medium text-white mb-3">Batting</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="text-left py-2 text-gray-400">Batter</th>
                    <th className="text-right py-2 text-gray-400">R</th>
                    <th className="text-right py-2 text-gray-400">B</th>
                    <th className="text-right py-2 text-gray-400">4s</th>
                    <th className="text-right py-2 text-gray-400">6s</th>
                    <th className="text-right py-2 text-gray-400">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {innings[activeInnings].battingScorecard.map((entry, index) => (
                    <tr key={index} className="border-b border-[#333]">
                      <td className="py-2">
                        <div>
                          <div className="text-white font-medium">{entry.playerName}</div>
                          <div className="text-gray-400 text-xs">{entry.dismissal}</div>
                        </div>
                      </td>
                      <td className="text-right py-2 text-white font-medium">{entry.runs}</td>
                      <td className="text-right py-2 text-gray-300">{entry.balls}</td>
                      <td className="text-right py-2 text-gray-300">{entry.fours}</td>
                      <td className="text-right py-2 text-gray-300">{entry.sixes}</td>
                      <td className="text-right py-2 text-gray-300">{entry.strikeRate.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">Bowling</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="text-left py-2 text-gray-400">Bowler</th>
                    <th className="text-right py-2 text-gray-400">O</th>
                    <th className="text-right py-2 text-gray-400">M</th>
                    <th className="text-right py-2 text-gray-400">R</th>
                    <th className="text-right py-2 text-gray-400">W</th>
                    <th className="text-right py-2 text-gray-400">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {innings[activeInnings].bowlingScorecard.map((entry, index) => (
                    <tr key={index} className="border-b border-[#333]">
                      <td className="py-2 text-white font-medium">{entry.playerName}</td>
                      <td className="text-right py-2 text-gray-300">{entry.overs.toFixed(1)}</td>
                      <td className="text-right py-2 text-gray-300">{entry.maidens}</td>
                      <td className="text-right py-2 text-gray-300">{entry.runs}</td>
                      <td className="text-right py-2 text-white font-medium">{entry.wickets}</td>
                      <td className="text-right py-2 text-gray-300">{entry.economy.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
