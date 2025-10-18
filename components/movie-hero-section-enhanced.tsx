"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Play, Plus, Share, Heart, BookOpen, Info, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface MovieHeroSectionProps {
  movie: {
    id: string
    title: string
    backdropUrl: string
    posterUrl: string
    year: string
    duration: string
    language: string
    rating: string
    sidduScore: number
    criticsScore?: number
    synopsis: string
    genres: string[]
    directors: { id: string; name: string }[]
    trailerUrl?: string
  }
}

export function MovieHeroSectionEnhanced({ movie }: MovieHeroSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const posterRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacityOverlay = useTransform(scrollYProgress, [0, 0.8], [0.5, 0.9])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    setMousePosition({ x, y })
  }

  // Poster hover effect
  const [isPosterHovered, setIsPosterHovered] = useState(false)

  // Atmospheric particle effect
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number; speed: number; opacity: number }>
  >([])

  useEffect(() => {
    // Generate random particles for atmospheric effect
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    setParticles(newParticles)

    // Animate particles
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y - particle.speed > 0 ? particle.y - particle.speed : 100,
          opacity: ((Math.sin((Date.now() / 1000) * particle.speed) + 1) / 2) * 0.5 + 0.1,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onMouseMove={handleMouseMove}
    >
      {/* Backdrop Image with Parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          y: parallaxY,
          scale: parallaxScale,
        }}
      >
        <Image
          src={movie.backdropUrl || "/placeholder.svg?height=1080&width=1920&query=cinematic movie backdrop"}
          alt={`${movie.title} backdrop`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Atmospheric particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                filter: "blur(1px)",
              }}
              animate={{
                opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Interactive Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: opacityOverlay,
          background: `radial-gradient(
            circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
            rgba(26, 26, 26, 0.4) 0%,
            rgba(26, 26, 26, 0.8) 50%,
            rgba(26, 26, 26, 0.95) 100%
          ), linear-gradient(to top, #1A1A1A 0%, rgba(26, 26, 26, 0.8) 60%, rgba(26, 26, 26, 0.4) 100%)`,
        }}
      />

      {/* Content Container */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end px-4 pb-12 md:pb-16 md:px-8 lg:px-16"
        style={{ opacity: contentOpacity }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 md:gap-12">
            {/* Movie Poster with Interactive Effects */}
            <motion.div
              ref={posterRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="mx-auto md:mx-0 w-[200px] md:w-[240px] lg:w-[300px]"
              onMouseEnter={() => setIsPosterHovered(true)}
              onMouseLeave={() => setIsPosterHovered(false)}
            >
              <motion.div
                className="relative aspect-[2/3] rounded-lg shadow-2xl overflow-hidden"
                animate={{
                  rotateY: isPosterHovered ? 5 : 0,
                  rotateX: isPosterHovered ? -5 : 0,
                  scale: isPosterHovered ? 1.05 : 1,
                  boxShadow: isPosterHovered
                    ? "0 25px 50px -12px rgba(0, 191, 255, 0.4), 0 0 30px 5px rgba(0, 0, 0, 0.5)"
                    : "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Image
                  src={movie.posterUrl || "/placeholder.svg?height=450&width=300&query=movie poster"}
                  alt={`${movie.title} poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 200px, (max-width: 1024px) 240px, 300px"
                />

                {/* Poster hover overlay with actions */}
                <motion.div
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isPosterHovered ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="sm"
                    className="bg-[#00BFFF] hover:bg-[#00A3DD] text-black font-semibold"
                    onClick={() => setShowTrailer(true)}
                  >
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Watch Trailer
                  </Button>

                  <div className="flex gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className={cn(
                              "border-[#E0E0E0]/30 bg-black/30 backdrop-blur-sm",
                              isLiked && "border-[#00BFFF] text-[#00BFFF]",
                            )}
                            onClick={() => setIsLiked(!isLiked)}
                          >
                            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isLiked ? "Unlike" : "Like"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className={cn(
                              "border-[#E0E0E0]/30 bg-black/30 backdrop-blur-sm",
                              isBookmarked && "border-[#00BFFF] text-[#00BFFF]",
                            )}
                            onClick={() => setIsBookmarked(!isBookmarked)}
                          >
                            <BookOpen className={cn("h-5 w-5", isBookmarked && "fill-current")} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isBookmarked ? "Remove from Watchlist" : "Add to Watchlist"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="border-[#E0E0E0]/30 bg-black/30 backdrop-blur-sm"
                          >
                            <Share className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Share</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Movie Details with Interactive Elements */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="space-y-4">
                {/* Title and Score with Animation */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl font-bold font-inter text-[#E0E0E0] drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {movie.title}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <div className="relative">
                      <div className="bg-[#00BFFF] text-[#1A1A1A] rounded-full h-14 w-14 flex items-center justify-center font-inter font-bold text-xl">
                        {movie.sidduScore}
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full bg-[#00BFFF]"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 0, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Director with hover effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-[#A0A0A0] font-dmsans"
                >
                  Directed by{" "}
                  <span className="text-[#E0E0E0] hover:text-[#00BFFF] transition-colors cursor-pointer">
                    {movie.directors.map((director) => director.name).join(", ")}
                  </span>
                </motion.div>

                {/* Metadata with animated reveal */}
                <motion.div
                  className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-dmsans"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <span className="px-2 py-1 bg-[#282828] rounded-md text-[#E0E0E0]">{movie.year}</span>
                  <span className="px-2 py-1 bg-[#282828] rounded-md text-[#E0E0E0]">{movie.duration}</span>
                  <span className="px-2 py-1 bg-[#282828] rounded-md text-[#E0E0E0]">{movie.language}</span>
                  <span className="px-2 py-1 bg-[#282828] rounded-md text-[#E0E0E0] font-medium">{movie.rating}</span>
                </motion.div>

                {/* Genres with hover effects */}
                <motion.div
                  className="flex flex-wrap justify-center md:justify-start gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  {movie.genres.map((genre, index) => (
                    <motion.div key={genre} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Badge
                        className="bg-transparent border border-[#00BFFF] text-[#E0E0E0] hover:bg-[#00BFFF]/10 transition-colors font-dmsans cursor-pointer"
                        variant="outline"
                      >
                        {genre}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Synopsis with expand/collapse */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-2 relative"
                >
                  <p className={`text-[#E0E0E0] font-dmsans ${expanded ? "" : "line-clamp-3"}`}>{movie.synopsis}</p>
                  {movie.synopsis.length > 150 && (
                    <motion.div
                      className={`${!expanded ? "bg-gradient-to-b from-transparent to-[#1A1A1A] absolute bottom-0 left-0 right-0 h-8" : "hidden"}`}
                    />
                  )}
                  {movie.synopsis.length > 150 && (
                    <motion.button
                      onClick={() => setExpanded(!expanded)}
                      className="text-[#00BFFF] hover:text-[#00A3DD] transition-colors mt-1 font-dmsans text-sm flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {expanded ? "Show Less" : "Read More"}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </motion.button>
                  )}
                </motion.div>

                {/* Action Buttons with animations */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                    <Button
                      className="w-full sm:w-auto bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] font-inter font-semibold"
                      onClick={() => setShowTrailer(true)}
                    >
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      Watch Trailer
                    </Button>
                    <motion.div
                      className="absolute inset-0 rounded-md bg-[#00BFFF]"
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-auto border-[#00BFFF] text-[#E0E0E0] hover:bg-[#00BFFF]/10 font-inter",
                        isBookmarked && "bg-[#00BFFF]/10 border-[#00BFFF]",
                      )}
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Plus className={cn("mr-2 h-4 w-4", isBookmarked && "text-[#00BFFF]")} />
                      {isBookmarked ? "Added to Watchlist" : "Add to Watchlist"}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-[#A0A0A0] text-[#E0E0E0] hover:bg-[#282828] font-inter"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      More Info
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              className="relative w-full max-w-5xl aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={movie.trailerUrl || "https://www.youtube.com/embed/YoHD9XEInc0"}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <Button
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"
                size="icon"
                onClick={() => setShowTrailer(false)}
              >
                ✕
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
