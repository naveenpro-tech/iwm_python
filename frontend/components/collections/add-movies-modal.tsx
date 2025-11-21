"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Plus, Check, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: string
  title: string
  year: number | null
  poster: string
  genres: string[]
  rating: number | null
}

interface AddMoviesModalProps {
  collectionId: string
  collectionTitle: string
  onClose: () => void
  onMoviesAdded: (movies: Movie[]) => void
}

export function AddMoviesModal({
  collectionId,
  collectionTitle,
  onClose,
  onMoviesAdded,
}: AddMoviesModalProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [selectedMovies, setSelectedMovies] = useState<Set<string>>(new Set())
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // Mock search function - replace with real API call
  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock data - replace with real API call
      const mockResults: Movie[] = [
        {
          id: "tmdb-550",
          title: "Fight Club",
          year: 1999,
          poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
          genres: ["Drama", "Thriller"],
          rating: 8.8,
        },
        {
          id: "tmdb-13",
          title: "Forrest Gump",
          year: 1994,
          poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
          genres: ["Drama", "Romance"],
          rating: 8.8,
        },
        {
          id: "tmdb-680",
          title: "Pulp Fiction",
          year: 1994,
          poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
          genres: ["Crime", "Drama"],
          rating: 8.9,
        },
      ]

      setSearchResults(mockResults)
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        title: "Search Failed",
        description: "Failed to search movies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchMovies(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const toggleMovieSelection = (movieId: string) => {
    const newSelection = new Set(selectedMovies)
    if (newSelection.has(movieId)) {
      newSelection.delete(movieId)
    } else {
      newSelection.add(movieId)
    }
    setSelectedMovies(newSelection)
  }

  const handleAddMovies = async () => {
    if (selectedMovies.size === 0) {
      toast({
        title: "No Movies Selected",
        description: "Please select at least one movie to add",
      })
      return
    }

    setIsAdding(true)
    try {
      // Simulate API call to add movies to collection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const addedMovies = searchResults.filter((m) => selectedMovies.has(m.id))
      onMoviesAdded(addedMovies)

      toast({
        title: "Movies Added!",
        description: `${selectedMovies.size} ${selectedMovies.size === 1 ? "movie" : "movies"} added to "${collectionTitle}"`,
      })

      onClose()
    } catch (error) {
      console.error("Failed to add movies:", error)
      toast({
        title: "Add Failed",
        description: "Failed to add movies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-[#282828] border border-[#3A3A3A] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#3A3A3A]">
            <div>
              <h2 className="text-2xl font-inter font-bold text-[#E0E0E0]">Add Movies</h2>
              <p className="text-sm text-[#A0A0A0] font-dm-sans mt-1">
                Search and add movies to "{collectionTitle}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-[#3A3A3A]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
              <Input
                type="text"
                placeholder="Search movies by title, genre, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1A1A1A] border-[#3A3A3A] text-[#E0E0E0] placeholder-[#A0A0A0]"
              />
            </div>
            {selectedMovies.size > 0 && (
              <p className="text-sm text-[#00BFFF] mt-2">
                {selectedMovies.size} {selectedMovies.size === 1 ? "movie" : "movies"} selected
              </p>
            )}
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto p-6">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#00BFFF] animate-spin mb-4" />
                <p className="text-[#A0A0A0] font-dm-sans">Searching movies...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Search className="w-16 h-16 text-[#3A3A3A] mb-4" />
                <p className="text-[#A0A0A0] font-dm-sans text-lg mb-2">
                  {searchQuery ? "No movies found" : "Start typing to search"}
                </p>
                <p className="text-[#A0A0A0] font-dm-sans text-sm">
                  {searchQuery ? "Try a different search term" : "Search by title, genre, or year"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {searchResults.map((movie) => {
                    const isSelected = selectedMovies.has(movie.id)
                    return (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`bg-[#1A1A1A] border ${
                          isSelected ? "border-[#00BFFF]" : "border-[#3A3A3A]"
                        } rounded-lg overflow-hidden hover:border-[#00BFFF] transition-all duration-200 cursor-pointer`}
                        onClick={() => toggleMovieSelection(movie.id)}
                      >
                        <div className="flex gap-4 p-4">
                          {/* Poster */}
                          <div className="relative w-20 h-28 flex-shrink-0">
                            <Image
                              src={movie.poster || "/placeholder.svg"}
                              alt={movie.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-[#00BFFF]/20 flex items-center justify-center rounded-lg">
                                <div className="bg-[#00BFFF] rounded-full p-1">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-inter font-semibold text-[#E0E0E0] text-lg line-clamp-1">
                              {movie.title}
                            </h3>
                            <p className="text-[#A0A0A0] font-dm-sans text-sm mb-2">{movie.year}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {movie.genres.slice(0, 2).map((genre) => (
                                <Badge
                                  key={genre}
                                  variant="secondary"
                                  className="bg-[#3A3A3A] text-[#E0E0E0] text-xs"
                                >
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                            {movie.rating && (
                              <p className="text-[#00BFFF] font-dm-sans text-sm">★ {movie.rating}</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#3A3A3A]">
            <Button variant="outline" onClick={onClose} className="border-[#3A3A3A] text-[#E0E0E0]">
              Cancel
            </Button>
            <Button
              onClick={handleAddMovies}
              disabled={selectedMovies.size === 0 || isAdding}
              className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white disabled:opacity-50"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {selectedMovies.size > 0 ? `${selectedMovies.size} ` : ""}
                  {selectedMovies.size === 1 ? "Movie" : "Movies"}
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

