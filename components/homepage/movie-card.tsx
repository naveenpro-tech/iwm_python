"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, PlayCircle, PlusCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WhereToWatchButton } from "@/components/where-to-watch-button"
import type { Movie } from "./types"

interface MovieCardProps extends Movie {
  className?: string
  onAddToWatchlist?: (movieId: string) => void
  onRemoveFromWatchlist?: (movieId: string) => void
  isInWatchlist?: boolean
}

export const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterUrl,
  sidduScore,
  year, // This should be just the year string
  genres,
  streamingOptions,
  className = "",
  onAddToWatchlist,
  onRemoveFromWatchlist,
  isInWatchlist,
  releaseDate, // Full release date for "NEW" badge logic
}) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWatchlist && onRemoveFromWatchlist) {
      onRemoveFromWatchlist(id)
    } else if (!isInWatchlist && onAddToWatchlist) {
      onAddToWatchlist(id)
    }
  }

  const isNewRelease = () => {
    if (!releaseDate) return false
    const release = new Date(releaseDate)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    return release >= oneYearAgo
  }

  return (
    <motion.div
      className={`relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group bg-slate-800 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      transition={{ duration: 0.2, ease: "circOut" }}
    >
      <Link href={`/movies/${id}`} passHref legacyBehavior>
        <a className="block w-full h-full">
          <Image
            src={posterUrl || "/placeholder.svg?width=200&height=300&query=Movie+Poster"}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content visible on hover */}
          <motion.div
            className="absolute inset-0 p-3 flex flex-col justify-end text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <h3 className="text-base lg:text-lg font-semibold leading-tight mb-1 line-clamp-2 shadow-text">{title}</h3>
            <div className="flex items-center text-xs mb-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 mr-1 fill-yellow-400" />
              <span className="font-medium">{sidduScore?.toFixed(1) || "N/A"}</span>
              <span className="mx-1.5 text-slate-400">•</span>
              <span>{year}</span>
            </div>
            {genres && genres.length > 0 && (
              <div className="text-xs text-slate-300 line-clamp-1 mb-2">{genres.slice(0, 2).join(", ")}</div>
            )}

            <div className="flex items-center space-x-2 mt-auto">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-1.5 h-7 w-7 rounded-full"
                aria-label="Play trailer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("Play trailer for", id)
                }}
              >
                <PlayCircle className="w-4 h-4" />
              </Button>
              {onAddToWatchlist && onRemoveFromWatchlist && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-1.5 h-7 w-7 rounded-full"
                  aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                  onClick={handleWatchlistToggle}
                >
                  {isInWatchlist ? (
                    <CheckCircle className="w-4 h-4 text-sky-400" />
                  ) : (
                    <PlusCircle className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Static content (visible always or when not hovered) */}
          {!isHovered && (
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 shadow-text">{title}</h3>
              <div className="flex items-center text-xs text-slate-300 mt-0.5">
                <Star className="w-3 h-3 text-yellow-400 mr-0.5 fill-yellow-400" />
                <span>{sidduScore?.toFixed(1) || "N/A"}</span>
              </div>
            </div>
          )}
        </a>
      </Link>
      {isHovered && streamingOptions && (
        <div className="absolute top-2 right-2 z-10">
          <WhereToWatchButton streamingOptions={streamingOptions} movieId={id} title={title} variant="icon" />
        </div>
      )}
      {isNewRelease() && (
        <Badge variant="default" className="absolute top-2 left-2 bg-sky-500 text-white text-xs px-1.5 py-0.5">
          NEW
        </Badge>
      )}
    </motion.div>
  )
}
