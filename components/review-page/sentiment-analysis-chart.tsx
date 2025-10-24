"use client"

import { Smile, Meh, Frown } from "lucide-react"
import type { SentimentAnalysisChartProps } from "@/types/review-page"

export default function SentimentAnalysisChart({ sentiment }: SentimentAnalysisChartProps) {
  return (
    <div className="space-y-3">
      {/* Positive */}
      <div className="flex items-center gap-2">
        <Smile className="w-5 h-5 text-[#10B981] flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#E0E0E0]">Positive</span>
            <span className="text-xs text-[#10B981] font-semibold">{sentiment.positive.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-[#3A3A3A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${sentiment.positive}%` }}
            />
          </div>
        </div>
      </div>

      {/* Neutral */}
      <div className="flex items-center gap-2">
        <Meh className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#E0E0E0]">Neutral</span>
            <span className="text-xs text-[#F59E0B] font-semibold">{sentiment.neutral.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-[#3A3A3A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F59E0B] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${sentiment.neutral}%` }}
            />
          </div>
        </div>
      </div>

      {/* Negative */}
      <div className="flex items-center gap-2">
        <Frown className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#E0E0E0]">Negative</span>
            <span className="text-xs text-[#EF4444] font-semibold">{sentiment.negative.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-[#3A3A3A] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#EF4444] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${sentiment.negative}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

