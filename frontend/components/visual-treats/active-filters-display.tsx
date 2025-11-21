"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { FilterState } from "./types"

interface ActiveFiltersDisplayProps {
  filters: FilterState
  onRemoveFilter: (filterType: keyof Omit<FilterState, "sortBy">, value: string) => void
  onClearAll: () => void
}

export function ActiveFiltersDisplay({ filters, onRemoveFilter, onClearAll }: ActiveFiltersDisplayProps) {
  const activeFilterItems: { type: keyof Omit<FilterState, "sortBy">; value: string }[] = []
  ;(Object.keys(filters) as Array<keyof FilterState>).forEach((key) => {
    if (key !== "sortBy") {
      const filterValues = filters[key as keyof Omit<FilterState, "sortBy">]
      if (Array.isArray(filterValues)) {
        filterValues.forEach((value) => {
          activeFilterItems.push({ type: key as keyof Omit<FilterState, "sortBy">, value })
        })
      }
    }
  })

  if (activeFilterItems.length === 0) {
    return null
  }

  return (
    <div className="mt-4 mb-6 p-4 bg-[#282828] rounded-lg border border-gray-700">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-300 mr-2">Active Filters:</span>
        {activeFilterItems.map((item, index) => (
          <Badge
            key={`${item.type}-${item.value}-${index}`}
            variant="outline"
            className="bg-[#00BFFF]/20 text-[#00BFFF] border-[#00BFFF]/30 flex items-center gap-1"
          >
            {item.value}
            <button
              onClick={() => onRemoveFilter(item.type, item.value)}
              className="ml-1 p-0.5 rounded-full hover:bg-[#00BFFF]/30"
              aria-label={`Remove filter ${item.value}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {activeFilterItems.length > 0 && (
          <button onClick={onClearAll} className="ml-auto text-sm text-gray-400 hover:text-[#00BFFF] underline">
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
