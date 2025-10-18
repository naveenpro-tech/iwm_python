"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PulseTrendingCard } from "./pulse-trending-card"
import type { TrendingPulse } from "./types"

interface PulseCardCarouselProps {
  pulses: TrendingPulse[]
}

export function PulseCardCarousel({ pulses }: PulseCardCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const checkScroll = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 5) // Add a small buffer
    setCanScrollRight(scrollWidth - scrollLeft - clientWidth > 5) // Add a small buffer
  }

  useEffect(() => {
    checkScroll()
    const currentCarouselRef = carouselRef.current
    currentCarouselRef?.addEventListener("scroll", checkScroll)
    return () => currentCarouselRef?.removeEventListener("scroll", checkScroll)
  }, [pulses]) // Re-check on pulses change

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return
    const scrollAmount = carouselRef.current.clientWidth * 0.8 // Scroll by 80% of visible width
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  if (!pulses || pulses.length === 0) return null

  return (
    <div className="relative">
      {!isMobile && (
        <>
          <motion.button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-700/60 hover:bg-slate-600/80 backdrop-blur-sm rounded-full p-2.5 text-white shadow-md transition-opacity duration-200 ${
              !canScrollLeft ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            whileHover={{ scale: canScrollLeft ? 1.05 : 1 }}
            whileTap={{ scale: canScrollLeft ? 0.95 : 1 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-700/60 hover:bg-slate-600/80 backdrop-blur-sm rounded-full p-2.5 text-white shadow-md transition-opacity duration-200 ${
              !canScrollRight ? "opacity-30 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            whileHover={{ scale: canScrollRight ? 1.05 : 1 }}
            whileTap={{ scale: canScrollRight ? 0.95 : 1 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </>
      )}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto pb-4 gap-4 md:gap-6 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {pulses.map((pulse, index) => (
          <div
            key={pulse.id || index} // Fallback to index if id is missing, though id should be present
            className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px] md:w-[360px] snap-start"
            role="group"
            aria-label={`Pulse by ${pulse.user.name}`}
          >
            <PulseTrendingCard pulse={pulse} />
          </div>
        ))}
      </div>
    </div>
  )
}
