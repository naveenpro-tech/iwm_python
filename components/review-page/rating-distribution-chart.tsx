"use client"

import { Star } from "lucide-react"
import type { RatingDistributionChartProps } from "@/types/review-page"

export default function RatingDistributionChart({ distribution }: RatingDistributionChartProps) {
  const ratings = [5, 4, 3, 2, 1] as const

  return (
    <div className="space-y-2">
      {ratings.map((rating) => {
        const data = distribution?.[rating] || { count: 0, percentage: 0 }
        return (
          <div key={rating} className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-12">
              <span className="text-xs text-[#E0E0E0] font-semibold">{rating}</span>
              <Star className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
            </div>
            <div className="flex-1 h-4 bg-[#3A3A3A] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00BFFF] to-[#0080FF] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${data.percentage}%` }}
              />
            </div>
            <span className="text-xs text-[#A0A0A0] w-12 text-right">
              {data.percentage.toFixed(1)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

