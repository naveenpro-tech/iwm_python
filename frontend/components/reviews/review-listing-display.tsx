"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ReviewCard } from "./review-card"
import { ReviewListItem } from "./review-list-item"
import { LoadingState } from "./loading-state"
import type { Review } from "./types"

interface ReviewListingDisplayProps {
  reviews: Review[]
  viewMode: string
  isLoading: boolean
}

export function ReviewListingDisplay({ reviews, viewMode, isLoading }: ReviewListingDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to top when view mode changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [viewMode])

  if (isLoading) {
    return <LoadingState viewMode={viewMode} />
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div ref={containerRef}>
      {viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {reviews.map((review) => (
            <motion.div key={review.id} variants={itemVariants}>
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {reviews.map((review) => (
            <motion.div key={review.id} variants={itemVariants}>
              <ReviewListItem review={review} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
