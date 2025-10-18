"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Search, Filter, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/profile/empty-state"
import Image from "next/image"
import Link from "next/link"

interface WatchlistMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  releaseStatus: "released" | "upcoming"
  sidduScore?: number
}

interface ProfileWatchlistProps {
  userId: string
}

export function ProfileWatchlist({ userId }: ProfileWatchlistProps) {
  const [movies, setMovies] = useState<WatchlistMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    // Simulate API call to fetch watchlist
    const fetchWatchlist = async () => {
      setIsLoading(true)

      // Mock data - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const mockWatchlist: WatchlistMovie[] = [
        {
          id: "m2",
          title: "Challengers",
          posterUrl: "/challengers-poster.png",
          year: "2024",
          genres: ["Drama", "Sport"],
          addedDate: "Yesterday",
          releaseStatus: "released",
          sidduScore: 8.7,
        },
        {
          id: "m5",
          title: "Killers of the Flower Moon",
          posterUrl: "/killers-of-the-flower-moon-poster.png",
          year: "2023",
          genres: ["Crime", "Drama", "Western"],
          addedDate: "Last week",
          releaseStatus: "released",
          sidduScore: 9.2,
        },
        {
          id: "m6",
          title: "Poor Things",
          posterUrl: "/poor-things-poster.png",
          year: "2023",
          genres: ["Comedy", "Drama", "Romance", "Sci-Fi"],
          addedDate: "2 weeks ago",
          releaseStatus: "released",
          sidduScore: 8.7,
        },
        {
          id: "m7",
          title: "Furiosa: A Mad Max Saga",
          posterUrl: "/action-movie-poster.png",
          year: "2024",
          genres: ["Action", "Adventure", "Sci-Fi"],
          addedDate: "3 weeks ago",
          releaseStatus: "upcoming",
        },
        {
          id: "m8",
          title: "The Fall Guy",
          posterUrl: "/sci-fi-movie-poster.png",
          year: "2024",
          genres: ["Action", "Comedy"],
          addedDate: "1 month ago",
          releaseStatus: "upcoming",
        },
        {
          id: "m9",
          title: "Kingdom of the Planet of the Apes",
          posterUrl: "/sci-fi-movie-poster.png",
          year: "2024",
          genres: ["Action", "Adventure", "Sci-Fi"],
          addedDate: "1 month ago",
          releaseStatus: "upcoming",
        },
        {
          id: "m10",
          title: "Barbie",
          posterUrl: "/barbie-movie-poster.png",
          year: "2023",
          genres: ["Adventure", "Comedy", "Fantasy"],
          addedDate: "2 months ago",
          releaseStatus: "released",
          sidduScore: 8.9,
        },
        {
          id: "m11",
          title: "Oppenheimer",
          posterUrl: "/oppenheimer-inspired-poster.png",
          year: "2023",
          genres: ["Biography", "Drama", "History"],
          addedDate: "3 months ago",
          releaseStatus: "released",
          sidduScore: 9.4,
        },
      ]

      setMovies(mockWatchlist)
      setIsLoading(false)
    }

    fetchWatchlist()
  }, [userId])

  // Filter and sort movies
  const filteredMovies = movies
    .filter((movie) => {
      // Apply search filter
      if (searchQuery) {
        return (
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }
      return true
    })
    .filter((movie) => {
      // Apply status filter
      if (filterStatus === "all") return true
      if (filterStatus === "released") return movie.releaseStatus === "released"
      if (filterStatus === "upcoming") return movie.releaseStatus === "upcoming"
      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "recent") {
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title)
      }
      if (sortBy === "year-desc") {
        return Number.parseInt(b.year) - Number.parseInt(a.year)
      }
      if (sortBy === "year-asc") {
        return Number.parseInt(a.year) - Number.parseInt(b.year)
      }
      if (sortBy === "rating-desc") {
        return (b.sidduScore || 0) - (a.sidduScore || 0)
      }
      return 0
    })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div>
      {/* Filters and Search */}
      <motion.div
        className="bg-[#282828] rounded-lg p-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] h-4 w-4" />
            <Input
              type="text"
              placeholder="Search watchlist..."
              className="pl-10 bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="text-[#A0A0A0] h-4 w-4" />
            <span className="text-[#A0A0A0] text-sm font-dmsans">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="year-desc">Year (Newest)</SelectItem>
                <SelectItem value="year-asc">Year (Oldest)</SelectItem>
                <SelectItem value="rating-desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#A0A0A0] text-sm font-dmsans">Status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectItem value="all">All Movies</SelectItem>
                <SelectItem value="released">Released</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Watchlist Grid */}
      {isLoading ? (
        <div className="bg-[#282828] rounded-lg p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin mr-2" />
          <span className="text-[#E0E0E0] font-dmsans">Loading watchlist...</span>
        </div>
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          icon={<Plus className="w-8 h-8" />}
          title="Your watchlist is empty"
          description={
            searchQuery
              ? "Try adjusting your search or filters"
              : "Add movies to your watchlist to keep track of what you want to watch"
          }
          actionLabel={!searchQuery ? "Explore Movies" : undefined}
          onAction={!searchQuery ? () => console.log("Navigate to movies") : undefined}
        />
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredMovies.map((movie) => (
            <motion.div
              key={movie.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/movies/${movie.id}`} className="block">
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={movie.posterUrl || "/placeholder.svg?height=300&width=200&query=movie+poster"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />

                  {/* Status Badge */}
                  {movie.releaseStatus === "upcoming" && (
                    <div className="absolute top-2 left-2 bg-[#00BFFF] text-[#1A1A1A] text-xs font-medium px-2 py-0.5 rounded">
                      Upcoming
                    </div>
                  )}

                  {/* SidduScore Badge */}
                  {movie.sidduScore && (
                    <div className="absolute top-2 right-2 bg-[#00BFFF] text-[#1A1A1A] rounded-full h-8 w-8 flex items-center justify-center font-inter font-bold text-sm">
                      {movie.sidduScore}
                    </div>
                  )}
                </div>

                <h3 className="mt-2 font-inter font-medium text-[#E0E0E0] truncate">{movie.title}</h3>
                <p className="text-[#A0A0A0] text-sm">{movie.year}</p>
                <p className="text-[#A0A0A0] text-xs mt-1">Added {movie.addedDate}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
