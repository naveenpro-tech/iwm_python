"use client"

import { useState } from "react"
import { NavigationContainer } from "@/components/navigation/navigation-container"
import { RecentHeader } from "@/components/recent/recent-header"
import { RecentFilters } from "@/components/recent/recent-filters"
import { RecentContentList } from "@/components/recent/recent-content-list"
import { RecentEmptyState } from "@/components/recent/recent-empty-state"
import { mockRecentItems } from "@/components/recent/mock-data"
import type { RecentItem, ContentType } from "@/components/recent/types"

export default function RecentPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<ContentType | "all">("all")
  const [recentItems, setRecentItems] = useState<RecentItem[]>(mockRecentItems)
  const [isClearing, setIsClearing] = useState(false)

  // Filter items based on selected content type
  const filteredItems =
    selectedFilter === "all" ? recentItems : recentItems.filter((item) => item.type === selectedFilter)

  // Handle clearing history
  const handleClearHistory = async () => {
    setIsClearing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRecentItems([])
    setIsClearing(false)
  }

  // Handle removing single item
  const handleRemoveItem = (itemId: string) => {
    setRecentItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  return (
    <NavigationContainer onScroll={setIsScrolled}>
      <div className="min-h-screen bg-[#0A0A0A] pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Header */}
          <RecentHeader totalItems={recentItems.length} onClearHistory={handleClearHistory} isClearing={isClearing} />

          {/* Filters */}
          <RecentFilters
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            itemCounts={{
              all: recentItems.length,
              movie: recentItems.filter((item) => item.type === "movie").length,
              profile: recentItems.filter((item) => item.type === "profile").length,
              casting: recentItems.filter((item) => item.type === "casting").length,
              industry: recentItems.filter((item) => item.type === "industry").length,
              cricket: recentItems.filter((item) => item.type === "cricket").length,
              pulse: recentItems.filter((item) => item.type === "pulse").length,
            }}
          />

          {/* Content */}
          {filteredItems.length > 0 ? (
            <RecentContentList items={filteredItems} onRemoveItem={handleRemoveItem} />
          ) : (
            <RecentEmptyState selectedFilter={selectedFilter} hasAnyItems={recentItems.length > 0} />
          )}
        </div>
      </div>
    </NavigationContainer>
  )
}
