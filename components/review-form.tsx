"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, X, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { isAuthenticated } from "@/lib/auth"

interface ReviewFormProps {
  movieId: string
  movieTitle: string
  onClose: () => void
  onSuccess: () => void
}

export function ReviewForm({ movieId, movieTitle, onClose, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [containsSpoilers, setContainsSpoilers] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (content.trim().length < 50) {
      setError("Review must be at least 50 characters long")
      return
    }

    if (!isAuthenticated()) {
      setError("You must be logged in to submit a review")
      return
    }

    setIsSubmitting(true)

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
      const accessToken = localStorage.getItem("access_token")

      // Get current user to get userId
      const meResponse = await fetch(`${apiBase}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!meResponse.ok) {
        throw new Error("Failed to authenticate. Please log in again.")
      }

      const user = await meResponse.json()

      const response = await fetch(`${apiBase}/api/v1/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          movieId,
          userId: user.email,  // Use email as external_id
          rating,
          title: title.trim() || null,
          content: content.trim(),
          spoilers: containsSpoilers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to submit review")
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 10 }, (_, i) => {
      const starValue = i + 1
      const isFilled = starValue <= (hoverRating || rating)

      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              isFilled ? "text-[#FFD700] fill-[#FFD700]" : "text-[#3A3A3A]"
            }`}
          />
        </button>
      )
    })
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#1A1A1A] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#3A3A3A]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#3A3A3A] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-inter text-[#E0E0E0]">Write a Review</h2>
            <p className="text-[#A0A0A0] font-dmsans mt-1">{movieTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-[#E0E0E0] font-inter mb-3 block">
              Your Rating <span className="text-[#FF4500]">*</span>
            </Label>
            <div className="flex items-center gap-2">
              {renderStars()}
              {rating > 0 && (
                <span className="ml-4 text-2xl font-bold text-[#00BFFF] font-inter">{rating}/10</span>
              )}
            </div>
          </div>

          {/* Title (Optional) */}
          <div>
            <Label htmlFor="review-title" className="text-[#E0E0E0] font-inter mb-2 block">
              Review Title (Optional)
            </Label>
            <Input
              id="review-title"
              type="text"
              placeholder="Sum up your review in one line"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#00BFFF] focus:ring-[#00BFFF]"
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="review-content" className="text-[#E0E0E0] font-inter mb-2 block">
              Your Review <span className="text-[#FF4500]">*</span>
            </Label>
            <Textarea
              id="review-content"
              placeholder="Share your thoughts about this movie... (minimum 50 characters)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#00BFFF] focus:ring-[#00BFFF] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-[#A0A0A0]">
                {content.length < 50 ? `${50 - content.length} more characters needed` : "✓ Minimum length met"}
              </span>
              <span className="text-sm text-[#A0A0A0]">{content.length} characters</span>
            </div>
          </div>

          {/* Spoiler Warning */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spoilers"
              checked={containsSpoilers}
              onCheckedChange={(checked) => setContainsSpoilers(checked as boolean)}
              className="border-[#3A3A3A] data-[state=checked]:bg-[#00BFFF] data-[state=checked]:border-[#00BFFF]"
              disabled={isSubmitting}
            />
            <Label
              htmlFor="spoilers"
              className="text-[#E0E0E0] font-dmsans cursor-pointer select-none"
            >
              This review contains spoilers
            </Label>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#FF4500]/10 border border-[#FF4500] rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-[#FF4500] flex-shrink-0 mt-0.5" />
                <p className="text-[#FF4500] font-dmsans">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#00BFFF]/10 border border-[#00BFFF] rounded-lg p-4 flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-[#00BFFF] flex-shrink-0 mt-0.5" />
                <p className="text-[#00BFFF] font-dmsans">Review submitted successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#282828]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || content.trim().length < 50}
              className="flex-1 bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

