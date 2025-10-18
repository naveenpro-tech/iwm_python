"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, MessageCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Review } from "./types"
import { formatDate } from "@/lib/utils"

interface ReviewListItemProps {
  review: Review
}

export function ReviewListItem({ review }: ReviewListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null)

  // Truncate review text if needed
  const shouldTruncate = review.content.length > 300
  const truncatedContent = shouldTruncate && !isExpanded ? `${review.content.substring(0, 300)}...` : review.content

  // Handle helpful/unhelpful votes
  const handleHelpfulVote = (helpful: boolean) => {
    setIsHelpful(helpful)
    // In a real app, this would send the vote to the server
  }

  return (
    <motion.div
      className="bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-lg overflow-hidden hover:border-siddu-border-hover transition-all duration-300"
      whileHover={{ y: -2, boxShadow: "0 8px 20px -12px rgba(0, 0, 0, 0.5)" }}
    >
      <div className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Movie Poster and Info */}
          <div className="flex-shrink-0">
            <Link href={`/movies/${review.movie.id}`} className="block">
              <div className="relative w-full md:w-24 h-36 rounded overflow-hidden">
                <Image
                  src={review.movie.posterUrl || "/placeholder.svg"}
                  alt={review.movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          </div>

          {/* Review Content */}
          <div className="flex-1">
            {/* Movie Title and Year */}
            <Link href={`/movies/${review.movie.id}`} className="block mb-2">
              <h3 className="text-base font-medium hover:text-siddu-electric-blue transition-colors">
                {review.movie.title} <span className="text-siddu-text-subtle">({review.movie.year})</span>
              </h3>
            </Link>

            {/* Review Header */}
            <div className="flex items-center mb-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
                <Image
                  src={review.author.avatarUrl || "/placeholder.svg"}
                  alt={review.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium">{review.author.name}</p>
                  {review.isVerified && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-siddu-verified-green/20 text-siddu-verified-green border-siddu-verified-green/30 text-[10px] px-1 py-0 h-4"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-siddu-text-subtle">{formatDate(review.date)}</p>
              </div>
              <div className="flex items-center bg-siddu-bg-card px-2 py-1 rounded">
                <span className="text-lg font-bold text-siddu-accent-yellow">{review.rating.toFixed(1)}</span>
                <span className="text-xs text-siddu-text-subtle ml-1">/10</span>
              </div>
            </div>

            {/* Review Title */}
            <h4 className="text-lg font-medium mb-2">{review.title}</h4>

            {/* Review Content */}
            {review.hasSpoilers && !isExpanded ? (
              <div className="relative">
                <div className="absolute inset-0 bg-siddu-bg-card-dark bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setIsExpanded(true)}
                  >
                    <AlertTriangle size={14} className="text-siddu-warning-amber" />
                    <span>Contains Spoilers - Reveal</span>
                  </Button>
                </div>
                <p className="text-sm text-siddu-text-subtle blur-sm">{truncatedContent}</p>
              </div>
            ) : (
              <p className="text-sm text-siddu-text-subtle">{truncatedContent}</p>
            )}

            {shouldTruncate && !review.hasSpoilers && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 p-0 h-auto text-siddu-electric-blue flex items-center"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} className="mr-1" /> Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1" /> Read more
                  </>
                )}
              </Button>
            )}

            {/* Review Footer */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  className={`flex items-center text-xs ${isHelpful === true ? "text-siddu-electric-blue" : "text-siddu-text-subtle hover:text-siddu-text-light"}`}
                  onClick={() => handleHelpfulVote(true)}
                  aria-label="Mark as helpful"
                >
                  <ThumbsUp size={14} className="mr-1" />
                  <span>{isHelpful === true ? review.helpfulVotes + 1 : review.helpfulVotes}</span>
                </button>
                <button
                  className={`flex items-center text-xs ${isHelpful === false ? "text-siddu-electric-blue" : "text-siddu-text-subtle hover:text-siddu-text-light"}`}
                  onClick={() => handleHelpfulVote(false)}
                  aria-label="Mark as unhelpful"
                >
                  <ThumbsDown size={14} className="mr-1" />
                  <span>{isHelpful === false ? review.unhelpfulVotes + 1 : review.unhelpfulVotes}</span>
                </button>
              </div>
              <Link
                href={`/reviews/${review.id}`}
                className="flex items-center text-xs text-siddu-text-subtle hover:text-siddu-text-light"
              >
                <MessageCircle size={14} className="mr-1" />
                <span>{review.commentCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
