"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface WatchlistMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  addedDate: string
}

interface WatchlistPreviewSectionProps {
  userId: string
}

export function WatchlistPreviewSection({ userId }: WatchlistPreviewSectionProps) {
  const [movies, setMovies] = useState<WatchlistMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch watchlist
    const fetchWatchlist = async () => {
      setIsLoading(true)

      // Mock data - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockWatchlist: WatchlistMovie[] = [
        {
          id: "m2",
          title: "Challengers",
          posterUrl: "/challengers-poster.png",
          year: "2024",
          addedDate: "Yesterday",
        },
        {
          id: "m5",
          title: "Killers of the Flower Moon",
          posterUrl: "/killers-of-the-flower-moon-poster.png",
          year: "2023",
          addedDate: "Last week",
        },
        {
          id: "m6",
          title: "Poor Things",
          posterUrl: "/poor-things-poster.png",
          year: "2023",
          addedDate: "2 weeks ago",
        },
      ]

      setMovies(mockWatchlist)
      setIsLoading(false)
    }

    fetchWatchlist()
  }, [userId])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="bg-[#282828] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-inter font-medium text-[#E0E0E0]">Watchlist</h2>
        <Link
          href="/profile/watchlist"
          className="text-[#00BFFF] font-dmsans text-sm flex items-center hover:underline"
        >
          View all
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#00BFFF] animate-spin" />
        </div>
      ) : movies.length === 0 ? (
        <p className="text-[#A0A0A0] font-dmsans text-center py-6">Your watchlist is empty</p>
      ) : (
        <motion.div className="grid grid-cols-3 gap-3" variants={containerVariants} initial="hidden" animate="visible">
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/movies/${movie.id}`} className="block">
                <div className="relative aspect-[2/3] rounded-md overflow-hidden">
                  <Image
                    src={movie.posterUrl || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100px, 120px"
                  />
                </div>
                <h3 className="mt-2 text-sm font-dmsans text-[#E0E0E0] truncate">{movie.title}</h3>
                <p className="text-xs text-[#A0A0A0]">{movie.year}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
