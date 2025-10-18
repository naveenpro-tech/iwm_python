"use client"

import { Button } from "@/components/ui/button"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown, ChevronUp, Film, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { WatchlistItem, WatchlistStats } from "./types"

interface WatchlistStatisticsProps {
  items: WatchlistItem[]
}

export function WatchlistStatistics({ items }: WatchlistStatisticsProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const stats: WatchlistStats = items.reduce(
    (acc, item) => {
      // Count by status
      if (item.status === "watched") acc.watched++
      else if (item.status === "watching") acc.watching++
      else if (item.status === "want-to-watch") acc.wantToWatch++

      // Count by priority
      if (item.priority === "high") acc.highPriority++
      else if (item.priority === "medium") acc.mediumPriority++
      else if (item.priority === "low") acc.lowPriority++

      // Count upcoming releases (future release dates)
      const releaseDate = new Date(item.releaseDate)
      if (releaseDate > new Date()) acc.upcomingReleases++

      return acc
    },
    {
      total: items.length,
      watched: 0,
      watching: 0,
      wantToWatch: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      upcomingReleases: 0,
    },
  )

  const watchedPercentage = stats.total > 0 ? Math.round((stats.watched / stats.total) * 100) : 0

  return (
    <motion.div
      className="mb-6 bg-[#282828] rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-xl font-semibold text-[#E0E0E0] flex items-center">
          <Film className="mr-2 h-5 w-5 text-[#00BFFF]" />
          Watchlist Statistics
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-[#A0A0A0]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#A0A0A0]" />
        )}
      </div>

      {isExpanded && (
        <motion.div
          className="p-4 pt-0 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Total and Watched Progress */}
          <div className="col-span-2 md:col-span-1 bg-[#1A1A1A] rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className="text-[#3A3A3A]"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-[#00BFFF]"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - watchedPercentage / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-[#E0E0E0]">{watchedPercentage}%</span>
                <span className="text-xs text-[#A0A0A0]">Watched</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-[#A0A0A0]">Total Items</p>
              <p className="text-xl font-semibold text-[#E0E0E0]">{stats.total}</p>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#A0A0A0] mb-2">Status Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-[#32CD32]" />
                  <span className="text-sm text-[#E0E0E0]">Watched</span>
                </div>
                <span className="text-sm font-medium text-[#E0E0E0]">{stats.watched}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#FFD700]" />
                  <span className="text-sm text-[#E0E0E0]">Watching</span>
                </div>
                <span className="text-sm font-medium text-[#E0E0E0]">{stats.watching}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Film className="h-4 w-4 mr-2 text-[#00BFFF]" />
                  <span className="text-sm text-[#E0E0E0]">Want to Watch</span>
                </div>
                <span className="text-sm font-medium text-[#E0E0E0]">{stats.wantToWatch}</span>
              </div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="bg-[#1A1A1A] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[#A0A0A0] mb-2">Priority Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-[#FF4500]" />
                  <span className="text-sm text-[#E0E0E0]">High</span>
                </div>
                <span className="text-sm font-medium text-[#E0E0E0]">{stats.highPriority}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-[#FFD700]" />
                  <span className="text-sm text-[#E0E0E0]">Medium</span>
                </div>
                <span className="text-sm font-medium text-[#E0E0E0]">{stats.mediumPriority}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-[#32CD32]" />
                  <span className="text-sm text-[#E0E0E0]">Low</span>
                </div>
                <span className="text-sm font-medium text-[#E0E0E0]">{stats.lowPriority}</span>
              </div>
            </div>
          </div>

          {/* Upcoming Releases */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col justify-between">
            <h3 className="text-sm font-medium text-[#A0A0A0] mb-2">Upcoming Releases</h3>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-[#E0E0E0]">{stats.upcomingReleases}</div>
              <div className="text-xs text-[#A0A0A0]">in your watchlist</div>
            </div>
            <Button
              variant="link"
              className="text-[#00BFFF] p-0 h-auto mt-2 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              View Calendar
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
