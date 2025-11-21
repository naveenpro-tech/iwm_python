"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LayoutGrid, List, Rows, Search, SlidersHorizontal } from "lucide-react"
import type { FavoriteSortOption, FavoriteViewMode, FavoritesFilters } from "./types"

interface FavoritesToolbarProps {
  filters: FavoritesFilters
  setFilters: React.Dispatch<React.SetStateAction<FavoritesFilters>>
  sortOption: FavoriteSortOption
  setSortOption: (sortOption: FavoriteSortOption) => void
  viewMode: FavoriteViewMode
  setViewMode: (viewMode: FavoriteViewMode) => void
  onToggleFilters?: () => void // For mobile
}

export function FavoritesToolbar({
  filters,
  setFilters,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  onToggleFilters,
}: FavoritesToolbarProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchTerm: event.target.value }))
  }

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, type: value as FavoritesFilters["type"] }))
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700">
      <div className="relative w-full md:w-auto md:flex-grow max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search favorites..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="pl-10 w-full bg-gray-700 border-gray-600 text-white focus:ring-sky-500"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[150px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="tv-show">TV Shows</SelectItem>
            <SelectItem value="person">People</SelectItem>
            <SelectItem value="scene">Scenes</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOption} onValueChange={(value) => setSortOption(value as FavoriteSortOption)}>
          <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="dateAddedDesc">Date Added (Newest)</SelectItem>
            <SelectItem value="dateAddedAsc">Date Added (Oldest)</SelectItem>
            <SelectItem value="titleAsc">Title (A-Z)</SelectItem>
            <SelectItem value="titleDesc">Title (Z-A)</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="md:hidden bg-gray-700 border-gray-600 hover:bg-gray-600"
          onClick={onToggleFilters}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
          className={
            viewMode === "grid" ? "bg-sky-600 hover:bg-sky-500" : "bg-gray-700 border-gray-600 hover:bg-gray-600"
          }
          aria-label="Grid view"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
          className={
            viewMode === "list" ? "bg-sky-600 hover:bg-sky-500" : "bg-gray-700 border-gray-600 hover:bg-gray-600"
          }
          aria-label="List view"
        >
          <List className="h-5 w-5" />
        </Button>
        <Button
          variant={viewMode === "wall" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("wall")}
          className={
            viewMode === "wall" ? "bg-sky-600 hover:bg-sky-500" : "bg-gray-700 border-gray-600 hover:bg-gray-600"
          }
          aria-label="Wall view"
        >
          <Rows className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
