"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RelatedReview {
  id: string
  title?: string
  content: string
  rating: number
  createdAt: string
  reviewer: {
    id: string
    username: string
    avatarUrl: string
  }
}

interface RelatedReviewsSectionProps {
  movieId: string
  currentReviewId: string
}

export function RelatedReviewsSection({ movieId, currentReviewId }: RelatedReviewsSectionProps) {
  const [reviews, setReviews] = useState<RelatedReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const fetchRelatedReviews = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      const useBackend = process.env.NEXT_PUBLIC_ENABLE_BACKEND === "true" && !!apiBase

      if (!useBackend || !apiBase) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${apiBase}/api/v1/reviews?movieId=${movieId}&limit=10&sortBy=rating_desc`
        )
        if (response.ok) {
          const data = await response.json()
          // Filter out current review
          const filtered = Array.isArray(data)
            ? data.filter((r: any) => r.id !== currentReviewId).slice(0, 6)
            : []
          
          // Transform data
          const transformed = filtered.map((r: any) => ({
            id: r.id,
            title: r.title,
            content: r.content,
            rating: r.rating,
            createdAt: r.date || r.createdAt,
            reviewer: {
              id: r.author?.id || "",
              username: r.author?.name || "Anonymous",
              avatarUrl: r.author?.avatarUrl || "",
            },
          }))
          
          setReviews(transformed)
        }
      } catch (error) {
        console.error("Error fetching related reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedReviews()
  }, [movieId, currentReviewId])

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("related-reviews-container")
    if (container) {
      const scrollAmount = 400
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-[#151515] rounded-lg border border-[#3A3A3A] p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#282828] border-t-[#00BFFF] rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <motion.div
      className="bg-[#151515] rounded-lg border border-[#3A3A3A] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-inter text-[#E0E0E0]">
            More Reviews for This Movie
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-[#282828] text-[#E0E0E0] hover:bg-[#3A3A3A] transition-colors flex items-center justify-center"
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-[#282828] text-[#E0E0E0] hover:bg-[#3A3A3A] transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div
          id="related-reviews-container"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <RelatedReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function RelatedReviewCard({ review }: { review: RelatedReview }) {
  const truncatedContent =
    review.content.length > 150
      ? review.content.substring(0, 150) + "..."
      : review.content

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link
      href={`/reviews/${review.id}`}
      className="flex-shrink-0 w-80 bg-[#1A1A1A] rounded-lg border border-[#3A3A3A] hover:border-[#00BFFF] transition-all p-4 group"
    >
      {/* Rating */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-[#00BFFF] text-[#1A1A1A] rounded-full w-10 h-10 flex items-center justify-center font-bold font-inter">
            {review.rating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(review.rating / 2)
                    ? "text-[#FFD700] fill-[#FFD700]"
                    : "text-[#3A3A3A]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="text-lg font-bold font-inter text-[#E0E0E0] mb-2 group-hover:text-[#00BFFF] transition-colors line-clamp-2">
          {review.title}
        </h4>
      )}

      {/* Content Preview */}
      <p className="text-[#A0A0A0] font-dmsans text-sm mb-3 line-clamp-3">
        {truncatedContent}
      </p>

      {/* Author */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#3A3A3A]">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#3A3A3A]">
          {review.reviewer.avatarUrl ? (
            <Image
              src={review.reviewer.avatarUrl}
              alt={review.reviewer.username}
              width={32}
              height={32}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#E0E0E0] text-xs font-bold">
              {review.reviewer.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#E0E0E0] font-inter truncate">
            {review.reviewer.username}
          </p>
          <p className="text-xs text-[#A0A0A0] font-dmsans">
            {formattedDate}
          </p>
        </div>
      </div>
    </Link>
  )
}

