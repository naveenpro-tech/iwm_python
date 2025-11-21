"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { PageHeader } from "./page-header"
import { NavigationTabs } from "./navigation-tabs"
import { FilterSortBar } from "./filter-sort-bar"
import { ReviewListingDisplay } from "./review-listing-display"
import { SentimentSnapshot } from "./sentiment-snapshot"
import { EmptyState } from "./empty-state"
import { mockReviews } from "./mock-data"
import type { ReviewFeedType, ReviewFilters, SortOption } from "./types"

export function ReviewsPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse URL parameters
  const activeTab = (searchParams.get("feed") as ReviewFeedType) || "latest"
  const viewMode = searchParams.get("view") || "grid"
  const sortBy = (searchParams.get("sort") as SortOption) || "date_desc"

  // Initialize filters from URL params
  const [filters, setFilters] = useState<ReviewFilters>({
    genres: searchParams.get("genres")?.split(",") || [],
    yearRange: {
      min: Number.parseInt(searchParams.get("yearMin") || "1900"),
      max: Number.parseInt(searchParams.get("yearMax") || "2024"),
    },
    countries: searchParams.get("countries")?.split(",") || [],
    languages: searchParams.get("languages")?.split(",") || [],
    scoreRange: {
      min: Number.parseFloat(searchParams.get("scoreMin") || "0"),
      max: Number.parseFloat(searchParams.get("scoreMax") || "10"),
    },
    verificationStatus: (searchParams.get("verification") as "verified" | "unverified" | "all") || "all",
  })

  // Filter reviews based on current filters and active tab
  const [filteredReviews, setFilteredReviews] = useState(mockReviews)
  const [isLoading, setIsLoading] = useState(false)

  // Update URL when filters or tab changes
  const updateUrl = (newFilters: ReviewFilters, newTab: ReviewFeedType, newSort: SortOption, newView: string) => {
    const params = new URLSearchParams()

    // Add feed type
    params.set("feed", newTab)

    // Add view mode
    params.set("view", newView)

    // Add sort option
    params.set("sort", newSort)

    // Add filters if they have values
    if (newFilters.genres.length > 0) params.set("genres", newFilters.genres.join(","))
    if (newFilters.yearRange.min !== 1900) params.set("yearMin", newFilters.yearRange.min.toString())
    if (newFilters.yearRange.max !== 2024) params.set("yearMax", newFilters.yearRange.max.toString())
    if (newFilters.countries.length > 0) params.set("countries", newFilters.countries.join(","))
    if (newFilters.languages.length > 0) params.set("languages", newFilters.languages.join(","))
    if (newFilters.scoreRange.min !== 0) params.set("scoreMin", newFilters.scoreRange.min.toString())
    if (newFilters.scoreRange.max !== 10) params.set("scoreMax", newFilters.scoreRange.max.toString())
    if (newFilters.verificationStatus !== "all") params.set("verification", newFilters.verificationStatus)

    router.push(`${pathname}?${params.toString()}`)
  }

  // Apply filters and update reviews
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call with setTimeout
    const timeoutId = setTimeout(() => {
      // Filter logic would normally be on the server
      // This is just for demonstration
      let results = [...mockReviews]

      // Apply filters
      if (filters.genres.length > 0) {
        results = results.filter((review) => review.movie.genres.some((genre) => filters.genres.includes(genre)))
      }

      if (filters.countries.length > 0) {
        results = results.filter((review) => filters.countries.includes(review.movie.country))
      }

      if (filters.languages.length > 0) {
        results = results.filter((review) => filters.languages.includes(review.movie.language))
      }

      results = results.filter(
        (review) => review.movie.year >= filters.yearRange.min && review.movie.year <= filters.yearRange.max,
      )

      results = results.filter(
        (review) => review.rating >= filters.scoreRange.min && review.rating <= filters.scoreRange.max,
      )

      if (filters.verificationStatus !== "all") {
        results = results.filter(
          (review) =>
            (filters.verificationStatus === "verified" && review.isVerified) ||
            (filters.verificationStatus === "unverified" && !review.isVerified),
        )
      }

      // Apply tab filter
      switch (activeTab) {
        case "top":
          results = results.sort((a, b) => b.rating - a.rating)
          break
        case "trending":
          results = results.sort((a, b) => b.engagementScore - a.engagementScore)
          break
        case "latest":
        default:
          results = results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          break
      }

      // Apply sorting
      switch (sortBy) {
        case "date_asc":
          results = results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          break
        case "date_desc":
          results = results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          break
        case "rating_asc":
          results = results.sort((a, b) => a.rating - b.rating)
          break
        case "rating_desc":
          results = results.sort((a, b) => b.rating - a.rating)
          break
        case "helpful_desc":
          results = results.sort((a, b) => b.helpfulVotes - a.helpfulVotes)
          break
        case "comments_desc":
          results = results.sort((a, b) => b.commentCount - a.commentCount)
          break
      }

      setFilteredReviews(results)
      setIsLoading(false)
    }, 500) // Simulate network delay

    return () => clearTimeout(timeoutId)
  }, [filters, activeTab, sortBy])

  // Handle tab change
  const handleTabChange = (tab: ReviewFeedType) => {
    updateUrl(filters, tab, sortBy, viewMode)
  }

  // Handle filter change
  const handleFilterChange = (newFilters: ReviewFilters) => {
    setFilters(newFilters)
    updateUrl(newFilters, activeTab, sortBy, viewMode)
  }

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    updateUrl(filters, activeTab, sort, viewMode)
  }

  // Handle view mode change
  const handleViewModeChange = (view: string) => {
    updateUrl(filters, activeTab, sortBy, view)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    const defaultFilters: ReviewFilters = {
      genres: [],
      yearRange: { min: 1900, max: 2024 },
      countries: [],
      languages: [],
      scoreRange: { min: 0, max: 10 },
      verificationStatus: "all",
    }
    setFilters(defaultFilters)
    updateUrl(defaultFilters, activeTab, sortBy, viewMode)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div className="container mx-auto px-4 py-8" variants={containerVariants} initial="hidden" animate="visible">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-9">
          <motion.div variants={itemVariants}>
            <PageHeader />
          </motion.div>

          <motion.div variants={itemVariants}>
            <NavigationTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FilterSortBar
              filters={filters}
              onFilterChange={handleFilterChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onClearFilters={handleClearFilters}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            {filteredReviews.length > 0 ? (
              <ReviewListingDisplay reviews={filteredReviews} viewMode={viewMode} isLoading={isLoading} />
            ) : (
              <EmptyState onClearFilters={handleClearFilters} />
            )}
          </motion.div>
        </div>

        {/* Sidebar - Only visible on desktop */}
        <motion.div className="hidden lg:block lg:col-span-3" variants={itemVariants}>
          <SentimentSnapshot />
        </motion.div>
      </div>
    </motion.div>
  )
}
