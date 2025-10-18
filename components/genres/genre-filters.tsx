"use client"

import { useState, useMemo, useEffect } from "react"
import { Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMobile } from "@/hooks/use-mobile"
import type { MovieFilters } from "@/lib/api"

interface GenreFiltersProps {
  subgenres: { id: string; name: string }[]
  genre: string
  currentFilters: MovieFilters
  onFiltersChange: (newFilters: Partial<MovieFilters>) => void
  availableCountries: string[]
  availableLanguages: string[]
}

const DEFAULT_YEAR_RANGE: [number, number] = [1900, new Date().getFullYear()]
const DEFAULT_RATING_RANGE: [number, number] = [0, 10]

export function GenreFilters({
  subgenres,
  genre,
  currentFilters,
  onFiltersChange,
  availableCountries,
  availableLanguages,
}: GenreFiltersProps) {
  const isMobile = useMobile()

  const [popoverYearRange, setPopoverYearRange] = useState(currentFilters.yearRange || DEFAULT_YEAR_RANGE)
  const [popoverRatingRange, setPopoverRatingRange] = useState(currentFilters.ratingRange || DEFAULT_RATING_RANGE)
  const [popoverSelectedCountries, setPopoverSelectedCountries] = useState<string[]>(currentFilters.countries || [])
  const [popoverSelectedLanguages, setPopoverSelectedLanguages] = useState<string[]>(currentFilters.languages || [])
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Sync popover state if external currentFilters change (e.g. on initial load after details fetch)
  useEffect(() => {
    setPopoverYearRange(currentFilters.yearRange || DEFAULT_YEAR_RANGE)
    setPopoverRatingRange(currentFilters.ratingRange || DEFAULT_RATING_RANGE)
    setPopoverSelectedCountries(currentFilters.countries || [])
    setPopoverSelectedLanguages(currentFilters.languages || [])
  }, [
    currentFilters.yearRange,
    currentFilters.ratingRange,
    currentFilters.countries,
    currentFilters.languages,
    isPopoverOpen,
  ])

  const sortOptions = [
    { value: "popularity", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "recent", label: "Recently Added" },
    { value: "year", label: "Release Year" },
    { value: "runtime", label: "Runtime" },
    { value: "genre_defining", label: "Genre Defining" },
  ]

  const handleApplyPopoverFilters = () => {
    onFiltersChange({
      yearRange: popoverYearRange,
      ratingRange: popoverRatingRange,
      countries: popoverSelectedCountries,
      languages: popoverSelectedLanguages,
    })
    setIsPopoverOpen(false)
  }

  const handleResetPopoverFilters = () => {
    setPopoverYearRange(DEFAULT_YEAR_RANGE)
    setPopoverRatingRange(DEFAULT_RATING_RANGE)
    setPopoverSelectedCountries([])
    setPopoverSelectedLanguages([])
    // Apply immediately
    onFiltersChange({
      yearRange: DEFAULT_YEAR_RANGE,
      ratingRange: DEFAULT_RATING_RANGE,
      countries: [],
      languages: [],
    })
  }

  const activeFilterCount = useMemo(
    () =>
      (currentFilters.yearRange &&
      (currentFilters.yearRange[0] !== DEFAULT_YEAR_RANGE[0] || currentFilters.yearRange[1] !== DEFAULT_YEAR_RANGE[1])
        ? 1
        : 0) +
      (currentFilters.ratingRange &&
      (currentFilters.ratingRange[0] !== DEFAULT_RATING_RANGE[0] ||
        currentFilters.ratingRange[1] !== DEFAULT_RATING_RANGE[1])
        ? 1
        : 0) +
      (currentFilters.countries?.length || 0) + // Count each country as a filter
      (currentFilters.languages?.length || 0), // Count each language
    [currentFilters],
  )

  const renderMultiSelect = (
    title: string,
    options: string[],
    selected: string[],
    setter: (values: string[]) => void,
  ) => (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-200">{title}</h4>
      <ScrollArea className="h-32 border border-gray-700 rounded-md p-2 bg-background">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2 py-1 hover:bg-gray-700/50 px-1 rounded">
            <Checkbox
              id={`${title}-${option}`}
              checked={selected.includes(option)}
              onCheckedChange={(checked) => {
                setter(checked ? [...selected, option] : selected.filter((item) => item !== option))
              }}
              className="border-gray-600 data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
            />
            <label htmlFor={`${title}-${option}`} className="text-sm text-gray-300 cursor-pointer flex-grow">
              {option}
            </label>
          </div>
        ))}
      </ScrollArea>
    </div>
  )

  return (
    <div className="space-y-4 sticky top-[60px] md:top-[68px] z-30 bg-background py-3 border-b border-gray-800 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div className="overflow-x-auto pb-2 no-scrollbar">
          <Tabs
            value={currentFilters.subgenre || "all"}
            className="w-full"
            onValueChange={(value) => onFiltersChange({ subgenre: value })}
          >
            <TabsList className="bg-gray-800/50 h-9">
              <TabsTrigger
                value="all"
                className="h-7 text-xs sm:text-sm px-2.5 sm:px-3 data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
              >
                All {genre}
              </TabsTrigger>
              {subgenres.map((sub) => (
                <TabsTrigger
                  key={sub.id}
                  value={sub.id}
                  className="h-7 text-xs sm:text-sm px-2.5 sm:px-3 data-[state=active]:bg-[#00BFFF] data-[state=active]:text-black"
                >
                  {sub.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Select
            value={currentFilters.sortBy}
            onValueChange={(value) => onFiltersChange({ sortBy: value as MovieFilters["sortBy"] })}
          >
            <SelectTrigger className="w-full md:w-[190px] bg-gray-800/50 border-gray-700 h-9 text-xs sm:text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-gray-700 focus:bg-gray-700 data-[highlighted]:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-800/50 hover:bg-gray-700/70 relative h-9 px-3"
              >
                <Filter className="h-4 w-4 mr-1 md:mr-1.5" />
                <span className="hidden md:inline text-xs sm:text-sm">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#00BFFF] text-black text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center px-1">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 md:w-[350px] bg-gray-800 border-gray-700 shadow-2xl text-gray-200"
              sideOffset={8}
            >
              <div className="space-y-5 p-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Advanced Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetPopoverFilters}
                    className="text-xs text-[#00BFFF] hover:text-[#00aeee] px-2 py-1"
                  >
                    <RotateCcw size={12} className="mr-1" /> Reset
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-gray-300">Year Range</h4>
                  <Slider
                    value={popoverYearRange}
                    min={1900}
                    max={new Date().getFullYear()}
                    step={1}
                    onValueChange={(value) => setPopoverYearRange(value as [number, number])}
                    className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-[#00BFFF] [&>span:nth-child(2)>span]:bg-gray-600 [&>span:nth-child(2)>span]:border-gray-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{popoverYearRange[0]}</span>
                    <span>{popoverYearRange[1]}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-medium text-gray-300">SidduScore Rating</h4>
                  <Slider
                    value={popoverRatingRange}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setPopoverRatingRange(value as [number, number])}
                    className="[&>span:first-child]:h-1 [&>span:first-child>span]:bg-[#00BFFF] [&>span:nth-child(2)>span]:bg-gray-600 [&>span:nth-child(2)>span]:border-gray-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{popoverRatingRange[0].toFixed(1)}</span>
                    <span>{popoverRatingRange[1].toFixed(1)}</span>
                  </div>
                </div>

                {availableCountries.length > 0 &&
                  renderMultiSelect(
                    "Country of Origin",
                    availableCountries,
                    popoverSelectedCountries,
                    setPopoverSelectedCountries,
                  )}
                {availableLanguages.length > 0 &&
                  renderMultiSelect(
                    "Language",
                    availableLanguages,
                    popoverSelectedLanguages,
                    setPopoverSelectedLanguages,
                  )}

                <Button
                  onClick={handleApplyPopoverFilters}
                  className="w-full bg-[#00BFFF] hover:bg-[#00aeee] text-black font-semibold mt-2"
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
