"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ActiveFiltersProps {
  filters: string[]
  onClearFilter: (filter: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onClearFilter, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  const formatFilterLabel = (filter: string) => {
    const [type, value] = filter.split(":")
    return value || filter
  }

  return (
    <motion.div
      className="flex flex-wrap items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-sm text-gray-400">Active filters:</span>

      {filters.map((filter) => (
        <Badge
          key={filter}
          variant="secondary"
          className="bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/30 hover:bg-[#00BFFF]/30"
        >
          {formatFilterLabel(filter)}
          <button
            onClick={() => onClearFilter(filter)}
            className="ml-1 hover:text-white transition-colors"
            aria-label={`Remove ${formatFilterLabel(filter)} filter`}
          >
            <X size={12} />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-gray-400 hover:text-white h-6 px-2 text-xs"
      >
        Clear all
      </Button>
    </motion.div>
  )
}
