"use client"

import { motion } from "framer-motion"
import type { SidduReviewTabProps } from "@/types/review-page"
import OfficialReviewCard from "./official-review-card"

export default function SidduReviewTab({ review, isLoading }: SidduReviewTabProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00BFFF] border-r-transparent"></div>
      </div>
    )
  }

  if (!review) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="w-24 h-24 rounded-full bg-[#282828] border border-[#3A3A3A] flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-[#A0A0A0]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#E0E0E0] font-inter mb-2">
          No Official Siddu Review Yet
        </h3>
        <p className="text-[#A0A0A0] text-center max-w-md">
          Our team is working on a comprehensive review for this movie. Check back soon!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <OfficialReviewCard review={review} />
    </motion.div>
  )
}

