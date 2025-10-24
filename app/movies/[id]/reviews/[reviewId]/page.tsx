"use client"

import { use as usePromise, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CinematicHeader } from "@/components/review-page/cinematic-header"
import { ReviewerInfoBar } from "@/components/review-page/reviewer-info-bar"
import { MainReviewContent } from "@/components/review-page/main-review-content"
import { MovieContextCard } from "@/components/review-page/movie-context-card"
import { CommentsSection } from "@/components/review-page/comments-section"
import { RelatedReviewsSection } from "@/components/review-page/related-reviews-section"

interface FullReviewDTO {
  id: string
  content: string
  rating: number
  createdAt: string
  isSpoiler: boolean
  title?: string
  movie: {
    id: string
    title: string
    releaseYear: number
    posterUrl: string
    backdropUrl: string
    sidduScore: number
  }
  reviewer: {
    id: string
    username: string
    avatarUrl: string
    isVerifiedReviewer: boolean
    totalReviews: number
    followerCount: number
  }
  engagement: {
    likes: number
    commentsCount: number
    userHasLiked: boolean
  }
  comments: any[]
}

export default function MovieReviewDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string; reviewId: string }> 
}) {
  const { id: movieId, reviewId } = usePromise(params)
  const [review, setReview] = useState<FullReviewDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReview = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      const useBackend = process.env.NEXT_PUBLIC_ENABLE_BACKEND === "true" && !!apiBase

      if (!useBackend || !apiBase) {
        setError("Backend not configured")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${apiBase}/api/v1/reviews/${reviewId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch review: ${response.statusText}`)
        }
        const data = await response.json()
        
        // Verify the review belongs to this movie
        if (data.movie.id !== movieId) {
          throw new Error("Review does not belong to this movie")
        }
        
        setReview(data)
      } catch (err) {
        console.error("Error fetching review:", err)
        setError(err instanceof Error ? err.message : "Failed to load review")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReview()
  }, [reviewId, movieId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#282828] border-t-[#00BFFF] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E0E0E0] mb-4">Review Not Found</h1>
          <p className="text-[#A0A0A0] mb-6">{error || "The review you're looking for doesn't exist."}</p>
          <Link
            href={`/movies/${movieId}`}
            className="inline-flex items-center gap-2 bg-[#00BFFF] text-[#1A1A1A] px-6 py-3 rounded-lg hover:bg-[#00A3DD] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Movie
          </Link>
        </div>
      </div>
    )
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A]"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href={`/movies/${review.movie.id}`}
          className="flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-sm text-[#E0E0E0] px-4 py-2 rounded-lg hover:bg-[#282828] transition-colors border border-[#3A3A3A]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Movie</span>
        </Link>
      </div>

      {/* Cinematic Header */}
      <CinematicHeader
        backdropUrl={review.movie.backdropUrl}
        movieTitle={review.movie.title}
        releaseYear={review.movie.releaseYear}
      />

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Reviewer Info Bar */}
        <ReviewerInfoBar
          reviewer={review.reviewer}
          createdAt={review.createdAt}
        />

        {/* Main Review Content */}
        <MainReviewContent
          title={review.title}
          content={review.content}
          rating={review.rating}
          isSpoiler={review.isSpoiler}
          engagement={review.engagement}
          reviewId={review.id}
        />

        {/* Movie Context Card */}
        <MovieContextCard movie={review.movie} />

        {/* Comments Section */}
        <CommentsSection
          reviewId={review.id}
          comments={review.comments}
          commentsCount={review.engagement.commentsCount}
        />

        {/* Related Reviews */}
        <RelatedReviewsSection
          movieId={review.movie.id}
          currentReviewId={review.id}
        />
      </div>
    </motion.div>
  )
}

