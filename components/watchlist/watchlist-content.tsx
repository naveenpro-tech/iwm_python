"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { WatchlistHeader } from "./watchlist-header"
import { WatchlistGrid } from "./watchlist-grid"
import { WatchlistEmptyState } from "./watchlist-empty-state"

export function WatchlistContent() {
  const [hasItems, setHasItems] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")

  // This would normally come from a database or API
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    // Simulate empty state for demo purposes
    setHasItems(filter !== "watched")
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <WatchlistHeader activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      <div className="container mx-auto px-4 py-6">
        {hasItems ? <WatchlistGrid activeFilter={activeFilter} /> : <WatchlistEmptyState activeFilter={activeFilter} />}
      </div>
    </motion.div>
  )
}
