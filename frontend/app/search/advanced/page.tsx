"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const AdvancedSearchHeader = dynamic(
  () => import("@/components/search/advanced/advanced-search-header").then((mod) => mod.AdvancedSearchHeader),
  { ssr: false },
)
const QueryBuilder = dynamic(
  () => import("@/components/search/advanced/query-builder").then((mod) => mod.QueryBuilder),
  { ssr: false },
)
const VisualQueryBuilder = dynamic(
  () => import("@/components/search/advanced/visual-query-builder").then((mod) => mod.VisualQueryBuilder),
  { ssr: false },
)
const SearchResults = dynamic(
  () => import("@/components/search/advanced/search-results").then((mod) => mod.SearchResults),
  { ssr: false },
)
const SearchHistorySidebar = dynamic(
  () => import("@/components/search/advanced/search-history-sidebar").then((mod) => mod.SearchHistorySidebar),
  { ssr: false },
)
import { useMobile } from "@/hooks/use-mobile"
import type { AdvancedSearchState, FilterSet } from "@/components/search/advanced/types"

export default function AdvancedSearchPage() {
  const isMobile = useMobile()
  const [searchState, setSearchState] = useState<AdvancedSearchState>({
    query: "",
    filters: {
      textFilters: {},
      peopleFilters: {},
      dateFilters: {},
      ratingFilters: {},
      awardFilters: {},
      technicalFilters: {},
    },
    savedSearches: [],
    searchHistory: [],
    results: [],
    isLoading: false,
  })

  const [showVisualBuilder, setShowVisualBuilder] = useState(false)
  const [showHistory, setShowHistory] = useState(!isMobile)

  const handleSearch = (query: string, filters: FilterSet) => {
    setSearchState((prev) => ({
      ...prev,
      query,
      filters,
      isLoading: true,
    }))

    // Simulate search
    setTimeout(() => {
      setSearchState((prev) => ({
        ...prev,
        isLoading: false,
        results: generateMockResults(query, filters),
      }))
    }, 1000)
  }

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0 },
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A]"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4 py-6">
        <AdvancedSearchHeader
          query={searchState.query}
          savedSearches={searchState.savedSearches}
          onSearch={(query) => handleSearch(query, searchState.filters)}
          onSaveSearch={(name) => {
            // Save search logic
          }}
        />

        <div className="flex gap-6 mt-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {/* Query Builder Toggle */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Build Your Search</h2>
                <button
                  onClick={() => setShowVisualBuilder(!showVisualBuilder)}
                  className="text-[#00BFFF] hover:text-[#0099CC] transition-colors"
                >
                  {showVisualBuilder ? "Standard View" : "Visual Builder"}
                </button>
              </div>

              {/* Query Builder */}
              {showVisualBuilder ? (
                <VisualQueryBuilder
                  filters={searchState.filters}
                  onFiltersChange={(filters) => setSearchState((prev) => ({ ...prev, filters }))}
                />
              ) : (
                <QueryBuilder
                  filters={searchState.filters}
                  onFiltersChange={(filters) => setSearchState((prev) => ({ ...prev, filters }))}
                  onSearch={() => handleSearch(searchState.query, searchState.filters)}
                />
              )}

              {/* Search Results */}
              <SearchResults
                results={searchState.results}
                isLoading={searchState.isLoading}
                totalCount={searchState.results.length}
              />
            </div>
          </div>

          {/* Search History Sidebar */}
          {showHistory && !isMobile && (
            <SearchHistorySidebar
              searchHistory={searchState.searchHistory}
              onSelectHistory={(item) => {
                setSearchState((prev) => ({
                  ...prev,
                  query: item.query,
                  filters: item.filters,
                }))
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

function generateMockResults(query: string, filters: FilterSet) {
  // Mock result generation
  return Array.from({ length: 10 }, (_, i) => ({
    id: `result-${i}`,
    type: "movie" as const,
    title: `Movie Result ${i + 1}`,
    year: 2020 + i,
    poster: `/placeholder.svg?height=300&width=200`,
    rating: 8.5 - i * 0.2,
    matchScore: 95 - i * 5,
    hasOscar: false,
    hasCannes: false,
    hasGoldenGlobe: false,
  }))
}
