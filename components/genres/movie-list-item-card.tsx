"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, CalendarDays, Clock, PlayCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/components/movies/types"

interface MovieListItemCardProps {
  movie: Movie
}

export function MovieListItemCard({ movie }: MovieListItemCardProps) {
  return (
    <motion.div
      className="group bg-gray-800/40 border border-gray-700/60 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:border-[#00BFFF]/50 transition-all duration-300 flex flex-col sm:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // whileHover={{ borderColor: "#00BFFF" }} // Handled by class now
    >
      <div className="sm:w-32 md:w-36 lg:w-40 relative aspect-[2/3] sm:aspect-auto flex-shrink-0">
        <Image
          src={movie.posterUrl || "/placeholder.svg?height=240&width=160&query=movie poster"}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Link
          href={`/movies/${movie.id}`}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
          aria-label={`View details for ${movie.title}`}
        >
          <PlayCircle className="h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
        </Link>
      </div>

      <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
        <div>
          <Link href={`/movies/${movie.id}`} className="block mb-1" aria-label={`View details for ${movie.title}`}>
            <h3 className="text-md sm:text-lg font-semibold text-gray-100 group-hover:text-[#00BFFF] transition-colors line-clamp-2">
              {movie.title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-gray-400 mb-1.5 sm:mb-2">
            {movie.year && (
              <span className="flex items-center">
                <CalendarDays className="h-3 w-3 mr-0.5" /> {movie.year}
              </span>
            )}
            {movie.runtime && (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-0.5" /> {movie.runtime} min
              </span>
            )}
            {movie.sidduScore && (
              <span className="flex items-center font-semibold text-yellow-400">
                <Star className="h-3 w-3 mr-0.5 fill-yellow-400" /> {movie.sidduScore.toFixed(1)}
              </span>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-2.5">
              {movie.genres.slice(0, 3).map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="text-[10px] sm:text-xs font-normal bg-gray-700/50 text-gray-300 border-gray-600/70 px-1.5 py-0.5"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-300/90 line-clamp-2 sm:line-clamp-3 mb-2.5 sm:mb-3 leading-relaxed">
            {movie.overview || "No overview available for this movie."}
          </p>
        </div>

        <div className="mt-auto">
          <Link href={`/movies/${movie.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto border-[#00BFFF]/70 text-[#00BFFF] hover:bg-[#00BFFF]/10 hover:text-[#00aeee] hover:border-[#00BFFF] text-xs px-3 py-1.5 h-auto"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
