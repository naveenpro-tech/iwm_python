"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Filter, X, SortAsc, SortDesc, Clock, Film, User, Video, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { FilterState, AvailableFilters, SortByType } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  availableFilters: AvailableFilters
}

const sortOptions: { label: string; value: SortByType; icon: React.ElementType }[] = [
  { label: "Most Popular", value: "popular", icon: SortDesc },
  { label: "Most Viewed", value: "views_desc", icon: Eye },
  { label: "Most Recent", value: "recent", icon: Clock },
  { label: "Oldest First", value: "oldest", icon: SortAsc },
  { label: "Title (A-Z)", value: "title_asc", icon: Film },
  { label: "Title (Z-A)", value: "title_desc", icon: Film },
  { label: "Director (A-Z)", value: "director_asc", icon: User },
  { label: "Director (Z-A)", value: "director_desc", icon: User },
  { label: "Film (A-Z)", value: "film_asc", icon: Video },
  { label: "Film (Z-A)", value: "film_desc", icon: Video },
]

export function FilterSidebar({ isOpen, onClose, filters, onFilterChange, availableFilters }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({
    categories: "",
    tags: "",
    directors: "",
    cinematographers: "",
    decades: "",
  })

  useEffect(() => {
    setLocalFilters(filters) // Sync with external changes if any
  }, [filters])

  const handleSortChange = (value: SortByType) => {
    setLocalFilters((prev) => ({ ...prev, sortBy: value }))
  }

  const handleToggleFilter = (filterType: keyof Omit<FilterState, "sortBy">, value: string) => {
    setLocalFilters((prev) => {
      const currentValues = prev[filterType] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      return { ...prev, [filterType]: newValues }
    })
  }

  const handleApplyFilters = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const handleResetFilters = () => {
    const resetFiltersState: FilterState = {
      categories: [],
      tags: [],
      directors: [],
      cinematographers: [],
      decades: [],
      sortBy: "popular",
    }
    setLocalFilters(resetFiltersState)
    // Optionally apply immediately or wait for "Apply Filters"
    // onFilterChange(resetFiltersState);
  }

  const handleSearchQueryChange = (filterType: string, query: string) => {
    setSearchQueries((prev) => ({ ...prev, [filterType]: query }))
  }

  const filterItems = (items: { name: string; count: number }[], query: string) => {
    if (!query) return items
    return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
  }

  const renderFilterSection = (
    title: string,
    filterKey: keyof Omit<FilterState, "sortBy">,
    availableItems: { name: string; count: number }[],
  ) => (
    <AccordionItem value={filterKey} className="border-gray-700">
      <AccordionTrigger className="text-white hover:text-[#00BFFF] hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent>
        <Input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchQueries[filterKey]}
          onChange={(e) => handleSearchQueryChange(filterKey, e.target.value)}
          className="bg-[#222] border-gray-600 text-white mb-2 text-sm"
        />
        <ScrollArea className="h-40">
          <div className="space-y-2 mt-2 pr-2">
            {filterItems(availableItems, searchQueries[filterKey]).map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filterKey}-${item.name}`}
                  checked={(localFilters[filterKey] as string[]).includes(item.name)}
                  onCheckedChange={() => handleToggleFilter(filterKey, item.name)}
                  className="border-gray-500 data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
                />
                <Label
                  htmlFor={`${filterKey}-${item.name}`}
                  className="text-gray-300 cursor-pointer flex justify-between w-full text-sm"
                >
                  <span>{item.name}</span>
                  <span className="text-gray-500">({item.count})</span>
                </Label>
              </div>
            ))}
            {filterItems(availableItems, searchQueries[filterKey]).length === 0 && (
              <p className="text-gray-500 text-sm">No {title.toLowerCase()} found.</p>
            )}
          </div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  )

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose}></div>}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-[#1A1A1A] shadow-2xl z-50 flex flex-col"
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#00BFFF]" />
            Filter & Sort
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-grow p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3 text-md">Sort By</h3>
              <div className="grid grid-cols-1 gap-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.value}
                      variant={localFilters.sortBy === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full justify-start text-sm ${
                        localFilters.sortBy === option.value
                          ? "bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white border-[#00BFFF]"
                          : "border-gray-600 text-gray-300 hover:bg-[#3A3A3A] hover:text-white hover:border-gray-500"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            <Accordion type="multiple" className="w-full" defaultValue={["categories", "tags"]}>
              {renderFilterSection("Categories", "categories", availableFilters.categories)}
              {renderFilterSection("Tags", "tags", availableFilters.tags)}
              {renderFilterSection("Directors", "directors", availableFilters.directors)}
              {renderFilterSection("Cinematographers", "cinematographers", availableFilters.cinematographers)}
              {renderFilterSection("Decades", "decades", availableFilters.decades)}
            </Accordion>
          </div>
        </ScrollArea>

        <div className="flex gap-3 p-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-[#3A3A3A] hover:text-white"
          >
            Reset
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1 bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white">
            Apply Filters
          </Button>
        </div>
      </motion.div>
    </>
  )
}
