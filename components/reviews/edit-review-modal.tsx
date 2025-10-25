"use client"

import { useState } from "react"
import { updateReview } from "@/lib/api/reviews"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface EditReviewModalProps {
  review: {
    id: string
    title?: string
    content: string
    rating: number
    hasSpoilers: boolean
  }
  onClose: () => void
  onSuccess: () => void
}

export function EditReviewModal({ review, onClose, onSuccess }: EditReviewModalProps) {
  const [title, setTitle] = useState(review.title || "")
  const [content, setContent] = useState(review.content)
  const [rating, setRating] = useState(review.rating)
  const [hasSpoilers, setHasSpoilers] = useState(review.hasSpoilers)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Review content is required",
        variant: "destructive",
      })
      return
    }

    if (rating < 0 || rating > 10) {
      toast({
        title: "Validation Error",
        description: "Rating must be between 0 and 10",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await updateReview(review.id, {
        title: title.trim() || undefined,
        content: content.trim(),
        rating,
        hasSpoilers,
      })
      
      toast({
        title: "Success",
        description: "Review updated successfully",
      })
      
      onSuccess()
    } catch (error: any) {
      console.error("Error updating review:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-siddu-bg-card border-siddu-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Review</DialogTitle>
          <DialogDescription className="text-siddu-text-subtle">
            Make changes to your review. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title (Optional)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your review a title"
              className="bg-siddu-bg-card-dark border-siddu-border-subtle"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating" className="text-sm font-medium">
              Rating (0-10) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
              className="bg-siddu-bg-card-dark border-siddu-border-subtle"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Review Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this movie..."
              rows={8}
              className="bg-siddu-bg-card-dark border-siddu-border-subtle resize-none"
              required
            />
            <p className="text-xs text-siddu-text-subtle">
              {content.length} characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="spoilers"
              checked={hasSpoilers}
              onCheckedChange={(checked) => setHasSpoilers(checked as boolean)}
              className="border-siddu-border-subtle"
            />
            <Label
              htmlFor="spoilers"
              className="text-sm font-medium cursor-pointer"
            >
              This review contains spoilers
            </Label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-siddu-border-subtle"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-siddu-electric-blue hover:bg-siddu-electric-blue/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

