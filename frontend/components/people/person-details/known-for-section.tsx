"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState } from "react"

interface KnownForSectionProps {
  personId: string | number
}

export function KnownForSection({ personId }: KnownForSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Mock known for data
  const knownForFilms = [
    {
      id: 1,
      title: "Oppenheimer",
      year: 2023,
      role: "Director",
      poster: "/placeholder.svg?height=600&width=400&query=oppenheimer%20movie%20poster",
      rating: 8.5,
    },
    {
      id: 2,
      title: "Inception",
      year: 2010,
      role: "Director",
      poster: "/inception-movie-poster.png",
      rating: 8.8,
    },
    {
      id: 3,
      title: "The Dark Knight",
      year: 2008,
      role: "Director",
      poster: "/dark-knight-poster.png",
      rating: 9.0,
    },
    {
      id: 4,
      title: "Interstellar",
      year: 2014,
      role: "Director",
      poster: "/placeholder.svg?height=600&width=400&query=interstellar%20movie%20poster",
      rating: 8.6,
    },
    {
      id: 5,
      title: "Dunkirk",
      year: 2017,
      role: "Director",
      poster: "/dunkirk-poster.png",
      rating: 7.8,
    },
    {
      id: 6,
      title: "The Prestige",
      year: 2006,
      role: "Director",
      poster: "/prestige-poster.png",
      rating: 8.5,
    },
  ]

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Known For</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="border-gray-700"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="border-gray-700"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        onScroll={handleScroll}
      >
        {knownForFilms.map((film) => (
          <motion.div key={film.id} variants={itemVariants} className="flex-shrink-0 w-36 sm:w-48">
            <Link href={`/movies/${film.id}`}>
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={film.poster || "/placeholder.svg"}
                  alt={film.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 768px) 144px, 192px"
                />
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm line-clamp-1">{film.title}</h3>
                  <div className="flex items-center">
                    <Star size={12} className="text-[#00BFFF]" />
                    <span className="text-xs ml-1">{film.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{film.year}</span>
                  <span>{film.role}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
