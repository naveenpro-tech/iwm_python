"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { RatingFilters } from "../types"

interface RatingFiltersPanelProps {
  filters: RatingFilters
  onChange: (filters: RatingFilters) => void
}

export function RatingFiltersPanel({ filters, onChange }: RatingFiltersPanelProps) {
  return (
    <div className="space-y-6">
      {/* SidduScore Range */}
      <div>
        <Label className="text-gray-300">SidduScore Range</Label>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{filters.sidduScoreMin || 0}</span>
            <span>{filters.sidduScoreMax || 10}</span>
          </div>
          <Slider
            value={[filters.sidduScoreMin || 0, filters.sidduScoreMax || 10]}
            onValueChange={([min, max]) =>
              onChange({
                ...filters,
                sidduScoreMin: min,
                sidduScoreMax: max,
              })
            }
            max={10}
            step={0.1}
            className="[&_[role=slider]]:bg-[#00BFFF]"
          />
        </div>
      </div>

      {/* User Rating Range */}
      <div>
        <Label className="text-gray-300">User Rating Range</Label>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{filters.userRatingMin || 0}</span>
            <span>{filters.userRatingMax || 10}</span>
          </div>
          <Slider
            value={[filters.userRatingMin || 0, filters.userRatingMax || 10]}
            onValueChange={([min, max]) =>
              onChange({
                ...filters,
                userRatingMin: min,
                userRatingMax: max,
              })
            }
            max={10}
            step={0.1}
            className="[&_[role=slider]]:bg-green-500"
          />
        </div>
      </div>

      {/* Visual Indicators */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="bg-[#333333] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Min SidduScore</p>
          <p className="text-2xl font-bold text-[#00BFFF]">{filters.sidduScoreMin || 0}</p>
        </div>
        <div className="bg-[#333333] rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Min User Rating</p>
          <p className="text-2xl font-bold text-green-500">{filters.userRatingMin || 0}</p>
        </div>
      </div>
    </div>
  )
}
