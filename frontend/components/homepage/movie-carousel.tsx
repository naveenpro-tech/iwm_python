"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MovieCard } from "./movie-card"
import type { Movie } from "./types" // Ensure this Movie type matches MovieCard's expectation

interface MovieCarouselProps {
  movies: Movie[]
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const checkScrollPosition = () => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 5) // Add a small buffer
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5) // Add a small buffer

    const cardWidth = carouselRef.current.querySelector("div > div")?.clientWidth || 0
    const gap = isMobile ? 12 : 16 // Assuming gap-3 (12px) or gap-4 (16px)
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollPosition, { passive: true })
      checkScrollPosition() // Initial check
      // Also check on window resize as clientWidth/scrollWidth can change
      window.addEventListener("resize", checkScrollPosition)
      return () => {
        carousel.removeEventListener("scroll", checkScrollPosition)
        window.removeEventListener("resize", checkScrollPosition)
      }
    }
  }, [isMobile, movies]) // Re-run if movies change or mobile state changes

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return
    const carousel = carouselRef.current
    // Estimate card width including gap for more accurate scrolling
    // This assumes all cards are roughly the same width
    const cardElement = carousel.querySelector("div > div") as HTMLElement // Target the MovieCard container
    const cardWidth = cardElement ? cardElement.offsetWidth : isMobile ? 140 : 200 // Fallback width
    const gap = isMobile ? 12 : 16
    const scrollAmountPerCard = cardWidth + gap

    // Scroll by a few cards at a time for better UX on desktop
    const cardsToScroll = isMobile ? 1 : Math.max(1, Math.floor(carousel.clientWidth / scrollAmountPerCard) - 1)
    const scrollDistance = cardsToScroll * scrollAmountPerCard

    carousel.scrollBy({ left: direction === "left" ? -scrollDistance : scrollDistance, behavior: "smooth" })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === carouselRef.current) {
        if (e.key === "ArrowLeft" && canScrollLeft) scroll("left")
        else if (e.key === "ArrowRight" && canScrollRight) scroll("right")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [canScrollLeft, canScrollRight])

  const visibleDots = Math.min(movies.length, 5) // Max 5 dots for mobile
  const dotStartIndex = Math.max(0, Math.min(currentIndex - Math.floor(visibleDots / 2), movies.length - visibleDots))

  return (
    <div className="relative">
      {!isMobile && (
        <>
          <motion.button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#282828]/80 backdrop-blur-sm rounded-full p-2 text-[#E0E0E0] shadow-lg ${
              !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100"
            } transition-opacity duration-200 hidden md:flex items-center justify-center -translate-x-1/2`}
            onClick={() => scroll("left")}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(40, 40, 40, 1)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#282828]/80 backdrop-blur-sm rounded-full p-2 text-[#E0E0E0] shadow-lg ${
              !canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100"
            } transition-opacity duration-200 hidden md:flex items-center justify-center translate-x-1/2`}
            onClick={() => scroll("right")}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(40, 40, 40, 1)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}

      <div
        ref={carouselRef}
        className="flex overflow-x-auto pb-4 gap-3 md:gap-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={checkScrollPosition}
        tabIndex={0} // Make it focusable for keyboard navigation
        role="region"
        aria-label="Movie releases carousel"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 w-[140px] md:w-[160px] lg:w-[200px] snap-start" // Adjust widths as needed
            role="group"
            aria-label={movie.title}
          >
            <MovieCard
              {...movie} // Spread all movie props
            />
          </div>
        ))}
      </div>

      {isMobile && movies.length > 1 && (
        <motion.div
          className="flex justify-center mt-4 space-x-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(visibleDots)].map((_, i) => {
            const actualIndex = dotStartIndex + i
            return (
              <button
                key={actualIndex}
                onClick={() => {
                  if (carouselRef.current) {
                    const cardElements = Array.from(carouselRef.current.children) as HTMLElement[]
                    const targetCard = cardElements[actualIndex]?.querySelector("div > div") as HTMLElement // Target MovieCard container
                    if (targetCard) {
                      const cardWidth = targetCard.offsetWidth
                      const gap = isMobile ? 12 : 16
                      carouselRef.current.scrollTo({
                        left: actualIndex * (cardWidth + gap),
                        behavior: "smooth",
                      })
                    }
                  }
                }}
                className="w-2 h-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label={`Go to movie ${actualIndex + 1}`}
              >
                <motion.div
                  className={`w-full h-full rounded-full ${
                    actualIndex === currentIndex ? "bg-primary" : "bg-muted-foreground/50"
                  }`}
                  animate={{ scale: actualIndex === currentIndex ? 1.2 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
