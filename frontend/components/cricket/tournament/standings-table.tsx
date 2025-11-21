"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import Image from "next/image"

interface TeamStanding {
  position: number
  team: {
    name: string
    logoUrl: string
  }
  played: number
  won: number
  lost: number
  drawn: number
  points: number
  netRunRate?: number
  form?: ("W" | "L" | "D" | "N")[]
  positionChange?: "up" | "down" | "same"
}

interface StandingsTableProps {
  standings: TeamStanding[]
  title?: string
  showNetRunRate?: boolean
  showForm?: boolean
}

export default function StandingsTable({
  standings,
  title = "Tournament Standings",
  showNetRunRate = true,
  showForm = true,
}: StandingsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#333]">
              <th className="text-left py-3 text-gray-400">Pos</th>
              <th className="text-left py-3 text-gray-400">Team</th>
              <th className="text-center py-3 text-gray-400">P</th>
              <th className="text-center py-3 text-gray-400">W</th>
              <th className="text-center py-3 text-gray-400">L</th>
              <th className="text-center py-3 text-gray-400">D</th>
              <th className="text-center py-3 text-gray-400">Pts</th>
              {showNetRunRate && <th className="text-center py-3 text-gray-400">NRR</th>}
              {showForm && <th className="text-center py-3 text-gray-400">Form</th>}
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <motion.tr
                key={team.team.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-[#333] hover:bg-[#252525]"
              >
                <td className="py-3 pl-3">
                  <div className="flex items-center">
                    <span className="text-white mr-2">{team.position}</span>
                    {team.positionChange && (
                      <span>
                        {team.positionChange === "up" ? (
                          <TrendingUp size={14} className="text-green-500" />
                        ) : team.positionChange === "down" ? (
                          <TrendingDown size={14} className="text-red-500" />
                        ) : (
                          <Minus size={14} className="text-gray-500" />
                        )}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="relative w-8 h-8 mr-2">
                      <Image
                        src={team.team.logoUrl || "/placeholder.svg"}
                        alt={team.team.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-white">{team.team.name}</span>
                  </div>
                </td>
                <td className="py-3 text-center text-white">{team.played}</td>
                <td className="py-3 text-center text-white">{team.won}</td>
                <td className="py-3 text-center text-white">{team.lost}</td>
                <td className="py-3 text-center text-white">{team.drawn}</td>
                <td className="py-3 text-center text-white font-bold">{team.points}</td>
                {showNetRunRate && (
                  <td className="py-3 text-center text-white">
                    {team.netRunRate !== undefined ? team.netRunRate.toFixed(3) : "-"}
                  </td>
                )}
                {showForm && team.form && (
                  <td className="py-3 text-center">
                    <div className="flex justify-center space-x-1">
                      {team.form.map((result, i) => (
                        <span
                          key={i}
                          className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${
                            result === "W"
                              ? "bg-green-900 text-green-300"
                              : result === "L"
                                ? "bg-red-900 text-red-300"
                                : result === "D"
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
