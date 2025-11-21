"use client"

import { motion } from "framer-motion"
import { TextFiltersPanel } from "./filter-panels/text-filters-panel"
import { PeopleFiltersPanel } from "./filter-panels/people-filters-panel"
import { DateFiltersPanel } from "./filter-panels/date-filters-panel"
import { RatingFiltersPanel } from "./filter-panels/rating-filters-panel"
import { AwardFiltersPanel } from "./filter-panels/award-filters-panel"
import { TechnicalFiltersPanel } from "./filter-panels/technical-filters-panel"
import { ActiveFiltersDisplay } from "./active-filters-display"
import { Button } from "@/components/ui/button"
import type { FilterSet } from "./types"

interface QueryBuilderProps {
  filters: FilterSet
  onFiltersChange: (filters: FilterSet) => void
  onSearch: () => void
}

export function QueryBuilder({ filters, onFiltersChange, onSearch }: QueryBuilderProps) {
  const filterCategories = [
    { id: "text", label: "Text Filters", component: TextFiltersPanel },
    { id: "people", label: "People", component: PeopleFiltersPanel },
    { id: "date", label: "Date Range", component: DateFiltersPanel },
    { id: "rating", label: "Ratings", component: RatingFiltersPanel },
    { id: "awards", label: "Awards", component: AwardFiltersPanel },
    { id: "technical", label: "Technical Crew", component: TechnicalFiltersPanel },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Active Filters */}
      <ActiveFiltersDisplay
        filters={filters}
        onRemoveFilter={(category, key) => {
          const newFilters = { ...filters }
          delete newFilters[category][key]
          onFiltersChange(newFilters)
        }}
      />

      {/* Filter Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filterCategories.map((category) => {
          const Component = category.component
          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="bg-[#282828] border border-gray-700 rounded-lg p-4"
            >
              <h3 className="text-white font-semibold mb-3">{category.label}</h3>
              <Component
                filters={filters[`${category.id}Filters`]}
                onChange={(newFilters) => {
                  onFiltersChange({
                    ...filters,
                    [`${category.id}Filters`]: newFilters,
                  })
                }}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Search Button */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <Button onClick={onSearch} size="lg" className="bg-[#00BFFF] hover:bg-[#0099CC] text-white px-8">
          Apply Filters & Search
        </Button>
      </motion.div>
    </motion.div>
  )
}
