"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExploreHeader } from "./explore-header"
import { ExploreCategories } from "./explore-categories"
import { ExploreGrid } from "./explore-grid"
import { ExploreFilters } from "./explore-filters"
import { useDebounce } from "@/hooks/use-debounce"

export function ExploreContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("trending")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  const handleFilterToggle = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <ExploreHeader searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      <ExploreCategories activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <ExploreFilters activeFilters={activeFilters} onFilterToggle={handleFilterToggle} />
        </aside>

        <main className="flex-1">
          <ExploreGrid
            searchQuery={debouncedSearchQuery}
            activeCategory={activeCategory}
            activeFilters={activeFilters}
          />
        </main>
      </div>
    </motion.div>
  )
}
