"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, Grid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PeopleGrid } from "@/components/people/people-grid"
import { PeopleList } from "@/components/people/people-list"
import { FilterSidebar } from "@/components/people/filter-sidebar"
import { ActiveFilters } from "@/components/people/active-filters"
import { Pagination } from "@/components/shared/pagination"
import { useMobile } from "@/hooks/use-mobile"

export default function PeopleDirectoryPage() {
  const isMobile = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filtersOpen, setFiltersOpen] = useState(!isMobile)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleClearFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const handleClearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white pb-16"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        >
          <h1 className="text-3xl font-bold mb-2">Explore Film Industry Professionals</h1>
          <p className="text-gray-400">
            Discover actors, directors, writers, and other talents behind your favorite films
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {filtersOpen && (
            <motion.div
              className="w-full md:w-64 shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FilterSidebar onFilterChange={handleFilterChange} activeFilters={activeFilters} />
            </motion.div>
          )}

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-auto flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search by name, role, or film..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#282828] border-gray-700 focus:border-[#00BFFF] focus:ring-[#00BFFF]"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="border-gray-700"
                  aria-label={filtersOpen ? "Hide filters" : "Show filters"}
                >
                  <Filter size={18} />
                </Button>

                <div className="border border-gray-700 rounded-md flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-r-none ${viewMode === "grid" ? "bg-[#282828]" : ""}`}
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <Grid size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`rounded-l-none ${viewMode === "list" ? "bg-[#282828]" : ""}`}
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                  >
                    <List size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="mb-4">
                <ActiveFilters
                  filters={activeFilters}
                  onClearFilter={handleClearFilter}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            )}

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {["Actor", "Director", "Writer", "Producer", "Cinematographer"].map((role) => (
                  <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    className={`border-gray-700 hover:bg-[#282828] hover:text-white ${
                      activeFilters.includes(`role:${role}`) ? "bg-[#282828] border-[#00BFFF]" : ""
                    }`}
                    onClick={() => {
                      if (activeFilters.includes(`role:${role}`)) {
                        handleClearFilter(`role:${role}`)
                      } else {
                        setActiveFilters([...activeFilters, `role:${role}`])
                      }
                    }}
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-400 mb-4">Showing 1-24 of 1,245 professionals</div>

            {viewMode === "grid" ? <PeopleGrid /> : <PeopleList />}

            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={52} onPageChange={setCurrentPage} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
