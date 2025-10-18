"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { FilterOptions, ReleaseType } from "@/components/movie-calendar/types"

// Mock data for filters
const LANGUAGES = ["English", "Hindi", "Spanish", "French", "Japanese", "Korean"]
const GENRES = ["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Romance", "Thriller", "Animation"]
const COUNTRIES = ["USA", "India", "UK", "Japan", "South Korea", "France", "Italy", "Spain"]

interface CalendarFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
  onClearFilters: () => void
}

export function CalendarFilters({ filters, onFilterChange, onClearFilters }: CalendarFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Handle release type change
  const handleReleaseTypeChange = (type: ReleaseType) => {
    onFilterChange({ releaseType: type })
  }

  // Handle language selection
  const handleLanguageChange = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter((l) => l !== language)
      : [...filters.languages, language]

    onFilterChange({ languages: newLanguages })
  }

  // Handle genre selection
  const handleGenreChange = (genre: string) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre]

    onFilterChange({ genres: newGenres })
  }

  // Handle country selection
  const handleCountryChange = (country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter((c) => c !== country)
      : [...filters.countries, country]

    onFilterChange({ countries: newCountries })
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.releaseType !== "all" ||
    filters.languages.length > 0 ||
    filters.genres.length > 0 ||
    filters.countries.length > 0

  return (
    <div className="bg-[#282828] rounded-lg overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Filter className="w-5 h-5 text-[#A0A0A0] mr-2" />
          <h3 className="font-inter font-medium text-[#E0E0E0]">Filters</h3>

          {hasActiveFilters && (
            <Badge className="ml-2 bg-[#00BFFF] text-[#1A1A1A]">
              {filters.languages.length +
                filters.genres.length +
                filters.countries.length +
                (filters.releaseType !== "all" ? 1 : 0)}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-[#00BFFF] border-[#3A3A3A] hover:bg-[#00BFFF]/10 hover:text-[#00BFFF]"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="md:hidden text-[#E0E0E0] border-[#3A3A3A] hover:bg-[#3A3A3A]"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      <div className={`border-t border-[#3A3A3A] p-4 ${isExpanded ? "block" : "hidden md:block"}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Release Type Filter */}
          <div>
            <label className="block text-sm font-dmsans text-[#A0A0A0] mb-2">Release Type</label>
            <div className="flex rounded-md overflow-hidden">
              <button
                className={`flex-1 py-2 px-3 text-sm font-inter transition-colors ${
                  filters.releaseType === "all"
                    ? "bg-[#00BFFF] text-[#1A1A1A]"
                    : "bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                }`}
                onClick={() => handleReleaseTypeChange("all")}
              >
                All
              </button>
              <button
                className={`flex-1 py-2 px-3 text-sm font-inter transition-colors ${
                  filters.releaseType === "theatrical"
                    ? "bg-[#00BFFF] text-[#1A1A1A]"
                    : "bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                }`}
                onClick={() => handleReleaseTypeChange("theatrical")}
              >
                Theatrical
              </button>
              <button
                className={`flex-1 py-2 px-3 text-sm font-inter transition-colors ${
                  filters.releaseType === "ott"
                    ? "bg-[#00BFFF] text-[#1A1A1A]"
                    : "bg-[#1A1A1A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                }`}
                onClick={() => handleReleaseTypeChange("ott")}
              >
                OTT
              </button>
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-dmsans text-[#A0A0A0] mb-2">Language</label>
            <Select>
              <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                {LANGUAGES.map((language) => (
                  <SelectItem
                    key={language}
                    value={language}
                    className="hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.languages.includes(language)}
                        onChange={() => handleLanguageChange(language)}
                        className="mr-2"
                      />
                      {language}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Languages */}
            {filters.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.languages.map((language) => (
                  <Badge
                    key={language}
                    className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#E0E0E0]"
                    onClick={() => handleLanguageChange(language)}
                  >
                    {language}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-dmsans text-[#A0A0A0] mb-2">Genre</label>
            <Select>
              <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                {GENRES.map((genre) => (
                  <SelectItem
                    key={genre}
                    value={genre}
                    className="hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                        className="mr-2"
                      />
                      {genre}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Genres */}
            {filters.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.genres.map((genre) => (
                  <Badge
                    key={genre}
                    className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#E0E0E0]"
                    onClick={() => handleGenreChange(genre)}
                  >
                    {genre}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Country Filter */}
          <div>
            <label className="block text-sm font-dmsans text-[#A0A0A0] mb-2">Country</label>
            <Select>
              <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                {COUNTRIES.map((country) => (
                  <SelectItem
                    key={country}
                    value={country}
                    className="hover:bg-[#3A3A3A] focus:bg-[#3A3A3A] cursor-pointer"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.countries.includes(country)}
                        onChange={() => handleCountryChange(country)}
                        className="mr-2"
                      />
                      {country}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected Countries */}
            {filters.countries.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.countries.map((country) => (
                  <Badge
                    key={country}
                    className="bg-[#3A3A3A] hover:bg-[#4A4A4A] text-[#E0E0E0]"
                    onClick={() => handleCountryChange(country)}
                  >
                    {country}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
