"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FavoritesHeader } from "@/components/favorites/favorites-header"
import { FavoritesToolbar } from "@/components/favorites/favorites-toolbar"
import { FavoritesGrid } from "@/components/favorites/favorites-grid"
import { FavoritesList } from "@/components/favorites/favorites-list"
import { FavoritesWall } from "@/components/favorites/favorites-wall"
import { FavoritesInsights } from "@/components/favorites/favorites-insights"
import { FavoritesEmptyState } from "@/components/favorites/favorites-empty-state"
import { mockFavorites } from "@/components/favorites/mock-data"
import type {
  FavoriteMovie,
  FavoriteSortOption,
  FavoriteViewMode,
  FavoritesFilters,
} from "@/components/favorites/types"

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState<FavoriteViewMode>("grid")
  const [sortOption, setSortOption] = useState<FavoriteSortOption>("dateAddedDesc")
  const [filters, setFilters] = useState<FavoritesFilters>({ searchTerm: "", type: "all" })
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(mockFavorites)

  const filteredFavorites = favorites.filter((item) => {
    const searchTermMatch = item.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    const typeMatch = filters.type === "all" || item.type === filters.type
    return searchTermMatch && typeMatch
  })

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortOption) {
      case "dateAddedDesc":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case "dateAddedAsc":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      case "titleAsc":
        return a.title.localeCompare(b.title)
      case "titleDesc":
        return b.title.localeCompare(a.title)
      case "type":
        return (a.type || "").localeCompare(b.type || "")
      default:
        return 0
    }
  })

  const removeFavorite = (itemId: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Placeholder for mobile filter toggle if needed in the future
  const handleToggleFilters = () => {
    console.log("Toggle filters clicked - implement mobile filter panel logic")
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FavoritesHeader totalCount={favorites.length} />

      <div className="container mx-auto px-4 py-8">
        <FavoritesToolbar
          filters={filters}
          setFilters={setFilters}
          sortOption={sortOption}
          setSortOption={setSortOption}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onToggleFilters={handleToggleFilters} // Added a placeholder, can be expanded
        />

        {sortedFavorites.length > 0 ? (
          <div className="mt-8">
            {viewMode === "grid" && <FavoritesGrid favorites={sortedFavorites} onRemove={removeFavorite} />}
            {viewMode === "list" && <FavoritesList favorites={sortedFavorites} onRemove={removeFavorite} />}
            {viewMode === "wall" && <FavoritesWall favorites={sortedFavorites} onRemove={removeFavorite} />}
            {viewMode === "insights" && <FavoritesInsights favorites={favorites} />}
          </div>
        ) : (
          <FavoritesEmptyState hasSearch={filters.searchTerm.length > 0} />
        )}
      </div>
    </motion.div>
  )
}
