"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, MessageCircle, AlertTriangle, ChevronDown, ChevronUp, Pencil, Trash2, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Review } from "./types"
import { formatDate } from "@/lib/utils"
import { me } from "@/lib/auth"
import { deleteReview } from "@/lib/api/reviews"
import { useToast } from "@/hooks/use-toast"
import { EditReviewModal } from "./edit-review-modal"

interface ReviewListItemProps {
  review: Review
  onReviewUpdated?: () => void
}

export function ReviewListItem({ review, onReviewUpdated }: ReviewListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await me()
        setCurrentUser(user)
      } catch (error) {
        console.debug("User not authenticated")
      }
    }
    fetchUser()
  }, [])

  // Truncate review text if needed
  const shouldTruncate = review.content.length > 300
  const truncatedContent = shouldTruncate && !isExpanded ? `${review.content.substring(0, 300)}...` : review.content

  // Handle helpful/unhelpful votes
  const handleHelpfulVote = (helpful: boolean) => {
    setIsHelpful(helpful)
    // In a real app, this would send the vote to the server
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteReview(review.id)
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
      if (onReviewUpdated) {
        onReviewUpdated()
      } else {
        window.location.reload()
      }
    } catch (error: any) {
      console.error("Error deleting review:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    toast({
      title: "Success",
      description: "Review updated successfully",
    })
    if (onReviewUpdated) {
      onReviewUpdated()
    } else {
      window.location.reload()
    }
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
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
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
                  href={`/movies/${review.movie.id}/reviews/${review.id}`}
                  className="flex items-center text-xs text-siddu-text-subtle hover:text-siddu-text-light"
                >
                  <MessageCircle size={14} className="mr-1" />
                  <span>{review.commentCount}</span>
                </Link>
              </div>

              {/* Edit/Delete Buttons - Only show if user owns the review */}
              {currentUser?.id === review.author.id && (
                <div className="flex gap-2 pt-3 border-t border-siddu-border-subtle">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex-1 border-siddu-border-subtle hover:bg-siddu-bg-card"
                  >
                    <Pencil className="w-3 h-3 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditReviewModal
          review={{
            id: review.id,
            title: review.title,
            content: review.content,
            rating: review.rating,
            hasSpoilers: review.hasSpoilers,
          }}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </motion.div>
  )
}
