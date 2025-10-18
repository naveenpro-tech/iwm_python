"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { FilterSet } from "./types"

interface ActiveFiltersDisplayProps {
  filters: FilterSet
  onRemoveFilter: (category: string, key: string) => void
}

export function ActiveFiltersDisplay({ filters, onRemoveFilter }: ActiveFiltersDisplayProps) {
  const activeFilters: { category: string; key: string; value: string }[] = []

  // Collect all active filters
  Object.entries(filters).forEach(([category, categoryFilters]) => {
    Object.entries(categoryFilters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        activeFilters.push({
          category,
          key,
          value: Array.isArray(value) ? value.join(", ") : String(value),
        })
      }
    })
  })

  if (activeFilters.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#282828] border border-gray-700 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Active Filters</h3>
        <span className="text-sm text-gray-400">{activeFilters.length} filters applied</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {activeFilters.map((filter) => (
            <motion.div
              key={`${filter.category}-${filter.key}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge variant="secondary" className="bg-[#333333] pr-1">
                <span className="text-gray-400 text-xs mr-1">{filter.key}:</span>
                {filter.value}
                <button
                  onClick={() => onRemoveFilter(filter.category, filter.key)}
                  className="ml-2 p-1 hover:bg-[#404040] rounded transition-colors"
                >
                  <X size={12} />
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
