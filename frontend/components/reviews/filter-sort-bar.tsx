"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, X, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { ReviewFilters, SortOption } from "./types"
import { ActiveFilters } from "./active-filters"

interface FilterSortBarProps {
  filters: ReviewFilters
  onFilterChange: (filters: ReviewFilters) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: string
  onViewModeChange: (view: string) => void
  onClearFilters: () => void
}

export function FilterSortBar({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
}: FilterSortBarProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  // Available options for filters
  const genreOptions = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "History",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "War",
    "Western",
  ]

  const countryOptions = [
    "United States",
    "United Kingdom",
    "France",
    "Japan",
    "South Korea",
    "India",
    "China",
    "Brazil",
    "Italy",
    "Germany",
    "Spain",
    "Australia",
    "Canada",
    "Russia",
    "Mexico",
  ]

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "Japanese",
    "Korean",
    "Hindi",
    "Mandarin",
    "Portuguese",
    "Italian",
    "German",
    "Russian",
    "Arabic",
    "Swedish",
    "Danish",
    "Norwegian",
  ]

  // Handle filter changes
  const handleGenreChange = (genre: string, checked: boolean) => {
    const newGenres = checked ? [...filters.genres, genre] : filters.genres.filter((g) => g !== genre)

    onFilterChange({
      ...filters,
      genres: newGenres,
    })
  }

  const handleCountryChange = (country: string, checked: boolean) => {
    const newCountries = checked ? [...filters.countries, country] : filters.countries.filter((c) => c !== country)

    onFilterChange({
      ...filters,
      countries: newCountries,
    })
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = checked ? [...filters.languages, language] : filters.languages.filter((l) => l !== language)

    onFilterChange({
      ...filters,
      languages: newLanguages,
    })
  }

  const handleYearRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      yearRange: {
        min: values[0],
        max: values[1],
      },
    })
  }

  const handleScoreRangeChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      scoreRange: {
        min: values[0],
        max: values[1],
      },
    })
  }

  const handleVerificationChange = (status: "verified" | "unverified" | "all") => {
    onFilterChange({
      ...filters,
      verificationStatus: status,
    })
  }

  // Count active filters
  const activeFilterCount =
    filters.genres.length +
    filters.countries.length +
    filters.languages.length +
    (filters.yearRange.min !== 1900 || filters.yearRange.max !== 2024 ? 1 : 0) +
    (filters.scoreRange.min !== 0 || filters.scoreRange.max !== 10 ? 1 : 0) +
    (filters.verificationStatus !== "all" ? 1 : 0)

  return (
    <div className="mb-6">
      {/* Desktop Filter Bar */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-siddu-electric-blue text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-siddu-bg-card-dark border border-siddu-border-subtle p-4">
              <div className="space-y-4">
                {/* Genre Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Genres</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {genreOptions.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre}`}
                          checked={filters.genres.includes(genre)}
                          onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                        />
                        <Label htmlFor={`genre-${genre}`} className="text-sm">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Year Range Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Release Year</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.yearRange.min, filters.yearRange.max]}
                      min={1900}
                      max={2024}
                      step={1}
                      onValueChange={handleYearRangeChange}
                    />
                    <div className="flex justify-between mt-2 text-xs text-siddu-text-subtle">
                      <span>{filters.yearRange.min}</span>
                      <span>{filters.yearRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Country Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Country</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {countryOptions.slice(0, 8).map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={`country-${country}`}
                          checked={filters.countries.includes(country)}
                          onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
                        />
                        <Label htmlFor={`country-${country}`} className="text-sm">
                          {country}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {countryOptions.length > 8 && (
                    <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-siddu-electric-blue">
                      Show more
                    </Button>
                  )}
                </div>

                {/* Score Range Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">SidduScore</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.scoreRange.min, filters.scoreRange.max]}
                      min={0}
                      max={10}
                      step={0.5}
                      onValueChange={handleScoreRangeChange}
                    />
                    <div className="flex justify-between mt-2 text-xs text-siddu-text-subtle">
                      <span>{filters.scoreRange.min}</span>
                      <span>{filters.scoreRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Verification Status Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Verification Status</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={filters.verificationStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVerificationChange("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filters.verificationStatus === "verified" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVerificationChange("verified")}
                    >
                      Verified
                    </Button>
                    <Button
                      variant={filters.verificationStatus === "unverified" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVerificationChange("unverified")}
                    >
                      Unverified
                    </Button>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {activeFilterCount > 0 && (
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={onClearFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[180px] bg-siddu-bg-card-dark border-siddu-border-subtle">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-siddu-bg-card-dark border-siddu-border-subtle">
              <SelectItem value="date_desc">Newest First</SelectItem>
              <SelectItem value="date_asc">Oldest First</SelectItem>
              <SelectItem value="rating_desc">Highest Rating</SelectItem>
              <SelectItem value="rating_asc">Lowest Rating</SelectItem>
              <SelectItem value="helpful_desc">Most Helpful</SelectItem>
              <SelectItem value="comments_desc">Most Discussed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Mobile Filter Bar */}
      <div className="flex md:hidden items-center justify-between mb-4">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsFilterDrawerOpen(true)}>
          <Filter size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-siddu-electric-blue text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>

        <div className="flex items-center space-x-2">
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-[140px] bg-siddu-bg-card-dark border-siddu-border-subtle">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-siddu-bg-card-dark border-siddu-border-subtle">
              <SelectItem value="date_desc">Newest First</SelectItem>
              <SelectItem value="date_asc">Oldest First</SelectItem>
              <SelectItem value="rating_desc">Highest Rating</SelectItem>
              <SelectItem value="rating_asc">Lowest Rating</SelectItem>
              <SelectItem value="helpful_desc">Most Helpful</SelectItem>
              <SelectItem value="comments_desc">Most Discussed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <ActiveFilters
          filters={filters}
          onRemoveGenre={(genre) => handleGenreChange(genre, false)}
          onRemoveCountry={(country) => handleCountryChange(country, false)}
          onRemoveLanguage={(language) => handleLanguageChange(language, false)}
          onRemoveYearRange={() => handleYearRangeChange([1900, 2024])}
          onRemoveScoreRange={() => handleScoreRangeChange([0, 10])}
          onRemoveVerification={() => handleVerificationChange("all")}
          onClearAll={onClearFilters}
        />
      )}

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsFilterDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-siddu-bg-card-dark border-t border-siddu-border-subtle rounded-t-xl p-4 z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterDrawerOpen(false)}>
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Genre Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Genres</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {genreOptions.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-genre-${genre}`}
                          checked={filters.genres.includes(genre)}
                          onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                        />
                        <Label htmlFor={`mobile-genre-${genre}`} className="text-sm">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Year Range Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Release Year</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.yearRange.min, filters.yearRange.max]}
                      min={1900}
                      max={2024}
                      step={1}
                      onValueChange={handleYearRangeChange}
                    />
                    <div className="flex justify-between mt-2 text-xs text-siddu-text-subtle">
                      <span>{filters.yearRange.min}</span>
                      <span>{filters.yearRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Country Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Country</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {countryOptions.slice(0, 8).map((country) => (
                      <div key={country} className="flex items-center space-x-2">
                        <Checkbox
                          id={`mobile-country-${country}`}
                          checked={filters.countries.includes(country)}
                          onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
                        />
                        <Label htmlFor={`mobile-country-${country}`} className="text-sm">
                          {country}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {countryOptions.length > 8 && (
                    <Button variant="link" size="sm" className="mt-1 p-0 h-auto text-siddu-electric-blue">
                      Show more
                    </Button>
                  )}
                </div>

                {/* Score Range Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">SidduScore</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.scoreRange.min, filters.scoreRange.max]}
                      min={0}
                      max={10}
                      step={0.5}
                      onValueChange={handleScoreRangeChange}
                    />
                    <div className="flex justify-between mt-2 text-xs text-siddu-text-subtle">
                      <span>{filters.scoreRange.min}</span>
                      <span>{filters.scoreRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Verification Status Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Verification Status</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={filters.verificationStatus === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVerificationChange("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={filters.verificationStatus === "verified" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVerificationChange("verified")}
                    >
                      Verified
                    </Button>
                    <Button
                      variant={filters.verificationStatus === "unverified" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVerificationChange("unverified")}
                    >
                      Unverified
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-siddu-border-subtle">
                  <Button variant="outline" className="flex-1" onClick={onClearFilters}>
                    Clear All
                  </Button>
                  <Button className="flex-1" onClick={() => setIsFilterDrawerOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
