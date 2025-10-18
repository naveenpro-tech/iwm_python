"use client"

import { motion } from "framer-motion"
import { MovieCard } from "@/components/homepage/movie-card"
import type { Movie } from "@/components/movies/types"

interface MovieGridProps {
  movies: Movie[]
}

export function MovieGrid({ movies }: MovieGridProps) {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {movies.map((movie) => (
        <motion.div key={movie.id} variants={itemVariants}>
          <MovieCard
            id={movie.id}
            title={movie.title}
            posterUrl={movie.posterUrl}
            year={movie.year}
            genres={movie.genres}
            sidduScore={movie.sidduScore}
            streamingOptions={movie.streamingOptions}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
