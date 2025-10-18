"use client"

import { motion } from "framer-motion"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onClearFilters: () => void
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Search size={40} className="text-gray-500" />
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">No scenes found</h3>

      <p className="text-gray-400 max-w-md mb-6">
        We couldn't find any scenes matching your current filters. Try adjusting your filters or explore our curated
        collections.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={onClearFilters}>
          <RefreshCw size={16} className="mr-2" />
          Clear All Filters
        </Button>

        <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700">
          <Filter size={16} className="mr-2" />
          Explore Popular Scenes
        </Button>
      </div>
    </motion.div>
  )
}
