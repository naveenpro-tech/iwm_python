"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { PersonalizedActivitySliderProps } from "./types" // Adjusted path if types.ts is in the same folder

import { ProgressSnapshotCard } from "./progress-snapshot-card"
import { WhatsNextSnapshotCard } from "./whats-next-snapshot-card"
import { InfluenceSnapshotCard } from "./influence-snapshot-card"
import { RecommendationSnapshotCard } from "./recommendation-snapshot-card"
import { WeeklyGemSnapshotCard } from "./weekly-gem-snapshot-card"
import { Button } from "@/components/ui/button"

// Card components are already defined in separate files and imported.

export const PersonalizedActivitySlider: React.FC<PersonalizedActivitySliderProps> = ({
  mockProgressData,
  mockWhatsNextData,
  mockInfluenceData,
  mockRecommendationData,
  mockWeeklyGemData,
}) => {
  const allItems = [
    ...(mockProgressData?.map((item) => ({ type: "progress" as const, data: item })) || []),
    ...(mockWhatsNextData?.map((item) => ({ type: "whatsNext" as const, data: item })) || []),
    ...(mockInfluenceData?.map((item) => ({ type: "influence" as const, data: item })) || []),
    ...(mockRecommendationData?.map((item) => ({ type: "recommendation" as const, data: item })) || []),
    ...(mockWeeklyGemData?.map((item) => ({ type: "weeklyGem" as const, data: item })) || []),
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // 0 for initial, 1 for next, -1 for prev

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection
      if (nextIndex < 0) return allItems.length - 1
      if (nextIndex >= allItems.length) return 0
      return nextIndex
    })
  }, [allItems.length])

  useEffect(() => {
    if (allItems.length <= 1) return
    const timer = setInterval(() => {
      paginate(1)
    }, 7000)
    return () => clearInterval(timer)
  }, [allItems.length, paginate]) // paginate is now stable via useCallback

  if (!allItems.length) {
    return (
      <section className="relative w-full py-12 md:py-16 bg-gradient-to-b from-gray-900 via-gray-900/95 to-black overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center py-10 text-gray-500">
            No personalized insights available at the moment. Explore the platform to get started!
          </div>
        </div>
      </section>
    )
  }

  const currentItem = allItems[currentIndex]
  let CardComponent: React.FC<any> // Use React.FC<any> for dynamic component

  switch (currentItem.type) {
    case "progress":
      CardComponent = ProgressSnapshotCard
      break
    case "whatsNext":
      CardComponent = WhatsNextSnapshotCard
      break
    case "influence":
      CardComponent = InfluenceSnapshotCard
      break
    case "recommendation":
      CardComponent = RecommendationSnapshotCard
      break
    case "weeklyGem":
      CardComponent = WeeklyGemSnapshotCard
      break
    default:
      CardComponent = () => <div className="text-white p-6 bg-red-500/20 rounded-lg">Error: Unknown card type.</div>
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%", // Use percentage for smoother transitions relative to container
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px)",
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px)",
    }),
  }

  return (
    <section className="relative w-full py-12 md:py-16 bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500 mb-2">
            Your Siddu Snapshot
          </h2>
          <p className="text-md md:text-lg text-gray-400 max-w-2xl mx-auto">
            Personalized insights and what's new for you. Tailored by Siddu AI.
          </p>
        </div>

        <div className="relative h-[500px] md:h-[480px] flex items-center justify-center">
          {" "}
          {/* Adjusted height slightly */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex} // This key is crucial for AnimatePresence to detect changes
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 250, damping: 30, duration: 0.7 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 },
                filter: { duration: 0.4 },
              }}
              className="absolute w-full max-w-sm sm:max-w-md md:max-w-lg" // Responsive max width for the card
            >
              <CardComponent item={currentItem.data} isActive={true} />
            </motion.div>
          </AnimatePresence>
        </div>

        {allItems.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-sm border-gray-700 text-gray-300 rounded-full p-2"
              onClick={() => paginate(-1)}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-800/60 hover:bg-gray-700/80 backdrop-blur-sm border-gray-700 text-gray-300 rounded-full p-2"
              onClick={() => paginate(1)}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2.5 z-10">
          {allItems.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : index < currentIndex ? -1 : 0)
                setCurrentIndex(index)
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-out
              ${currentIndex === index ? "bg-primary scale-125 ring-2 ring-primary/50 ring-offset-2 ring-offset-gray-900" : "bg-gray-600 hover:bg-gray-500"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
