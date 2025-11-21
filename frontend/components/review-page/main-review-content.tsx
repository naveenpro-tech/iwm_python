"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Share2, Star, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isAuthenticated } from "@/lib/auth"

interface MainReviewContentProps {
  title?: string
  content: string
  rating: number
  isSpoiler: boolean
  engagement: {
    likes: number
    commentsCount: number
    userHasLiked: boolean
  }
  reviewId: string
}

export function MainReviewContent({
  title,
  content,
  rating,
  isSpoiler,
  engagement,
  reviewId,
}: MainReviewContentProps) {
  const [showSpoiler, setShowSpoiler] = useState(false)
  const [hasLiked, setHasLiked] = useState(engagement.userHasLiked)
  const [likesCount, setLikesCount] = useState(engagement.likes)

  const handleLike = async () => {
    if (!isAuthenticated()) {
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname)
      return
    }

    // Optimistic UI update
    setHasLiked(!hasLiked)
    setLikesCount(hasLiked ? likesCount - 1 : likesCount + 1)

    // TODO: Call API to update like status
    // try {
    //   await fetch(`/api/v1/reviews/${reviewId}/like`, { method: 'POST' })
    // } catch (error) {
    //   // Revert on error
    //   setHasLiked(hasLiked)
    //   setLikesCount(likesCount)
    // }
  }

  const handleShare = () => {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({
        title: title || "Movie Review",
        url: url,
      })
    } else {
      navigator.clipboard.writeText(url)
      // TODO: Show toast notification
      alert("Link copied to clipboard!")
    }
  }

  const scrollToComments = () => {
    const commentsSection = document.getElementById("comments-section")
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const renderStars = () => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }, (_, i) => {
          const isFilled = i < fullStars
          const isHalf = i === fullStars && hasHalfStar

          return (
            <Star
              key={i}
              className={`w-6 h-6 ${
                isFilled
                  ? "text-[#FFD700] fill-[#FFD700]"
                  : isHalf
                  ? "text-[#FFD700] fill-[#FFD700] opacity-50"
                  : "text-[#3A3A3A]"
              }`}
            />
          )
        })}
      </div>
    )
  }

  return (
    <motion.div
      className="bg-[#151515] rounded-lg border border-[#3A3A3A] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="p-6 md:p-8 space-y-6">
        {/* Rating */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-[#3A3A3A]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00BFFF] to-[#0080FF] flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-[#151515] flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-inter text-[#00BFFF]">{rating}</span>
                <span className="text-sm text-[#A0A0A0] font-dmsans">/ 10</span>
              </div>
            </div>
          </div>
          {renderStars()}
        </div>

        {/* Title */}
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]">
            {title}
          </h2>
        )}

        {/* Review Content */}
        <div className="prose prose-invert max-w-none">
          {isSpoiler && !showSpoiler ? (
            <motion.div
              className="bg-[#1A1A1A] rounded-lg p-8 text-center border-2 border-[#FF4500]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertTriangle className="w-12 h-12 text-[#FF4500] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#E0E0E0] mb-2 font-inter">
                Spoiler Warning
              </h3>
              <p className="text-[#A0A0A0] mb-6 font-dmsans">
                This review contains spoilers. Click below to reveal the content.
              </p>
              <Button
                onClick={() => setShowSpoiler(true)}
                className="bg-[#FF4500] text-white hover:bg-[#FF4500]/90"
              >
                Show Spoilers
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="text-[#E0E0E0] font-dmsans text-lg leading-relaxed whitespace-pre-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {content}
            </motion.div>
          )}
        </div>

        {/* Engagement Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-[#3A3A3A]">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasLiked
                  ? "bg-[#FF4500]/10 text-[#FF4500]"
                  : "bg-[#282828] text-[#A0A0A0] hover:text-[#FF4500]"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
              <span className="font-dmsans">{likesCount}</span>
            </motion.button>

            {/* Comment Button */}
            <motion.button
              onClick={scrollToComments}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#282828] text-[#A0A0A0] hover:text-[#00BFFF] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-dmsans">{engagement.commentsCount}</span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#282828] text-[#A0A0A0] hover:text-[#00BFFF] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
              <span className="font-dmsans hidden sm:inline">Share</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

