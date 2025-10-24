"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search, Filter, Plus, Grid3x3, List, X, Check, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/profile/empty-state"
import { AddToCollectionModal } from "@/components/profile/collections/add-to-collection-modal"
import Image from "next/image"
import Link from "next/link"

type ViewMode = "grid" | "list"
type Priority = "high" | "medium" | "low"

interface WatchlistMovie {
  id: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  releaseStatus: "released" | "upcoming"
  sidduScore?: number
  priority: Priority
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
  const [filterPriority, setFilterPriority] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addToCollectionMovie, setAddToCollectionMovie] = useState<{ id: string; title: string } | null>(null)

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
          priority: "high",
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
          priority: "high",
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
          priority: "medium",
        },
        {
          id: "m7",
          title: "Furiosa: A Mad Max Saga",
          posterUrl: "/action-movie-poster.png",
          year: "2024",
          genres: ["Action", "Adventure", "Sci-Fi"],
          addedDate: "3 weeks ago",
          releaseStatus: "upcoming",
          priority: "high",
        },
        {
          id: "m8",
          title: "The Fall Guy",
          posterUrl: "/sci-fi-movie-poster.png",
          year: "2024",
          genres: ["Action", "Comedy"],
          addedDate: "1 month ago",
          releaseStatus: "upcoming",
          priority: "medium",
        },
        {
          id: "m9",
          title: "Kingdom of the Planet of the Apes",
          posterUrl: "/sci-fi-movie-poster.png",
          year: "2024",
          genres: ["Action", "Adventure", "Sci-Fi"],
          addedDate: "1 month ago",
          releaseStatus: "upcoming",
          priority: "low",
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
          priority: "low",
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
          priority: "medium",
        },
      ]

      setMovies(mockWatchlist)
      setIsLoading(false)
    }

    fetchWatchlist()
  }, [userId])

  // Action handlers
  const handleRemove = async (movieId: string) => {
    setRemovingId(movieId)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setMovies(prev => prev.filter(m => m.id !== movieId))
    } catch (error) {
      console.error("Failed to remove from watchlist:", error)
    } finally {
      setRemovingId(null)
    }
  }

  const handleMarkWatched = async (movieId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setMovies(prev => prev.filter(m => m.id !== movieId))
      // In real app, this would move to history
    } catch (error) {
      console.error("Failed to mark as watched:", error)
    }
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
      // Apply status filter
      if (filterStatus === "all") return true
      if (filterStatus === "released") return movie.releaseStatus === "released"
      if (filterStatus === "upcoming") return movie.releaseStatus === "upcoming"
      return true
    })
    .filter((movie) => {
      // Apply priority filter
      if (filterPriority === "all") return true
      return movie.priority === filterPriority
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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high": return "bg-[#EF4444] text-white"
      case "medium": return "bg-[#F59E0B] text-white"
      case "low": return "bg-[#10B981] text-white"
    }
  }

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
                placeholder="Search watchlist..."
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
                <SelectTrigger className="w-[120px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#A0A0A0] text-sm font-dmsans">Priority:</span>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[120px] bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Watchlist Content */}
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

                    {/* Priority Badge */}
                    <div className={`absolute top-2 left-2 ${getPriorityColor(movie.priority)} text-xs font-medium px-2 py-0.5 rounded uppercase`}>
                      {movie.priority}
                    </div>

                    {/* Status Badge */}
                    {movie.releaseStatus === "upcoming" && (
                      <div className="absolute top-2 right-2 bg-[#00BFFF] text-[#1A1A1A] text-xs font-medium px-2 py-0.5 rounded">
                        Upcoming
                      </div>
                    )}

                    {/* SidduScore Badge */}
                    {movie.sidduScore && (
                      <div className="absolute bottom-2 left-2 bg-[#00BFFF] text-[#1A1A1A] rounded-full h-8 w-8 flex items-center justify-center font-inter font-bold text-sm">
                        {movie.sidduScore}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-2 font-inter font-medium text-[#E0E0E0] truncate">{movie.title}</h3>
                  <p className="text-[#A0A0A0] text-sm">{movie.year}</p>
                  <p className="text-[#A0A0A0] text-xs mt-1">Added {movie.addedDate}</p>
                </Link>

                {/* Quick Actions - Fixed hover bug by using transform instead of opacity */}
                <div className="absolute top-2 right-2 translate-x-0 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleMarkWatched(movie.id)
                    }}
                    className="p-1.5 bg-[#10B981] hover:bg-[#10B981]/90 rounded-full transition-colors shadow-lg"
                    title="Mark as watched"
                  >
                    <Check className="w-3.5 h-3.5 text-white" />
                  </button>
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
                      if (confirm(`Remove "${movie.title}" from watchlist?`)) {
                        handleRemove(movie.id)
                      }
                    }}
                    className="p-1.5 bg-[#EF4444] hover:bg-[#EF4444]/90 rounded-full transition-colors shadow-lg"
                    title="Remove from watchlist"
                    disabled={removingId === movie.id}
                  >
                    <X className="w-3.5 h-3.5 text-white" />
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
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`${getPriorityColor(movie.priority)} text-xs font-medium px-2 py-0.5 rounded uppercase`}>
                      {movie.priority}
                    </span>
                    {movie.releaseStatus === "upcoming" && (
                      <span className="bg-[#00BFFF] text-[#1A1A1A] text-xs font-medium px-2 py-0.5 rounded">
                        Upcoming
                      </span>
                    )}
                    {movie.sidduScore && (
                      <span className="text-[#00BFFF] text-sm font-inter font-bold">
                        ⭐ {movie.sidduScore}
                      </span>
                    )}
                  </div>
                  <p className="text-[#A0A0A0] text-xs mt-2">Added {movie.addedDate}</p>
                </div>

                {/* Quick Actions - Fixed hover bug */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={() => handleMarkWatched(movie.id)}
                    className="p-2 bg-[#10B981] hover:bg-[#10B981]/90 rounded-lg transition-colors shadow-lg"
                    title="Mark as watched"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setAddToCollectionMovie({ id: movie.id, title: movie.title })}
                    className="p-2 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-lg transition-colors shadow-lg"
                    title="Add to collection"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${movie.title}" from watchlist?`)) {
                        handleRemove(movie.id)
                      }
                    }}
                    className="p-2 bg-[#EF4444] hover:bg-[#EF4444]/90 rounded-lg transition-colors shadow-lg"
                    title="Remove from watchlist"
                    disabled={removingId === movie.id}
                  >
                    <X className="w-4 h-4 text-white" />
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
