"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Filter } from "lucide-react"
import type { TeamProfile } from "./types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CurrentSquadSectionProps {
  team: TeamProfile
}

export default function CurrentSquadSection({ team }: CurrentSquadSectionProps) {
  const [filter, setFilter] = useState("all")

  const filteredPlayers = team.players.filter((player) => {
    if (filter === "all") return true
    return player.role === filter
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="bg-[#282828] rounded-lg p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Current Squad</h2>
        <div className="flex items-center">
          <Filter className="text-[#00BFFF] mr-2" size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#333] text-white border border-[#444] rounded-md px-3 py-1"
          >
            <option value="all">All Players</option>
            <option value="Batsman">Batsmen</option>
            <option value="Bowler">Bowlers</option>
            <option value="All-rounder">All-rounders</option>
            <option value="Wicket-keeper">Wicket-keepers</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="mb-4">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filteredPlayers.map((player) => (
              <motion.div key={player.id} variants={item}>
                <Link href={`/cricket/players/${player.id}`}>
                  <div className="bg-[#333] rounded-lg overflow-hidden hover:bg-[#3A3A3A] transition-colors">
                    <div className="relative h-40 bg-[#222]">
                      <Image
                        src={player.imageUrl || "/placeholder.svg"}
                        alt={player.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-medium truncate">{player.name}</h3>
                      <p className="text-[#00BFFF] text-sm">{player.role}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="list">
          <div className="bg-[#333] rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-[#3A3A3A] p-3">
              <div className="col-span-5 text-[#E0E0E0] font-medium">Name</div>
              <div className="col-span-2 text-[#E0E0E0] font-medium">Role</div>
              <div className="col-span-2 text-[#E0E0E0] font-medium">Batting</div>
              <div className="col-span-2 text-[#E0E0E0] font-medium">Bowling</div>
              <div className="col-span-1 text-[#E0E0E0] font-medium">Age</div>
            </div>

            <motion.div variants={container} initial="hidden" animate="show">
              {filteredPlayers.map((player) => (
                <motion.div key={player.id} variants={item}>
                  <Link href={`/cricket/players/${player.id}`}>
                    <div className="grid grid-cols-12 p-3 border-b border-[#444] hover:bg-[#3A3A3A] transition-colors">
                      <div className="col-span-5 flex items-center">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                          <Image
                            src={player.imageUrl || "/placeholder.svg"}
                            alt={player.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-white">{player.name}</span>
                      </div>
                      <div className="col-span-2 text-[#00BFFF]">{player.role}</div>
                      <div className="col-span-2 text-[#E0E0E0]">{player.battingStyle}</div>
                      <div className="col-span-2 text-[#E0E0E0]">{player.bowlingStyle || "-"}</div>
                      <div className="col-span-1 text-[#E0E0E0]">{player.age}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-4">
        <Button variant="outline" className="border-[#444] text-[#E0E0E0] hover:bg-[#333]">
          View Full Squad
        </Button>
      </div>
    </div>
  )
}
