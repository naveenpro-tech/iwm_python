"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarNavigationProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onGoToToday: () => void
}

export function CalendarNavigation({ currentDate, onPrevMonth, onNextMonth, onGoToToday }: CalendarNavigationProps) {
  // Format the current month and year
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const month = monthNames[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#282828] rounded-lg p-4">
      <div className="flex items-center mb-4 sm:mb-0">
        <motion.h3
          className="text-xl font-bold font-inter text-[#E0E0E0]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={`${month}-${year}`} // Key for animation when month changes
        >
          {month} {year}
        </motion.h3>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A] hover:text-[#E0E0E0]"
          onClick={onGoToToday}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Today
        </Button>

        <div className="flex items-center space-x-1">
          <motion.button
            className="p-2 rounded-full bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#00BFFF]/20 hover:text-[#00BFFF] transition-colors"
            onClick={onPrevMonth}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            className="p-2 rounded-full bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#00BFFF]/20 hover:text-[#00BFFF] transition-colors"
            onClick={onNextMonth}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
