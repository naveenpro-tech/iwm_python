"use client"

import { useState } from "react"
import type { CricketMatch } from "../types"
import { motion } from "framer-motion"
import Image from "next/image"
import { User } from "lucide-react"

interface MatchPlayingXIProps {
  match: CricketMatch
}

export function MatchPlayingXI({ match }: MatchPlayingXIProps) {
  const [activeTeam, setActiveTeam] = useState<"home" | "away">("home")

  const homeTeam = match.teams.home
  const awayTeam = match.teams.away

  // Generate mock playing XI for each team
  const generatePlayingXI = (team: typeof homeTeam) => {
    // Use the players from the team, or generate more if needed
    const players = [...team.players]

    // If we need more players to make 11, add generic ones
    while (players.length < 11) {
      players.push({
        id: `player-${team.id}-${players.length + 1}`,
        name: `Player ${players.length + 1}`,
        role:
          players.length % 4 === 0
            ? "Batsman"
            : players.length % 4 === 1
              ? "Bowler"
              : players.length % 4 === 2
                ? "All-rounder"
                : "Wicket-keeper",
        country: team.name,
      })
    }

    return players
  }

  const homePlayingXI = generatePlayingXI(homeTeam)
  const awayPlayingXI = generatePlayingXI(awayTeam)

  const currentPlayingXI = activeTeam === "home" ? homePlayingXI : awayPlayingXI
  const currentTeam = activeTeam === "home" ? homeTeam : awayTeam

  return (
    <div>
      {/* Team selector */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTeam("home")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            activeTeam === "home" ? "bg-[#00BFFF] text-[#1A1A1A]" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
          }`}
        >
          <div className="relative w-6 h-6">
            <Image src={homeTeam.logo || "/placeholder.svg"} alt={homeTeam.name} fill className="object-contain" />
          </div>
          <span>{homeTeam.name}</span>
        </button>

        <button
          onClick={() => setActiveTeam("away")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            activeTeam === "away" ? "bg-[#00BFFF] text-[#1A1A1A]" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
          }`}
        >
          <div className="relative w-6 h-6">
            <Image src={awayTeam.logo || "/placeholder.svg"} alt={awayTeam.name} fill className="object-contain" />
          </div>
          <span>{awayTeam.name}</span>
        </button>
      </div>

      {/* Team composition */}
      <motion.div
        key={activeTeam}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="mb-6"
      >
        <div className="bg-[#282828] rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Team Composition</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#333333] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#E0E0E0] mb-1">
                {currentPlayingXI.filter((p) => p.role === "Batsman").length}
              </div>
              <div className="text-sm text-[#A0A0A0]">Batsmen</div>
            </div>

            <div className="bg-[#333333] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#E0E0E0] mb-1">
                {currentPlayingXI.filter((p) => p.role === "Bowler").length}
              </div>
              <div className="text-sm text-[#A0A0A0]">Bowlers</div>
            </div>

            <div className="bg-[#333333] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#E0E0E0] mb-1">
                {currentPlayingXI.filter((p) => p.role === "All-rounder").length}
              </div>
              <div className="text-sm text-[#A0A0A0]">All-rounders</div>
            </div>

            <div className="bg-[#333333] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#E0E0E0] mb-1">
                {currentPlayingXI.filter((p) => p.role === "Wicket-keeper").length}
              </div>
              <div className="text-sm text-[#A0A0A0]">Wicket-keepers</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Playing XI list */}
      <div className="bg-[#282828] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#444444]">
          <h3 className="font-bold text-[#E0E0E0]">{currentTeam.name} Playing XI</h3>
        </div>

        <div className="divide-y divide-[#444444]">
          {currentPlayingXI.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center mr-3">
                  {player.image ? (
                    <Image
                      src={player.image || "/placeholder.svg"}
                      alt={player.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User size={20} className="text-[#A0A0A0]" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-[#E0E0E0]">{player.name}</div>
                  <div className="text-xs text-[#A0A0A0]">{player.role}</div>
                </div>
              </div>

              <div className="text-sm text-[#A0A0A0]">#{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
