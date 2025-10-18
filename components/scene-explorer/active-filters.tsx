"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SceneFilter } from "./types"

interface ActiveFiltersProps {
  filters: SceneFilter[]
  onRemove: (filter: SceneFilter) => void
  onClearAll: () => void
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-400 mr-1">Active Filters:</span>

        <AnimatePresence>
          {filters.map((filter, index) => (
            <motion.div
              key={`${filter.type}-${filter.value}`}
              className="bg-gray-800 text-gray-200 rounded-full px-3 py-1 text-sm flex items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <span className="mr-1 text-gray-400">{filter.type}:</span>
              <span>{filter.label}</span>
              <button
                className="ml-2 text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => onRemove(filter)}
                aria-label={`Remove ${filter.type} filter for ${filter.label}`}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200 text-sm" onClick={onClearAll}>
          Clear All
        </Button>
      </div>
    </motion.div>
  )
}
