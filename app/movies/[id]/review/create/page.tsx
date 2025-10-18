"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieReviewCreation } from "@/components/review/movie-review-creation"
import { mockMovies } from "@/components/movies/mock-data"

export default function CreateReviewPage() {
  const params = useParams()
  const router = useRouter()
  const movieId = params.id as string
  const [movie, setMovie] = useState<any>(null)

  useEffect(() => {
    // In a real app, fetch movie data from API
    const foundMovie = mockMovies.find((m) => m.id === movieId)
    if (foundMovie) {
      setMovie(foundMovie)
    }
  }, [movieId])

  if (!movie) {
    return (
      <div className="min-h-screen bg-siddu-bg-primary flex items-center justify-center">
        <div className="text-siddu-text-subtle">Loading...</div>
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
            onSubmit={(review) => {
              console.log("Review submitted:", review)
              // Handle review submission
              router.push(`/movies/${movieId}`)
            }}
            onCancel={() => router.back()}
          />
        </div>
      </motion.div>
    </div>
  )
}
