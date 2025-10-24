"use client"

import { motion } from "framer-motion"
import type { KeywordTagCloudProps } from "@/types/review-page"

export default function KeywordTagCloud({ keywords }: KeywordTagCloudProps) {
  const getSentimentColor = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return "bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]"
      case "neutral":
        return "bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]"
      case "negative":
        return "bg-[#EF4444]/20 border-[#EF4444]/50 text-[#EF4444]"
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword, index) => (
        <motion.div
          key={keyword.keyword}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`px-3 py-1.5 rounded-full border text-sm font-medium ${getSentimentColor(
            keyword.sentiment
          )} transition-all duration-200 hover:scale-105 cursor-default`}
        >
          {keyword.keyword}
          <span className="ml-1.5 text-xs opacity-70">({keyword.count})</span>
        </motion.div>
      ))}
    </div>
  )
}

