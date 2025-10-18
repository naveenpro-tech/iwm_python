"use client"

import { motion } from "framer-motion"
import type { MovieRelease } from "@/components/movie-calendar/types"

interface DateCellProps {
  date: Date | null
  releases: MovieRelease[]
  isToday: boolean
  isSelected: boolean
  onSelect?: () => void
}

export function DateCell({ date, releases, isToday, isSelected, onSelect }: DateCellProps) {
  if (!date) {
    // Empty cell for days outside the current month
    return <div className="aspect-square p-1 bg-[#1A1A1A]/50 rounded-md" />
  }

  // Count releases by type
  const theatricalReleases = releases.filter((r) => r.releaseType === "theatrical")
  const ottReleases = releases.filter((r) => r.releaseType === "ott")

  // Determine if there are any releases
  const hasReleases = releases.length > 0

  // Cell animation variants
  const cellVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.button
      className={`
        relative aspect-square p-1 md:p-2 rounded-md flex flex-col items-center justify-start
        ${isSelected ? "bg-[#00BFFF]/20 border border-[#00BFFF]" : "bg-[#1A1A1A] border border-transparent"}
        ${isToday && !isSelected ? "border border-[#00BFFF]/50" : ""}
        ${hasReleases ? "hover:bg-[#3A3A3A]" : "hover:bg-[#282828]"}
        transition-colors
      `}
      onClick={onSelect}
      variants={cellVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`}
      aria-selected={isSelected}
      aria-current={isToday ? "date" : undefined}
    >
      {/* Date number */}
      <span
        className={`
          text-sm md:text-base font-inter font-medium
          ${isSelected ? "text-[#00BFFF]" : "text-[#E0E0E0]"}
          ${isToday && !isSelected ? "text-[#00BFFF]" : ""}
        `}
      >
        {date.getDate()}
      </span>

      {/* Release indicators */}
      {hasReleases && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
          {theatricalReleases.length > 0 && (
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {ottReleases.length > 0 && (
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#00BFFF]"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          )}
        </div>
      )}

      {/* Release count badge (for dates with many releases) */}
      {releases.length > 2 && (
        <div className="absolute top-1 right-1 bg-[#3A3A3A] text-[#E0E0E0] text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {releases.length}
        </div>
      )}
    </motion.button>
  )
}
