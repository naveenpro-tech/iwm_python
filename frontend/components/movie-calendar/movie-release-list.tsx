"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Calendar } from "lucide-react"
import { MovieReleaseCard } from "@/components/movie-calendar/movie-release-card"
import type { MovieRelease } from "@/components/movie-calendar/types"

interface MovieReleaseListProps {
  releases: MovieRelease[]
  selectedDate: Date | null
  isLoading: boolean
}

export function MovieReleaseList({ releases, selectedDate, isLoading }: MovieReleaseListProps) {
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="bg-[#282828] rounded-lg p-4 md:p-6">
      <div className="flex items-center mb-4">
        <Calendar className="w-5 h-5 text-[#A0A0A0] mr-2" />
        <h3 className="font-inter font-medium text-[#E0E0E0]">
          {selectedDate ? `Releases on ${formatDate(selectedDate)}` : "Upcoming Releases"}
        </h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin" />
          <span className="ml-2 text-[#E0E0E0] font-dmsans">Loading releases...</span>
        </div>
      ) : releases.length > 0 ? (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {releases.map((release) => (
              <motion.div key={release.id} variants={itemVariants}>
                <MovieReleaseCard release={release} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="bg-[#1A1A1A] rounded-lg p-6 text-center">
          <p className="text-[#A0A0A0] font-dmsans mb-2">
            {selectedDate ? "No movie releases found for this date" : "No upcoming releases match your filters"}
          </p>
          <p className="text-[#E0E0E0] font-dmsans text-sm">
            {selectedDate ? "Try selecting a different date" : "Try adjusting your filters to see more results"}
          </p>
        </div>
      )}
    </div>
  )
}
