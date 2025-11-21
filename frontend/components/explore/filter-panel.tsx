"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { FilterState } from "./types"

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  isMobile?: boolean
}

export function FilterPanel({ filters, onFilterChange, isMobile = false }: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    year: true,
    language: isMobile ? false : true,
    country: isMobile ? false : true,
    rating: isMobile ? false : true,
  })

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western",
  ]

  const languages = [
    "English",
    "Spanish",
    "French",
    "Japanese",
    "Korean",
    "Hindi",
    "Mandarin",
    "German",
    "Italian",
    "Portuguese",
  ]

  const countries = [
    "United States",
    "United Kingdom",
    "India",
    "Japan",
    "South Korea",
    "France",
    "Spain",
    "Italy",
    "Germany",
    "Brazil",
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleGenreChange = (genre: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      genres: checked ? [...filters.genres, genre] : filters.genres.filter((g) => g !== genre),
    })
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      languages: checked ? [...filters.languages, language] : filters.languages.filter((l) => l !== language),
    })
  }

  const handleCountryChange = (country: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      countries: checked ? [...filters.countries, country] : filters.countries.filter((c) => c !== country),
    })
  }

  const handleYearChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      yearRange: [values[0], values[1]],
    })
  }

  const handleRatingChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      ratingRange: [values[0], values[1]],
    })
  }

  const handleClearAll = () => {
    onFilterChange({
      genres: [],
      yearRange: [1900, new Date().getFullYear()],
      languages: [],
      countries: [],
      ratingRange: [0, 10],
    })
  }

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.languages.length > 0 ||
    filters.countries.length > 0 ||
    filters.yearRange[0] > 1900 ||
    filters.yearRange[1] < new Date().getFullYear() ||
    filters.ratingRange[0] > 0 ||
    filters.ratingRange[1] < 10

  return (
    <motion.div
      className={`bg-[#282828] rounded-lg border border-[#3A3A3A] ${isMobile ? "p-4" : "p-5"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-[#00BFFF] hover:text-[#00BFFF]/80 hover:bg-[#00BFFF]/10 h-8 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Genres */}
      <div className="mb-6">
        <button className="flex justify-between items-center w-full mb-3" onClick={() => toggleSection("genres")}>
          <h4 className="font-medium">Genres</h4>
          {expandedSections.genres ? (
            <ChevronUp className="h-4 w-4 text-[#A0A0A0]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#A0A0A0]" />
          )}
        </button>

        {expandedSections.genres && (
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox
                  id={`genre-${genre}`}
                  checked={filters.genres.includes(genre)}
                  onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                  className="data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                />
                <label htmlFor={`genre-${genre}`} className="text-sm text-[#E0E0E0] cursor-pointer">
                  {genre}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Year Range */}
      <div className="mb-6">
        <button className="flex justify-between items-center w-full mb-3" onClick={() => toggleSection("year")}>
          <h4 className="font-medium">Release Year</h4>
          {expandedSections.year ? (
            <ChevronUp className="h-4 w-4 text-[#A0A0A0]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#A0A0A0]" />
          )}
        </button>

        {expandedSections.year && (
          <div className="px-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#A0A0A0]">{filters.yearRange[0]}</span>
              <span className="text-sm text-[#A0A0A0]">{filters.yearRange[1]}</span>
            </div>
            <Slider
              min={1900}
              max={new Date().getFullYear()}
              step={1}
              value={[filters.yearRange[0], filters.yearRange[1]]}
              onValueChange={handleYearChange}
              className="my-4"
            />
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="mb-6">
        <button className="flex justify-between items-center w-full mb-3" onClick={() => toggleSection("language")}>
          <h4 className="font-medium">Languages</h4>
          {expandedSections.language ? (
            <ChevronUp className="h-4 w-4 text-[#A0A0A0]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#A0A0A0]" />
          )}
        </button>

        {expandedSections.language && (
          <div className="grid grid-cols-2 gap-2">
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`language-${language}`}
                  checked={filters.languages.includes(language)}
                  onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                  className="data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                />
                <label htmlFor={`language-${language}`} className="text-sm text-[#E0E0E0] cursor-pointer">
                  {language}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Countries */}
      <div className="mb-6">
        <button className="flex justify-between items-center w-full mb-3" onClick={() => toggleSection("country")}>
          <h4 className="font-medium">Countries</h4>
          {expandedSections.country ? (
            <ChevronUp className="h-4 w-4 text-[#A0A0A0]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#A0A0A0]" />
          )}
        </button>

        {expandedSections.country && (
          <div className="grid grid-cols-2 gap-2">
            {countries.map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={filters.countries.includes(country)}
                  onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
                  className="data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                />
                <label htmlFor={`country-${country}`} className="text-sm text-[#E0E0E0] cursor-pointer truncate">
                  {country}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Range */}
      <div className="mb-2">
        <button className="flex justify-between items-center w-full mb-3" onClick={() => toggleSection("rating")}>
          <h4 className="font-medium">Rating</h4>
          {expandedSections.rating ? (
            <ChevronUp className="h-4 w-4 text-[#A0A0A0]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#A0A0A0]" />
          )}
        </button>

        {expandedSections.rating && (
          <div className="px-1">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#A0A0A0]">{filters.ratingRange[0]}</span>
              <span className="text-sm text-[#A0A0A0]">{filters.ratingRange[1]}</span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={[filters.ratingRange[0], filters.ratingRange[1]]}
              onValueChange={handleRatingChange}
              className="my-4"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
