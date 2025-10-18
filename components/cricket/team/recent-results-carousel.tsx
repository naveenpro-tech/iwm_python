"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface MatchResult {
  id: string
  date: string
  opponent: {
    name: string
    logoUrl: string
  }
  venue: string
  result: string
  score: string
  isWin: boolean
}

interface RecentResultsCarouselProps {
  results: MatchResult[]
}

export default function RecentResultsCarousel({ results }: RecentResultsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
  }

  if (results.length === 0) {
    return (
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Results</h2>
        <p className="text-gray-400">No recent matches found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Recent Results</h2>

      <div className="relative">
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex"
          >
            {results.map((match) => (
              <div key={match.id} className="w-full flex-shrink-0 px-4">
                <div
                  className={`bg-[#252525] rounded-lg p-4 border-l-4 ${
                    match.isWin ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-400">{match.date}</div>
                    <div className="text-sm text-gray-400">{match.venue}</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative w-12 h-12 mr-3">
                        <Image
                          src={match.opponent.logoUrl || "/placeholder.svg"}
                          alt={match.opponent.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-white font-medium">vs {match.opponent.name}</div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        match.isWin ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
                      }`}
                    >
                      {match.isWin ? "Won" : "Lost"}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-white font-medium">{match.score}</div>
                    <div className="text-sm text-gray-400">{match.result}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {results.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-[#333] rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>

            <button
              onClick={goToNext}
              disabled={currentIndex === results.length - 1}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-[#333] rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}
      </div>

      {results.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {results.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-[#00BFFF]" : "bg-[#333]"}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
