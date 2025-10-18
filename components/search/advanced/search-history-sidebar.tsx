"use client"

import { motion } from "framer-motion"
import { Clock, Filter, Hash } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SearchHistoryItem } from "./types"

interface SearchHistorySidebarProps {
  searchHistory: SearchHistoryItem[]
  onSelectHistory: (item: SearchHistoryItem) => void
}

export function SearchHistorySidebar({ searchHistory, onSelectHistory }: SearchHistorySidebarProps) {
  // Mock search history
  const mockHistory: SearchHistoryItem[] = [
    {
      id: "1",
      query: "Christopher Nolan movies",
      filters: {
        textFilters: {},
        peopleFilters: { directors: ["Christopher Nolan"] },
        dateFilters: {},
        ratingFilters: {},
        awardFilters: {},
        technicalFilters: {},
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      resultCount: 12,
    },
    {
      id: "2",
      query: "Oscar winners 2020s",
      filters: {
        textFilters: {},
        peopleFilters: {},
        dateFilters: { decade: "2020s" },
        ratingFilters: {},
        awardFilters: { hasOscar: true },
        technicalFilters: {},
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      resultCount: 45,
    },
    {
      id: "3",
      query: "High rated sci-fi",
      filters: {
        textFilters: { titleContains: "sci-fi" },
        peopleFilters: {},
        dateFilters: {},
        ratingFilters: { sidduScoreMin: 8 },
        awardFilters: {},
        technicalFilters: {},
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      resultCount: 78,
    },
  ]

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const getActiveFilterCount = (item: SearchHistoryItem) => {
    let count = 0
    Object.values(item.filters).forEach((category) => {
      Object.values(category).forEach((value) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          count++
        }
      })
    })
    return count
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-80">
      <Card className="bg-[#282828] border-gray-700 h-full">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Clock size={18} />
            Search History
          </h3>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 space-y-3">
            {mockHistory.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectHistory(item)}
                className="w-full text-left p-3 bg-[#333333] hover:bg-[#404040] rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-medium text-sm line-clamp-1">{item.query}</p>
                  <span className="text-gray-500 text-xs">{formatTimestamp(item.timestamp)}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-gray-400">
                    <Hash size={12} />
                    {item.resultCount} results
                  </span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <Filter size={12} />
                    {getActiveFilterCount(item)} filters
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  )
}
