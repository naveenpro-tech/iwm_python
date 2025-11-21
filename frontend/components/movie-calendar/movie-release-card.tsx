"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Plus } from "lucide-react"
import { NotificationToggle } from "@/components/movie-calendar/notification-toggle"
import type { MovieRelease } from "@/components/movie-calendar/types"

interface MovieReleaseCardProps {
  release: MovieRelease
}

export function MovieReleaseCard({ release }: MovieReleaseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Format release date
  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <motion.div
      className="bg-[#1A1A1A] rounded-lg overflow-hidden hover:bg-[#3A3A3A] transition-colors"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="flex h-full">
        {/* Movie Poster */}
        <div className="relative w-24 md:w-32 flex-shrink-0">
          <Link href={`/movies/${release.id}`}>
            <div className="relative h-full">
              <Image
                src={release.posterUrl || "/placeholder.svg"}
                alt={release.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 128px"
              />

              {/* Release Type Badge */}
              <div
                className={`
                  absolute top-2 left-2 text-xs font-inter font-medium px-1.5 py-0.5 rounded
                  ${
                    release.releaseType === "theatrical" ? "bg-[#FFD700] text-[#1A1A1A]" : "bg-[#00BFFF] text-[#1A1A1A]"
                  }
                `}
              >
                {release.releaseType === "theatrical" ? "Theater" : "OTT"}
              </div>
            </div>
          </Link>
        </div>

        {/* Movie Info */}
        <div className="flex-1 p-3 flex flex-col">
          <div className="flex-1">
            <Link href={`/movies/${release.id}`} className="block">
              <h4 className="font-inter font-medium text-[#E0E0E0] hover:text-[#00BFFF] transition-colors line-clamp-1">
                {release.title}
              </h4>
            </Link>

            <div className="flex items-center mt-1 text-xs text-[#A0A0A0] font-dmsans">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formatReleaseDate(release.releaseDate)}</span>
            </div>

            {/* Additional Info */}
            <div className="mt-2 flex flex-wrap gap-1">
              {release.languages.map((language) => (
                <span key={language} className="text-xs bg-[#282828] text-[#A0A0A0] px-1.5 py-0.5 rounded">
                  {language}
                </span>
              ))}

              {release.genres.slice(0, 2).map((genre) => (
                <span key={genre} className="text-xs bg-[#282828] text-[#A0A0A0] px-1.5 py-0.5 rounded">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#3A3A3A]">
            {/* SidduScore */}
            <div className="bg-[#00BFFF] text-[#1A1A1A] rounded-full h-6 w-6 flex items-center justify-center font-inter font-bold text-xs">
              {release.sidduScore}
            </div>

            <div className="flex items-center space-x-2">
              {/* Notification Toggle */}
              <NotificationToggle movieId={release.id} />

              {/* Add to Watchlist */}
              <motion.button
                className="p-1.5 rounded-full text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#00BFFF]/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Add ${release.title} to watchlist`}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
