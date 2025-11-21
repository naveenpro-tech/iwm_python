"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SceneFilter } from "./types"
import { useMobile } from "@/hooks/use-mobile"

interface SearchFilterBarProps {
  onFilterChange: (filters: SceneFilter[]) => void
  activeFilters: SceneFilter[]
}

export default function SearchFilterBar({ onFilterChange, activeFilters }: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const isMobile = useMobile()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Would typically debounce this and trigger search
  }

  const handleFilterSelect = (type: SceneFilter["type"], value: string, label: string) => {
    // Check if filter already exists
    const filterExists = activeFilters.some((filter) => filter.type === type && filter.value === value)

    if (!filterExists) {
      onFilterChange([...activeFilters, { type, value, label }])
    }
  }

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen)
  }

  const applyFilters = () => {
    // This would apply any pending filters
    setIsFilterDrawerOpen(false)
  }

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search scenes, movies, directors..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 h-11 w-full"
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Controls - Desktop */}
        {!isMobile && (
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            {/* Movie Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Movie
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Select Movie</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleFilterSelect("movie", "inception", "Inception")}>
                    Inception
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("movie", "interstellar", "Interstellar")}>
                    Interstellar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("movie", "parasite", "Parasite")}>
                    Parasite
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Genre Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Genre
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Select Genre</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleFilterSelect("genre", "action", "Action")}>
                    Action
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("genre", "drama", "Drama")}>
                    Drama
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("genre", "sci-fi", "Sci-Fi")}>
                    Sci-Fi
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Director Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Director
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Select Director</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleFilterSelect("director", "christopher-nolan", "Christopher Nolan")}
                  >
                    Christopher Nolan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("director", "bong-joon-ho", "Bong Joon-ho")}>
                    Bong Joon-ho
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterSelect("director", "denis-villeneuve", "Denis Villeneuve")}
                  >
                    Denis Villeneuve
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cinematographer Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Cinematographer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Select Cinematographer</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleFilterSelect("cinematographer", "roger-deakins", "Roger Deakins")}
                  >
                    Roger Deakins
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterSelect("cinematographer", "hoyte-van-hoytema", "Hoyte van Hoytema")}
                  >
                    Hoyte van Hoytema
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterSelect("cinematographer", "emmanuel-lubezki", "Emmanuel Lubezki")}
                  >
                    Emmanuel Lubezki
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Scene Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
                  Scene Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Select Scene Type</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleFilterSelect("sceneType", "action", "Action")}>
                    Action
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("sceneType", "emotional", "Emotional")}>
                    Emotional
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("sceneType", "dialogue", "Dialogue")}>
                    Dialogue
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("sceneType", "vfx", "VFX Showcase")}>
                    VFX Showcase
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterSelect("sceneType", "one-shot", "One-shot")}>
                    One-shot
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Mobile Filter Button */}
        {isMobile && (
          <Button
            variant="outline"
            className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            onClick={toggleFilterDrawer}
          >
            <Filter className="mr-2" size={16} />
            Filters
          </Button>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {isMobile && isFilterDrawerOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <motion.div
            className="bg-gray-900 w-full rounded-t-xl p-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-100"
                onClick={toggleFilterDrawer}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Mobile Filter Controls would go here */}
              {/* Similar to desktop but stacked vertically */}
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1 bg-gray-800 border-gray-700" onClick={toggleFilterDrawer}>
                Cancel
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
