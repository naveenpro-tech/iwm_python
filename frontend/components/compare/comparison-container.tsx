"use client"

import { AnimatePresence } from "framer-motion"
import type { MovieComparisonData } from "./types"
import { Skeleton } from "@/components/ui/skeleton"
import { ComparisonColumn } from "./comparison-column"

interface ComparisonContainerProps {
  movies: MovieComparisonData[]
  isLoading: boolean
  onRemoveMovie: (movieId: string) => void
}

export function ComparisonContainer({ movies, isLoading, onRemoveMovie }: ComparisonContainerProps) {
  const findBestValue = (field: keyof MovieComparisonData, higherIsBetter = true) => {
    if (movies.length < 2) return null

    let bestVal: number | undefined = undefined
    let bestMovieId: string | null = null

    movies.forEach((movie) => {
      const value = movie[field] as number | undefined // Assuming numeric fields for now
      if (typeof value === "number") {
        if (bestVal === undefined) {
          bestVal = value
          bestMovieId = movie.id
        } else if (higherIsBetter && value > bestVal) {
          bestVal = value
          bestMovieId = movie.id
        } else if (!higherIsBetter && value < bestVal) {
          bestVal = value
          bestMovieId = movie.id
        }
      }
    })
    return bestMovieId
  }

  const bestSidduScoreMovieId = findBestValue("sidduScore")
  const bestAudienceScoreMovieId = findBestValue("audienceScore")
  const bestCriticScoreMovieId = findBestValue("criticScore")
  const shortestRuntimeMovieId = findBestValue("runtime", false) // Lower is better for runtime (example)
  // Add more for box office if it's stored as number

  const isHighlighted = (movieId: string, field: keyof MovieComparisonData, value: any): boolean => {
    if (movies.length < 2) return false
    switch (field) {
      case "sidduScore":
        return movieId === bestSidduScoreMovieId
      case "audienceScore":
        return movieId === bestAudienceScoreMovieId
      case "criticScore":
        return movieId === bestCriticScoreMovieId
      case "runtime":
        return movieId === shortestRuntimeMovieId
      // case 'boxOffice': // Needs specific handling if comparing worldwide string values
      //   const worldwideValues = movies.map(m => m.boxOffice?.worldwide ? parseFloat(m.boxOffice.worldwide.replace(/[^\\d.-]/g, '')) : 0);
      //   const maxWorldwide = Math.max(...worldwideValues);
      //   const currentWorldwide = movie.boxOffice?.worldwide ? parseFloat(movie.boxOffice.worldwide.replace(/[^\\d.-]/g, '')) : 0;
      //   return currentWorldwide === maxWorldwide;
      default:
        return false
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(movies.length || 1)].map((_, index) => (
          <div key={index} className="bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-lg p-4 md:p-6">
            <Skeleton className="w-full h-[300px] md:h-[450px] rounded-md mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-1/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 ${movies.length > 1 ? "md:grid-cols-2" : ""} ${movies.length > 2 ? "lg:grid-cols-3" : ""} gap-4 md:gap-6`}
    >
      <AnimatePresence>
        {movies.map((movie) => (
          <ComparisonColumn
            key={movie.id}
            movie={movie}
            onRemoveMovie={onRemoveMovie}
            isHighlighted={(field, value) => isHighlighted(movie.id, field, value)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
