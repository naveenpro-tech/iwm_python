"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export interface PreviousYearsNavigationProps {
  awardId: string
  currentYear: number
  previousYears: number[]
}

export function PreviousYearsNavigation({ awardId, currentYear, previousYears }: PreviousYearsNavigationProps) {
  // Sort years in descending order
  const sortedYears = [...previousYears].sort((a, b) => b - a)

  // Find current year index
  const currentYearIndex = sortedYears.indexOf(currentYear)

  // Determine previous and next years
  const previousYear = currentYearIndex < sortedYears.length - 1 ? sortedYears[currentYearIndex + 1] : null
  const nextYear = currentYearIndex > 0 ? sortedYears[currentYearIndex - 1] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-4 mb-8"
    >
      <div className="flex justify-between items-center">
        <div>
          {previousYear && (
            <Link href={`/awards/${awardId}/${previousYear}`}>
              <motion.button whileHover={{ x: -3 }} className="flex items-center text-gray-300 hover:text-white">
                <ChevronLeft size={16} className="mr-1" />
                <span>{previousYear}</span>
              </motion.button>
            </Link>
          )}
        </div>

        <div className="flex space-x-2">
          {sortedYears.map((year) => (
            <Link key={year} href={`/awards/${awardId}/${year}`}>
              <span
                className={`px-3 py-1 rounded-md text-sm ${
                  year === currentYear
                    ? "bg-[#FFD700] text-black font-medium"
                    : "bg-[#252525] text-gray-300 hover:bg-[#333] hover:text-white"
                }`}
              >
                {year}
              </span>
            </Link>
          ))}
        </div>

        <div>
          {nextYear && (
            <Link href={`/awards/${awardId}/${nextYear}`}>
              <motion.button whileHover={{ x: 3 }} className="flex items-center text-gray-300 hover:text-white">
                <span>{nextYear}</span>
                <ChevronRight size={16} className="ml-1" />
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
