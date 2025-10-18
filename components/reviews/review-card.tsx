"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, MessageCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Review } from "./types"
import { formatDate } from "@/lib/utils"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null)

  // Truncate review text if needed
  const shouldTruncate = review.content.length > 200
  const truncatedContent = shouldTruncate && !isExpanded ? `${review.content.substring(0, 200)}...` : review.content

  // Handle helpful/unhelpful votes
  const handleHelpfulVote = (helpful: boolean) => {
    setIsHelpful(helpful)
    // In a real app, this would send the vote to the server
  }

  return (
    <motion.div
      className="bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-lg overflow-hidden hover:border-siddu-border-hover transition-all duration-300"
      whileHover={{ y: -4, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)" }}
    >
      {/* Movie Context Bar */}
      <Link href={`/movies/${review.movie.id}`} className="block">
        <div className="flex items-center p-3 bg-gradient-to-r from-siddu-bg-card to-siddu-bg-card-dark border-b border-siddu-border-subtle">
          <div className="relative w-10 h-15 mr-3 rounded overflow-hidden">
            <Image
              src={review.movie.posterUrl || "/placeholder.svg"}
              alt={review.movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium line-clamp-1">{review.movie.title}</h3>
            <p className="text-xs text-siddu-text-subtle">{review.movie.year}</p>
          </div>
        </div>
      </Link>

      {/* Review Header */}
      <div className="p-4 pb-2">
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
        <h4 className="text-base font-medium mb-2">{review.title}</h4>
      </div>

      {/* Review Content */}
      <div className="px-4 pb-3">
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
            variant="link"
            size="sm"
            className="mt-1 p-0 h-auto text-siddu-electric-blue"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        )}
      </div>

      {/* Review Footer */}
      <div className="px-4 py-3 border-t border-siddu-border-subtle flex items-center justify-between">
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
    </motion.div>
  )
}
