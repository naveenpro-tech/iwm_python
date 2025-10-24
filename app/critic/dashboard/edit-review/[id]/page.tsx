"use client"

import { use as usePromise, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Send, Trash2, Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { generateMockDrafts } from "@/lib/critic/mock-drafts"

export default function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [autoSaving, setAutoSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    movieTitle: "",
    movieYear: 0,
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
    tags: [] as string[],
    spoilerWarning: false,
  })

  useEffect(() => {
    const fetchReview = async () => {
      // Mock data - in real app would fetch from API
      const drafts = generateMockDrafts()
      const draft = drafts.find((d) => d.id === id)

      if (draft) {
        setFormData({
          movieTitle: draft.movieTitle,
          movieYear: draft.movieYear,
          rating: draft.rating,
          ratingNumeric: draft.ratingNumeric,
          ratingBreakdown: {
            story: draft.ratingBreakdown[0]?.score || 0,
            acting: draft.ratingBreakdown[1]?.score || 0,
            direction: draft.ratingBreakdown[2]?.score || 0,
            cinematography: draft.ratingBreakdown[3]?.score || 0,
            music: draft.ratingBreakdown[4]?.score || 0,
            overall: draft.ratingBreakdown[5]?.score || 0,
          },
          youtubeUrl: draft.youtubeVideoId || "",
          writtenContent: draft.writtenContent,
          tags: draft.tags,
          spoilerWarning: draft.spoilerWarning,
        })
      }
      setIsLoading(false)
    }

    fetchReview()
  }, [id])

  const handleSaveDraft = async () => {
    setAutoSaving(true)
    setTimeout(() => {
      setAutoSaving(false)
      toast({ title: "Draft saved", description: "Your changes have been saved" })
    }, 1000)
  }

  const handleUpdate = async () => {
    if (!formData.rating || !formData.writtenContent) {
      toast({ title: "Error", description: "Please complete all required fields", variant: "destructive" })
      return
    }

    toast({ title: "Success", description: "Review updated successfully!" })
    router.push("/critic/dashboard")
  }

  const handleDelete = async () => {
    toast({ title: "Success", description: "Review deleted successfully" })
    router.push("/critic/dashboard")
  }

  const letterGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-[#E0E0E0]">Loading review...</div>
      </div>
    )
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
              <h1 className="text-3xl font-bold font-inter text-[#E0E0E0]">Edit Review</h1>
              <p className="text-sm text-[#A0A0A0]">{formData.movieTitle} ({formData.movieYear})</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="border-[#3A3A3A] text-[#E0E0E0]"
              disabled={autoSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {autoSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button onClick={handleUpdate} className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]">
              <Send className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-6 max-w-md"
            >
              <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">Delete Review?</h3>
              <p className="text-[#A0A0A0] mb-6">
                Are you sure you want to delete this review? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="border-[#3A3A3A] text-[#E0E0E0]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Form - Same as Create Review */}
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

          {/* Written Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Written Review</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.writtenContent}
                  onChange={(e) => setFormData({ ...formData, writtenContent: e.target.value })}
                  placeholder="Write your review here..."
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
            transition={{ delay: 0.3, duration: 0.6 }}
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

