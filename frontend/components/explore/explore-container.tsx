"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ExploreHeader } from "./explore-header"
import { CategoryTabs } from "./category-tabs"
import { FilterPanel } from "./filter-panel"
import { ActiveFilters } from "./active-filters"
import { ContentGrid } from "./content-grid"
import { getExploreMovies, searchMovies } from "@/lib/api/movies"
import type { MovieType, FilterState, CategoryType } from "./types"
import { useMobile } from "@/hooks/use-mobile"

export function ExploreContainer() {
  const [movies, setMovies] = useState<MovieType[]>([])
  const [filteredMovies, setFilteredMovies] = useState<MovieType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<CategoryType>("trending")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    yearRange: [1900, new Date().getFullYear()],
    languages: [],
    countries: [],
    ratingRange: [0, 10],
  })

  const isMobile = useMobile()

  useEffect(() => {
    // Fetch movies from API based on active category
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const data = await getExploreMovies({
          category: activeCategory,
          limit: 50, // Fetch more movies for better filtering
        })

        setMovies(data)
        setFilteredMovies(data)
      } catch (error) {
        console.error("Failed to fetch movies:", error)
        setMovies([])
        setFilteredMovies([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [activeCategory])

  useEffect(() => {
    // Apply search and filters
    const applyFiltersAndSearch = async () => {
      if (searchQuery) {
        // Use search API when there's a search query
        try {
          const searchResults = await searchMovies(searchQuery, 50)
          setFilteredMovies(searchResults)
        } catch (error) {
          console.error("Failed to search movies:", error)
          setFilteredMovies([])
        }
        return
      }

      // Apply client-side filters when no search query
      if (movies.length > 0) {
        let results = [...movies]

        // Apply genre filter
        if (filters.genres.length > 0) {
          results = results.filter((movie) => movie.genres.some((genre) => filters.genres.includes(genre)))
        }

        // Apply year range filter
        results = results.filter((movie) => {
          const year = Number.parseInt(movie.year)
          return year >= filters.yearRange[0] && year <= filters.yearRange[1]
        })

        // Apply language filter
        if (filters.languages.length > 0) {
          results = results.filter((movie) => filters.languages.includes(movie.language))
        }

        // Apply country filter
        if (filters.countries.length > 0) {
          results = results.filter((movie) => filters.countries.includes(movie.country))
        }

        // Apply rating filter - use sidduScore with fallback to rating
        results = results.filter((movie) => {
          const score = movie.sidduScore ?? movie.rating ?? 0
          return score >= filters.ratingRange[0] && score <= filters.ratingRange[1]
        })

        setFilteredMovies(results)
      }
    }

    applyFiltersAndSearch()
  }, [movies, searchQuery, filters])

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category)
    setIsLoading(true)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode)
  }

  const handleClearFilter = (filterType: keyof FilterState, value?: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }

      if (filterType === "genres" && value) {
        newFilters.genres = prev.genres.filter((genre) => genre !== value)
      } else if (filterType === "languages" && value) {
        newFilters.languages = prev.languages.filter((lang) => lang !== value)
      } else if (filterType === "countries" && value) {
        newFilters.countries = prev.countries.filter((country) => country !== value)
      } else if (filterType === "yearRange") {
        newFilters.yearRange = [1900, new Date().getFullYear()]
      } else if (filterType === "ratingRange") {
        newFilters.ratingRange = [0, 10]
      }

      return newFilters
    })
  }

  const handleClearAllFilters = () => {
    setFilters({
      genres: [],
      yearRange: [1900, new Date().getFullYear()],
      languages: [],
      countries: [],
      ratingRange: [0, 10],
    })
    setSearchQuery("")
  }

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.languages.length > 0 ||
    filters.countries.length > 0 ||
    filters.yearRange[0] > 1900 ||
    filters.yearRange[1] < new Date().getFullYear() ||
    filters.ratingRange[0] > 0 ||
    filters.ratingRange[1] < 10 ||
    searchQuery !== ""

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
      className="min-h-screen bg-[#1A1A1A] text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-4 md:py-6">
        <motion.div variants={itemVariants}>
          <ExploreHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onFilterToggle={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <CategoryTabs activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Filter Panel - Desktop */}
          {!isMobile && (
            <motion.div className="w-64 flex-shrink-0" variants={itemVariants}>
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </motion.div>
          )}

          {/* Filter Panel - Mobile */}
          {isMobile && showFilters && (
            <motion.div
              className="w-full mb-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} isMobile={true} />
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div className="flex-1" variants={itemVariants}>
            {hasActiveFilters && (
              <ActiveFilters
                filters={filters}
                searchQuery={searchQuery}
                onClearFilter={handleClearFilter}
                onClearSearchQuery={() => setSearchQuery("")}
                onClearAll={handleClearAllFilters}
              />
            )}

            <ContentGrid movies={filteredMovies} isLoading={isLoading} viewMode={viewMode} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
