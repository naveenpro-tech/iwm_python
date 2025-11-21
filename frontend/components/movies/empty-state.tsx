"use client"

import { motion } from "framer-motion"
import { Film, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-[#00BFFF]/20 blur-3xl rounded-full" />
        <div className="relative bg-[#282828] rounded-full p-6">
          {hasFilters ? <Search className="h-12 w-12 text-[#00BFFF]" /> : <Film className="h-12 w-12 text-[#00BFFF]" />}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-[#E0E0E0] mb-2">
        {hasFilters ? "No movies match your filters" : "No movies found"}
      </h3>

      <p className="text-[#A0A0A0] text-center max-w-md mb-6">
        {hasFilters
          ? "Try adjusting your filters or search criteria to find more movies."
          : "We couldn't find any movies. Please check back later."}
      </p>

      {hasFilters && (
        <Button onClick={onClearFilters} className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white">
          Clear All Filters
        </Button>
      )}
    </motion.div>
  )
}
