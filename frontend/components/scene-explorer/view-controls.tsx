"use client"

import { motion } from "framer-motion"
import { Grid, List, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ViewMode, SortOption } from "./types"

interface ViewControlsProps {
  viewMode: ViewMode
  sortOption: SortOption
  onViewModeChange: (mode: ViewMode) => void
  onSortChange: (option: SortOption) => void
}

export default function ViewControls({ viewMode, sortOption, onViewModeChange, onSortChange }: ViewControlsProps) {
  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "popular":
        return "Most Popular"
      case "latest":
        return "Latest Added"
      case "discussed":
        return "Most Discussed"
      case "releaseNewest":
        return "Release Date (Newest)"
      case "releaseOldest":
        return "Release Date (Oldest)"
      default:
        return "Sort By"
    }
  }

  return (
    <motion.div
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          className={
            viewMode === "grid"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          }
          onClick={() => onViewModeChange("grid")}
          aria-label="Grid view"
        >
          <Grid size={16} className="mr-1" />
          <span className="hidden sm:inline">Grid</span>
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          className={
            viewMode === "list"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          }
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
        >
          <List size={16} className="mr-1" />
          <span className="hidden sm:inline">List</span>
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
            <SortAsc size={16} className="mr-2" />
            {getSortLabel(sortOption)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-200">
          <DropdownMenuItem
            className={sortOption === "popular" ? "bg-gray-700" : ""}
            onClick={() => onSortChange("popular")}
          >
            Most Popular
          </DropdownMenuItem>
          <DropdownMenuItem
            className={sortOption === "latest" ? "bg-gray-700" : ""}
            onClick={() => onSortChange("latest")}
          >
            Latest Added
          </DropdownMenuItem>
          <DropdownMenuItem
            className={sortOption === "discussed" ? "bg-gray-700" : ""}
            onClick={() => onSortChange("discussed")}
          >
            Most Discussed
          </DropdownMenuItem>
          <DropdownMenuItem
            className={sortOption === "releaseNewest" ? "bg-gray-700" : ""}
            onClick={() => onSortChange("releaseNewest")}
          >
            Release Date (Newest)
          </DropdownMenuItem>
          <DropdownMenuItem
            className={sortOption === "releaseOldest" ? "bg-gray-700" : ""}
            onClick={() => onSortChange("releaseOldest")}
          >
            Release Date (Oldest)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
