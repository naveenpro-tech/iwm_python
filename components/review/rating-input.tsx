"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface RatingInputProps {
  value: number
  onChange: (rating: number) => void
  movieTitle: string
}

export function RatingInput({ value, onChange, movieTitle }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const getRatingLabel = (rating: number) => {
    if (rating <= 2) return "Poor"
    if (rating <= 4) return "Below Average"
    if (rating <= 6) return "Average"
    if (rating <= 8) return "Good"
    return "Excellent"
  }

  const handleClick = (rating: number) => {
    onChange(rating)
  }

  const handleMouseEnter = (rating: number) => {
    setHoverRating(rating)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const displayRating = hoverRating || value

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-siddu-text-light">Your Rating</label>

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[...Array(10)].map((_, index) => {
            const starValue = index + 1
            const isFilled = starValue <= displayRating

            return (
              <motion.button
                key={index}
                type="button"
                onClick={() => handleClick(starValue)}
                onMouseEnter={() => handleMouseEnter(starValue)}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative focus:outline-none focus:ring-2 focus:ring-siddu-electric-blue rounded"
              >
                <Star
                  className={`w-6 h-6 md:w-8 md:h-8 transition-all duration-200 ${
                    isFilled ? "fill-siddu-accent-yellow text-siddu-accent-yellow" : "text-siddu-border-subtle"
                  }`}
                />
              </motion.button>
            )
          })}
        </div>

        {displayRating > 0 && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="ml-2">
            <span className="text-2xl font-bold text-siddu-text-light">{displayRating}</span>
            <span className="text-siddu-text-subtle ml-2">{getRatingLabel(displayRating)}</span>
          </motion.div>
        )}
      </div>

      {value === 0 && (
        <p className="text-sm text-siddu-text-subtle animate-pulse">Click on a star to rate {movieTitle}</p>
      )}
    </div>
  )
}
