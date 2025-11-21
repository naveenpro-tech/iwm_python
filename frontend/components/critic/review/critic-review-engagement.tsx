"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface CriticReviewEngagementProps {
  reviewId: string
  likes: number
  commentCount: number
  viewCount: number
  userHasLiked: boolean
  userHasBookmarked: boolean
  onScrollToComments: () => void
}

export function CriticReviewEngagement({
  reviewId,
  likes,
  commentCount,
  viewCount,
  userHasLiked: initialLiked,
  userHasBookmarked: initialBookmarked,
  onScrollToComments,
}: CriticReviewEngagementProps) {
  const router = useRouter()
  const [hasLiked, setHasLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [hasBookmarked, setHasBookmarked] = useState(initialBookmarked)
  const [showParticles, setShowParticles] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleLike = async () => {
    // Check authentication (mock)
    const isAuthenticated = false // Replace with actual auth check
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Optimistic update
    setHasLiked(!hasLiked)
    setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1)

    // Particle burst animation
    if (!hasLiked) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 600)
    }

    // API call would go here
    try {
      // await fetch(`/api/v1/critic-reviews/${reviewId}/like`, { method: hasLiked ? "DELETE" : "POST" })
    } catch (err) {
      // Revert on error
      setHasLiked(hasLiked)
      setLikeCount(likeCount)
    }
  }

  const handleBookmark = async () => {
    const isAuthenticated = false
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setHasBookmarked(!hasBookmarked)
    // API call would go here
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    // Show toast notification
    setShowShareModal(false)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.5 }}
        className="sticky top-20 z-40 bg-[#1A1A1A]/95 backdrop-blur-md border border-[#3A3A3A] rounded-full px-6 py-3 flex items-center justify-center gap-6 shadow-lg"
      >
        {/* Like Button */}
        <motion.button
          onClick={handleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex items-center gap-2 group"
        >
          <div className="relative">
            <Heart
              className={`w-6 h-6 transition-all ${
                hasLiked ? "text-red-500 fill-red-500" : "text-[#A0A0A0] group-hover:text-red-500"
              }`}
            />
            {/* Particle Burst */}
            <AnimatePresence>
              {showParticles && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i * Math.PI) / 4) * 30,
                        y: Math.sin((i * Math.PI) / 4) * 30,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full"
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
          <span className={`text-sm font-medium ${hasLiked ? "text-red-500" : "text-[#E0E0E0]"}`}>
            {formatNumber(likeCount)}
          </span>
        </motion.button>

        {/* Comment Button */}
        <motion.button
          onClick={onScrollToComments}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 group"
        >
          <MessageCircle className="w-6 h-6 text-[#A0A0A0] group-hover:text-[#00BFFF] transition-colors" />
          <span className="text-sm font-medium text-[#E0E0E0]">{formatNumber(commentCount)}</span>
        </motion.button>

        {/* Share Button */}
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="group"
        >
          <Share2 className="w-6 h-6 text-[#A0A0A0] group-hover:text-[#00BFFF] transition-colors" />
        </motion.button>

        {/* Bookmark Button */}
        <motion.button
          onClick={handleBookmark}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="group"
        >
          <Bookmark
            className={`w-6 h-6 transition-all ${
              hasBookmarked ? "text-[#FFD700] fill-[#FFD700]" : "text-[#A0A0A0] group-hover:text-[#FFD700]"
            }`}
          />
        </motion.button>

        {/* View Count */}
        <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-[#3A3A3A]">
          <span className="text-sm text-[#A0A0A0]">{formatNumber(viewCount)} views</span>
        </div>
      </motion.div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold font-inter text-[#E0E0E0] mb-4">Share Review</h3>
              <div className="space-y-3">
                <button
                  onClick={copyLink}
                  className="w-full bg-[#282828] hover:bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg p-3 text-left text-[#E0E0E0] transition-colors"
                >
                  Copy Link
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#282828] hover:bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg p-3 text-left text-[#E0E0E0] transition-colors"
                >
                  Share on Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#282828] hover:bg-[#3A3A3A] border border-[#3A3A3A] rounded-lg p-3 text-left text-[#E0E0E0] transition-colors"
                >
                  Share on Facebook
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

