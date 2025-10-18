"use client"

import { motion } from "framer-motion"
import { Search, Grid, List, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ExploreHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onFilterToggle: () => void
  showFilters: boolean
}

export function ExploreHeader({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onFilterToggle,
  showFilters,
}: ExploreHeaderProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold mb-4">Explore</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0A0A0]" />
          <Input
            type="text"
            placeholder="Search movies, directors, actors..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:ring-[#00BFFF] focus:border-[#00BFFF]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#E0E0E0]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex bg-[#282828] rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={`px-3 ${
                viewMode === "grid"
                  ? "bg-[#00BFFF] text-white hover:bg-[#00BFFF]/90"
                  : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={`px-3 ${
                viewMode === "list"
                  ? "bg-[#00BFFF] text-white hover:bg-[#00BFFF]/90"
                  : "text-[#A0A0A0] hover:text-[#E0E0E0]"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={onFilterToggle}
            className={
              showFilters ? "bg-[#00BFFF] text-white hover:bg-[#00BFFF]/90" : "border-[#3A3A3A] text-[#E0E0E0]"
            }
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
