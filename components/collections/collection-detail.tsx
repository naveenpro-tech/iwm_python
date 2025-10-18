"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Heart, Share2, Plus, Grid3X3, List, Film, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollectionDetailSkeleton } from "./collection-detail-skeleton"
import { MovieGrid } from "@/components/movies/movie-grid"
import { MovieList } from "@/components/movies/movie-list"
import { mockFeaturedCollections, mockPopularCollections, mockUserCollections } from "./mock-data"
import { getMovieMockData } from "@/components/movies/mock-data"
import type { Collection } from "./types"

interface CollectionDetailProps {
  id: string
}

export function CollectionDetail({ id }: CollectionDetailProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [collection, setCollection] = useState<Collection | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // Simulate API fetch with delay
    const timer = setTimeout(() => {
      // Find the collection from mock data based on id
      const foundCollection = [...mockFeaturedCollections, ...mockPopularCollections, ...mockUserCollections].find(
        (c) => c.id === id,
      )

      if (foundCollection) {
        // Add mock movies data to the collection
        const collectionWithMovies = {
          ...foundCollection,
          movies: getMovieMockData().slice(0, foundCollection.moviesCount),
        }
        setCollection(collectionWithMovies)
      }

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (collection) {
      // Increment or decrement like count based on action
      setCollection({
        ...collection,
        likesCount: isLiked ? collection.likesCount - 1 : collection.likesCount + 1,
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
                  src={collection.posterUrls[0] || "/placeholder.svg"}
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
                <Button
                  className={`${
                    isLiked
                      ? "bg-[#6e4bbd] hover:bg-[#5d3ba9]"
                      : "bg-[#2A2A2A] hover:bg-[#333333] border border-[#333333]"
                  } text-white`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-white" : ""}`} />
                  {isLiked ? "Liked" : "Like"}
                </Button>

                <Button variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                <Button variant="outline" className="border-[#333333] text-white hover:bg-[#333333]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Films
                </Button>
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
                className={`rounded-none ${
                  viewMode === "grid" ? "bg-[#6e4bbd] text-white" : "bg-[#1E1E1E] text-[#A0A0A0] hover:text-white"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${
                  viewMode === "list" ? "bg-[#6e4bbd] text-white" : "bg-[#1E1E1E] text-[#A0A0A0] hover:text-white"
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
    </motion.div>
  )
}
