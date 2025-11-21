"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { CricketMatch } from "./types"
import { formatDistanceToNow, format } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"

interface MatchCardProps {
  match: CricketMatch
  type: "upcoming" | "completed"
}

export function MatchCard({ match, type }: MatchCardProps) {
  const homeTeam = match.teams.home
  const awayTeam = match.teams.away
  const isUpcoming = type === "upcoming"

  // Format match date
  const formatMatchDate = () => {
    const date = new Date(match.startTime)
    if (isUpcoming) {
      const isToday = new Date().toDateString() === date.toDateString()
      const isTomorrow = new Date(Date.now() + 86400000).toDateString() === date.toDateString()

      if (isToday) {
        return `Today, ${format(date, "h:mm a")}`
      } else if (isTomorrow) {
        return `Tomorrow, ${format(date, "h:mm a")}`
      } else {
        return format(date, "EEE, MMM d, h:mm a")
      }
    } else {
      return format(date, "EEE, MMM d")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#282828] rounded-lg overflow-hidden shadow-md border border-[#444444] hover:border-[#00BFFF] transition-all duration-300"
    >
      <div className="p-4">
        {/* Match header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {match.series.logo && (
              <Image
                src={match.series.logo || "/placeholder.svg"}
                alt={match.series.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-xs text-[#A0A0A0] font-medium truncate max-w-[150px]">{match.series.name}</span>
          </div>
          <div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#333333] text-[#A0A0A0]">
              {match.matchType}
            </span>
          </div>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image src={homeTeam.logo || "/placeholder.svg"} alt={homeTeam.name} fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-medium text-[#E0E0E0] text-sm">{homeTeam.name}</h3>
              {!isUpcoming && match.innings && match.innings.find((i) => i.team === homeTeam.id) && (
                <div className="text-sm font-bold text-[#E0E0E0]">
                  {match.innings.find((i) => i.team === homeTeam.id)?.runs}/
                  {match.innings.find((i) => i.team === homeTeam.id)?.wickets}
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-[#A0A0A0] text-xs">vs</div>

          <div className="flex items-center space-x-2">
            <div>
              <h3 className="font-medium text-[#E0E0E0] text-sm text-right">{awayTeam.name}</h3>
              {!isUpcoming && match.innings && match.innings.find((i) => i.team === awayTeam.id) && (
                <div className="text-sm font-bold text-[#E0E0E0] text-right">
                  {match.innings.find((i) => i.team === awayTeam.id)?.runs}/
                  {match.innings.find((i) => i.team === awayTeam.id)?.wickets}
                </div>
              )}
            </div>
            <div className="relative w-8 h-8">
              <Image src={awayTeam.logo || "/placeholder.svg"} alt={awayTeam.name} fill className="object-contain" />
            </div>
          </div>
        </div>

        {/* Match info */}
        <div className="space-y-1">
          {/* Date and time */}
          <div className="flex items-center text-xs text-[#A0A0A0]">
            <Calendar size={12} className="mr-1" />
            <span>{formatMatchDate()}</span>
          </div>

          {/* Venue */}
          <div className="flex items-center text-xs text-[#A0A0A0]">
            <MapPin size={12} className="mr-1" />
            <span>
              {match.venue.name}, {match.venue.city}
            </span>
          </div>

          {/* Match result for completed matches */}
          {!isUpcoming && match.result && (
            <div className="mt-2 pt-2 border-t border-[#444444]">
              <p className="text-sm font-medium text-[#E0E0E0]">{match.result.description}</p>
              {match.manOfTheMatch && (
                <p className="text-xs text-[#A0A0A0] mt-1">Man of the Match: {match.manOfTheMatch.name}</p>
              )}
            </div>
          )}

          {/* Countdown for upcoming matches */}
          {isUpcoming && (
            <div className="mt-2 pt-2 border-t border-[#444444] flex items-center">
              <Clock size={12} className="mr-1 text-[#A0A0A0]" />
              <span className="text-xs text-[#A0A0A0]">
                Starts {formatDistanceToNow(new Date(match.startTime), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer with link to match details */}
      <Link
        href={`/cricket/matches/${match.id}`}
        className="block bg-[#333333] py-2 px-4 text-center text-xs font-medium text-[#E0E0E0] hover:bg-[#444444] transition-colors"
      >
        {isUpcoming ? "Match Details" : "View Scorecard"}
      </Link>
    </motion.div>
  )
}
