"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Globe } from "lucide-react"
import type { MasterpieceFilm } from "./types" // Assuming a shared MasterpieceFilm type
import React from "react"

interface MasterpieceCardProps {
  film: MasterpieceFilm
  index: number // For staggered animation
}

export const MasterpieceCard: React.FC<MasterpieceCardProps> = ({ film, index }) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.div
      className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg group bg-slate-800"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, zIndex: 10, boxShadow: "0px 10px 20px rgba(0, 191, 255, 0.3)" }}
      transition={{ duration: 0.2, ease: "circOut" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // Staggered animation based on index, if desired in parent component
      // transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/movies/${film.id}`} passHref legacyBehavior>
        <a className="block w-full h-full">
          <Image
            src={film.posterUrl || "/placeholder.svg?width=200&height=300&query=Classic+Movie+Poster"}
            alt={film.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content visible on hover */}
          <motion.div
            className="absolute inset-0 p-3 flex flex-col justify-end text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            <h3 className="text-base lg:text-lg font-semibold leading-tight mb-1 line-clamp-2 shadow-text">
              {film.title}
            </h3>
            <div className="flex items-center text-xs mb-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 mr-1 fill-yellow-400" />
              <span className="font-medium">{film.sidduScore?.toFixed(1) || "N/A"}</span>
              <span className="mx-1.5 text-slate-400">•</span>
              <span>{film.year}</span>
            </div>
            <div className="flex items-center text-xs text-slate-300 mb-1.5">
              <Globe className="w-3 h-3 mr-1" />
              <span>{film.country}</span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">Dir. {film.director}</p>
            {film.visualStyle && (
              <p className="text-[11px] text-sky-300 mt-1 line-clamp-1 italic">Style: {film.visualStyle}</p>
            )}
          </motion.div>

          {/* Static content (visible always or when not hovered) */}
          {!isHovered && (
            <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 shadow-text">{film.title}</h3>
              <div className="flex items-center text-xs text-slate-300 mt-0.5">
                <Star className="w-3 h-3 text-yellow-400 mr-0.5 fill-yellow-400" />
                <span>{film.sidduScore?.toFixed(1) || "N/A"}</span>
              </div>
            </div>
          )}
        </a>
      </Link>
    </motion.div>
  )
}
