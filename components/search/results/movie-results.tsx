"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface MovieResultsProps {
  query: string
  limit?: number
}

export function MovieResults({ query, limit }: MovieResultsProps) {
  // Mock data - in a real app, this would come from an API
  const movies = [
    {
      id: 1,
      title: "Inception",
      year: 2010,
      poster: "/inception-movie-poster.png",
      rating: 8.8,
      genres: ["Sci-Fi", "Action", "Thriller"],
      director: "Christopher Nolan",
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: 2008,
      poster: "/dark-knight-poster.png",
      rating: 9.0,
      genres: ["Action", "Crime", "Drama"],
      director: "Christopher Nolan",
    },
    {
      id: 3,
      title: "Interstellar",
      year: 2014,
      poster: "/interstellar-poster.png",
      rating: 8.6,
      genres: ["Sci-Fi", "Adventure", "Drama"],
      director: "Christopher Nolan",
    },
    {
      id: 4,
      title: "Oppenheimer",
      year: 2023,
      poster: "/oppenheimer-inspired-poster.png",
      rating: 8.5,
      genres: ["Biography", "Drama", "History"],
      director: "Christopher Nolan",
    },
    {
      id: 5,
      title: "Dunkirk",
      year: 2017,
      poster: "/dunkirk-poster.png",
      rating: 7.8,
      genres: ["Action", "Drama", "History"],
      director: "Christopher Nolan",
    },
    {
      id: 6,
      title: "The Prestige",
      year: 2006,
      poster: "/prestige-poster.png",
      rating: 8.5,
      genres: ["Drama", "Mystery", "Sci-Fi"],
      director: "Christopher Nolan",
    },
  ]

  // Limit results if specified
  const displayedMovies = limit ? movies.slice(0, limit) : movies

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

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      variants={containerVariants}
    >
      {displayedMovies.map((movie) => (
        <motion.div
          key={movie.id}
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors"
        >
          <Link href={`/movies/${movie.id}`}>
            <div className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={movie.poster || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="text-sm text-gray-300">Directed by</p>
                  <p className="font-medium">{movie.director}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
                <div className="flex items-center space-x-1 bg-[#1A1A1A] px-2 py-1 rounded text-[#00BFFF]">
                  <Star size={14} className="fill-[#00BFFF]" />
                  <span className="text-sm font-medium">{movie.rating}</span>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-400 mb-3">
                <span>{movie.year}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>152 min</span>
                </div>
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
