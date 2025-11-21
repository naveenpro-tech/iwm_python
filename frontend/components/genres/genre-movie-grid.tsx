"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MovieCard } from "@/components/homepage/movie-card"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/components/movies/types"
import type { MovieFilters } from "@/lib/api"
import { MovieListItemCard } from "@/components/genres/movie-list-item-card"
import { GridIcon, ListFilterIcon, Loader2 } from "lucide-react" // Changed icons

interface GenreMovieGridProps {
  initialMovies: Movie[]
  genre: string // genreSlug
  isLoading: boolean
  isLoadingMore: boolean
  loadMoreMovies: () => void
  hasMore: boolean
  filters: MovieFilters
}

export function GenreMovieGrid({
  initialMovies,
  genre,
  isLoading,
  isLoadingMore,
  loadMoreMovies,
  hasMore,
  filters,
}: GenreMovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    setMovies(initialMovies)
  }, [initialMovies])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Slightly increased stagger
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 }, // Added scale
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }, // Smoother ease
    },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }, // Exit animation
  }

  // Skeleton for initial load
  const renderSkeleton = () => (
    <div
      className={`grid gap-4 md:gap-6 ${displayMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
    >
      {Array(filters.limit || 12)
        .fill(0)
        .map((_, i) => (
          <motion.div
            key={`skeleton-${i}`}
            className="bg-[#1F1F1F] border border-gray-800 rounded-lg animate-pulse overflow-hidden"
            variants={itemVariants} // Apply itemVariants to skeleton for consistency if container animates
          >
            {displayMode === "list" ? (
              <div className="flex p-3">
                <div className="h-32 w-20 bg-gray-700 rounded-md mr-4 flex-shrink-0"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-[2/3] bg-gray-700"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
              </>
            )}
          </motion.div>
        ))}
    </div>
  )

  if (isLoading && movies.length === 0) {
    return renderSkeleton()
  }

  if (!isLoading && movies.length === 0) {
    return (
      <motion.div
        className="text-center py-16 bg-[#1F1F1F] rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold mb-3 text-gray-200">No Movies Found</h3>
        <p className="text-gray-400">Try adjusting your filters or check back later for {genre} movies.</p>
        {/* You could add a button to reset filters here */}
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center mb-2 -mt-2">
        {" "}
        {/* Adjusted margin */}
        <Button
          variant={displayMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setDisplayMode("grid")}
          className={`mr-2 ${displayMode === "grid" ? "bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black" : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/70"}`}
          aria-label="Grid view"
        >
          <GridIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={displayMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setDisplayMode("list")}
          className={`${displayMode === "list" ? "bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-black" : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/70"}`}
          aria-label="List view"
        >
          <ListFilterIcon className="h-4 w-4" />
        </Button>
      </div>

      <motion.div
        className={
          displayMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5" // Adjusted gap
            : "space-y-4 md:space-y-5" // Adjusted gap
        }
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={displayMode}
      >
        <AnimatePresence>
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={itemVariants}
              layout // Animate layout changes
              // No need for initial/animate/exit here if parent `motion.div` handles stagger with AnimatePresence
            >
              {displayMode === "grid" ? (
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  posterUrl={movie.posterUrl}
                  year={movie.year}
                  genres={movie.genres}
                  sidduScore={movie.sidduScore}
                  streamingOptions={movie.streamingOptions}
                />
              ) : (
                <MovieListItemCard movie={movie} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          {" "}
          {/* Added padding top */}
          <Button
            onClick={loadMoreMovies}
            disabled={isLoadingMore}
            className="min-w-[160px] bg-[#00BFFF] hover:bg-[#00aeee] text-black font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            aria-label="Load more movies"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
