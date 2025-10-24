"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CriticReview {
  id: string
  criticUsername: string
  criticName: string
  criticAvatar: string
  criticVerified: boolean
  rating: string
  ratingNumeric: number
  excerpt: string
  slug: string
}

interface VerifiedCriticReviewsSectionProps {
  movieId: string
}

export function VerifiedCriticReviewsSection({ movieId }: VerifiedCriticReviewsSectionProps) {
  const [reviews, setReviews] = useState<CriticReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchCriticReviews = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      const useBackend = process.env.NEXT_PUBLIC_ENABLE_BACKEND === "true" && !!apiBase

      try {
        if (useBackend && apiBase) {
          const response = await fetch(`${apiBase}/api/v1/critic-reviews?movieId=${movieId}&limit=10`)
          if (response.ok) {
            const data = await response.json()
            setReviews(data.items || data || [])
          } else {
            throw new Error("Failed to fetch")
          }
        } else {
          throw new Error("Backend not configured")
        }
      } catch (err) {
        console.warn("Using mock critic reviews:", err)
        // Mock data
        setReviews([
          {
            id: "cr-1",
            criticUsername: "siddu",
            criticName: "Siddu Kumar",
            criticAvatar: "/critic-avatar-1.png",
            criticVerified: true,
            rating: "A+",
            ratingNumeric: 9.5,
            excerpt: "A timeless masterpiece that transcends the boundaries of cinema. Shawshank Redemption is a profound meditation on hope, friendship, and the human spirit.",
            slug: "the-shawshank-redemption-1994",
          },
          {
            id: "cr-2",
            criticUsername: "rajesh_cinema",
            criticName: "Rajesh Menon",
            criticAvatar: "/critic-avatar-2.png",
            criticVerified: true,
            rating: "A",
            ratingNumeric: 9.0,
            excerpt: "Exceptional storytelling combined with stellar performances. This film stands as a testament to the power of redemption and perseverance.",
            slug: "the-shawshank-redemption-1994",
          },
          {
            id: "cr-3",
            criticUsername: "priya_reviews",
            criticName: "Priya Sharma",
            criticAvatar: "/critic-avatar-3.png",
            criticVerified: true,
            rating: "A+",
            ratingNumeric: 9.8,
            excerpt: "One of the greatest films ever made. The emotional depth and narrative brilliance make this an unforgettable cinematic experience.",
            slug: "the-shawshank-redemption-1994",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCriticReviews()
  }, [movieId])

  const visibleReviews = 3
  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < reviews.length - visibleReviews

  const scrollLeft = () => {
    if (canScrollLeft) setCurrentIndex(currentIndex - 1)
  }

  const scrollRight = () => {
    if (canScrollRight) setCurrentIndex(currentIndex + 1)
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-8 w-48 bg-[#282828] rounded" />
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return null // Don't show section if no critic reviews
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="py-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#00BFFF]" />
          <h2 className="text-3xl font-bold font-inter text-[#E0E0E0]">Verified Critic Reviews</h2>
        </div>
        <Link href={`/movies/${movieId}/reviews?filter=critic`}>
          <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#282828]">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-[#00BFFF] rounded-full flex items-center justify-center hover:bg-[#00A3DD] transition-colors shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-[#1A1A1A]" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-[#00BFFF] rounded-full flex items-center justify-center hover:bg-[#00A3DD] transition-colors shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-[#1A1A1A]" />
          </button>
        )}

        {/* Reviews Grid */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: -currentIndex * (100 / visibleReviews) + "%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {reviews.map((review, index) => (
              <CriticReviewCard key={review.id} review={review} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function CriticReviewCard({ review, index }: { review: CriticReview; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
      className="min-w-[calc(33.333%-1rem)] flex-shrink-0"
    >
      <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-[#3A3A3A] hover:border-[#00BFFF] transition-all h-full">
        <CardContent className="pt-6">
          {/* Critic Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-[#00BFFF]"
                style={{ backgroundImage: `url(${review.criticAvatar})` }}
              />
              {review.criticVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00BFFF] rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#1A1A1A]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <Link
                href={`/critic/${review.criticUsername}`}
                className="font-bold text-[#E0E0E0] hover:text-[#00BFFF] transition-colors"
              >
                {review.criticName}
              </Link>
              <p className="text-xs text-[#A0A0A0]">@{review.criticUsername}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 bg-[#00BFFF]/10 border border-[#00BFFF]/30 rounded-lg px-3 py-2">
              <span className="text-2xl font-bold text-[#00BFFF]">{review.rating}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(review.ratingNumeric / 2) ? "fill-[#FFD700] text-[#FFD700]" : "text-[#3A3A3A]"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-sm text-[#A0A0A0] mb-4 line-clamp-4">{review.excerpt}</p>

          {/* Read Full Review Link */}
          <Link href={`/critic/${review.criticUsername}/review/${review.slug}`}>
            <Button variant="outline" className="w-full border-[#3A3A3A] text-[#00BFFF] hover:bg-[#00BFFF]/10">
              Read Full Review
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

