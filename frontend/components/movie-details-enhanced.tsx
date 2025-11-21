"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Play, Star, Clock, Calendar, Heart, Share, ChevronDown, ChevronUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MovieDetailsEnhancedProps {
  movie: {
    id: string
    title: string
    tagline?: string
    posterUrl: string
    backdropUrl: string
    releaseYear: number
    duration: number
    rating: number
    genres: string[]
    synopsis: string
    director: string
    cast: Array<{
      id: string
      name: string
      character: string
      profileUrl: string
    }>
    streamingServices?: Array<{
      id: string
      name: string
      logoUrl: string
      url: string
    }>
  }
}

export function MovieDetailsEnhanced({ movie }: MovieDetailsEnhancedProps) {
  const [showFullSynopsis, setShowFullSynopsis] = useState(false)
  const [isSynopsisTruncated, setIsSynopsisTruncated] = useState(false)
  const synopsisRef = useRef<HTMLParagraphElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 1, 1])
  const titleY = useTransform(scrollYProgress, [0, 0.15, 0.3], [50, 0, 0])

  // Check if synopsis needs to be truncated
  useEffect(() => {
    if (synopsisRef.current) {
      setIsSynopsisTruncated(synopsisRef.current.scrollHeight > synopsisRef.current.clientHeight)
    }
  }, [movie.synopsis])

  const toggleSynopsis = () => {
    setShowFullSynopsis((prev) => !prev)
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Hero section with parallax effect */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div className="absolute inset-0 bg-black/50 z-10" style={{ opacity }} />

        <motion.div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

        <motion.div className="absolute inset-0" style={{ scale }}>
          <img src={movie.backdropUrl || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.button
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full p-6 transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play size={32} fill="white" />
          </motion.button>
        </div>

        <motion.div className="absolute bottom-0 left-0 right-0 p-8 z-20" style={{ opacity: titleOpacity, y: titleY }}>
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.tagline && <p className="text-xl text-gray-300 italic">{movie.tagline}</p>}
          </div>
        </motion.div>
      </div>

      {/* Content section */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column - Poster and quick info */}
            <div className="md:w-1/3">
              <motion.div
                className="rounded-lg overflow-hidden shadow-lg shadow-purple-900/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img src={movie.posterUrl || "/placeholder.svg"} alt={movie.title} className="w-full h-auto" />
              </motion.div>

              <motion.div
                className="mt-6 flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button className="flex-1 bg-purple-700 hover:bg-purple-600">
                  <Heart size={16} className="mr-2" />
                  Favorite
                </Button>
                <Button className="flex-1 bg-blue-700 hover:bg-blue-600">
                  <Plus size={16} className="mr-2" />
                  Watchlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share size={16} className="mr-2" />
                  Share
                </Button>
              </motion.div>

              <motion.div
                className="mt-6 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  <span className="text-xl font-bold">{movie.rating.toFixed(1)}</span>
                  <span className="text-gray-400">/10</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="text-gray-400" size={18} />
                  <span>
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={18} />
                  <span>{movie.releaseYear}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="outline" className="bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {movie.streamingServices && movie.streamingServices.length > 0 && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <h3 className="text-lg font-semibold mb-3">Where to Watch</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {movie.streamingServices.map((service) => (
                      <a
                        key={service.id}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-gray-700 rounded-lg p-2 flex items-center justify-center transition-all duration-200"
                      >
                        <img src={service.logoUrl || "/placeholder.svg"} alt={service.name} className="h-8" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right column - Details */}
            <div className="md:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                <div className="relative">
                  <p
                    ref={synopsisRef}
                    className={cn(
                      "text-gray-300 leading-relaxed",
                      !showFullSynopsis && "max-h-[120px] overflow-hidden",
                    )}
                  >
                    {movie.synopsis}
                  </p>

                  {isSynopsisTruncated && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 mt-2"
                      onClick={toggleSynopsis}
                    >
                      {showFullSynopsis ? (
                        <>
                          <ChevronUp size={16} className="mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" />
                          Show more
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.cast.map((actor, index) => (
                    <motion.div
                      key={actor.id}
                      className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="aspect-[2/3] overflow-hidden">
                        <img
                          src={actor.profileUrl || "/placeholder.svg"}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-white">{actor.name}</h3>
                        <p className="text-sm text-gray-400">{actor.character}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="text-2xl font-bold mb-4">Director</h2>
                <p className="text-gray-300">{movie.director}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
