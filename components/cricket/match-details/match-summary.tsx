"use client"

import type { CricketMatch } from "../types"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, User } from "lucide-react"

interface MatchSummaryProps {
  match: CricketMatch
}

export function MatchSummary({ match }: MatchSummaryProps) {
  const homeTeam = match.teams.home
  const awayTeam = match.teams.away

  // Get current or latest innings
  const getCurrentInnings = () => {
    if (match.currentInnings) {
      return match.currentInnings
    } else if (match.innings && match.innings.length > 0) {
      return match.innings[match.innings.length - 1]
    }
    return null
  }

  const currentInnings = getCurrentInnings()

  // Get batting team
  const getBattingTeam = () => {
    if (!currentInnings) return null
    return match.teams[currentInnings.team === homeTeam.id ? "home" : "away"]
  }

  const battingTeam = getBattingTeam()

  return (
    <div className="space-y-6">
      {/* Match status banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#282828] rounded-lg p-4"
      >
        <h3 className="text-lg font-bold text-[#E0E0E0] mb-2">
          {match.status === "Live" && "Match in Progress"}
          {match.status === "Innings Break" && "Innings Break"}
          {match.status === "Completed" && "Match Completed"}
          {match.status === "Upcoming" && "Match Upcoming"}
        </h3>

        {match.status === "Live" && currentInnings && battingTeam && (
          <p className="text-[#A0A0A0]">
            {battingTeam.name} are {currentInnings.runs}/{currentInnings.wickets} after{" "}
            {Math.floor(currentInnings.overs)}.{(currentInnings.overs % 1) * 10} overs
          </p>
        )}

        {match.status === "Innings Break" && match.innings && match.innings.length > 0 && (
          <p className="text-[#A0A0A0]">
            {match.teams[match.innings[0].team === homeTeam.id ? "home" : "away"].name} scored {match.innings[0].runs}/
            {match.innings[0].wickets}
          </p>
        )}

        {match.status === "Completed" && match.result && <p className="text-[#A0A0A0]">{match.result.description}</p>}

        {match.status === "Upcoming" && <p className="text-[#A0A0A0]">Match will begin soon</p>}
      </motion.div>

      {/* Key performers */}
      {(match.status === "Live" || match.status === "Completed" || match.status === "Innings Break") && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Key Performers</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Batsmen */}
            <Card className="bg-[#282828] border-[#444444]">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#E0E0E0] text-lg">Top Batsmen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {match.currentBatsmen ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center mr-3">
                            <User size={16} className="text-[#A0A0A0]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#E0E0E0]">{match.currentBatsmen.striker.player.name}</p>
                            <p className="text-xs text-[#A0A0A0]">{match.currentBatsmen.striker.player.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#E0E0E0]">{match.currentBatsmen.striker.runs}</p>
                          <p className="text-xs text-[#A0A0A0]">{match.currentBatsmen.striker.balls} balls</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center mr-3">
                            <User size={16} className="text-[#A0A0A0]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#E0E0E0]">{match.currentBatsmen.nonStriker.player.name}</p>
                            <p className="text-xs text-[#A0A0A0]">{match.currentBatsmen.nonStriker.player.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#E0E0E0]">{match.currentBatsmen.nonStriker.runs}</p>
                          <p className="text-xs text-[#A0A0A0]">{match.currentBatsmen.nonStriker.balls} balls</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-[#A0A0A0]">No batting data available</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Bowlers */}
            <Card className="bg-[#282828] border-[#444444]">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#E0E0E0] text-lg">Top Bowlers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {match.currentBowler ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center mr-3">
                          <User size={16} className="text-[#A0A0A0]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#E0E0E0]">{match.currentBowler.player.name}</p>
                          <p className="text-xs text-[#A0A0A0]">{match.currentBowler.player.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#E0E0E0]">
                          {match.currentBowler.wickets}/{match.currentBowler.runs}
                        </p>
                        <p className="text-xs text-[#A0A0A0]">
                          {Math.floor(match.currentBowler.overs)}.{(match.currentBowler.overs % 1) * 10} overs
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-[#A0A0A0]">No bowling data available</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Man of the Match */}
      {match.status === "Completed" && match.manOfTheMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#282828] rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <Trophy size={20} className="text-[#FFC107] mr-2" />
            <h3 className="text-lg font-bold text-[#E0E0E0]">Man of the Match</h3>
          </div>

          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-[#333333] flex items-center justify-center mr-4">
              <User size={32} className="text-[#A0A0A0]" />
            </div>
            <div>
              <p className="font-bold text-xl text-[#E0E0E0]">{match.manOfTheMatch.name}</p>
              <p className="text-[#A0A0A0]">
                {match.manOfTheMatch.role}, {match.manOfTheMatch.country}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Match progress */}
      {(match.status === "Live" || match.status === "Innings Break" || match.status === "Completed") && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Match Progress</h3>

          <div className="bg-[#282828] rounded-lg p-4">
            {match.innings &&
              match.innings.map((innings, index) => {
                const battingTeam = match.teams[innings.team === homeTeam.id ? "home" : "away"]
                return (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="relative w-6 h-6 mr-2">
                        <Image
                          src={battingTeam.logo || "/placeholder.svg"}
                          alt={battingTeam.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium text-[#E0E0E0]">{battingTeam.name} Innings</span>
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#A0A0A0] text-sm">
                        {innings.runs}/{innings.wickets} ({Math.floor(innings.overs)}.{(innings.overs % 1) * 10} ov)
                      </span>
                      <span className="text-[#A0A0A0] text-sm">RR: {innings.runRate.toFixed(2)}</span>
                    </div>

                    <div className="w-full h-2 bg-[#333333] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(innings.overs / 50) * 100}%`,
                          backgroundColor: battingTeam.primaryColor || "#00BFFF",
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}

            {match.currentInnings && (
              <div>
                <div className="flex items-center mb-2">
                  <div className="relative w-6 h-6 mr-2">
                    <Image
                      src={battingTeam?.logo || ""}
                      alt={battingTeam?.name || ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-medium text-[#E0E0E0]">{battingTeam?.name} Innings (In Progress)</span>
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#A0A0A0] text-sm">
                    {match.currentInnings.runs}/{match.currentInnings.wickets} ({Math.floor(match.currentInnings.overs)}
                    .{(match.currentInnings.overs % 1) * 10} ov)
                  </span>
                  <span className="text-[#A0A0A0] text-sm">RR: {match.currentInnings.runRate.toFixed(2)}</span>
                </div>

                <div className="w-full h-2 bg-[#333333] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(match.currentInnings.overs / 50) * 100}%`,
                      backgroundColor: battingTeam?.primaryColor || "#00BFFF",
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
