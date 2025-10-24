"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ReviewHeaderProps } from "@/types/review-page"

export default function ReviewHeader({ movie }: ReviewHeaderProps) {
  const router = useRouter()
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-lg shadow-lg"
          : "relative bg-[#282828]"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Poster */}
          <div className="flex-shrink-0">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className={`${
                isSticky ? "h-16 w-11" : "h-32 w-20 sm:h-40 sm:w-28"
              } object-cover rounded-lg transition-all duration-300`}
            />
          </div>

          {/* Movie Info */}
          <div className="flex-1 min-w-0">
            <h1
              className={`${
                isSticky ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl lg:text-4xl"
              } font-bold text-[#E0E0E0] font-inter transition-all duration-300 truncate`}
            >
              {movie.title}
            </h1>
            <p className="text-[#A0A0A0] text-sm sm:text-base mt-1">{movie.year}</p>
          </div>

          {/* Back Button */}
          <Button
            onClick={() => router.push(`/movies/${movie.id}`)}
            variant="outline"
            className="flex-shrink-0 border-[#3A3A3A] bg-[#282828] text-[#E0E0E0] hover:bg-[#3A3A3A] hover:border-[#00BFFF] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Movie</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

