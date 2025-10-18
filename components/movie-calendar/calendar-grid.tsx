"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { DateCell } from "@/components/movie-calendar/date-cell"
import type { MovieRelease } from "@/components/movie-calendar/types"

interface CalendarGridProps {
  currentDate: Date
  selectedDate: Date | null
  releases: MovieRelease[]
  onDateSelect: (date: Date) => void
  isLoading: boolean
}

export function CalendarGrid({ currentDate, selectedDate, releases, onDateSelect, isLoading }: CalendarGridProps) {
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()

    // Total days in the month
    const daysInMonth = lastDay.getDate()

    // Generate array of dates for the calendar
    const calendarDays: (Date | null)[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day))
    }

    return calendarDays
  }

  // Get calendar days
  const calendarDays = generateCalendarDays()

  // Get releases for a specific date
  const getReleasesForDate = (date: Date) => {
    if (!date) return []

    return releases.filter((release) => {
      const releaseDate = new Date(release.releaseDate)
      return (
        releaseDate.getDate() === date.getDate() &&
        releaseDate.getMonth() === date.getMonth() &&
        releaseDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelected = (date: Date) => {
    if (!selectedDate) return false

    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  // Animation variants
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="bg-[#282828] rounded-lg p-4 md:p-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin" />
          <span className="ml-2 text-[#E0E0E0] font-dmsans">Loading calendar...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Day names */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center py-2 text-[#A0A0A0] font-inter font-medium text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((date, index) => (
                <DateCell
                  key={date ? date.toISOString() : `empty-${index}`}
                  date={date}
                  releases={date ? getReleasesForDate(date) : []}
                  isToday={date ? isToday(date) : false}
                  isSelected={date ? isSelected(date) : false}
                  onSelect={date ? () => onDateSelect(date) : undefined}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
