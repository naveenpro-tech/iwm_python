"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ReviewFilters } from "./types"

interface ActiveFiltersProps {
  filters: ReviewFilters
  onRemoveGenre: (genre: string) => void
  onRemoveCountry: (country: string) => void
  onRemoveLanguage: (language: string) => void
  onRemoveYearRange: () => void
  onRemoveScoreRange: () => void
  onRemoveVerification: () => void
  onClearAll: () => void
}

export function ActiveFilters({
  filters,
  onRemoveGenre,
  onRemoveCountry,
  onRemoveLanguage,
  onRemoveYearRange,
  onRemoveScoreRange,
  onRemoveVerification,
  onClearAll,
}: ActiveFiltersProps) {
  const hasYearFilter = filters.yearRange.min !== 1900 || filters.yearRange.max !== 2024
  const hasScoreFilter = filters.scoreRange.min !== 0 || filters.scoreRange.max !== 10
  const hasVerificationFilter = filters.verificationStatus !== "all"

  return (
    <div className="mb-4 flex flex-wrap gap-2 items-center">
      <span className="text-sm text-siddu-text-subtle mr-1">Active Filters:</span>

      {/* Genre Filters */}
      {filters.genres.map((genre) => (
        <Badge
          key={`genre-${genre}`}
          variant="outline"
          className="bg-siddu-bg-card border-siddu-border-subtle flex items-center gap-1 pl-2 pr-1 py-1"
        >
          <span className="text-xs">Genre: {genre}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveGenre(genre)}
          >
            <X size={12} />
            <span className="sr-only">Remove {genre} filter</span>
          </Button>
        </Badge>
      ))}

      {/* Country Filters */}
      {filters.countries.map((country) => (
        <Badge
          key={`country-${country}`}
          variant="outline"
          className="bg-siddu-bg-card border-siddu-border-subtle flex items-center gap-1 pl-2 pr-1 py-1"
        >
          <span className="text-xs">Country: {country}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveCountry(country)}
          >
            <X size={12} />
            <span className="sr-only">Remove {country} filter</span>
          </Button>
        </Badge>
      ))}

      {/* Language Filters */}
      {filters.languages.map((language) => (
        <Badge
          key={`language-${language}`}
          variant="outline"
          className="bg-siddu-bg-card border-siddu-border-subtle flex items-center gap-1 pl-2 pr-1 py-1"
        >
          <span className="text-xs">Language: {language}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveLanguage(language)}
          >
            <X size={12} />
            <span className="sr-only">Remove {language} filter</span>
          </Button>
        </Badge>
      ))}

      {/* Year Range Filter */}
      {hasYearFilter && (
        <Badge
          variant="outline"
          className="bg-siddu-bg-card border-siddu-border-subtle flex items-center gap-1 pl-2 pr-1 py-1"
        >
          <span className="text-xs">
            Year: {filters.yearRange.min} - {filters.yearRange.max}
          </span>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={onRemoveYearRange}>
            <X size={12} />
            <span className="sr-only">Remove year range filter</span>
          </Button>
        </Badge>
      )}

      {/* Score Range Filter */}
      {hasScoreFilter && (
        <Badge
          variant="outline"
          className="bg-siddu-bg-card border-siddu-border-subtle flex items-center gap-1 pl-2 pr-1 py-1"
        >
          <span className="text-xs">
            Score: {filters.scoreRange.min} - {filters.scoreRange.max}
          </span>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 hover:bg-transparent" onClick={onRemoveScoreRange}>
            <X size={12} />
            <span className="sr-only">Remove score range filter</span>
          </Button>
        </Badge>
      )}

      {/* Verification Status Filter */}
      {hasVerificationFilter && (
        <Badge
          variant="outline"
          className="bg-siddu-bg-card border-siddu-border-subtle flex items-center gap-1 pl-2 pr-1 py-1"
        >
          <span className="text-xs">Status: {filters.verificationStatus}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onRemoveVerification}
          >
            <X size={12} />
            <span className="sr-only">Remove verification status filter</span>
          </Button>
        </Badge>
      )}

      {/* Clear All Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-siddu-electric-blue hover:text-siddu-electric-blue/80 hover:bg-siddu-bg-card p-0 h-auto"
        onClick={onClearAll}
      >
        Clear All
      </Button>
    </div>
  )
}
