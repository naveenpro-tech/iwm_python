"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MasterpieceCard } from "@/components/homepage/masterpiece-card" // Ensure this path is correct

// This MasterpieceFilm interface should match the one in GlobalMasterpiecesSection
// and the data structure from app/homepage/page.tsx
interface MasterpieceFilm {
  id: string
  title: string
  posterUrl: string
  sidduScore: number
  country: string
  countryCode: string
  director: string
  year: string
  visualStyle?: string
}

interface MasterpieceCarouselProps {
  films: MasterpieceFilm[]
}

export function MasterpieceCarousel({ films }: MasterpieceCarouselProps) {
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
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)

    const cardWidth = carouselRef.current.querySelector("div > div")?.clientWidth || 0 // Target the MasterpieceCard container
    const gap = isMobile ? 12 : 16
    const newIndex = Math.round(scrollLeft / (cardWidth + gap))
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollPosition)
      checkScrollPosition() // Initial check
      return () => carousel.removeEventListener("scroll", checkScrollPosition)
    }
  }, [isMobile, films]) // Re-run if films change

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return
    const carousel = carouselRef.current
    const cardWidth = carousel.querySelector("div > div")?.clientWidth || 0
    const gap = isMobile ? 12 : 16
    const scrollAmount = direction === "left" ? -(cardWidth + gap) : cardWidth + gap
    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" })
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

  const visibleDots = Math.min(films.length, 5)
  const dotStartIndex = Math.max(0, Math.min(currentIndex - 2, films.length - visibleDots))

  return (
    <div className="relative">
      {!isMobile && (
        <>
          <motion.button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#282828]/80 backdrop-blur-sm rounded-full p-2 text-[#E0E0E0] shadow-lg ${
              !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100"
            } transition-opacity duration-200 hidden md:flex items-center justify-center`}
            onClick={() => scroll("left")}
            whileHover={{ scale: 1.05 }}
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
            } transition-opacity duration-200 hidden md:flex items-center justify-center`}
            onClick={() => scroll("right")}
            whileHover={{ scale: 1.05 }}
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
        tabIndex={0}
        role="region"
        aria-label="Global masterpiece films carousel"
      >
        {films.map((film, index) => (
          <div
            key={film.id}
            className="flex-shrink-0 w-[140px] md:w-[160px] lg:w-[200px] snap-start"
            role="group"
            aria-label={`${film.title} from ${film.country}`}
          >
            <MasterpieceCard film={film} index={index} />
          </div>
        ))}
      </div>

      {isMobile && films.length > 1 && (
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
                    const cardElement = carouselRef.current.children[actualIndex] as HTMLElement
                    if (cardElement) {
                      const cardWidth = cardElement.offsetWidth
                      const gap = isMobile ? 12 : 16
                      carouselRef.current.scrollTo({
                        left: actualIndex * (cardWidth + gap),
                        behavior: "smooth",
                      })
                    }
                  }
                }}
                className="w-2 h-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                aria-label={`Go to film ${actualIndex + 1}`}
              >
                <motion.div
                  className={`w-full h-full rounded-full ${
                    actualIndex === currentIndex ? "bg-[#00BFFF]" : "bg-[#3A3A3A]"
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
