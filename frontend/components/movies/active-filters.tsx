"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface ActiveFiltersProps {
  filters: {
    genres: string[]
    yearRange: [number, number]
    countries: string[]
    languages: string[]
    scoreRange: [number, number]
    status: string[]
  }
  onRemoveFilter: (type: string, value: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters: { type: string; value: string; label: string }[] = []

  // Collect all active filters
  filters.genres.forEach((genre) => {
    activeFilters.push({ type: "genre", value: genre, label: genre })
  })

  filters.countries.forEach((country) => {
    activeFilters.push({ type: "country", value: country, label: country })
  })

  filters.languages.forEach((language) => {
    activeFilters.push({ type: "language", value: language, label: language })
  })

  filters.status.forEach((status) => {
    const label = status === "theaters" ? "In Theaters" : status === "streaming" ? "Streaming" : "Coming Soon"
    activeFilters.push({ type: "status", value: status, label })
  })

  // Year range
  const currentYear = new Date().getFullYear()
  if (filters.yearRange[0] > 1900 || filters.yearRange[1] < currentYear) {
    activeFilters.push({
      type: "year",
      value: `${filters.yearRange[0]}-${filters.yearRange[1]}`,
      label: `${filters.yearRange[0]}-${filters.yearRange[1]}`,
    })
  }

  // Score range
  if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 10) {
    activeFilters.push({
      type: "score",
      value: `${filters.scoreRange[0]}-${filters.scoreRange[1]}`,
      label: `Score: ${filters.scoreRange[0]}-${filters.scoreRange[1]}`,
    })
  }

  if (activeFilters.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-4"
    >
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#A0A0A0] flex-shrink-0">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.type}-${filter.value}-${index}`}
              variant="secondary"
              className="bg-[#3A3A3A] text-[#E0E0E0] border-[#3A3A3A] hover:bg-[#3A3A3A]/80 cursor-pointer group"
              onClick={() => onRemoveFilter(filter.type, filter.value)}
            >
              {filter.label}
              <X className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-[#00BFFF] hover:text-[#00BFFF]/80 flex-shrink-0"
          >
            Clear All
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  )
}
