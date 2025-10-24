"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search, Filter, Heart, Grid3x3, List, X, Plus, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/profile/empty-state"
import { AddToCollectionModal } from "@/components/profile/collections/add-to-collection-modal"
import Image from "next/image"
import Link from "next/link"

type ViewMode = "grid" | "list"

interface FavoriteMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  sidduScore?: number
  userRating: number
  reviewId?: string
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addToCollectionMovie, setAddToCollectionMovie] = useState<{ id: string; title: string } | null>(null)

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
          userRating: 5,
          reviewId: "r1",
        },
        {
          id: "m3",
          title: "Oppenheimer",
          posterUrl: "/oppenheimer-inspired-poster.png",
          year: "2023",
          genres: ["Biography", "Drama", "History"],
          addedDate: "3 months ago",
          sidduScore: 9.4,
          userRating: 5,
          reviewId: "r2",
        },
        {
          id: "m4",
          title: "Interstellar",
          posterUrl: "/interstellar-poster.png",
          year: "2014",
          genres: ["Adventure", "Drama", "Sci-Fi"],
          addedDate: "1 year ago",
          sidduScore: 9.1,
          userRating: 5,
          reviewId: "r3",
        },
        {
          id: "m12",
          title: "The Dark Knight",
          posterUrl: "/dark-knight-poster.png",
          year: "2008",
          genres: ["Action", "Crime", "Drama", "Thriller"],
          addedDate: "3 years ago",
          sidduScore: 9.5,
          userRating: 5,
          reviewId: "r4",
        },
        {
          id: "m13",
          title: "Parasite",
          posterUrl: "/parasite-movie-poster.png",
          year: "2019",
          genres: ["Comedy", "Drama", "Thriller"],
          addedDate: "2 years ago",
          sidduScore: 9.6,
          userRating: 4,
        },
        {
          id: "m14",
          title: "The Shawshank Redemption",
          posterUrl: "/shawshank-redemption-poster.png",
          year: "1994",
          genres: ["Drama"],
          addedDate: "4 years ago",
          sidduScore: 9.8,
          userRating: 5,
          reviewId: "r5",
        },
        {
          id: "m15",
          title: "Pulp Fiction",
          posterUrl: "/pulp-fiction-poster.png",
          year: "1994",
          genres: ["Crime", "Drama"],
          addedDate: "3 years ago",
          sidduScore: 9.2,
          userRating: 4,
        },
        {
          id: "m16",
          title: "The Godfather",
          posterUrl: "/classic-mob-poster.png",
          year: "1972",
          genres: ["Crime", "Drama"],
          addedDate: "5 years ago",
          sidduScore: 9.7,
          userRating: 5,
          reviewId: "r6",
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

  // Action handlers
  const handleRemove = async (movieId: string) => {
    setRemovingId(movieId)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setMovies(prev => prev.filter(m => m.id !== movieId))
    } catch (error) {
      console.error("Failed to remove from favorites:", error)
    } finally {
      setRemovingId(null)
    }
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "text-[#FFD700]" : "text-[#3A3A3A]"}>
            ★
          </span>
        ))}
      </div>
    )
  }

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
      if (sortBy === "my-rating") {
        return b.userRating - a.userRating
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
        <div className="flex flex-col gap-4">
          {/* Top Row: Search and View Mode */}
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid" ? "bg-[#00BFFF] text-white" : "text-[#A0A0A0] hover:text-[#E0E0E0]"
                }`}
                title="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list" ? "bg-[#00BFFF] text-white" : "text-[#A0A0A0] hover:text-[#E0E0E0]"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="text-[#A0A0A0] h-4 w-4" />
              <span className="text-[#A0A0A0] text-sm font-dmsans">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="my-rating">My Rating</SelectItem>
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
                <SelectTrigger className="w-[120px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectValue placeholder="Genre" />
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
        </div>
      </motion.div>

      {/* Favorites Content */}
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
      ) : viewMode === "grid" ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative"
              >
                <Link href={`/movies/${movie.id}`} className="block">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />

                    {/* SidduScore Badge */}
                    {movie.sidduScore && (
                      <div className="absolute top-2 left-2 bg-[#00BFFF] text-[#1A1A1A] rounded-full h-8 w-8 flex items-center justify-center font-inter font-bold text-sm">
                        {movie.sidduScore}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-2 font-inter font-medium text-[#E0E0E0] truncate">{movie.title}</h3>
                  <p className="text-[#A0A0A0] text-sm">{movie.year}</p>

                  {/* User Rating */}
                  <div className="mt-1 flex items-center gap-1 text-sm">
                    {renderStars(movie.userRating)}
                  </div>
                </Link>

                {/* Quick Actions - Fixed hover bug */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 pointer-events-none group-hover:pointer-events-auto">
                  {movie.reviewId && (
                    <Link
                      href={`/reviews/${movie.reviewId}`}
                      className="p-1.5 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-full transition-colors shadow-lg"
                      title="View review"
                    >
                      <Edit className="w-3.5 h-3.5 text-white" />
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      setAddToCollectionMovie({ id: movie.id, title: movie.title })
                    }}
                    className="p-1.5 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-full transition-colors shadow-lg"
                    title="Add to collection"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      if (confirm(`Remove "${movie.title}" from favorites?`)) {
                        handleRemove(movie.id)
                      }
                    }}
                    className="p-1.5 bg-[#EF4444] hover:bg-[#EF4444]/90 rounded-full transition-colors shadow-lg"
                    title="Remove from favorites"
                    disabled={removingId === movie.id}
                  >
                    <Heart className="w-3.5 h-3.5 text-white fill-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#282828] rounded-lg p-4 flex gap-4 group hover:bg-[#2A2A2A] transition-colors"
              >
                <Link href={`/movies/${movie.id}`} className="flex-shrink-0">
                  <div className="relative w-24 h-36 rounded-lg overflow-hidden">
                    <Image
                      src={movie.posterUrl || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/movies/${movie.id}`}>
                    <h3 className="font-inter font-semibold text-[#E0E0E0] text-lg truncate hover:text-[#00BFFF] transition-colors">
                      {movie.title}
                    </h3>
                  </Link>
                  <p className="text-[#A0A0A0] text-sm mt-1">{movie.year} • {movie.genres.slice(0, 2).join(", ")}</p>

                  {/* User Rating */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[#A0A0A0] text-xs">My Rating:</span>
                    {renderStars(movie.userRating)}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {movie.sidduScore && (
                      <span className="text-[#00BFFF] text-sm font-inter font-bold">
                        ⭐ {movie.sidduScore}
                      </span>
                    )}
                    {movie.reviewId && (
                      <Link
                        href={`/reviews/${movie.reviewId}`}
                        className="text-xs text-[#00BFFF] hover:underline"
                      >
                        View Review
                      </Link>
                    )}
                  </div>
                  <p className="text-[#A0A0A0] text-xs mt-2">Added {movie.addedDate}</p>
                </div>

                {/* Quick Actions - Fixed hover bug */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  {movie.reviewId && (
                    <Link
                      href={`/reviews/${movie.reviewId}`}
                      className="p-2 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-lg transition-colors shadow-lg"
                      title="View review"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </Link>
                  )}
                  <button
                    onClick={() => setAddToCollectionMovie({ id: movie.id, title: movie.title })}
                    className="p-2 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-lg transition-colors shadow-lg"
                    title="Add to collection"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${movie.title}" from favorites?`)) {
                        handleRemove(movie.id)
                      }
                    }}
                    className="p-2 bg-[#EF4444] hover:bg-[#EF4444]/90 rounded-lg transition-colors shadow-lg"
                    title="Remove from favorites"
                    disabled={removingId === movie.id}
                  >
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add to Collection Modal */}
      <AnimatePresence>
        {addToCollectionMovie && (
          <AddToCollectionModal
            movieId={addToCollectionMovie.id}
            movieTitle={addToCollectionMovie.title}
            onClose={() => setAddToCollectionMovie(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
