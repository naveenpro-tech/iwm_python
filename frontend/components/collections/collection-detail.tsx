"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart, Share2, Plus, Grid3X3, List, Film, User, Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CollectionDetailSkeleton } from "./collection-detail-skeleton"
import { MovieGrid } from "@/components/movies/movie-grid"
import { MovieList } from "@/components/movies/movie-list"
import { AddMoviesModal } from "./add-movies-modal"
import { getCollection, likeCollection, importCollection } from "@/lib/api/collections"
import { getCurrentUser } from "@/lib/auth"
import type { Collection } from "./types"

interface CollectionDetailProps {
  id: string
}

export function CollectionDetail({ id }: CollectionDetailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [collection, setCollection] = useState<Collection | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLiked, setIsLiked] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [showAddMoviesModal, setShowAddMoviesModal] = useState(false)
  const { toast } = useToast()

  // Sanitize poster URL - handle malformed JSON strings from database
  const sanitizePosterUrl = (url: string | null | undefined): string => {
    if (!url) return ""

    if (typeof url === 'string' && url.includes('"')) {
      const urlMatch = url.match(/["']([^"']+\.(jpg|jpeg|png|webp|gif|svg))["']/i)
      if (urlMatch) {
        const extractedUrl = urlMatch[1]
        if (extractedUrl.startsWith('http://') || extractedUrl.startsWith('https://')) {
          return extractedUrl
        }
        if (extractedUrl.startsWith('/') && !extractedUrl.startsWith('/mnt') && !extractedUrl.startsWith('/tmp')) {
          return extractedUrl
        }
        return ""
      }

      const httpMatch = url.match(/(https?:\/\/[^\s"']+)/i)
      if (httpMatch) return httpMatch[1]

      return ""
    }

    if (url.startsWith('/mnt') || url.startsWith('/tmp')) {
      return ""
    }

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
      return url
    }

    return ""
  }

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.log("User not logged in")
        setCurrentUser(null)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true)
      try {
        const data = await getCollection(id)
        console.log("Raw collection data from API:", data)

        // Transform backend movies data to frontend Movie type
        // Backend returns: { poster: "url", ... }
        // Frontend expects: { posterUrl: "url", ... }
        const transformedMovies = (data.movies || []).map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          posterUrl: sanitizePosterUrl(movie.poster || movie.posterUrl), // Sanitize malformed URLs
          year: movie.year ? String(movie.year) : "",
          genres: movie.genres || [],
          sidduScore: movie.rating || movie.sidduScore,
        }))

        console.log(`Collection "${data.title}": ${transformedMovies.length} movies transformed`)
        console.log("First movie:", transformedMovies[0])

        // Transform backend data to frontend Collection type
        const transformedCollection: Collection = {
          id: data.id,
          title: data.title,
          description: data.description || "",
          creator: data.creator,
          movieCount: data.movieCount || 0,
          followers: data.followers || 0,
          posterImages: (data.posterImages || []).map((url: string) => sanitizePosterUrl(url)).filter((url: string) => url !== ""),
          isPublic: data.isPublic,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          tags: data.tags || [],
          movies: transformedMovies, // Use transformed movies
          // Computed/display fields for component compatibility
          curator: data.creator,
          moviesCount: data.movieCount || 0,
          likesCount: data.followers || 0,
          lastUpdated: data.updatedAt || data.createdAt,
          isOfficial: false,  // Not in backend yet
          isPrivate: !data.isPublic,
        }

        console.log("Transformed collection:", transformedCollection)
        setCollection(transformedCollection)

        // Check if current user is the owner
        if (currentUser && data.creator === currentUser.username) {
          setIsOwner(true)
        }
      } catch (error) {
        console.error("Failed to fetch collection:", error)
        setCollection(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollection()
  }, [id, currentUser])

  const handleLike = async () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to like this collection",
        variant: "destructive",
      })
      return
    }

    // Optimistic UI update
    const previousLiked = isLiked
    const previousCount = collection?.likesCount || 0

    setIsLiked(!isLiked)
    if (collection) {
      setCollection({
        ...collection,
        likesCount: isLiked ? collection.likesCount - 1 : collection.likesCount + 1,
      })
    }

    try {
      const result = await likeCollection(id)

      // Update based on server response
      setIsLiked(result.liked)

      toast({
        title: result.liked ? "Collection Liked!" : "Collection Unliked",
        description: result.liked
          ? "Added to your liked collections"
          : "Removed from your liked collections",
      })
    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked)
      if (collection) {
        setCollection({
          ...collection,
          likesCount: previousCount,
        })
      }

      console.error("Failed to like collection:", error)
      toast({
        title: "Action Failed",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      // Generate shareable URL (use current URL for direct import)
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      const shareUrl = `${baseUrl}/collections/${id}`

      if (navigator.share) {
        await navigator.share({ title: collection?.title || "Collection", url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Link copied!", description: "Share this link to let others import this collection" })
      }
    } catch (err) {
      // Fallback to clipboard on error
      try {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
        const shareUrl = `${baseUrl}/collections/${id}`
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Link copied!", description: "Share this link to let others import this collection" })
      } catch {
        toast({ title: "Share failed", description: "Unable to share right now", variant: "destructive" })
      }
    }
  }

  const handleImportCollection = async () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to import this collection",
        variant: "destructive",
      })
      return
    }

    if (isOwner) {
      toast({
        title: "Already Yours",
        description: "You already own this collection",
      })
      return
    }

    try {
      // Call the real import API
      const result = await importCollection(id)

      toast({
        title: "Collection Imported!",
        description: `"${collection?.title}" has been added to your collections`,
      })
    } catch (error: any) {
      console.error("Failed to import collection:", error)
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import collection. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <CollectionDetailSkeleton />
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#E0E0E0] flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
          <p className="mb-6">The collection you're looking for doesn't exist or has been removed.</p>
          <Link href="/collections">
            <Button className="bg-[#6e4bbd] hover:bg-[#5d3ba9] text-white">Back to Collections</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-[#121212] text-[#E0E0E0]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#20124d] to-[#121212]">
        <div className="absolute inset-0 bg-[url('/abstract-pattern-purple.png')] opacity-10 mix-blend-overlay"></div>

        {/* Collection Header */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Link href="/collections" className="inline-flex items-center text-[#A0A0A0] hover:text-white mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Collections
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Poster */}
            <div className="md:col-span-1">
              <motion.div
                className="aspect-[2/3] relative rounded-lg overflow-hidden border border-[#333333]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={sanitizePosterUrl(collection.posterImages?.[0]) || "/placeholder.svg"}
                  alt={collection.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </motion.div>
            </div>

            {/* Collection Info */}
            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                {collection.isOfficial && <Badge className="bg-[#6e4bbd] text-white border-none">Official</Badge>}
                {collection.isPrivate && (
                  <Badge variant="outline" className="border-[#333333] text-[#A0A0A0]">
                    Private
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{collection.title}</h1>

              <p className="text-[#B0B0B0] mb-6 max-w-3xl">{collection.description}</p>

              <div className="flex flex-wrap gap-6 mb-6 text-sm text-[#A0A0A0]">
                <div className="flex items-center">
                  <Film className="w-4 h-4 mr-2 text-[#9671e3]" />
                  <span>
                    {collection.moviesCount} {collection.moviesCount === 1 ? "film" : "films"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? "fill-[#9671e3] text-[#9671e3]" : "text-[#9671e3]"}`} />
                  <span>
                    {collection.likesCount} {collection.likesCount === 1 ? "like" : "likes"}
                  </span>
                </div>

                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-[#9671e3]" />
                  <span>
                    Created by <span className="text-white">{collection.curator}</span>
                  </span>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-[#9671e3]" />
                  <span>Updated {new Date(collection.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Show Import button for non-owners */}
                {!isOwner && currentUser && (
                  <Button
                    className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white"
                    onClick={handleImportCollection}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Import This Collection
                  </Button>
                )}

                <Button
                  className={`${isLiked
                    ? "bg-[#6e4bbd] hover:bg-[#5d3ba9]"
                    : "bg-[#2A2A2A] hover:bg-[#333333] border border-[#333333]"
                    } text-white`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-white" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>

                <Button variant="outline" className="border-[#333333] text-white hover:bg-[#333333]" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                {/* Show Add Films button only for owners */}
                {isOwner && (
                  <Button
                    variant="outline"
                    className="border-[#333333] text-white hover:bg-[#333333]"
                    onClick={() => setShowAddMoviesModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Films
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Collection Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="movies" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-[#1E1E1E] p-1">
              <TabsTrigger value="movies" className="data-[state=active]:bg-[#6e4bbd] data-[state=active]:text-white">
                Movies
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-[#6e4bbd] data-[state=active]:text-white">
                Notes
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-[#6e4bbd] data-[state=active]:text-white">
                Activity
              </TabsTrigger>
            </TabsList>

            <div className="flex border border-[#333333] rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === "grid" ? "bg-[#6e4bbd] text-white" : "bg-[#1E1E1E] text-[#A0A0A0] hover:text-white"
                  }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === "list" ? "bg-[#6e4bbd] text-white" : "bg-[#1E1E1E] text-[#A0A0A0] hover:text-white"
                  }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="movies" className="mt-0">
            {collection.movies && collection.movies.length > 0 ? (
              viewMode === "grid" ? (
                <MovieGrid movies={collection.movies} />
              ) : (
                <MovieList movies={collection.movies} />
              )
            ) : (
              <div className="bg-[#1E1E1E] border border-dashed border-[#333333] rounded-lg p-8 text-center">
                <Film className="h-12 w-12 text-[#6e4bbd] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Movies Yet</h3>
                <p className="text-[#A0A0A0] max-w-md mx-auto mb-6">
                  This collection doesn't have any movies yet. Start adding your favorite films!
                </p>
                <Button className="bg-[#6e4bbd] hover:bg-[#5d3ba9] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Films
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-6">
              <p className="text-[#A0A0A0]">No notes have been added to this collection yet.</p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-0">
            <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-6">
              <p className="text-[#A0A0A0]">No recent activity for this collection.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Movies Modal */}
      <AnimatePresence>
        {showAddMoviesModal && (
          <AddMoviesModal
            collectionId={id}
            collectionTitle={collection.title}
            onClose={() => setShowAddMoviesModal(false)}
            onMoviesAdded={(movies) => {
              // Refresh collection data
              console.log("Movies added:", movies)
              setShowAddMoviesModal(false)
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
