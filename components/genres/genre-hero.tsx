"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import type { GenreStatisticTopMovie } from "@/lib/api"

interface GenreHeroProps {
  title: string
  description: string
  backgroundImage: string
  topMovies?: GenreStatisticTopMovie[]
}

export function GenreHero({ title, description, backgroundImage, topMovies }: GenreHeroProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]) // Fade out faster
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]) // Slightly more scale
  const yText = useTransform(scrollYProgress, [0, 1], [0, 150]) // Text moves more

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const shortDescriptionLength = 180
  const canExpandDescription = description.length > shortDescriptionLength

  return (
    <motion.div
      ref={ref}
      className="relative h-[65vh] min-h-[480px] md:h-[75vh] md:min-h-[550px] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div className="absolute inset-0 z-0" style={{ scale, opacity }}>
        <Image
          src={backgroundImage || "/placeholder.svg?height=800&width=1400&query=epic genre background"}
          alt={`${title} genre background`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center md:justify-end items-start text-left pb-12 md:pb-20">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 md:mb-5 shadow-text"
          style={{ y: yText }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 50 }}
        >
          {title}
        </motion.h1>
        <motion.div
          className="text-base md:text-lg text-gray-200 max-w-2xl mb-5 md:mb-8 shadow-text-sm"
          style={{ y: yText }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 50 }}
        >
          <p className="leading-relaxed">
            {isDescriptionExpanded || !canExpandDescription
              ? description
              : `${description.substring(0, shortDescriptionLength)}...`}
          </p>
          {canExpandDescription && (
            <Button
              variant="link"
              className="text-[#00BFFF] hover:text-[#00aeee] p-0 h-auto text-sm mt-1.5 inline-flex items-center font-semibold"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              aria-expanded={isDescriptionExpanded}
            >
              {isDescriptionExpanded ? "Read Less" : "Read More"}
              {isDescriptionExpanded ? (
                <ChevronUp className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          )}
        </motion.div>

        {topMovies && topMovies.length > 0 && (
          <motion.div
            className="mt-4"
            style={{ y: yText }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 50 }}
          >
            <h3 className="text-md font-semibold text-gray-100 mb-2 uppercase tracking-wider">Top Rated in {title}:</h3>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {topMovies.map((movie) => (
                <Link
                  href={movie.movieUrl}
                  key={movie.id}
                  className="group"
                  aria-label={`View details for ${movie.title}`}
                >
                  <motion.div
                    className="bg-black/60 backdrop-blur-md p-2.5 rounded-lg flex items-center gap-3 hover:bg-black/80 transition-all duration-300 shadow-lg hover:shadow-[#00BFFF]/30"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Image
                      src={movie.posterUrl || "/placeholder.svg?height=75&width=50&query=movie poster"}
                      alt={movie.title}
                      width={44}
                      height={66}
                      className="rounded-sm object-cover shadow-md"
                    />
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#00BFFF] transition-colors duration-200">
                        {movie.title}
                      </p>
                      <div className="flex items-center text-xs text-yellow-400">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 mr-1" />
                        {movie.sidduScore.toFixed(1)}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
