"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Star, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Review {
  id: string
  movieId: string
  movieTitle: string
  moviePosterUrl: string
  rating: number
  content: string
  date: string
}

interface RecentReviewsSectionProps {
  userId: string
}

export function RecentReviewsSection({ userId }: RecentReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch recent reviews
    const fetchReviews = async () => {
      setIsLoading(true)

      // Mock data - in a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockReviews: Review[] = [
        {
          id: "r1",
          movieId: "m1",
          movieTitle: "Dune: Part Two",
          moviePosterUrl: "/dune-part-two-poster.png",
          rating: 9,
          content: "Denis Villeneuve has outdone himself with this epic conclusion...",
          date: "2 hours ago",
        },
        {
          id: "r2",
          movieId: "m3",
          movieTitle: "Oppenheimer",
          moviePosterUrl: "/oppenheimer-inspired-poster.png",
          rating: 10,
          content: "Christopher Nolan's masterpiece. The performances are incredible...",
          date: "3 days ago",
        },
      ]

      setReviews(mockReviews)
      setIsLoading(false)
    }

    fetchReviews()
  }, [userId])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="bg-[#282828] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-inter font-medium text-[#E0E0E0]">Recent Reviews</h2>
        <Link href="/profile/reviews" className="text-[#00BFFF] font-dmsans text-sm flex items-center hover:underline">
          View all
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#00BFFF] animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-[#A0A0A0] font-dmsans text-center py-6">No reviews yet</p>
      ) : (
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
          {reviews.map((review) => (
            <motion.div key={review.id} className="bg-[#1A1A1A] rounded-lg p-3" variants={itemVariants}>
              <div className="flex">
                <Link href={`/movies/${review.movieId}`} className="flex-shrink-0 mr-3">
                  <div className="w-12 h-16 rounded overflow-hidden">
                    <Image
                      src={review.moviePosterUrl || "/placeholder.svg"}
                      alt={review.movieTitle}
                      width={48}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/movies/${review.movieId}`}>
                    <h3 className="font-inter font-medium text-[#E0E0E0] hover:text-[#00BFFF] transition-colors truncate">
                      {review.movieTitle}
                    </h3>
                  </Link>

                  <div className="flex items-center mt-1 mb-2">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? "text-[#FFD700] fill-[#FFD700]" : "text-[#3A3A3A]"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-[#A0A0A0] text-xs">{review.date}</span>
                  </div>

                  <p className="text-[#A0A0A0] text-sm font-dmsans line-clamp-2">{review.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
