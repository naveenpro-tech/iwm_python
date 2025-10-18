"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movie {
  id: string
  title: string
  posterUrl: string
  sidduScore: number
}

interface RelatedMoviesSectionProps {
  movies: Movie[]
}

export function RelatedMoviesSection({ movies }: RelatedMoviesSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Check scroll position to update arrow visibility
  const checkScrollPosition = () => {
    if (!carouselRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollPosition)
      checkScrollPosition()
      return () => carousel.removeEventListener("scroll", checkScrollPosition)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    const carousel = carouselRef.current
    const cardWidth = carousel.querySelector("div")?.clientWidth || 0
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth

    carousel.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.2 + custom * 0.05,
      },
    }),
  }

  return (
    <motion.section
      ref={containerRef}
      className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]" variants={itemVariants}>
          More Like This
        </motion.h2>
      </div>

      {/* Carousel Container */}
      <motion.div className="relative" variants={itemVariants}>
        {/* Navigation Arrows (Desktop Only) */}
        {!isMobile && (
          <>
            <motion.button
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#282828]/80 backdrop-blur-sm rounded-full p-2 text-[#E0E0E0] shadow-md ${
                !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-100"
              } transition-opacity duration-200 hidden md:flex items-center justify-center`}
              onClick={() => scroll("left")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#282828]/80 backdrop-blur-sm rounded-full p-2 text-[#E0E0E0] shadow-md ${
                !canScrollRight ? "opacity-0 pointer-events-none" : "opacity-100"
              } transition-opacity duration-200 hidden md:flex items-center justify-center`}
              onClick={() => scroll("right")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </>
        )}

        {/* Carousel Track */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={checkScrollPosition}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className="flex-shrink-0 w-[160px] md:w-[200px] snap-start"
              custom={index}
              variants={cardVariants}
            >
              <Link href={`/movies/${movie.id}`}>
                <motion.div
                  className="bg-[#282828] rounded-lg shadow-md overflow-hidden hover:bg-[#3A3A3A] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Movie Poster */}
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
                    <Image
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 160px, 200px"
                    />
                    {/* SidduScore Badge */}
                    <div className="absolute top-2 right-2 bg-[#00BFFF] text-[#1A1A1A] rounded-full h-8 w-8 flex items-center justify-center font-inter font-bold text-sm shadow-md">
                      {movie.sidduScore}
                    </div>
                  </div>
                  {/* Movie Title */}
                  <div className="p-3">
                    <h3 className="font-inter font-medium text-[#E0E0E0] text-sm line-clamp-1">{movie.title}</h3>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-4 flex justify-center md:hidden">
          <div className="flex space-x-1">
            {[...Array(Math.min(5, movies.length))].map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-[#00BFFF]" : "bg-[#3A3A3A]"}`} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
