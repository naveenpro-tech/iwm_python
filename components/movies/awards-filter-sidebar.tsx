"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export interface AwardsFilters {
  country: string
  ceremonies: string[]
  language: string
  categoryType: string
  yearRange: [number, number]
  status: string
}

interface AwardsFilterSidebarProps {
  awards: Array<{
    id: string
    name: string
    year: number
    category: string
    status: "Winner" | "Nominee"
    country?: string
    language?: string
    prestige_level?: string
    ceremony_id?: string
  }>
  filters: AwardsFilters
  onFiltersChange: (filters: AwardsFilters) => void
  isMobile?: boolean
}

export function AwardsFilterSidebar({ awards, filters, onFiltersChange, isMobile = false }: AwardsFilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    country: true,
    ceremonies: true,
    language: true,
    categoryType: true,
    yearRange: true,
    status: true,
  })

  // Extract unique values from awards
  const countries = ["All", ...Array.from(new Set(awards.map((a) => a.country).filter(Boolean))).sort()]
  const ceremonies = Array.from(new Set(awards.map((a) => a.name))).sort()
  const languages = ["All", ...Array.from(new Set(awards.map((a) => a.language).filter(Boolean))).sort()]
  const categoryTypes = ["All", ...Array.from(new Set(awards.map((a) => a.category).filter(Boolean))).sort()]

  // Get year range
  const years = awards.map((a) => a.year)
  const minYear = years.length > 0 ? Math.min(...years) : new Date().getFullYear() - 10
  const maxYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear()

  const handleCeremonyToggle = (ceremony: string) => {
    const newCeremonies = filters.ceremonies.includes(ceremony)
      ? filters.ceremonies.filter((c) => c !== ceremony)
      : [...filters.ceremonies, ceremony]
    onFiltersChange({ ...filters, ceremonies: newCeremonies })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      country: "All",
      ceremonies: [],
      language: "All",
      categoryType: "All",
      yearRange: [minYear, maxYear],
      status: "All",
    })
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const activeFiltersCount =
    (filters.country !== "All" ? 1 : 0) +
    filters.ceremonies.length +
    (filters.language !== "All" ? 1 : 0) +
    (filters.categoryType !== "All" ? 1 : 0) +
    (filters.status !== "All" ? 1 : 0) +
    (filters.yearRange[0] !== minYear || filters.yearRange[1] !== maxYear ? 1 : 0)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#00BFFF]" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-[#00BFFF] text-black">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Country Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("country")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-medium text-gray-300 cursor-pointer">Country</Label>
          {expandedSections.country ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.country && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Select value={filters.country} onValueChange={(value) => onFiltersChange({ ...filters, country: value })}>
                <SelectTrigger className="bg-[#282828] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Award Ceremonies Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("ceremonies")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-medium text-gray-300 cursor-pointer">
            Award Ceremonies {filters.ceremonies.length > 0 && `(${filters.ceremonies.length})`}
          </Label>
          {expandedSections.ceremonies ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.ceremonies && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ScrollArea className="h-[200px] rounded-md border border-gray-700 bg-[#282828] p-3">
                <div className="space-y-2">
                  {ceremonies.map((ceremony) => (
                    <div key={ceremony} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ceremony-${ceremony}`}
                        checked={filters.ceremonies.includes(ceremony)}
                        onCheckedChange={() => handleCeremonyToggle(ceremony)}
                        className="border-gray-600"
                      />
                      <label
                        htmlFor={`ceremony-${ceremony}`}
                        className="text-sm text-gray-300 cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {ceremony}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Language Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("language")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-medium text-gray-300 cursor-pointer">Language</Label>
          {expandedSections.language ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.language && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Select value={filters.language} onValueChange={(value) => onFiltersChange({ ...filters, language: value })}>
                <SelectTrigger className="bg-[#282828] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Year Range Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("yearRange")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-medium text-gray-300 cursor-pointer">
            Year Range ({filters.yearRange[0]} - {filters.yearRange[1]})
          </Label>
          {expandedSections.yearRange ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.yearRange && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2"
            >
              <Slider
                min={minYear}
                max={maxYear}
                step={1}
                value={filters.yearRange}
                onValueChange={(value) => onFiltersChange({ ...filters, yearRange: value as [number, number] })}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{minYear}</span>
                <span>{maxYear}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <button
          onClick={() => toggleSection("status")}
          className="flex items-center justify-between w-full text-left"
        >
          <Label className="text-sm font-medium text-gray-300 cursor-pointer">Status</Label>
          {expandedSections.status ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {expandedSections.status && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
                <SelectTrigger className="bg-[#282828] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Winner">Winners Only</SelectItem>
                  <SelectItem value="Nominee">Nominees Only</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  // Mobile: Render as Sheet (drawer)
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full gap-2 bg-[#1C1C1C] border-gray-700 text-white hover:bg-[#282828]">
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-[#00BFFF] text-black ml-auto">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#141414] border-gray-700 text-white w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-white">Filter Awards</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] mt-6">
            <FilterContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Render as sidebar
  return (
    <div className="bg-[#1C1C1C] rounded-xl p-6 border border-gray-700 sticky top-4">
      <FilterContent />
    </div>
  )
}

