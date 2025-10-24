"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ReviewFilterBarProps, RatingFilter, VerificationFilter, SpoilerFilter, SortOption } from "@/types/review-page"

export default function ReviewFilterBar({
  filters,
  sortBy,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
}: ReviewFilterBarProps) {
  return (
    <div className="bg-[#282828] rounded-lg border border-[#3A3A3A] p-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-[#00BFFF]" />
        <h3 className="text-lg font-semibold text-[#E0E0E0] font-inter">Filter & Sort</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Rating Filter */}
        <div>
          <label className="text-xs text-[#A0A0A0] mb-1 block">Rating</label>
          <Select
            value={filters.rating}
            onValueChange={(value) =>
              onFilterChange({ ...filters, rating: value as RatingFilter })
            }
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#282828] border-[#3A3A3A]">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verification Filter */}
        <div>
          <label className="text-xs text-[#A0A0A0] mb-1 block">Verification</label>
          <Select
            value={filters.verification}
            onValueChange={(value) =>
              onFilterChange({ ...filters, verification: value as VerificationFilter })
            }
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#282828] border-[#3A3A3A]">
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Spoiler Filter */}
        <div>
          <label className="text-xs text-[#A0A0A0] mb-1 block">Spoilers</label>
          <Select
            value={filters.spoilers}
            onValueChange={(value) =>
              onFilterChange({ ...filters, spoilers: value as SpoilerFilter })
            }
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#282828] border-[#3A3A3A]">
              <SelectItem value="show_all">Show All</SelectItem>
              <SelectItem value="hide_spoilers">Hide Spoilers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div>
          <label className="text-xs text-[#A0A0A0] mb-1 block">Sort By</label>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#282828] border-[#3A3A3A]">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest_rated">Highest Rated</SelectItem>
              <SelectItem value="lowest_rated">Lowest Rated</SelectItem>
              <SelectItem value="most_helpful">Most Helpful</SelectItem>
              <SelectItem value="most_comments">Most Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div>
          <label className="text-xs text-[#A0A0A0] mb-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
            <Input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

