"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"

interface Team {
  id: string
  name: string
  shortName: string
  logoUrl: string
  score?: string
}

export interface MatchHeaderProps {
  matchId: string
  tournament: string
  stage: string
  date: string
  venue: string
  status: "upcoming" | "live" | "completed"
  result?: string
  homeTeam: Team
  awayTeam: Team
}

export function MatchHeader({ tournament, stage, date, venue, status, result, homeTeam, awayTeam }: MatchHeaderProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  })

  const getStatusBadge = () => {
    switch (status) {
      case "live":
        return (
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-white"></span>
            LIVE
          </div>
        )
      case "upcoming":
        return <div className="bg-[#333] text-white px-3 py-1 rounded-full text-sm font-medium">Upcoming</div>
      case "completed":
        return <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">Completed</div>
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl overflow-hidden mb-8"
    >
      <div className="bg-[#252525] p-4">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h2 className="text-white font-bold">{tournament}</h2>
            <p className="text-gray-400 text-sm">{stage}</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="flex items-center text-gray-300 text-sm mb-2">
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm mb-2">
              <Clock size={14} className="mr-1" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin size={14} className="mr-1" />
              <span>{venue}</span>
            </div>
          </div>

          {status === "completed" && result && (
            <div className="bg-[#252525] px-4 py-2 rounded-lg">
              <p className="text-white text-center">{result}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="relative h-24 w-24 mb-3">
              <Image src={homeTeam.logoUrl || "/placeholder.svg"} alt={homeTeam.name} fill className="object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{homeTeam.name}</h3>
            <p className="text-gray-400">{homeTeam.shortName}</p>
          </div>

          <div className="flex items-center justify-center mb-6 md:mb-0">
            {status === "live" || status === "completed" ? (
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <span className="text-3xl md:text-5xl font-bold text-white">{homeTeam.score}</span>
                  <span className="text-2xl md:text-4xl font-bold text-gray-400 mx-3">vs</span>
                  <span className="text-3xl md:text-5xl font-bold text-white">{awayTeam.score}</span>
                </div>
                {status === "live" && (
                  <div className="mt-2 text-red-500 font-medium">
                    <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-red-500 inline-block"></span>
                    LIVE
                  </div>
                )}
              </div>
            ) : (
              <div className="text-2xl md:text-4xl font-bold text-gray-400">vs</div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 mb-3">
              <Image src={awayTeam.logoUrl || "/placeholder.svg"} alt={awayTeam.name} fill className="object-contain" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{awayTeam.name}</h3>
            <p className="text-gray-400">{awayTeam.shortName}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
