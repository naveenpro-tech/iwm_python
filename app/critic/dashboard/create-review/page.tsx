"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Send, Search, Upload, X, Plus, Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function CreateReviewPage() {
  const { toast } = useToast()
  const [step, setStep] = useState<"search" | "compose">("search")
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    rating: "",
    ratingNumeric: 0,
    ratingBreakdown: {
      story: 0,
      acting: 0,
      direction: 0,
      cinematography: 0,
      music: 0,
      overall: 0,
    },
    youtubeUrl: "",
    writtenContent: "",
    images: [] as { url: string; caption: string }[],
    whereToWatch: [] as { platform: string; link: string; price: string }[],
    tags: [] as string[],
    spoilerWarning: false,
  })

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie)
    setStep("compose")
  }

  const handleSaveDraft = async () => {
    if (!selectedMovie) {
      toast({ title: "Error", description: "Please select a movie", variant: "destructive" })
      return
    }

    setAutoSaving(true)
    try {
      const { createCriticReview } = await import("@/lib/api/critic-reviews")
      await createCriticReview({
        movie_id: selectedMovie.id,
        title: "Untitled Review",
        content: formData.writtenContent,
        numeric_rating: formData.ratingNumeric || 0,
        tags: formData.tags,
        youtube_video_id: formData.youtubeUrl ? extractYouTubeId(formData.youtubeUrl) : undefined,
        is_draft: true,
      })
      toast({ title: "Draft saved", description: "Your review has been saved as a draft" })
    } catch (error: any) {
      console.error("Error saving draft:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save draft",
        variant: "destructive",
      })
    } finally {
      setAutoSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!formData.rating || !formData.writtenContent) {
      toast({ title: "Error", description: "Please complete all required fields", variant: "destructive" })
      return
    }

    if (!selectedMovie) {
      toast({ title: "Error", description: "Please select a movie", variant: "destructive" })
      return
    }

    setIsPublishing(true)
    try {
      const { createCriticReview } = await import("@/lib/api/critic-reviews")
      const review = await createCriticReview({
        movie_id: selectedMovie.id,
        title: `${selectedMovie.title} Review`,
        content: formData.writtenContent,
        numeric_rating: formData.ratingNumeric,
        tags: formData.tags,
        youtube_video_id: formData.youtubeUrl ? extractYouTubeId(formData.youtubeUrl) : undefined,
        is_draft: false,
      })
      toast({ title: "Success", description: "Review published successfully!" })
      // Redirect to the published review
      window.location.href = `/critic/dashboard`
    } catch (error: any) {
      console.error("Error publishing review:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to publish review",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  // Helper function to extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | undefined => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? match[1] : undefined
  }

  const letterGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]

  if (step === "search") {
    return <MovieSearchStep onSelect={handleMovieSelect} />
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/critic/dashboard">
              <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold font-inter text-[#E0E0E0]">Create Review</h1>
              <p className="text-sm text-[#A0A0A0]">{selectedMovie?.title} ({selectedMovie?.year})</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="border-[#3A3A3A] text-[#E0E0E0]"
              disabled={autoSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {autoSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="border-[#3A3A3A] text-[#E0E0E0]">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handlePublish} className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </motion.div>

        {/* Form */}
        <div className="space-y-6">
          {/* Rating Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Rating</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#E0E0E0]">Letter Grade</Label>
                    <Select value={formData.rating} onValueChange={(val) => setFormData({ ...formData, rating: val })}>
                      <SelectTrigger className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {letterGrades.map((grade) => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[#E0E0E0]">Numeric Rating (0-10)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.ratingNumeric}
                      onChange={(e) => setFormData({ ...formData, ratingNumeric: parseFloat(e.target.value) })}
                      className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                    />
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div>
                  <Label className="text-[#E0E0E0] mb-3 block">Rating Breakdown</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(formData.ratingBreakdown).map((category) => (
                      <div key={category}>
                        <Label className="text-sm text-[#A0A0A0] capitalize">{category}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.ratingBreakdown[category as keyof typeof formData.ratingBreakdown]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              ratingBreakdown: {
                                ...formData.ratingBreakdown,
                                [category]: parseInt(e.target.value),
                              },
                            })
                          }
                          className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">YouTube Video URL (Optional)</Label>
                  <Input
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>

                <div>
                  <Label className="text-[#E0E0E0] mb-2 block">Images</Label>
                  <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Written Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Written Review</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.writtenContent}
                  onChange={(e) => setFormData({ ...formData, writtenContent: e.target.value })}
                  placeholder="Write your review here... (supports HTML formatting)"
                  rows={15}
                  className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] font-mono"
                />
                <p className="text-xs text-[#A0A0A0] mt-2">{formData.writtenContent.length} characters</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tags & Settings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Tags & Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Tags (comma-separated)</Label>
                  <Input
                    value={formData.tags.join(", ")}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map((t) => t.trim()) })}
                    placeholder="Drama, Thriller, Must-Watch"
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="spoiler"
                    checked={formData.spoilerWarning}
                    onChange={(e) => setFormData({ ...formData, spoilerWarning: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="spoiler" className="text-[#E0E0E0] cursor-pointer flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    This review contains spoilers
                  </Label>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function MovieSearchStep({ onSelect }: { onSelect: (movie: any) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // Use real movie search API
      const { searchMovies } = await import("@/lib/api/search")
      const response = await searchMovies(searchQuery, 20)

      // Transform backend response to match expected format
      const movies = response.results.map((movie: any) => ({
        id: movie.id, // Internal database ID
        external_id: movie.external_id, // TMDB ID
        title: movie.title,
        year: movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : null),
        poster: movie.poster_url || "/placeholder.svg",
      }))

      setSearchResults(movies)
    } catch (error) {
      console.error("Failed to search movies:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold font-inter text-[#E0E0E0] mb-2">Select a Movie</h1>
          <p className="text-[#A0A0A0]">Search for the movie you want to review</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for a movie..."
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
            />
            <Button onClick={handleSearch} className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </motion.div>

        <div className="space-y-4">
          {isSearching && (
            <div className="text-center text-[#A0A0A0] py-8">Searching movies...</div>
          )}

          {!isSearching && searchResults.length === 0 && searchQuery && (
            <div className="text-center text-[#A0A0A0] py-8">
              No movies found. Try a different search term.
            </div>
          )}

          {!isSearching && searchResults.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              onClick={() => onSelect(movie)}
              className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-4 hover:border-[#00BFFF] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-24 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${movie.poster})` }}
                />
                <div>
                  <h3 className="text-lg font-bold text-[#E0E0E0]">{movie.title}</h3>
                  <p className="text-sm text-[#A0A0A0]">{movie.year || "N/A"}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

