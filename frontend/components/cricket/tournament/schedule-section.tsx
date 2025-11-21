"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Match {
  id: string
  date: string
  time: string
  teams: {
    team1: {
      name: string
      logoUrl: string
    }
    team2: {
      name: string
      logoUrl: string
    }
  }
  venue: string
  group?: string
  stage?: string
  isCompleted: boolean
  result?: string
}

interface ScheduleSectionProps {
  matches: Match[]
  title?: string
}

export default function ScheduleSection({ matches, title = "Tournament Schedule" }: ScheduleSectionProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all")

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true
    if (filter === "upcoming") return !match.isCompleted
    if (filter === "completed") return match.isCompleted
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>

      <div className="flex mb-6 bg-[#252525] rounded-lg p-1">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 rounded-md text-center transition-colors ${
            filter === "all" ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          All Matches
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`flex-1 py-2 rounded-md text-center transition-colors ${
            filter === "upcoming" ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`flex-1 py-2 rounded-md text-center transition-colors ${
            filter === "completed" ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Completed
        </button>
      </div>

      {filteredMatches.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No matches found.</p>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className={`bg-[#252525] rounded-lg p-4 border-l-4 ${
                match.isCompleted ? "border-[#FFD700]" : "border-[#00BFFF]"
              }`}
            >
              <Link href={`/cricket/matches/${match.id}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    {(match.group || match.stage) && (
                      <div className="text-xs text-gray-400 mb-2">
                        {match.group ? `Group ${match.group}` : match.stage}
                      </div>
                    )}

                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        <div className="relative w-8 h-8 mr-2">
                          <Image
                            src={match.teams.team1.logoUrl || "/placeholder.svg"}
                            alt={match.teams.team1.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-white">{match.teams.team1.name}</span>
                      </div>

                      <span className="text-gray-400 mx-2">vs</span>

                      <div className="flex items-center">
                        <div className="relative w-8 h-8 mr-2">
                          <Image
                            src={match.teams.team2.logoUrl || "/placeholder.svg"}
                            alt={match.teams.team2.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="text-white">{match.teams.team2.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center text-gray-300">
                      <Calendar size={14} className="mr-1" />
                      {match.date}
                    </div>

                    <div className="flex items-center text-gray-300">
                      <Clock size={14} className="mr-1" />
                      {match.time}
                    </div>

                    <div className="flex items-center text-gray-300">
                      <MapPin size={14} className="mr-1" />
                      {match.venue}
                    </div>
                  </div>

                  {match.isCompleted && match.result && (
                    <div className="mt-3 md:mt-0 text-[#FFD700] font-medium">{match.result}</div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
