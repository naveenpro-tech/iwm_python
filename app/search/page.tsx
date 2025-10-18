"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { SearchHeader } from "@/components/search/search-header"
import { SearchTabs } from "@/components/search/search-tabs"
import { SearchFilters } from "@/components/search/search-filters"
import { ResultsContainer } from "@/components/search/results-container"
import { Pagination } from "@/components/shared/pagination"
import { NoResultsState } from "@/components/search/no-results-state"
import { LoadingState } from "@/components/search/loading-state"
import { useDebounce } from "@/hooks/use-debounce"
import { useMobile } from "@/hooks/use-mobile"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const isMobile = useMobile()

  // Extract query from URL
  const query = searchParams.get("q") || ""
  const initialTab = searchParams.get("type") || "all"

  // State
  const [searchQuery, setSearchQuery] = useState(query)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isLoading, setIsLoading] = useState(false)
  const [hasResults, setHasResults] = useState(true)
  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(!isMobile)

  // Debounce search query to prevent excessive API calls
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Fetch results when query or filters change
  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        setHasResults(debouncedQuery !== "noresults")
      }, 800)
    }
  }, [debouncedQuery, activeTab, page])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPage(1)
  }

  // Container variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white pb-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SearchHeader
        query={searchQuery}
        setQuery={setSearchQuery}
        toggleFilters={() => setFiltersOpen(!filtersOpen)}
        showFiltersButton={isMobile}
      />

      <div className="container mx-auto px-4 pt-24">
        <SearchTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {filtersOpen && (
            <motion.div
              className="w-full md:w-64 shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchFilters activeTab={activeTab} />
            </motion.div>
          )}

          <div className="flex-1">
            {isLoading ? (
              <LoadingState type={activeTab} />
            ) : !hasResults ? (
              <NoResultsState query={debouncedQuery} />
            ) : (
              <>
                <ResultsContainer type={activeTab} query={debouncedQuery} />
                <div className="mt-8">
                  <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
