"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LiveMatchCard } from "./live-match-card"
import { MatchCard } from "./match-card"
import { getLiveMatches, getUpcomingMatches, getCompletedMatches } from "./mock-data"
import type { CricketMatch, MatchFilter } from "./types"
import { Calendar, Clock, ChevronRight } from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"

export function CricketDashboard() {
  const [liveMatches, setLiveMatches] = useState<CricketMatch[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<CricketMatch[]>([])
  const [completedMatches, setCompletedMatches] = useState<CricketMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<MatchFilter>({})
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Fetch matches
  useEffect(() => {
    const fetchMatches = () => {
      setIsLoading(true)

      // Simulate API call with setTimeout
      setTimeout(() => {
        setLiveMatches(getLiveMatches())
        setUpcomingMatches(getUpcomingMatches())
        setCompletedMatches(getCompletedMatches())
        setIsLoading(false)
      }, 1000)
    }

    fetchMatches()

    // Set up polling for live matches
    const intervalId = setInterval(() => {
      setLiveMatches(getLiveMatches())
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(intervalId)
  }, [])

  // Filter upcoming matches by selected date
  const filteredUpcomingMatches = upcomingMatches.filter((match) => {
    const matchDate = new Date(match.startTime)
    return isSameDay(matchDate, selectedDate)
  })

  // Generate next 7 days for date selector
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-40 bg-[#333333] rounded-md animate-pulse mb-6"></div>

        {/* Live matches skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-[#333333] rounded-md animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#282828] rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Upcoming matches skeleton */}
        <div className="mb-8">
          <div className="h-6 w-40 bg-[#333333] rounded-md animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#282828] rounded-lg h-48 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-inter mb-6"
      >
        Cricket
      </motion.h1>

      {/* Live matches section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold font-inter mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Live Matches
        </h2>

        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((match, index) => (
              <LiveMatchCard key={match.id} match={match} expanded={index === 0} />
            ))}
          </div>
        ) : (
          <div className="bg-[#282828] rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-[#A0A0A0]">
              <Clock className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">No Live Matches</h3>
            <p className="text-[#A0A0A0]">
              There are no matches in progress right now. Check the upcoming matches below.
            </p>
          </div>
        )}
      </motion.section>

      {/* Upcoming matches section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold font-inter mb-4">Upcoming Matches</h2>

        {/* Date selector */}
        <div className="mb-4 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {next7Days.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-md min-w-[80px] transition-colors ${
                  isSameDay(date, selectedDate)
                    ? "bg-[#00BFFF] text-[#1A1A1A]"
                    : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
                }`}
              >
                <span className="text-xs font-medium">{format(date, "EEE")}</span>
                <span className="text-lg font-bold">{format(date, "d")}</span>
                <span className="text-xs">{format(date, "MMM")}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredUpcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUpcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} type="upcoming" />
            ))}
          </div>
        ) : (
          <div className="bg-[#282828] rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-[#A0A0A0]">
              <Calendar className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">No Matches Today</h3>
            <p className="text-[#A0A0A0]">
              There are no matches scheduled for this date. Please select another date to see upcoming fixtures.
            </p>
          </div>
        )}
      </motion.section>

      {/* Recent results section */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-inter">Recent Results</h2>
          <a href="/cricket/results" className="text-sm text-[#00BFFF] hover:underline flex items-center">
            View all
            <ChevronRight size={16} className="ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedMatches.slice(0, 6).map((match) => (
            <MatchCard key={match.id} match={match} type="completed" />
          ))}
        </div>
      </motion.section>
    </div>
  )
}
