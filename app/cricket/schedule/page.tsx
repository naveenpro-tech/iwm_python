"use client"

import { useState, useEffect } from "react"
import { getUpcomingMatches } from "@/components/cricket/mock-data"
import { MatchCard } from "@/components/cricket/match-card"
import type { CricketMatch, MatchFilter } from "@/components/cricket/types"
import { motion } from "framer-motion"
import { Filter, Search, Calendar } from "lucide-react"
import { format, addDays, isSameDay, isAfter, isBefore, parseISO } from "date-fns"

export default function SchedulePage() {
  const [matches, setMatches] = useState<CricketMatch[]>([])
  const [filteredMatches, setFilteredMatches] = useState<CricketMatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<MatchFilter>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchMatches = () => {
      setIsLoading(true)

      // Simulate API call with setTimeout
      setTimeout(() => {
        const upcomingMatches = getUpcomingMatches()
        setMatches(upcomingMatches)
        setFilteredMatches(upcomingMatches)
        setIsLoading(false)
      }, 1000)
    }

    fetchMatches()
  }, [])

  // Filter matches based on search query, active filters, and selected date
  useEffect(() => {
    let filtered = [...matches]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (match) =>
          match.teams.home.name.toLowerCase().includes(query) ||
          match.teams.away.name.toLowerCase().includes(query) ||
          match.series.name.toLowerCase().includes(query) ||
          match.venue.name.toLowerCase().includes(query) ||
          match.venue.city.toLowerCase().includes(query),
      )
    }

    // Apply match type filter
    if (activeFilters.matchType && activeFilters.matchType.length > 0) {
      filtered = filtered.filter((match) => activeFilters.matchType?.includes(match.matchType))
    }

    // Apply series filter
    if (activeFilters.series) {
      filtered = filtered.filter((match) => match.series.id === activeFilters.series)
    }

    // Apply team filter
    if (activeFilters.team) {
      filtered = filtered.filter(
        (match) => match.teams.home.id === activeFilters.team || match.teams.away.id === activeFilters.team,
      )
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter((match) => isSameDay(parseISO(match.startTime), selectedDate))
    }

    // Apply date range filter
    if (activeFilters.dateRange) {
      const { start, end } = activeFilters.dateRange
      filtered = filtered.filter(
        (match) =>
          (isAfter(parseISO(match.startTime), parseISO(start)) ||
            isSameDay(parseISO(match.startTime), parseISO(start))) &&
          (isBefore(parseISO(match.startTime), parseISO(end)) || isSameDay(parseISO(match.startTime), parseISO(end))),
      )
    }

    setFilteredMatches(filtered)
  }, [matches, searchQuery, activeFilters, selectedDate])

  // Toggle match type filter
  const toggleMatchTypeFilter = (type: "T20" | "ODI" | "Test" | "T10" | "Other") => {
    setActiveFilters((prev) => {
      const currentTypes = prev.matchType || []
      const newTypes = currentTypes.includes(type) ? currentTypes.filter((t) => t !== type) : [...currentTypes, type]

      return {
        ...prev,
        matchType: newTypes.length > 0 ? newTypes : undefined,
      }
    })
  }

  // Generate next 7 days for date selector
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i))

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-40 bg-[#333333] rounded-md animate-pulse mb-6"></div>

        <div className="h-10 bg-[#333333] rounded-md animate-pulse mb-6"></div>

        <div className="h-16 bg-[#333333] rounded-md animate-pulse mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#282828] rounded-lg h-48 animate-pulse"></div>
          ))}
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
        Match Schedule
      </motion.h1>

      {/* Search and filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-4"
      >
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" size={18} />
          <input
            type="text"
            placeholder="Search teams, series, venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#333333] border-none rounded-lg py-2 pl-10 pr-4 text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:ring-2 focus:ring-[#00BFFF] focus:outline-none"
          />
        </div>

        {/* Date selector */}
        <div className="mb-4 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedDate(null)}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-md min-w-[80px] transition-colors ${
                selectedDate === null ? "bg-[#00BFFF] text-[#1A1A1A]" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
              }`}
            >
              <Calendar size={16} className="mb-1" />
              <span className="text-xs font-medium">All Dates</span>
            </button>

            {next7Days.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-md min-w-[80px] transition-colors ${
                  selectedDate && isSameDay(date, selectedDate)
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center mr-2">
            <Filter size={16} className="text-[#A0A0A0] mr-1" />
            <span className="text-sm text-[#A0A0A0]">Filters:</span>
          </div>

          <button
            onClick={() => toggleMatchTypeFilter("T20")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilters.matchType?.includes("T20")
                ? "bg-[#00BFFF] text-[#1A1A1A]"
                : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
            }`}
          >
            T20
          </button>

          <button
            onClick={() => toggleMatchTypeFilter("ODI")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilters.matchType?.includes("ODI")
                ? "bg-[#00BFFF] text-[#1A1A1A]"
                : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
            }`}
          >
            ODI
          </button>

          <button
            onClick={() => toggleMatchTypeFilter("Test")}
            className={`px-3 py-1 rounded-full text-sm ${
              activeFilters.matchType?.includes("Test")
                ? "bg-[#00BFFF] text-[#1A1A1A]"
                : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
            }`}
          >
            Test
          </button>

          {activeFilters.matchType?.length || activeFilters.series || activeFilters.team || selectedDate ? (
            <button
              onClick={() => {
                setActiveFilters({})
                setSelectedDate(null)
              }}
              className="px-3 py-1 rounded-full text-sm bg-[#FF4D4D] text-white hover:bg-[#FF6B6B]"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      </motion.div>

      {/* Schedule list */}
      {filteredMatches.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} type="upcoming" />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#282828] rounded-lg p-6 text-center"
        >
          <p className="text-[#A0A0A0]">No matches found matching your filters.</p>
        </motion.div>
      )}
    </div>
  )
}
