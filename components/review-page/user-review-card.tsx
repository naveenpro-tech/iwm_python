"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ThumbsUp, ThumbsDown, MessageCircle, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UserReviewCardProps } from "@/types/review-page"

export default function UserReviewCard({
  review,
  isCurrentUser,
  onHelpfulClick,
  onUnhelpfulClick,
}: UserReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSpoilerRevealed, setIsSpoilerRevealed] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count)
  const [unhelpfulCount, setUnhelpfulCount] = useState(review.unhelpful_count)
  const [userVote, setUserVote] = useState<"helpful" | "unhelpful" | null>(review.user_vote || null)

  const handleHelpfulClick = () => {
    if (userVote === "helpful") {
      setHelpfulCount(helpfulCount - 1)
      setUserVote(null)
    } else {
      if (userVote === "unhelpful") {
        setUnhelpfulCount(unhelpfulCount - 1)
      }
      setHelpfulCount(helpfulCount + 1)
      setUserVote("helpful")
    }
    onHelpfulClick(review.id)
  }

  const handleUnhelpfulClick = () => {
    if (userVote === "unhelpful") {
      setUnhelpfulCount(unhelpfulCount - 1)
      setUserVote(null)
    } else {
      if (userVote === "helpful") {
        setHelpfulCount(helpfulCount - 1)
      }
      setUnhelpfulCount(unhelpfulCount + 1)
      setUserVote("unhelpful")
    }
    onUnhelpfulClick(review.id)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-[#FFD700] fill-[#FFD700]" : "text-[#3A3A3A]"
        }`}
      />
    ))
  }

  const shouldTruncate = review.content.length > 300
  const displayContent = isExpanded || !shouldTruncate ? review.content : review.content.slice(0, 300) + "..."

  return (
    <div
      className={`bg-[#282828] rounded-lg border ${
        isCurrentUser ? "border-[#00BFFF] shadow-[0_0_15px_rgba(0,191,255,0.2)]" : "border-[#3A3A3A]"
      } p-6 transition-all duration-200`}
    >
      {/* User Info & Rating */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={review.user.avatar_url}
            alt={review.user.display_name}
            className="w-12 h-12 rounded-full border-2 border-[#3A3A3A]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-[#E0E0E0] font-inter">
                {review.user.display_name}
              </h4>
              {review.user.is_verified && (
                <CheckCircle2 className="w-4 h-4 text-[#00BFFF]" />
              )}
              {isCurrentUser && (
                <span className="px-2 py-0.5 rounded-full bg-[#00BFFF]/20 border border-[#00BFFF]/50 text-[#00BFFF] text-xs font-semibold">
                  Your Review
                </span>
              )}
            </div>
            <p className="text-sm text-[#A0A0A0]">@{review.user.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
      </div>

      {/* Spoiler Warning */}
      {review.contains_spoilers && !isSpoilerRevealed && (
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-md bg-[#1A1A1A]/80 rounded-lg flex flex-col items-center justify-center z-10 p-6">
              <AlertTriangle className="w-12 h-12 text-[#F59E0B] mb-3" />
              <h4 className="text-lg font-semibold text-[#E0E0E0] font-inter mb-2">
                Contains Spoilers
              </h4>
              <p className="text-sm text-[#A0A0A0] text-center mb-4">
                This review contains spoilers. Click to reveal.
              </p>
              <Button
                onClick={() => setIsSpoilerRevealed(true)}
                className="bg-[#F59E0B] text-[#1A1A1A] hover:bg-[#D97706] font-semibold"
              >
                Reveal Spoilers
              </Button>
            </div>
            <div className="blur-sm select-none pointer-events-none">
              <p className="text-sm text-[#E0E0E0] leading-relaxed">{displayContent}</p>
            </div>
          </div>
        </div>
      )}

      {/* Review Content */}
      {(!review.contains_spoilers || isSpoilerRevealed) && (
        <div className="mb-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-[#E0E0E0] leading-relaxed whitespace-pre-wrap"
            >
              {displayContent}
            </motion.p>
          </AnimatePresence>

          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-[#00BFFF] hover:text-[#00BFFF] hover:bg-[#00BFFF]/10 p-0 h-auto"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Read More
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Footer: Timestamp & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#3A3A3A]">
        <div className="text-xs text-[#A0A0A0]">
          {new Date(review.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>

        <div className="flex items-center gap-4">
          {/* Helpful Button */}
          <button
            onClick={handleHelpfulClick}
            className={`flex items-center gap-1 text-sm ${
              userVote === "helpful" ? "text-[#10B981]" : "text-[#A0A0A0]"
            } hover:text-[#10B981] transition-colors`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{helpfulCount}</span>
          </button>

          {/* Unhelpful Button */}
          <button
            onClick={handleUnhelpfulClick}
            className={`flex items-center gap-1 text-sm ${
              userVote === "unhelpful" ? "text-[#EF4444]" : "text-[#A0A0A0]"
            } hover:text-[#EF4444] transition-colors`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{unhelpfulCount}</span>
          </button>

          {/* Comments */}
          <div className="flex items-center gap-1 text-sm text-[#A0A0A0]">
            <MessageCircle className="w-4 h-4" />
            <span>{review.comment_count}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

