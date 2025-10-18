"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface FilterSidebarProps {
  filters: {
    genres: string[]
    yearRange: [number, number]
    countries: string[]
    languages: string[]
    scoreRange: [number, number]
    status: string[]
  }
  onFiltersChange: (filters: any) => void
}

const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
]

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
]

const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "Japanese",
  "Korean",
  "Mandarin",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Arabic",
  "Tamil",
  "Telugu",
]

const STATUS_OPTIONS = [
  { value: "theaters", label: "In Theaters" },
  { value: "streaming", label: "Streaming" },
  { value: "coming-soon", label: "Coming Soon" },
]

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    year: true,
    countries: false,
    languages: false,
    score: true,
    status: true,
    advanced: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilter = (type: string, value: any) => {
    onFiltersChange({ ...filters, [type]: value })
  }

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string
    section: keyof typeof expandedSections
    children: React.ReactNode
  }) => (
    <div className="border-b border-[#3A3A3A] pb-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <h3 className="text-sm font-semibold text-[#E0E0E0]">{title}</h3>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 text-[#A0A0A0]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#A0A0A0]" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: expandedSections[section] ? "auto" : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  )

  return (
    <div className="bg-[#282828] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#E0E0E0]">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onFiltersChange({
              genres: [],
              yearRange: [1900, new Date().getFullYear()],
              countries: [],
              languages: [],
              scoreRange: [0, 10],
              status: [],
            })
          }}
          className="text-[#00BFFF] hover:text-[#00BFFF]/80"
        >
          Clear All
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 pr-4">
          {/* Genres */}
          <FilterSection title="Genres" section="genres">
            <div className="space-y-2">
              {GENRES.slice(0, expandedSections.genres ? undefined : 5).map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre}
                    checked={filters.genres.includes(genre)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter("genres", [...filters.genres, genre])
                      } else {
                        updateFilter(
                          "genres",
                          filters.genres.filter((g) => g !== genre),
                        )
                      }
                    }}
                    className="border-[#3A3A3A] data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                  />
                  <Label htmlFor={genre} className="text-sm text-[#E0E0E0] cursor-pointer">
                    {genre}
                  </Label>
                </div>
              ))}
              {GENRES.length > 5 && !expandedSections.genres && (
                <button
                  onClick={() => toggleSection("genres")}
                  className="text-sm text-[#00BFFF] hover:text-[#00BFFF]/80"
                >
                  Show more
                </button>
              )}
            </div>
          </FilterSection>

          {/* Release Year */}
          <FilterSection title="Release Year" section="year">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A0A0A0]">{filters.yearRange[0]}</span>
                <span className="text-[#A0A0A0]">{filters.yearRange[1]}</span>
              </div>
              <Slider
                value={filters.yearRange}
                onValueChange={(value) => updateFilter("yearRange", value)}
                min={1900}
                max={new Date().getFullYear()}
                step={1}
                className="[&_[role=slider]]:bg-[#00BFFF]"
              />
              <div className="flex gap-2 flex-wrap">
                {["2020s", "2010s", "2000s", "1990s", "Classic"].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentYear = new Date().getFullYear()
                      let range: [number, number] = [1900, currentYear]
                      switch (preset) {
                        case "2020s":
                          range = [2020, currentYear]
                          break
                        case "2010s":
                          range = [2010, 2019]
                          break
                        case "2000s":
                          range = [2000, 2009]
                          break
                        case "1990s":
                          range = [1990, 1999]
                          break
                        case "Classic":
                          range = [1900, 1989]
                          break
                      }
                      updateFilter("yearRange", range)
                    }}
                    className={cn(
                      "text-xs bg-transparent border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]",
                      filters.yearRange[0] === (preset === "Classic" ? 1900 : Number.parseInt(preset)) &&
                        "bg-[#00BFFF] text-white border-[#00BFFF] hover:bg-[#00BFFF]/90",
                    )}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          </FilterSection>

          {/* Country */}
          <FilterSection title="Country of Origin" section="countries">
            <div className="space-y-2">
              {COUNTRIES.map((country) => (
                <div key={country.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={country.code}
                    checked={filters.countries.includes(country.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter("countries", [...filters.countries, country.name])
                      } else {
                        updateFilter(
                          "countries",
                          filters.countries.filter((c) => c !== country.name),
                        )
                      }
                    }}
                    className="border-[#3A3A3A] data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                  />
                  <Label
                    htmlFor={country.code}
                    className="text-sm text-[#E0E0E0] cursor-pointer flex items-center gap-2"
                  >
                    <span>{country.flag}</span>
                    {country.name}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Language */}
          <FilterSection title="Language" section="languages">
            <div className="space-y-2">
              {LANGUAGES.slice(0, expandedSections.languages ? undefined : 5).map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={filters.languages.includes(language)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter("languages", [...filters.languages, language])
                      } else {
                        updateFilter(
                          "languages",
                          filters.languages.filter((l) => l !== language),
                        )
                      }
                    }}
                    className="border-[#3A3A3A] data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                  />
                  <Label htmlFor={language} className="text-sm text-[#E0E0E0] cursor-pointer">
                    {language}
                  </Label>
                </div>
              ))}
              {LANGUAGES.length > 5 && !expandedSections.languages && (
                <button
                  onClick={() => toggleSection("languages")}
                  className="text-sm text-[#00BFFF] hover:text-[#00BFFF]/80"
                >
                  Show more
                </button>
              )}
            </div>
          </FilterSection>

          {/* SidduScore */}
          <FilterSection title="SidduScore" section="score">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#A0A0A0]">{filters.scoreRange[0]}</span>
                <span className="text-[#A0A0A0]">{filters.scoreRange[1]}</span>
              </div>
              <Slider
                value={filters.scoreRange}
                onValueChange={(value) => updateFilter("scoreRange", value)}
                min={0}
                max={10}
                step={0.5}
                className="[&_[role=slider]]:bg-[#00BFFF]"
              />
              <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
            </div>
          </FilterSection>

          {/* Status */}
          <FilterSection title="Status" section="status">
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={status.value}
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFilter("status", [...filters.status, status.value])
                      } else {
                        updateFilter(
                          "status",
                          filters.status.filter((s) => s !== status.value),
                        )
                      }
                    }}
                    className="border-[#3A3A3A] data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                  />
                  <Label htmlFor={status.value} className="text-sm text-[#E0E0E0] cursor-pointer">
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </div>
  )
}
