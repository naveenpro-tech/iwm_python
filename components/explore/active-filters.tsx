"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FilterState } from "./types"

interface ActiveFiltersProps {
  filters: FilterState
  searchQuery: string
  onClearFilter: (filterType: keyof FilterState, value?: string) => void
  onClearSearchQuery: () => void
  onClearAll: () => void
}

export function ActiveFilters({
  filters,
  searchQuery,
  onClearFilter,
  onClearSearchQuery,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.languages.length > 0 ||
    filters.countries.length > 0 ||
    filters.yearRange[0] > 1900 ||
    filters.yearRange[1] < new Date().getFullYear() ||
    filters.ratingRange[0] > 0 ||
    filters.ratingRange[1] < 10 ||
    searchQuery !== ""

  if (!hasActiveFilters) return null

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <motion.div className="mb-4" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-[#A0A0A0]">Active Filters:</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-[#00BFFF] hover:text-[#00BFFF]/80 hover:bg-[#00BFFF]/10 h-7 px-2 text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Search Query */}
        {searchQuery && (
          <motion.div
            className="bg-[#282828] rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            variants={itemVariants}
          >
            <span>Search: {searchQuery}</span>
            <button onClick={onClearSearchQuery} className="ml-1 text-[#A0A0A0] hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}

        {/* Genres */}
        {filters.genres.map((genre) => (
          <motion.div
            key={`genre-${genre}`}
            className="bg-[#282828] rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            variants={itemVariants}
          >
            <span>{genre}</span>
            <button onClick={() => onClearFilter("genres", genre)} className="ml-1 text-[#A0A0A0] hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}

        {/* Year Range */}
        {(filters.yearRange[0] > 1900 || filters.yearRange[1] < new Date().getFullYear()) && (
          <motion.div
            className="bg-[#282828] rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            variants={itemVariants}
          >
            <span>
              Year: {filters.yearRange[0]} - {filters.yearRange[1]}
            </span>
            <button onClick={() => onClearFilter("yearRange")} className="ml-1 text-[#A0A0A0] hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}

        {/* Languages */}
        {filters.languages.map((language) => (
          <motion.div
            key={`language-${language}`}
            className="bg-[#282828] rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            variants={itemVariants}
          >
            <span>{language}</span>
            <button
              onClick={() => onClearFilter("languages", language)}
              className="ml-1 text-[#A0A0A0] hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}

        {/* Countries */}
        {filters.countries.map((country) => (
          <motion.div
            key={`country-${country}`}
            className="bg-[#282828] rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            variants={itemVariants}
          >
            <span>{country}</span>
            <button
              onClick={() => onClearFilter("countries", country)}
              className="ml-1 text-[#A0A0A0] hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}

        {/* Rating Range */}
        {(filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10) && (
          <motion.div
            className="bg-[#282828] rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            variants={itemVariants}
          >
            <span>
              Rating: {filters.ratingRange[0]} - {filters.ratingRange[1]}
            </span>
            <button onClick={() => onClearFilter("ratingRange")} className="ml-1 text-[#A0A0A0] hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
