"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Search, Download, Loader2, Globe, Lock, Check } from "lucide-react"
import type { UserCollection } from "@/types/profile"
import { getUserCollections } from "@/lib/api/collections"
import { useToast } from "@/hooks/use-toast"

interface ImportCollectionModalProps {
  onClose: () => void
  onImport: (collection: UserCollection) => void
  userId: string
}

export function ImportCollectionModal({
  onClose,
  onImport,
  userId,
}: ImportCollectionModalProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [publicCollections, setPublicCollections] = useState<UserCollection[]>([])
  const [filteredCollections, setFilteredCollections] = useState<UserCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState(false)
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)

  // Load public collections
  useEffect(() => {
    const loadPublicCollections = async () => {
      setIsLoading(true)
      try {
        // Fetch public collections (not owned by current user)
        const data = await getUserCollections()
        const items: any[] = Array.isArray(data) ? data : data?.items || []
        
        // Map and filter out user's own collections
        const mapped: UserCollection[] = items
          .filter((c: any) => c.isPublic !== false) // Only public collections
          .map((c: any) => {
            const movies = c.movies || []
            
            // If no movies array but posterImages exists, create movies from posterImages
            if (movies.length === 0 && c.posterImages && c.posterImages.length > 0) {
              c.posterImages.forEach((posterUrl: string, index: number) => {
                movies.push({
                  id: `movie-${index}`,
                  title: "",
                  posterUrl: posterUrl,
                  year: "",
                  genres: [],
                })
              })
            }
            
            return {
              id: c.id || c.external_id || `collection-${Math.random()}`,
              title: c.title || "Untitled",
              description: c.description || "",
              coverImage: c.coverImage || "",
              movieCount: c.movieCount ?? movies.length ?? 0,
              isPublic: c.isPublic ?? true,
              createdAt: c.createdAt || c.created_at || "",
              updatedAt: c.updatedAt || c.updated_at || "",
              movies: movies,
              tags: c.tags || [],
            }
          })
        
        setPublicCollections(mapped)
        setFilteredCollections(mapped)
      } catch (error) {
        console.error("Failed to load public collections:", error)
        toast({
          title: "Error",
          description: "Failed to load public collections",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadPublicCollections()
  }, [userId, toast])

  // Filter collections based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCollections(publicCollections)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = publicCollections.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.tags?.some((tag) => tag.toLowerCase().includes(query))
    )
    setFilteredCollections(filtered)
  }, [searchQuery, publicCollections])

  const handleImport = async (collection: UserCollection) => {
    setIsImporting(true)
    setSelectedCollectionId(collection.id)

    try {
      // Simulate API call to import collection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a copy of the collection for the user
      const importedCollection: UserCollection = {
        ...collection,
        id: `imported-${collection.id}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      onImport(importedCollection)
      
      toast({
        title: "Success",
        description: `"${collection.title}" has been imported to your collections`,
      })
      
      onClose()
    } catch (error) {
      console.error("Failed to import collection:", error)
      toast({
        title: "Error",
        description: "Failed to import collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      setSelectedCollectionId(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
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
              <h2 className="text-2xl font-inter font-bold text-[#E0E0E0]">
                Import Collection
              </h2>
              <p className="text-sm text-[#A0A0A0] font-dm-sans mt-1">
                Browse and import public collections to your profile
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-[#3A3A3A]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
              <input
                type="text"
                placeholder="Search collections by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg text-[#E0E0E0] placeholder-[#A0A0A0] font-dm-sans focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent"
              />
            </div>
          </div>

          {/* Collections List */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-[#00BFFF] animate-spin mb-4" />
                <p className="text-[#A0A0A0] font-dm-sans">Loading collections...</p>
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p className="text-[#A0A0A0] font-dm-sans text-lg mb-2">
                  {searchQuery ? "No collections found" : "No public collections available"}
                </p>
                <p className="text-[#A0A0A0] font-dm-sans text-sm">
                  {searchQuery ? "Try a different search term" : "Check back later for new collections"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCollections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-lg overflow-hidden hover:border-[#00BFFF] transition-all duration-200"
                  >
                    {/* Collection Preview */}
                    <div className="aspect-[4/3] bg-[#0f0f0f] relative overflow-hidden">
                      {collection.movies.length > 0 ? (
                        <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5">
                          {collection.movies.slice(0, 4).map((movie, index) => (
                            <div key={index} className="relative overflow-hidden bg-[#1A1A1A]">
                              {movie.posterUrl ? (
                                <img
                                  src={movie.posterUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-[#3A3A3A] text-2xl">🎬</span>
                                </div>
                              )}
                            </div>
                          ))}
                          {/* Fill empty slots */}
                          {Array.from({ length: Math.max(0, 4 - collection.movies.length) }).map((_, index) => (
                            <div
                              key={`empty-${index}`}
                              className="bg-[#1A1A1A] flex items-center justify-center"
                            >
                              <span className="text-[#3A3A3A] text-2xl">🎬</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-[#3A3A3A] text-6xl">📚</span>
                        </div>
                      )}
                    </div>

                    {/* Collection Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-inter font-semibold text-[#E0E0E0] text-lg line-clamp-1">
                          {collection.title}
                        </h3>
                        {collection.isPublic ? (
                          <Globe className="w-4 h-4 text-[#00BFFF] flex-shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-[#A0A0A0] flex-shrink-0" />
                        )}
                      </div>

                      <p className="text-[#A0A0A0] font-dm-sans text-sm line-clamp-2 mb-3">
                        {collection.description || "No description"}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[#A0A0A0] font-dm-sans text-sm">
                          {collection.movieCount} {collection.movieCount === 1 ? "movie" : "movies"}
                        </span>
                        <button
                          onClick={() => handleImport(collection)}
                          disabled={isImporting && selectedCollectionId === collection.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#00BFFF] text-white font-dm-sans text-sm font-medium rounded-lg hover:bg-[#00BFFF]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#00BFFF]"
                        >
                          {isImporting && selectedCollectionId === collection.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Importing...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Import</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

