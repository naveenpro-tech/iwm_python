"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"
import type { MovieType } from "./types"
import { ContentSkeleton } from "./content-skeleton"

interface ContentGridProps {
  movies: MovieType[]
  isLoading: boolean
  viewMode: "grid" | "list"
}

export function ContentGrid({ movies, isLoading, viewMode }: ContentGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  if (isLoading) {
    return <ContentSkeleton viewMode={viewMode} />
  }

  if (movies.length === 0) {
    return (
      <motion.div
        className="bg-[#282828] rounded-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-2">No results found</h3>
        <p className="text-[#A0A0A0]">Try adjusting your filters or search query to find what you're looking for.</p>
      </motion.div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {viewMode === "grid" ? (
        <motion.div
          key="grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="bg-[#282828] rounded-lg overflow-hidden cursor-pointer group"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative">
                <img
                  src={movie.posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-[#00BFFF] text-black font-medium px-4 py-2 rounded-full">View Details</button>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-medium text-[#E0E0E0] line-clamp-1">{movie.title}</h3>

                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-[#FFD700] mr-1" />
                    <span className="text-xs text-[#A0A0A0]">{movie.rating.toFixed(1)}</span>
                  </div>

                  <span className="text-xs text-[#A0A0A0]">{movie.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="list"
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="bg-[#282828] rounded-lg overflow-hidden cursor-pointer group flex"
              variants={itemVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="w-24 sm:w-32 flex-shrink-0">
                <img
                  src={movie.posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-[#E0E0E0]">{movie.title}</h3>

                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-[#FFD700] mr-1" />
                    <span className="text-sm text-[#A0A0A0]">{movie.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1 text-sm text-[#A0A0A0]">
                  <span>{movie.year}</span>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                  <span>•</span>
                  <span>{movie.language}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {movie.genres.slice(0, 3).map((genre) => (
                    <span key={genre} className="text-xs bg-[#3A3A3A] text-[#E0E0E0] px-2 py-0.5 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>

                {movie.director && (
                  <div className="mt-2 text-sm text-[#A0A0A0]">
                    <span className="text-[#E0E0E0]">Director:</span> {movie.director}
                  </div>
                )}

                <p className="mt-2 text-sm text-[#A0A0A0] line-clamp-2">{movie.overview}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
