"use client"

import { use as usePromise, useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CriticReviewHero } from "@/components/critic/review/critic-review-hero"
import { CriticRatingDisplay } from "@/components/critic/review/critic-rating-display"
import { CriticMediaSection } from "@/components/critic/review/critic-media-section"
import { WhereToWatch } from "@/components/critic/review/where-to-watch"
import { CriticReviewEngagement } from "@/components/critic/review/critic-review-engagement"
import { CriticReviewComments } from "@/components/critic/review/critic-review-comments"
import { CriticAuthorBar } from "@/components/critic/review/critic-author-bar"
import { getApiUrl } from "@/lib/api-config"
import type { CriticReview } from "@/types/critic"

export default function CriticReviewPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>
}) {
  const { username, slug } = usePromise(params)
  const [review, setReview] = useState<CriticReview | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const apiUrl = getApiUrl()
        // Fetch review from API by username and slug
        const response = await fetch(`${apiUrl}/critic-reviews/${username}/${slug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch review")
        }

        const reviewData = await response.json()
        setReview(reviewData)

        // Fetch comments if available
        try {
          const commentsResponse = await fetch(`${apiUrl}/critic-reviews/${reviewData.id}/comments`)
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json()
            setComments(commentsData)
          }
        } catch (err) {
          console.error("Error fetching comments:", err)
        }
      } catch (err) {
        console.error("Error fetching review:", err)
        setError("Review not found")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReview()
  }, [slug, username])

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A]">
        {/* Loading Skeleton */}
        <div className="h-[70vh] min-h-[500px] bg-gradient-to-b from-[#282828] to-[#1A1A1A] animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="h-64 bg-[#282828] rounded-2xl animate-pulse" />
          <div className="h-96 bg-[#282828] rounded-xl animate-pulse" />
          <div className="h-48 bg-[#282828] rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-3xl font-bold text-[#E0E0E0] mb-4">Review Not Found</h1>
          <p className="text-[#A0A0A0] mb-6">
            {error || "The review you're looking for doesn't exist or has been removed."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/critic/${username}`}
              className="inline-flex items-center justify-center gap-2 bg-[#00BFFF] text-[#1A1A1A] px-6 py-3 rounded-lg hover:bg-[#00A3DD] transition-colors"
            >
              View Critic Profile
            </Link>
            <Link
              href="/critics"
              className="inline-flex items-center justify-center gap-2 bg-[#282828] text-[#E0E0E0] px-6 py-3 rounded-lg hover:bg-[#3A3A3A] transition-colors border border-[#3A3A3A]"
            >
              Browse All Critics
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href={`/critic/${username}`}
          className="flex items-center gap-2 bg-[#1A1A1A]/80 backdrop-blur-sm text-[#E0E0E0] px-4 py-2 rounded-lg hover:bg-[#282828] transition-colors border border-[#3A3A3A]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Profile</span>
        </Link>
      </div>

      {/* Hero Section */}
      <CriticReviewHero
        backdropUrl={review.movieBackdrop}
        movieTitle={review.movieTitle}
        movieYear={review.movieYear}
        criticUsername={review.criticUsername}
        criticName={review.criticName}
        criticAvatar={review.criticAvatar}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Rating Display */}
        <CriticRatingDisplay
          rating={review.rating}
          ratingNumeric={review.ratingNumeric}
          sidduScore={review.movieSidduScore}
          ratingBreakdown={review.ratingBreakdown}
        />

        {/* Engagement Bar */}
        <CriticReviewEngagement
          reviewId={review.id}
          likes={review.likes}
          commentCount={review.commentCount}
          viewCount={review.viewCount}
          userHasLiked={review.userHasLiked}
          userHasBookmarked={review.userHasBookmarked}
          onScrollToComments={scrollToComments}
        />

        {/* Media Section (Video + Written Content + Images) */}
        <CriticMediaSection
          youtubeVideoId={review.youtubeVideoId}
          writtenContent={review.writtenContent}
          images={review.images}
          spoilerWarning={review.spoilerWarning}
          tags={review.tags}
        />

        {/* Where to Watch */}
        <WhereToWatch platforms={review.whereToWatch} />

        {/* Author Bar */}
        <CriticAuthorBar
          criticUsername={review.criticUsername}
          criticName={review.criticName}
          criticAvatar={review.criticAvatar}
          criticVerified={review.criticVerified}
          criticFollowers={review.criticFollowers}
        />

        {/* Comments Section */}
        <div ref={commentsRef}>
          <CriticReviewComments
            reviewId={review.id}
            comments={comments}
            commentCount={review.commentCount}
          />
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  )
}

