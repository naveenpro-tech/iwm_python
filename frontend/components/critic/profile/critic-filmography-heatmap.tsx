"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { CriticReview } from "@/types/critic"

interface CriticFilmographyHeatmapProps {
  reviews: CriticReview[]
}

export default function CriticFilmographyHeatmap({ reviews }: CriticFilmographyHeatmapProps) {
  const [hoveredReview, setHoveredReview] = useState<CriticReview | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)

  // Color scale based on rating
  const getHeatmapColor = (rating: number) => {
    const colors = [
      "#1A0033", // 1-2: Very dark purple
      "#2D0052", // 3-4: Dark purple
      "#4A0080", // 5-6: Purple
      "#0066CC", // 7-8: Blue
      "#00BFFF", // 9-10: Bright cyan
    ]
    const index = Math.floor((rating - 1) / 2)
    return colors[Math.min(Math.max(index, 0), 4)]
  }

  const handleTileClick = (movieId: number) => {
    setSelectedMovieId(selectedMovieId === movieId ? null : movieId)
    // Scroll to review showcase
    const reviewShowcase = document.getElementById("review-showcase")
    if (reviewShowcase) {
      reviewShowcase.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <Card className="bg-[#282828] border-[#3A3A3A]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#E0E0E0] font-inter">
          Filmography Heatmap
        </CardTitle>
        <p className="text-sm text-[#A0A0A0] font-dmsans mt-2">
          Visual representation of all reviewed movies. Color intensity indicates rating (dark = low, bright = high).
          Click a tile to filter reviews.
        </p>
      </CardHeader>
      <CardContent>
        {/* Desktop: Grid View */}
        <div className="hidden md:grid grid-cols-10 gap-2">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="relative aspect-square rounded cursor-pointer overflow-hidden"
              style={{ backgroundColor: getHeatmapColor(review.rating) }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              onMouseEnter={() => setHoveredReview(review)}
              onMouseLeave={() => setHoveredReview(null)}
              onClick={() => handleTileClick(review.movie.id)}
              data-testid="heatmap-tile"
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0"
                style={{
                  boxShadow: `0 0 20px ${getHeatmapColor(review.rating)}`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.8 }}
              />

              {/* Tooltip on hover */}
              <AnimatePresence>
                {hoveredReview?.id === review.id && (
                  <motion.div
                    className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg p-3 w-48 z-20 pointer-events-none"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex gap-2">
                      {review.movie.poster_url && (
                        <Image
                          src={review.movie.poster_url}
                          alt={review.movie.title}
                          width={40}
                          height={60}
                          className="rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#E0E0E0] line-clamp-2">
                          {review.movie.title}
                        </p>
                        <p className="text-xs text-[#A0A0A0] mt-1">
                          Rating: <span className="text-[#00BFFF] font-bold">{review.rating}/10</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Timeline View */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-2 pb-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                className="flex-shrink-0 w-16 h-24 rounded cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: getHeatmapColor(review.rating) }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTileClick(review.movie?.id || review.movie_id)}
              >
                {review.movie?.poster_url && (
                  <Image
                    src={review.movie.poster_url}
                    alt={review.movie?.title || "Movie"}
                    fill
                    className="object-cover opacity-50"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                  <span className="text-xs text-white font-bold">{review.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-sm text-[#A0A0A0] font-dmsans">Rating Scale:</span>
          {[
            { range: "1-2", color: "#1A0033" },
            { range: "3-4", color: "#2D0052" },
            { range: "5-6", color: "#4A0080" },
            { range: "7-8", color: "#0066CC" },
            { range: "9-10", color: "#00BFFF" },
          ].map((item) => (
            <div key={item.range} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-[#A0A0A0] font-dmsans">{item.range}</span>
            </div>
          ))}
        </div>

        {/* Selected Movie Filter Indicator */}
        {selectedMovieId && (
          <motion.div
            className="mt-4 p-3 bg-[#1A1A1A] border border-[#00BFFF] rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-[#E0E0E0] font-dmsans">
              Filtering reviews for selected movie.{" "}
              <button
                onClick={() => setSelectedMovieId(null)}
                className="text-[#00BFFF] hover:text-[#00A8E8] underline"
              >
                Clear filter
              </button>
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

