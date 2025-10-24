"use client"

import { motion } from "framer-motion"
import { Star, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface CriticRatingDisplayProps {
  rating: string
  ratingNumeric: number
  sidduScore: number
  ratingBreakdown: { category: string; score: number }[]
}

export function CriticRatingDisplay({
  rating,
  ratingNumeric,
  sidduScore,
  ratingBreakdown,
}: CriticRatingDisplayProps) {
  const [displayRating, setDisplayRating] = useState(0)
  const [displaySiddu, setDisplaySiddu] = useState(0)

  useEffect(() => {
    // Animated counter for ratings
    const duration = 1000
    const steps = 60
    const increment = ratingNumeric / steps
    const sidduIncrement = sidduScore / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setDisplayRating(Math.min(increment * currentStep, ratingNumeric))
      setDisplaySiddu(Math.min(sidduIncrement * currentStep, sidduScore))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [ratingNumeric, sidduScore])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#3A3A3A] rounded-2xl p-6 md:p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Critic's Rating */}
        <div className="text-center md:text-left">
          <p className="text-sm text-[#A0A0A0] mb-2 uppercase tracking-wider">Critic's Rating</p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="relative inline-block"
          >
            <div className="text-7xl md:text-8xl font-bold font-inter bg-gradient-to-br from-[#00BFFF] to-[#FFD700] bg-clip-text text-transparent">
              {rating}
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="absolute -top-2 -right-2 w-16 h-16 bg-[#00BFFF]/20 rounded-full blur-xl"
            />
          </motion.div>
          <p className="text-2xl text-[#E0E0E0] mt-2 font-dmsans">
            {displayRating.toFixed(1)}/10
          </p>
        </div>

        {/* Siddu Score Comparison */}
        <div className="text-center md:text-left border-t md:border-t-0 md:border-l border-[#3A3A3A] pt-6 md:pt-0 md:pl-8">
          <p className="text-sm text-[#A0A0A0] mb-2 uppercase tracking-wider flex items-center justify-center md:justify-start gap-2">
            <TrendingUp className="w-4 h-4" />
            Siddu Score
          </p>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <Star className="w-12 h-12 text-[#FFD700] fill-[#FFD700]" />
            <div>
              <p className="text-5xl font-bold font-inter text-[#FFD700]">
                {displaySiddu.toFixed(1)}
              </p>
              <p className="text-sm text-[#A0A0A0]">Community Rating</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 justify-center md:justify-start">
            <div className="flex-1 max-w-xs h-2 bg-[#3A3A3A] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(sidduScore / 10) * 100}%` }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full"
              />
            </div>
            <span className="text-sm text-[#A0A0A0]">10</span>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      {ratingBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-8 pt-8 border-t border-[#3A3A3A]"
        >
          <p className="text-sm text-[#A0A0A0] mb-4 uppercase tracking-wider">Rating Breakdown</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratingBreakdown.map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8 + index * 0.1, duration: 0.4 }}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-[#E0E0E0]">{item.category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-[#3A3A3A] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.score / 10) * 100}%` }}
                      transition={{ delay: 2 + index * 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-[#00BFFF] to-[#00A3DD] rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-[#00BFFF] w-8 text-right">
                    {item.score}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

