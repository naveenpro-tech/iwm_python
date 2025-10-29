"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Grid3X3, List, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieGrid } from "@/components/movies/movie-grid"
import { MovieList } from "@/components/movies/movie-list"
import { getCollection } from "@/lib/api/collections"
import type { Collection } from "@/components/collections/types"

interface PublicCollectionPageProps {
  params: Promise<{ id: string }>
}

export default function PublicCollectionPage({ params }: PublicCollectionPageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [collection, setCollection] = useState<Collection | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (!resolvedParams) return

    const fetchCollection = async () => {
      setIsLoading(true)
      try {
        const data = await getCollection(resolvedParams.id)
        
        // Check if collection is public
        if (!data.isPublic) {
          setError("This collection is private and cannot be shared")
          setIsLoading(false)
          return
        }

        // Transform backend data to frontend Collection type
        const transformedCollection: Collection = {
          id: data.id,
          title: data.title,
          description: data.description || "",
          creator: data.creator,
          movieCount: data.movieCount || 0,
          followers: data.followers || 0,
          posterImages: data.posterImages || [],
          isPublic: data.isPublic,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          tags: data.tags || [],
          movies: data.movies || [],
          curator: data.creator,
          moviesCount: data.movieCount || 0,
          likesCount: data.followers || 0,
          lastUpdated: data.updatedAt || data.createdAt,
        }

        setCollection(transformedCollection)
      } catch (err) {
        console.error("Failed to fetch collection:", err)
        setError("Failed to load collection")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollection()
  }, [resolvedParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00BFFF]"></div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error || "Collection not found"}</h1>
          <Link href="/">
            <Button className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0f0f0f] border-b border-[#3A3A3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-[#A0A0A0] hover:text-white">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="text-4xl font-bold text-white mb-2">{collection.title}</h1>
            <p className="text-[#A0A0A0] mb-4">{collection.description}</p>

            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="secondary" className="bg-[#3A3A3A] text-[#E0E0E0]">
                {collection.movieCount} {collection.movieCount === 1 ? "movie" : "movies"}
              </Badge>
              <Badge variant="secondary" className="bg-[#3A3A3A] text-[#E0E0E0]">
                Public Collection
              </Badge>
              {collection.creator && (
                <span className="text-[#A0A0A0] text-sm">
                  Curated by <span className="text-white font-semibold">{collection.creator}</span>
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Movies</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-[#00BFFF] text-black" : "border-[#333333] text-white"}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-[#00BFFF] text-black" : "border-[#333333] text-white"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Movies */}
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
            <p className="text-[#A0A0A0] max-w-md mx-auto">This collection doesn't have any movies yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

