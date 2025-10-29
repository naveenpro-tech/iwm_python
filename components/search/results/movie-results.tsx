"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { searchMovies, type SearchResult } from "@/lib/api/search"

interface MovieResultsProps {
  query: string
  limit?: number
}

export function MovieResults({ query, limit = 10 }: MovieResultsProps) {
  const [movies, setMovies] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastFetchedRef = useRef<string>("")

  useEffect(() => {
    // Skip if we've already fetched this exact query
    const fetchKey = `${query}-${limit}`
    if (lastFetchedRef.current === fetchKey) {
      return
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const fetchMovies = async () => {
      if (!query || query.trim().length === 0) {
        setMovies([])
        setIsLoading(false)
        setError(null)
        lastFetchedRef.current = fetchKey
        return
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()

      setIsLoading(true)
      setError(null)

      try {
        const response = await searchMovies(query, limit)
        setMovies(response.results)
        setError(null)
        lastFetchedRef.current = fetchKey
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        console.error("Failed to search movies:", err)
        setError("Failed to load search results")
        setMovies([])
        lastFetchedRef.current = fetchKey
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [query, limit])

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
      transition: {
        duration: 0.4,
      },
    },
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin mb-4" />
        <p className="text-[#E0E0E0] font-dmsans">Searching movies...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-red-400 font-dmsans">{error}</p>
      </div>
    )
  }

  // No results state
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <p className="text-[#A0A0A0] font-dmsans">No movies found for "{query}"</p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={containerVariants}
    >
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
        >
          <Link href={`/movies/${movie.id}`}>
            <div className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={movie.posterUrl || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
                {movie.sidduScore > 0 && (
                  <div className="flex items-center space-x-1 bg-[#1A1A1A] px-2 py-1 rounded text-[#00BFFF]">
                    <Star size={14} className="fill-[#00BFFF]" />
                    <span className="text-sm font-medium">{movie.sidduScore.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center text-sm text-gray-400 mb-3">
                <span>{movie.year}</span>
                {movie.runtime > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{movie.runtime} min</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-[#1A1A1A] hover:bg-[#333333] text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
