"use client"

import { motion } from "framer-motion"
import { Grid2X2, List, SlidersHorizontal, ChevronDown, X, CheckSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { SortOption, GroupByOption } from "./types"

interface WatchlistToolbarProps {
  totalItems: number
  viewMode: "grid" | "list"
  sortBy: SortOption
  groupBy: GroupByOption | null
  isBatchMode: boolean
  selectedCount: number
  onViewModeChange: (mode: "grid" | "list") => void
  onSortChange: (option: SortOption) => void
  onGroupByChange: (option: GroupByOption | null) => void
  onToggleBatchMode: () => void
  onSelectAll: () => void
}

export function WatchlistToolbar({
  totalItems,
  viewMode,
  sortBy,
  groupBy,
  isBatchMode,
  selectedCount,
  onViewModeChange,
  onSortChange,
  onGroupByChange,
  onToggleBatchMode,
  onSelectAll,
}: WatchlistToolbarProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "dateAdded", label: "Date Added" },
    { value: "title", label: "Title" },
    { value: "releaseDate", label: "Release Date" },
    { value: "rating", label: "Rating" },
    { value: "priority", label: "Priority" },
  ]

  const groupOptions: { value: GroupByOption; label: string }[] = [
    { value: "status", label: "Status" },
    { value: "priority", label: "Priority" },
    { value: "genre", label: "Genre" },
    { value: "year", label: "Year" },
  ]

  const getSortLabel = () => {
    return sortOptions.find((option) => option.value === sortBy)?.label || "Sort By"
  }

  const getGroupLabel = () => {
    return groupBy ? groupOptions.find((option) => option.value === groupBy)?.label : "Group By"
  }

  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-sm text-[#A0A0A0] flex items-center">
        {totalItems} {totalItems === 1 ? "item" : "items"}
        {isBatchMode && <Badge className="ml-2 bg-[#00BFFF] text-[#1A1A1A]">{selectedCount} selected</Badge>}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {groupBy && (
          <Badge variant="outline" className="bg-[#282828] text-[#E0E0E0] border-[#3A3A3A] flex items-center gap-1">
            Grouped by: {getGroupLabel()}
            <button onClick={() => onGroupByChange(null)} className="ml-1 hover:bg-[#3A3A3A] rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {isBatchMode ? (
          <Button
            variant="outline"
            size="sm"
            className="border-[#3A3A3A] bg-[#282828] text-[#E0E0E0]"
            onClick={onSelectAll}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            {selectedCount === totalItems ? "Deselect All" : "Select All"}
          </Button>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-[#3A3A3A] bg-[#282828]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {getSortLabel()}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#282828] border-[#3A3A3A]">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#3A3A3A]" />
                <DropdownMenuGroup>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`cursor-pointer ${sortBy === option.value ? "text-[#00BFFF]" : ""}`}
                      onClick={() => onSortChange(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-[#3A3A3A] bg-[#282828]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {getGroupLabel()}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#282828] border-[#3A3A3A]">
                <DropdownMenuLabel>Group By</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#3A3A3A]" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className={`cursor-pointer ${groupBy === null ? "text-[#00BFFF]" : ""}`}
                    onClick={() => onGroupByChange(null)}
                  >
                    None
                  </DropdownMenuItem>
                  {groupOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={`cursor-pointer ${groupBy === option.value ? "text-[#00BFFF]" : ""}`}
                      onClick={() => onGroupByChange(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <div className="flex border border-[#3A3A3A] rounded-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none ${
              isBatchMode
                ? "bg-[#282828] text-[#A0A0A0]"
                : viewMode === "grid"
                  ? "bg-[#00BFFF] text-[#1A1A1A]"
                  : "bg-[#282828]"
            }`}
            onClick={() => !isBatchMode && onViewModeChange("grid")}
            disabled={isBatchMode}
          >
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-none ${
              isBatchMode
                ? "bg-[#282828] text-[#A0A0A0]"
                : viewMode === "list"
                  ? "bg-[#00BFFF] text-[#1A1A1A]"
                  : "bg-[#282828]"
            }`}
            onClick={() => !isBatchMode && onViewModeChange("list")}
            disabled={isBatchMode}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant={isBatchMode ? "default" : "outline"}
          size="sm"
          className={
            isBatchMode ? "bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00BFFF]/90" : "border-[#3A3A3A] bg-[#282828]"
          }
          onClick={onToggleBatchMode}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          {isBatchMode ? "Cancel Selection" : "Select Items"}
        </Button>
      </div>
    </motion.div>
  )
}
