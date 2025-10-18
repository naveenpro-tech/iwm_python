"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Calendar, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WhereToWatchButton } from "@/components/where-to-watch-button"
import type { Movie } from "@/components/movies/types"

interface MovieListProps {
  movies: Movie[]
}

export function MovieList({ movies }: MovieListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          variants={itemVariants}
          className="bg-[#282828] rounded-lg overflow-hidden hover:bg-[#3A3A3A] transition-colors"
        >
          <Link href={`/movies/${movie.id}`}>
            <div className="flex flex-col md:flex-row p-4 gap-4">
              {/* Poster */}
              <div className="relative w-full md:w-32 h-48 md:h-48 flex-shrink-0">
                <Image
                  src={movie.posterUrl || "/placeholder.svg?height=192&width=128&query=movie poster"}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                {/* Title and Score */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#E0E0E0] font-inter line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[#A0A0A0]">
                      {movie.year && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {movie.year}
                        </span>
                      )}
                      {movie.runtime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {movie.runtime}
                        </span>
                      )}
                      {movie.country && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {movie.country}
                        </span>
                      )}
                    </div>
                  </div>
                  {movie.sidduScore && (
                    <div className="flex items-center gap-1 bg-black/50 rounded-full px-3 py-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{movie.sidduScore.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge
                        key={genre}
                        variant="outline"
                        className="text-xs bg-[#1A1A1A] text-[#E0E0E0] border-[#3A3A3A]"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Director and Cast */}
                <div className="space-y-1 text-sm">
                  {movie.director && (
                    <p className="text-[#A0A0A0]">
                      <span className="text-[#E0E0E0]">Director:</span> {movie.director}
                    </p>
                  )}
                  {movie.cast && movie.cast.length > 0 && (
                    <p className="text-[#A0A0A0]">
                      <span className="text-[#E0E0E0]">Cast:</span> {movie.cast.slice(0, 3).join(", ")}
                      {movie.cast.length > 3 && " ..."}
                    </p>
                  )}
                </div>

                {/* Synopsis */}
                {movie.synopsis && <p className="text-sm text-[#A0A0A0] line-clamp-2 font-dmsans">{movie.synopsis}</p>}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  {movie.streamingOptions && Object.keys(movie.streamingOptions).length > 0 && (
                    <WhereToWatchButton
                      movieId={movie.id}
                      movieTitle={movie.title}
                      streamingOptions={movie.streamingOptions}
                      variant="inline"
                      className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white"
                    />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                    onClick={(e) => {
                      e.preventDefault()
                      // Add to watchlist logic
                    }}
                  >
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
