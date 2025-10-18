"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface SearchFiltersProps {
  activeTab: string
}

export function SearchFilters({ activeTab }: SearchFiltersProps) {
  const [yearRange, setYearRange] = useState([1970, 2023])
  const [ratingRange, setRatingRange] = useState([0, 10])
  const [expandedSections, setExpandedSections] = useState({
    year: true,
    genre: true,
    rating: true,
    language: false,
    country: false,
  })

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }

  // Filter sections based on active tab
  const renderFilters = () => {
    switch (activeTab) {
      case "all":
      case "movies":
        return (
          <>
            <FilterSection title="Year" expanded={expandedSections.year} onToggle={() => toggleSection("year")}>
              <div className="px-2 py-4">
                <Slider
                  value={yearRange}
                  min={1900}
                  max={2023}
                  step={1}
                  onValueChange={setYearRange}
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Genre" expanded={expandedSections.genre} onToggle={() => toggleSection("genre")}>
              <div className="px-2 py-2 space-y-2">
                {["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Romance", "Thriller", "Animation"].map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox id={`genre-${genre}`} />
                    <Label htmlFor={`genre-${genre}`} className="text-sm cursor-pointer">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Rating" expanded={expandedSections.rating} onToggle={() => toggleSection("rating")}>
              <div className="px-2 py-4">
                <Slider
                  value={ratingRange}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={setRatingRange}
                  className="my-6"
                />
                <div className="flex justify-between text-sm">
                  <span>{ratingRange[0].toFixed(1)}</span>
                  <span>{ratingRange[1].toFixed(1)}</span>
                </div>
              </div>
            </FilterSection>
          </>
        )

      case "people":
        return (
          <>
            <FilterSection title="Role" expanded={expandedSections.genre} onToggle={() => toggleSection("genre")}>
              <div className="px-2 py-2 space-y-2">
                {["Actor", "Director", "Writer", "Producer", "Cinematographer", "Composer"].map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox id={`role-${role}`} />
                    <Label htmlFor={`role-${role}`} className="text-sm cursor-pointer">
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>

            <FilterSection
              title="Country"
              expanded={expandedSections.country}
              onToggle={() => toggleSection("country")}
            >
              <div className="px-2 py-2 space-y-2">
                {["United States", "India", "United Kingdom", "France", "Japan", "South Korea"].map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox id={`country-${country}`} />
                    <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </FilterSection>
          </>
        )

      // Add other tab filters as needed
      default:
        return null
    }
  }

  return (
    <motion.div
      className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-lg">Filters</h3>
      </div>

      <div className="divide-y divide-gray-700">{renderFilters()}</div>

      <div className="p-4 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          Reset
        </Button>
        <Button size="sm" className="flex-1 bg-[#00BFFF] hover:bg-[#00BFFF]/90">
          Apply
        </Button>
      </div>
    </motion.div>
  )
}

interface FilterSectionProps {
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#333333] transition-colors"
      >
        <span className="font-medium">{title}</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}
