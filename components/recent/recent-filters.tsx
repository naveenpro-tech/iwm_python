"use client"

import { motion } from "framer-motion"
import { Film, Users, Briefcase, Trophy, Activity, PowerIcon as Pulse, Grid3X3 } from "lucide-react"
import type { ContentType, FilterOption } from "./types"

interface RecentFiltersProps {
  selectedFilter: ContentType | "all"
  onFilterChange: (filter: ContentType | "all") => void
  itemCounts: {
    all: number
    movie: number
    profile: number
    casting: number
    industry: number
    cricket: number
    pulse: number
  }
}

export function RecentFilters({ selectedFilter, onFilterChange, itemCounts }: RecentFiltersProps) {
  const filters: FilterOption[] = [
    { id: "all", label: "All", icon: Grid3X3, count: itemCounts.all },
    { id: "movie", label: "Movies", icon: Film, count: itemCounts.movie },
    { id: "profile", label: "Profiles", icon: Users, count: itemCounts.profile },
    { id: "casting", label: "Casting Calls", icon: Briefcase, count: itemCounts.casting },
    { id: "industry", label: "Industry Pro", icon: Trophy, count: itemCounts.industry },
    { id: "cricket", label: "Cricket", icon: Activity, count: itemCounts.cricket },
    { id: "pulse", label: "Pulse", icon: Pulse, count: itemCounts.pulse },
  ]

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon
          const isActive = selectedFilter === filter.id

          return (
            <motion.button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-dmsans text-sm
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#00BFFF] text-white"
                    : "bg-[#1A1A1A] text-[#A0A0A0] hover:bg-[#282828] hover:text-[#E0E0E0]"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <span
                  className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${isActive ? "bg-white/20" : "bg-[#282828]"}
                `}
                >
                  {filter.count}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
