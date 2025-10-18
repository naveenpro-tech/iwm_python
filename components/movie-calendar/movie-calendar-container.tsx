"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarHeader } from "@/components/movie-calendar/calendar-header"
import { CalendarNavigation } from "@/components/movie-calendar/calendar-navigation"
import { CalendarFilters } from "@/components/movie-calendar/calendar-filters"
import { CalendarGrid } from "@/components/movie-calendar/calendar-grid"
import { MovieReleaseList } from "@/components/movie-calendar/movie-release-list"
import { useMovieReleases } from "@/components/movie-calendar/hooks/use-movie-releases"
import type { FilterOptions } from "@/components/movie-calendar/types"

export function MovieCalendarContainer() {
  // State for calendar navigation
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    releaseType: "all",
    languages: [],
    genres: [],
    countries: [],
  })

  // Get movie releases data
  const { releases, isLoading, filteredReleases, releasesForDate } = useMovieReleases(
    currentDate,
    selectedDate,
    filters,
  )

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (selectedDate && date.getTime() === selectedDate.getTime()) {
      setSelectedDate(null) // Deselect if clicking the same date
    } else {
      setSelectedDate(date)
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  // Reset filters
  const handleClearFilters = () => {
    setFilters({
      releaseType: "all",
      languages: [],
      genres: [],
      countries: [],
    })
  }

  // Reset to today
  const handleGoToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
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
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <CalendarHeader />
      </motion.div>

      {/* Navigation */}
      <motion.div variants={itemVariants} className="mb-6">
        <CalendarNavigation
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onGoToToday={handleGoToToday}
        />
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <CalendarFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
      </motion.div>

      {/* Calendar Grid */}
      <motion.div variants={itemVariants} className="mb-6">
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          releases={releases}
          onDateSelect={handleDateSelect}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Movie Release List */}
      <motion.div variants={itemVariants}>
        <MovieReleaseList
          releases={selectedDate ? releasesForDate : filteredReleases}
          selectedDate={selectedDate}
          isLoading={isLoading}
        />
      </motion.div>
    </motion.div>
  )
}
