"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Sparkles, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { SiddusPickMovie } from "./types" // Assuming this type exists
import React from "react"

interface PickMovieCardProps {
  movie: SiddusPickMovie
  className?: string
}

export const PickMovieCard: React.FC<PickMovieCardProps> = ({ movie, className = "" }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      className={`relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl group bg-slate-800 border-2 border-transparent hover:border-purple-500/70 transition-all duration-300 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2, ease: "circOut" }}
    >
      <Link href={`/movies/${movie.id}`} passHref legacyBehavior>
        <a className="block w-full h-full">
          <Image
            src={movie.posterUrl || "/placeholder.svg?width=300&height=450&query=Siddus+Pick"}
            alt={movie.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

          <div className="absolute top-3 left-3">
            <Badge
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2.5 py-1 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Siddu's Pick
            </Badge>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 text-white"
            initial={{ opacity: 1 }} // Always visible, but content animates
          >
            <motion.h3
              className="text-lg lg:text-xl font-bold leading-tight mb-1 line-clamp-2 shadow-text"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              {movie.title}
            </motion.h3>
            <motion.div
              className="flex items-center text-sm mb-2"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
              <span className="font-semibold">{movie.sidduScore?.toFixed(1) || "N/A"}</span>
              <span className="mx-2 text-slate-400">•</span>
              <span>{movie.year}</span>
            </motion.div>

            <motion.p
              className="text-xs lg:text-sm text-slate-300 line-clamp-3 italic leading-relaxed shadow-text"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? "auto" : 0,
              }}
              transition={{ duration: 0.25, delay: 0.1 }}
            >
              "{movie.pickReason}"
            </motion.p>

            {!isHovered && (
              <div className="flex items-center text-xs text-purple-300 mt-1.5">
                <Info className="w-3.5 h-3.5 mr-1" />
                <span>Hover for Siddu's take</span>
              </div>
            )}
          </motion.div>
        </a>
      </Link>
    </motion.div>
  )
}
