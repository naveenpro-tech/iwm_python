"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Clock } from "lucide-react"

interface MovieContextBarProps {
  movie: any
}

export function MovieContextBar({ movie }: MovieContextBarProps) {
  return (
    <motion.div
      className="bg-gradient-to-r from-siddu-bg-card-dark to-siddu-bg-card p-4 md:p-6 border-b border-siddu-border-subtle sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-16 md:w-16 md:h-20 flex-shrink-0">
          <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover rounded" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-siddu-text-light truncate">{movie.title}</h3>
          <div className="flex items-center gap-3 text-sm text-siddu-text-subtle">
            <span>{movie.year}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {movie.runtime}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
