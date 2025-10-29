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
import { getUserWatchlist, updateWatchlistItem, removeFromWatchlist } from "@/lib/api/watchlist"
import { useToast } from "@/hooks/use-toast"

type ViewMode = "grid" | "list"
type Priority = "high" | "medium" | "low"
type WatchStatus = "want-to-watch" | "watching" | "watched"

interface WatchlistMovie {
  id: string
  watchlistId: string
  title: string
  posterUrl: string
  year: string
  genres: string[]
  addedDate: string
  releaseStatus: "released" | "upcoming"
  sidduScore?: number
  priority: Priority
  status: WatchStatus
}

interface ProfileWatchlistProps {
  userId: string
}

export function ProfileWatchlist({ userId }: ProfileWatchlistProps) {
  const { toast } = useToast()
  const [movies, setMovies] = useState<WatchlistMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [addToCollectionMovie, setAddToCollectionMovie] = useState<{ id: string; title: string } | null>(null)

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true)
      try {
        const data = await getUserWatchlist(userId, 1, 100)
        const items = Array.isArray(data) ? data : data?.items || []
        const mapped: WatchlistMovie[] = items.map((w: any) => {
          const year = w.releaseDate || w.movie?.year || ""
          const releaseStatus: "released" | "upcoming" = year && Number(year) <= new Date().getFullYear() ? "released" : "upcoming"
          return {
            id: w.movieId || w.movie?.id || w.id,
            watchlistId: w.id || w.external_id,
            title: w.title || w.movie?.title || "",
            posterUrl: w.posterUrl || w.movie?.posterUrl || "",
            year: String(year || ""),
            genres: w.genres || w.movie?.genres || [],
            addedDate: w.dateAdded || "",
            releaseStatus,
            sidduScore: typeof w.rating === "number" ? w.rating : undefined,
            priority: (w.priority as Priority) || "medium",
            status: (w.status as WatchStatus) || "want-to-watch",
          }
        })
        setMovies(mapped)
      } catch (err) {
        console.error("Failed to load watchlist:", err)
        setMovies([])
      } finally {
        setIsLoading(false)
      }
    }
    if (userId) fetchWatchlist()
  }, [userId])

  // Action handlers
  const handleRemove = async (watchlistId: string) => {
    setRemovingId(watchlistId)
    try {
      await removeFromWatchlist(watchlistId)
      setMovies(prev => prev.filter(m => m.watchlistId !== watchlistId))
      toast({
        title: "Removed",
        description: "Movie removed from watchlist",
      })
    } catch (error) {
      console.error("Failed to remove from watchlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from watchlist",
        variant: "destructive",
      })
    } finally {
      setRemovingId(null)
    }
  }

  const handleStatusChange = async (watchlistId: string, newStatus: WatchStatus) => {
    setUpdatingId(watchlistId)
    try {
      await updateWatchlistItem(watchlistId, { status: newStatus })
      setMovies(prev =>
        prev.map(m =>
          m.watchlistId === watchlistId ? { ...m, status: newStatus } : m
        )
      )
      const statusLabel = newStatus === "want-to-watch" ? "Plan to Watch" : newStatus === "watching" ? "Watching" : "Watched"
      toast({
        title: "Updated",
        description: `Status changed to ${statusLabel}`,
      })
    } catch (error) {
      console.error("Failed to update status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
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
                key={movie.watchlistId}
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

                {/* Hover Overlay with Status Dropdown and Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex flex-col justify-between p-3 pointer-events-none group-hover:pointer-events-auto">
                  <div className="flex justify-end">
                    <Select value={movie.status} onValueChange={(newStatus) => handleStatusChange(movie.watchlistId, newStatus as WatchStatus)}>
                      <SelectTrigger className="w-auto h-8 bg-[#00BFFF] border-0 text-[#1A1A1A] text-xs font-medium pointer-events-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                        <SelectItem value="want-to-watch">Plan to Watch</SelectItem>
                        <SelectItem value="watching">Watching</SelectItem>
                        <SelectItem value="watched">Watched</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setAddToCollectionMovie({ id: movie.id, title: movie.title })
                      }}
                      className="p-1.5 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-full transition-colors shadow-lg pointer-events-auto"
                      title="Add to collection"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        if (confirm(`Remove "${movie.title}" from watchlist?`)) {
                          handleRemove(movie.watchlistId)
                        }
                      }}
                      className="p-1.5 bg-[#EF4444] hover:bg-[#EF4444]/90 rounded-full transition-colors shadow-lg disabled:opacity-50 pointer-events-auto"
                      title="Remove from watchlist"
                      disabled={removingId === movie.watchlistId}
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
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
                key={movie.watchlistId}
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

                {/* Status and Quick Actions */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <Select value={movie.status} onValueChange={(newStatus) => handleStatusChange(movie.watchlistId, newStatus as WatchStatus)}>
                    <SelectTrigger className="h-8 bg-[#00BFFF] border-0 text-[#1A1A1A] text-xs font-medium pointer-events-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                      <SelectItem value="want-to-watch">Plan to Watch</SelectItem>
                      <SelectItem value="watching">Watching</SelectItem>
                      <SelectItem value="watched">Watched</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => setAddToCollectionMovie({ id: movie.id, title: movie.title })}
                    className="p-2 bg-[#00BFFF] hover:bg-[#00BFFF]/90 rounded-lg transition-colors shadow-lg pointer-events-auto"
                    title="Add to collection"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${movie.title}" from watchlist?`)) {
                        handleRemove(movie.watchlistId)
                      }
                    }}
                    className="p-2 bg-[#EF4444] hover:bg-[#EF4444]/90 rounded-lg transition-colors shadow-lg disabled:opacity-50 pointer-events-auto"
                    title="Remove from watchlist"
                    disabled={removingId === movie.watchlistId}
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
