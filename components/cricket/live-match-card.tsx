"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { CricketMatch } from "./types"
import { ChevronRight } from "lucide-react"

interface LiveMatchCardProps {
  match: CricketMatch
  expanded?: boolean
}

export function LiveMatchCard({ match, expanded = false }: LiveMatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded)

  const homeTeam = match.teams.home
  const awayTeam = match.teams.away
  const currentInnings = match.currentInnings
  const isLive = match.status === "Live"

  // Format recent balls with color coding
  const formatBall = (ball: string) => {
    if (ball === "W") {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
          W
        </span>
      )
    } else if (ball === "4") {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold">
          4
        </span>
      )
    } else if (ball === "6") {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
          6
        </span>
      )
    } else if (ball === "0") {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-600 text-white text-xs font-bold">
          0
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
          {ball}
        </span>
      )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#282828] rounded-lg overflow-hidden shadow-lg border border-[#444444] hover:border-[#00BFFF] transition-all duration-300"
    >
      <div className="p-4">
        {/* Match header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {match.series.logo && (
              <Image
                src={match.series.logo || "/placeholder.svg"}
                alt={match.series.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-[#A0A0A0] font-medium truncate max-w-[150px]">{match.series.name}</span>
          </div>
          <div className="flex items-center">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                match.status === "Live"
                  ? "bg-red-600/20 text-red-500"
                  : match.status === "Innings Break"
                    ? "bg-amber-600/20 text-amber-500"
                    : "bg-blue-600/20 text-blue-500"
              }`}
            >
              {match.status === "Live" && (
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
              )}
              {match.status}
            </span>
          </div>
        </div>

        {/* Teams and scores */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image src={homeTeam.logo || "/placeholder.svg"} alt={homeTeam.name} fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-[#E0E0E0]">{homeTeam.name}</h3>
              {currentInnings && currentInnings.team === homeTeam.id && (
                <div className="text-lg font-bold text-[#E0E0E0]">
                  {currentInnings.runs}/{currentInnings.wickets}
                  <span className="text-sm font-normal text-[#A0A0A0] ml-1">
                    ({Math.floor(currentInnings.overs)}.{(currentInnings.overs % 1) * 10})
                  </span>
                </div>
              )}
              {match.innings && match.innings.find((i) => i.team === homeTeam.id) && (
                <div className="text-lg font-bold text-[#E0E0E0]">
                  {match.innings.find((i) => i.team === homeTeam.id)?.runs}/
                  {match.innings.find((i) => i.team === homeTeam.id)?.wickets}
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-[#A0A0A0] text-sm">vs</div>

          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-bold text-[#E0E0E0] text-right">{awayTeam.name}</h3>
              {currentInnings && currentInnings.team === awayTeam.id && (
                <div className="text-lg font-bold text-[#E0E0E0] text-right">
                  {currentInnings.runs}/{currentInnings.wickets}
                  <span className="text-sm font-normal text-[#A0A0A0] ml-1">
                    ({Math.floor(currentInnings.overs)}.{(currentInnings.overs % 1) * 10})
                  </span>
                </div>
              )}
              {match.innings && match.innings.find((i) => i.team === awayTeam.id) && (
                <div className="text-lg font-bold text-[#E0E0E0] text-right">
                  {match.innings.find((i) => i.team === awayTeam.id)?.runs}/
                  {match.innings.find((i) => i.team === awayTeam.id)?.wickets}
                </div>
              )}
            </div>
            <div className="relative w-10 h-10">
              <Image src={awayTeam.logo || "/placeholder.svg"} alt={awayTeam.name} fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Current batsmen and bowler - only show if match is live */}
        {isLive && match.currentBatsmen && match.currentBowler && (
          <div className="mb-4 bg-[#333333] rounded-md p-3">
            <div className="flex justify-between mb-2">
              <div>
                <span className="text-xs text-[#A0A0A0]">Batsmen</span>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-[#E0E0E0]">{match.currentBatsmen.striker.player.name}*</span>
                  <span className="text-[#E0E0E0]">
                    {match.currentBatsmen.striker.runs}
                    <span className="text-xs text-[#A0A0A0]">({match.currentBatsmen.striker.balls})</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-[#E0E0E0]">{match.currentBatsmen.nonStriker.player.name}</span>
                  <span className="text-[#E0E0E0]">
                    {match.currentBatsmen.nonStriker.runs}
                    <span className="text-xs text-[#A0A0A0]">({match.currentBatsmen.nonStriker.balls})</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#A0A0A0]">Bowler</span>
                <div>
                  <span className="font-medium text-[#E0E0E0]">{match.currentBowler.player.name}</span>
                </div>
                <div className="text-[#E0E0E0]">
                  {match.currentBowler.wickets}/{match.currentBowler.runs}
                  <span className="text-xs text-[#A0A0A0]">
                    ({Math.floor(match.currentBowler.overs)}.{(match.currentBowler.overs % 1) * 10})
                  </span>
                </div>
              </div>
            </div>

            {/* Recent balls */}
            {match.recentBalls && (
              <div>
                <span className="text-xs text-[#A0A0A0]">Recent</span>
                <div className="flex space-x-1 mt-1">
                  {match.recentBalls.map((ball, index) => (
                    <div key={index}>{formatBall(ball)}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="mt-2"
          >
            {/* Partnership */}
            {match.partnership && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#A0A0A0]">Partnership</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.partnership.runs} ({match.partnership.balls} balls)
                </span>
              </div>
            )}

            {/* Required run rate */}
            {match.requiredRunRate && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#A0A0A0]">Required RR</span>
                <span className="text-[#E0E0E0] font-medium">{match.requiredRunRate.toFixed(2)}</span>
              </div>
            )}

            {/* Win probability */}
            {match.winProbability && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#A0A0A0]">Win probability</span>
                  <div className="flex space-x-2">
                    <span style={{ color: homeTeam.primaryColor }}>
                      {homeTeam.shortName} {match.winProbability.home}%
                    </span>
                    <span style={{ color: awayTeam.primaryColor }}>
                      {awayTeam.shortName} {match.winProbability.away}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#444444] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${match.winProbability.home}%`,
                      backgroundColor: homeTeam.primaryColor,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Venue info */}
            <div className="text-xs text-[#A0A0A0] mb-3">
              {match.venue.name}, {match.venue.city}
            </div>
          </motion.div>
        )}

        {/* Toggle expand/collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center text-xs text-[#A0A0A0] hover:text-[#00BFFF] transition-colors mt-2"
        >
          {isExpanded ? "Show less" : "Show more"}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="ml-1">
            <ChevronRight size={14} className="rotate-90" />
          </motion.div>
        </button>
      </div>

      {/* Footer with link to match details */}
      <Link
        href={`/cricket/matches/${match.id}`}
        className="block bg-[#333333] py-2 px-4 text-center text-sm font-medium text-[#E0E0E0] hover:bg-[#444444] transition-colors"
      >
        View Full Scorecard
      </Link>
    </motion.div>
  )
}
