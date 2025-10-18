"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Search, Filter, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/profile/empty-state"
import Image from "next/image"
import Link from "next/link"

interface FavoriteMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  sidduScore?: number
}

interface ProfileFavoritesProps {
  userId: string
}

export function ProfileFavorites({ userId }: ProfileFavoritesProps) {
  const [movies, setMovies] = useState<FavoriteMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterGenre, setFilterGenre] = useState("all")
  const [availableGenres, setAvailableGenres] = useState<string[]>([])

  useEffect(() => {
    // Simulate API call to fetch favorites
    const fetchFavorites = async () => {
      setIsLoading(true)

      // Mock data - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1200))

      const mockFavorites: FavoriteMovie[] = [
        {
          id: "m1",
          title: "Inception",
          posterUrl: "/inception-movie-poster.png",
          year: "2010",
          genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
          addedDate: "2 years ago",
          sidduScore: 9.3,
        },
        {
          id: "m3",
          title: "Oppenheimer",
          posterUrl: "/oppenheimer-inspired-poster.png",
          year: "2023",
          genres: ["Biography", "Drama", "History"],
          addedDate: "3 months ago",
          sidduScore: 9.4,
        },
        {
          id: "m4",
          title: "Interstellar",
          posterUrl: "/interstellar-poster.png",
          year: "2014",
          genres: ["Adventure", "Drama", "Sci-Fi"],
          addedDate: "1 year ago",
          sidduScore: 9.1,
        },
        {
          id: "m12",
          title: "The Dark Knight",
          posterUrl: "/dark-knight-poster.png",
          year: "2008",
          genres: ["Action", "Crime", "Drama", "Thriller"],
          addedDate: "3 years ago",
          sidduScore: 9.5,
        },
        {
          id: "m13",
          title: "Parasite",
          posterUrl: "/parasite-movie-poster.png",
          year: "2019",
          genres: ["Comedy", "Drama", "Thriller"],
          addedDate: "2 years ago",
          sidduScore: 9.6,
        },
        {
          id: "m14",
          title: "The Shawshank Redemption",
          posterUrl: "/shawshank-redemption-poster.png",
          year: "1994",
          genres: ["Drama"],
          addedDate: "4 years ago",
          sidduScore: 9.8,
        },
        {
          id: "m15",
          title: "Pulp Fiction",
          posterUrl: "/pulp-fiction-poster.png",
          year: "1994",
          genres: ["Crime", "Drama"],
          addedDate: "3 years ago",
          sidduScore: 9.2,
        },
        {
          id: "m16",
          title: "The Godfather",
          posterUrl: "/classic-mob-poster.png",
          year: "1972",
          genres: ["Crime", "Drama"],
          addedDate: "5 years ago",
          sidduScore: 9.7,
        },
      ]

      // Extract all unique genres for filtering
      const genres = new Set<string>()
      mockFavorites.forEach((movie) => {
        movie.genres.forEach((genre) => genres.add(genre))
      })

      setAvailableGenres(Array.from(genres).sort())
      setMovies(mockFavorites)
      setIsLoading(false)
    }

    fetchFavorites()
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
      // Apply genre filter
      if (filterGenre === "all") return true
      return movie.genres.includes(filterGenre)
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
              placeholder="Search favorites..."
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
            <span className="text-[#A0A0A0] text-sm font-dmsans">Genre:</span>
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="w-[140px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                <SelectItem value="all">All Genres</SelectItem>
                {availableGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Favorites Grid */}
      {isLoading ? (
        <div className="bg-[#282828] rounded-lg p-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#00BFFF] animate-spin mr-2" />
          <span className="text-[#E0E0E0] font-dmsans">Loading favorites...</span>
        </div>
      ) : filteredMovies.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="No favorites found"
          description={
            searchQuery
              ? "Try adjusting your search or filters"
              : "Add movies to your favorites to build your collection"
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
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden group">
                  <Image
                    src={movie.posterUrl || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />

                  {/* Favorite Icon */}
                  <div className="absolute top-2 right-2 bg-[#1A1A1A80] p-1 rounded-full">
                    <Heart className="w-4 h-4 text-[#FF4D6D] fill-[#FF4D6D]" />
                  </div>

                  {/* SidduScore Badge */}
                  {movie.sidduScore && (
                    <div className="absolute bottom-2 left-2 bg-[#00BFFF] text-[#1A1A1A] rounded-full h-8 w-8 flex items-center justify-center font-inter font-bold text-sm">
                      {movie.sidduScore}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres.slice(0, 2).map((genre) => (
                          <span key={genre} className="text-xs bg-[#3A3A3A] text-[#E0E0E0] px-1.5 py-0.5 rounded">
                            {genre}
                          </span>
                        ))}
                        {movie.genres.length > 2 && (
                          <span className="text-xs bg-[#3A3A3A] text-[#E0E0E0] px-1.5 py-0.5 rounded">
                            +{movie.genres.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="mt-2 font-inter font-medium text-[#E0E0E0] truncate">{movie.title}</h3>
                <p className="text-[#A0A0A0] text-sm">{movie.year}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
