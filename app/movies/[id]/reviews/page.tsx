"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Star, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface Review {
  id: string
  title: string
  content: string
  rating: number
  date: string
  hasSpoilers: boolean
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
}

export default function ReviewsPage() {
  const params = useParams()
  const movieId = params.id as string
  const { toast } = useToast()

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
    spoilers: false,
  })

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
        const response = await fetch(`${apiBase}/api/v1/reviews?movieId=${movieId}&limit=50`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.items || data || [])
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
        toast({ title: "Error", description: "Failed to load reviews", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [movieId, toast])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" })
      return
    }

    setSubmitting(true)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const response = await fetch(`${apiBase}/api/v1/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId,
          userId: "user-123", // TODO: Get from auth context
          rating: formData.rating,
          title: formData.title,
          content: formData.content,
          spoilers: formData.spoilers,
        }),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews([newReview, ...reviews])
        setFormData({ title: "", content: "", rating: 5, spoilers: false })
        setShowForm(false)
        toast({ title: "Success", description: "Review posted successfully!" })
      } else {
        toast({ title: "Error", description: "Failed to post review", variant: "destructive" })
      }
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast({ title: "Error", description: "Failed to post review", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Movie Reviews</h1>
        <p className="text-muted-foreground">Read and share reviews from the community</p>
      </div>

      {/* Review Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>Share your thoughts about this movie</CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="w-full">
              Write a Review
            </Button>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  placeholder="Give your review a title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Select value={formData.rating.toString()} onValueChange={(val) => setFormData({ ...formData, rating: Number(val) })}>
                  <SelectTrigger id="rating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r} / 10
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Review</Label>
                <Textarea
                  id="content"
                  placeholder="Write your review here..."
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="spoilers"
                  checked={formData.spoilers}
                  onChange={(e) => setFormData({ ...formData, spoilers: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="spoilers" className="cursor-pointer">
                  This review contains spoilers
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post Review
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No reviews yet. Be the first to review!</p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{review.title}</h3>
                        <p className="text-sm text-muted-foreground">by {review.author.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < Math.round(review.rating / 2) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>

                    {review.hasSpoilers && (
                      <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-50 dark:bg-yellow-950 rounded text-sm text-yellow-800 dark:text-yellow-200">
                        <AlertCircle size={16} />
                        Contains spoilers
                      </div>
                    )}

                    <p className="text-sm mb-2">{review.content}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

