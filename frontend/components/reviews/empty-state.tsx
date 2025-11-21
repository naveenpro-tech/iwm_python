"use client"

import { motion } from "framer-motion"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-siddu-bg-card-dark rounded-full p-6 mb-6">
        <SearchX size={48} className="text-siddu-text-subtle" />
      </div>
      <h3 className="text-xl font-medium mb-2">No reviews match your filters</h3>
      <p className="text-siddu-text-subtle mb-6 max-w-md">
        Try adjusting your current filters or explore a different feed type to discover more reviews.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onClearFilters} className="flex-1">
          Clear All Filters
        </Button>
        <Button variant="outline" className="flex-1">
          Discover Movies to Review
        </Button>
      </div>
    </motion.div>
  )
}
