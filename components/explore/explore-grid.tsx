"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { MovieCard } from "@/components/homepage/movie-card"

interface ExploreGridProps {
  searchQuery: string
  activeCategory: string
  activeFilters: string[]
}

// Mock data - in a real app, this would come from an API
const mockMovies = [
  {
    id: "1",
    title: "Inception",
    posterUrl: "/inception-movie-poster.png",
    year: "2010",
    rating: 8.8,
    genres: ["action", "sci-fi"],
    language: "english",
  },
  {
    id: "2",
    title: "Parasite",
    posterUrl: "/parasite-movie-poster.png",
    year: "2019",
    rating: 8.6,
    genres: ["drama", "thriller"],
    language: "korean",
  },
  {
    id: "3",
    title: "The Dark Knight",
    posterUrl: "/dark-knight-poster.png",
    year: "2008",
    rating: 9.0,
    genres: ["action", "drama"],
    language: "english",
  },
  {
    id: "4",
    title: "Pulp Fiction",
    posterUrl: "/pulp-fiction-poster.png",
    year: "1994",
    rating: 8.9,
    genres: ["crime", "drama"],
    language: "english",
  },
  {
    id: "5",
    title: "Dune",
    posterUrl: "/dune-part-two-poster.png",
    year: "2021",
    rating: 8.0,
    genres: ["sci-fi", "adventure"],
    language: "english",
  },
  {
    id: "6",
    title: "Oppenheimer",
    posterUrl: "/oppenheimer-inspired-poster.png",
    year: "2023",
    rating: 8.5,
    genres: ["drama", "biography"],
    language: "english",
  },
  {
    id: "7",
    title: "Barbie",
    posterUrl: "/barbie-movie-poster.png",
    year: "2023",
    rating: 7.0,
    genres: ["comedy", "adventure"],
    language: "english",
  },
  {
    id: "8",
    title: "Poor Things",
    posterUrl: "/poor-things-poster.png",
    year: "2023",
    rating: 8.4,
    genres: ["comedy", "drama", "sci-fi"],
    language: "english",
  },
]

export function ExploreGrid({ searchQuery, activeCategory, activeFilters }: ExploreGridProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [filteredMovies, setFilteredMovies] = useState(mockMovies)

  // Simulate API call with filtering
  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => {
      let results = [...mockMovies]

      // Filter by search query
      if (searchQuery) {
        results = results.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
      }

      // Filter by active filters
      if (activeFilters.length > 0) {
        results = results.filter((movie) => {
          // Check if any genre filter matches
          const genreMatch = activeFilters.some((filter) => movie.genres.includes(filter))

          // Check if language filter matches
          const languageMatch = activeFilters.some((filter) => movie.language === filter)

          // Check if year filter matches
          const yearMatch = activeFilters.some((filter) => movie.year === filter)

          return genreMatch || languageMatch || yearMatch
        })
      }

      // Sort based on active category
      if (activeCategory === "trending") {
        // No specific sort, use default
      } else if (activeCategory === "top-rated") {
        results.sort((a, b) => b.rating - a.rating)
      } else if (activeCategory === "new") {
        results.sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
      }

      setFilteredMovies(results)
      setIsLoading(false)
    }, 600) // Simulate network delay

    return () => clearTimeout(timer)
  }, [searchQuery, activeCategory, activeFilters])

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
    visible: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin" />
      </div>
    )
  }

  if (filteredMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p className="text-gray-400 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {filteredMovies.map((movie) => (
        <motion.div key={movie.id} variants={itemVariants} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
          <MovieCard
            id={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            year={movie.year}
            rating={movie.rating}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
