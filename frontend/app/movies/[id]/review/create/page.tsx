"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieReviewCreation } from "@/components/review/movie-review-creation"
import { getApiUrl } from "@/lib/api-config"

export default function CreateReviewPage() {
  const params = useParams()
  const router = useRouter()
  const movieId = params.id as string
  const [movie, setMovie] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const apiBase = getApiUrl()
        console.log("Fetching movie data for review creation:", movieId)

        const response = await fetch(`${apiBase}/api/v1/movies/${movieId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch movie: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Movie data received:", data)

        // Transform backend data to match expected format
        const movieData = {
          id: data.external_id || data.id,
          title: data.title,
          posterUrl: data.poster_url,
          year: data.release_date ? new Date(data.release_date).getFullYear().toString() : "N/A",
          genres: data.genres || [],
          sidduScore: data.siddu_score || 0,
          director: data.director || "Unknown",
          runtime: data.runtime || "N/A",
        }

        setMovie(movieData)
      } catch (err) {
        console.error("Error fetching movie:", err)
        setError(err instanceof Error ? err.message : "Failed to load movie")
      } finally {
        setIsLoading(false)
      }
    }

    if (movieId) {
      fetchMovie()
    }
  }, [movieId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-siddu-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#00BFFF] border-r-transparent"></div>
          <div className="text-siddu-text-subtle">Loading movie data...</div>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-siddu-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="text-red-500 text-xl">⚠️</div>
          <div className="text-siddu-text-light font-semibold">Failed to Load Movie</div>
          <div className="text-siddu-text-subtle">{error || "Movie not found"}</div>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-siddu-bg-primary">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-siddu-text-subtle hover:text-siddu-text-light"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Movie
        </Button>

        <div className="max-w-4xl mx-auto">
          <MovieReviewCreation
            movie={movie}
            onCancel={() => router.back()}
          />
        </div>
      </motion.div>
    </div>
  )
}
