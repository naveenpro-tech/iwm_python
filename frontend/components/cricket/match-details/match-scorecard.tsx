"use client"

import { useState } from "react"
import type { CricketMatch } from "../types"
import { motion } from "framer-motion"
import Image from "next/image"

interface MatchScorecardProps {
  match: CricketMatch
}

export function MatchScorecard({ match }: MatchScorecardProps) {
  const [activeInnings, setActiveInnings] = useState(0)

  const homeTeam = match.teams.home
  const awayTeam = match.teams.away

  // Get all innings including current
  const getAllInnings = () => {
    const allInnings = [...(match.innings || [])]
    if (match.currentInnings && !allInnings.find((i) => i.team === match.currentInnings?.team)) {
      allInnings.push(match.currentInnings)
    }
    return allInnings
  }

  const innings = getAllInnings()

  if (innings.length === 0) {
    return (
      <div className="bg-[#282828] rounded-lg p-6 text-center">
        <p className="text-[#A0A0A0]">No scorecard available yet</p>
      </div>
    )
  }

  return (
    <div>
      {/* Innings selector */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {innings.map((inning, index) => {
            const team = match.teams[inning.team === homeTeam.id ? "home" : "away"]
            return (
              <button
                key={index}
                onClick={() => setActiveInnings(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md whitespace-nowrap ${
                  activeInnings === index
                    ? "bg-[#00BFFF] text-[#1A1A1A]"
                    : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
                }`}
              >
                <div className="relative w-5 h-5">
                  <Image src={team.logo || "/placeholder.svg"} alt={team.name} fill className="object-contain" />
                </div>
                <span>
                  {team.shortName} {inning.runs}/{inning.wickets}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active innings scorecard */}
      <motion.div key={activeInnings} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        {innings[activeInnings] && (
          <div>
            <div className="bg-[#282828] rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-[#444444]">
                <h3 className="font-bold text-[#E0E0E0]">
                  {match.teams[innings[activeInnings].team === homeTeam.id ? "home" : "away"].name} Innings
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[#A0A0A0] text-sm">
                    {innings[activeInnings].runs}/{innings[activeInnings].wickets} (
                    {Math.floor(innings[activeInnings].overs)}.{(innings[activeInnings].overs % 1) * 10} ov)
                  </span>
                  <span className="text-[#A0A0A0] text-sm">RR: {innings[activeInnings].runRate.toFixed(2)}</span>
                </div>
              </div>

              {/* Batting table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#333333]">
                    <tr>
                      <th className="text-left py-2 px-4 text-[#A0A0A0] font-medium text-sm">Batter</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">R</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">B</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">4s</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">6s</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {innings[activeInnings].battingOrder.length > 0 ? (
                      innings[activeInnings].battingOrder.map((batter, index) => (
                        <tr key={index} className="border-b border-[#444444] last:border-0">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-[#E0E0E0]">{batter.player.name}</div>
                              <div className="text-xs text-[#A0A0A0]">{batter.dismissal || "not out"}</div>
                            </div>
                          </td>
                          <td className="text-center py-3 px-2 text-[#E0E0E0] font-medium">{batter.runs}</td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">{batter.balls}</td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">{batter.fours}</td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">{batter.sixes}</td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">{batter.strikeRate.toFixed(1)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-[#A0A0A0]">
                          No batting data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-[#333333]">
                    <tr>
                      <td className="py-2 px-4 text-[#E0E0E0] font-medium">Extras</td>
                      <td colSpan={5} className="py-2 px-4 text-[#A0A0A0]">
                        {innings[activeInnings].extras.total} (WD: {innings[activeInnings].extras.wides}, NB:{" "}
                        {innings[activeInnings].extras.noBalls}, B: {innings[activeInnings].extras.byes}, LB:{" "}
                        {innings[activeInnings].extras.legByes})
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 text-[#E0E0E0] font-medium">Total</td>
                      <td colSpan={5} className="py-2 px-4 text-[#E0E0E0] font-medium">
                        {innings[activeInnings].runs}/{innings[activeInnings].wickets} (
                        {Math.floor(innings[activeInnings].overs)}.{(innings[activeInnings].overs % 1) * 10} Overs, RR:{" "}
                        {innings[activeInnings].runRate.toFixed(2)})
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Bowling table */}
            <div className="bg-[#282828] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[#444444]">
                <h3 className="font-bold text-[#E0E0E0]">Bowling</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#333333]">
                    <tr>
                      <th className="text-left py-2 px-4 text-[#A0A0A0] font-medium text-sm">Bowler</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">O</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">M</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">R</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">W</th>
                      <th className="text-center py-2 px-2 text-[#A0A0A0] font-medium text-sm">ECON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {innings[activeInnings].bowlingFigures.length > 0 ? (
                      innings[activeInnings].bowlingFigures.map((bowler, index) => (
                        <tr key={index} className="border-b border-[#444444] last:border-0">
                          <td className="py-3 px-4 text-[#E0E0E0] font-medium">{bowler.player.name}</td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">
                            {Math.floor(bowler.overs)}.{(bowler.overs % 1) * 10}
                          </td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">{bowler.maidens}</td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">{bowler.runs}</td>
                          <td className="text-center py-3 px-2 text-[#E0E0E0] font-medium">{bowler.wickets}</td>
                          <td className="text-center py-3 px-2 text-[#A0A0A0]">{bowler.economy.toFixed(1)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-[#A0A0A0]">
                          No bowling data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
