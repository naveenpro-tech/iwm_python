"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { submitCriticApplication } from "@/lib/api/critic-verification"
import type { CriticApplicationData, PlatformLink } from "@/lib/api/critic-verification"

interface CriticApplicationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CriticApplicationForm({ onSuccess, onCancel }: CriticApplicationFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<CriticApplicationData>({
    requested_username: "",
    requested_display_name: "",
    bio: "",
    platform_links: [{ platform: "youtube", url: "" }],
    sample_review_urls: ["", ""],
  })

  const handleAddPlatformLink = () => {
    setFormData({
      ...formData,
      platform_links: [...formData.platform_links, { platform: "", url: "" }],
    })
  }

  const handleRemovePlatformLink = (index: number) => {
    setFormData({
      ...formData,
      platform_links: formData.platform_links.filter((_, i) => i !== index),
    })
  }

  const handleAddReviewUrl = () => {
    if (formData.sample_review_urls.length < 5) {
      setFormData({
        ...formData,
        sample_review_urls: [...formData.sample_review_urls, ""],
      })
    }
  }

  const handleRemoveReviewUrl = (index: number) => {
    setFormData({
      ...formData,
      sample_review_urls: formData.sample_review_urls.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.requested_username.trim()) {
      toast({ title: "Error", description: "Username is required", variant: "destructive" })
      return
    }
    if (!formData.requested_display_name.trim()) {
      toast({ title: "Error", description: "Display name is required", variant: "destructive" })
      return
    }
    if (formData.bio.length < 100) {
      toast({ title: "Error", description: "Bio must be at least 100 characters", variant: "destructive" })
      return
    }
    if (formData.platform_links.some((link) => !link.platform || !link.url)) {
      toast({ title: "Error", description: "All platform links must be complete", variant: "destructive" })
      return
    }
    if (formData.sample_review_urls.filter((url) => url.trim()).length < 2) {
      toast({ title: "Error", description: "At least 2 sample review URLs are required", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      await submitCriticApplication(formData)
      toast({
        title: "Success",
        description: "Your application has been submitted for review. You'll be notified once it's approved.",
      })
      onSuccess?.()
    } catch (error: any) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#E0E0E0]">Critic Verification Application</CardTitle>
          <p className="text-sm text-[#A0A0A0] mt-2">
            Complete this form to apply for critic verification. Our team will review your application and notify you of the decision.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <Label className="text-[#E0E0E0]">Username *</Label>
              <Input
                value={formData.requested_username}
                onChange={(e) => setFormData({ ...formData, requested_username: e.target.value })}
                placeholder="your-critic-username"
                className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] mt-2"
                minLength={3}
                maxLength={100}
              />
              <p className="text-xs text-[#A0A0A0] mt-1">3-100 characters, lowercase letters, numbers, hyphens</p>
            </div>

            {/* Display Name */}
            <div>
              <Label className="text-[#E0E0E0]">Display Name *</Label>
              <Input
                value={formData.requested_display_name}
                onChange={(e) => setFormData({ ...formData, requested_display_name: e.target.value })}
                placeholder="Your Full Name"
                className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] mt-2"
                maxLength={200}
              />
            </div>

            {/* Bio */}
            <div>
              <Label className="text-[#E0E0E0]">Bio *</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself, your expertise, and why you want to be a verified critic..."
                className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] mt-2"
                rows={5}
                minLength={100}
                maxLength={1000}
              />
              <p className="text-xs text-[#A0A0A0] mt-1">
                {formData.bio.length}/1000 characters (minimum 100)
              </p>
            </div>

            {/* Platform Links */}
            <div>
              <Label className="text-[#E0E0E0] mb-3 block">Social Media & Platform Links * (at least 1)</Label>
              <div className="space-y-3">
                {formData.platform_links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...formData.platform_links]
                        newLinks[index].platform = e.target.value
                        setFormData({ ...formData, platform_links: newLinks })
                      }}
                      placeholder="Platform (e.g., youtube, twitter, instagram)"
                      className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] flex-1"
                      maxLength={50}
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...formData.platform_links]
                        newLinks[index].url = e.target.value
                        setFormData({ ...formData, platform_links: newLinks })
                      }}
                      placeholder="URL"
                      className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] flex-1"
                      maxLength={500}
                    />
                    {formData.platform_links.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleRemovePlatformLink(index)}
                        variant="outline"
                        className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={handleAddPlatformLink}
                variant="outline"
                className="border-[#3A3A3A] text-[#E0E0E0] mt-3 w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Platform Link
              </Button>
            </div>

            {/* Sample Review URLs */}
            <div>
              <Label className="text-[#E0E0E0] mb-3 block">Sample Review URLs * (2-5)</Label>
              <div className="space-y-2">
                {formData.sample_review_urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...formData.sample_review_urls]
                        newUrls[index] = e.target.value
                        setFormData({ ...formData, sample_review_urls: newUrls })
                      }}
                      placeholder="https://example.com/review"
                      className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] flex-1"
                      maxLength={500}
                    />
                    {formData.sample_review_urls.length > 2 && (
                      <Button
                        type="button"
                        onClick={() => handleRemoveReviewUrl(index)}
                        variant="outline"
                        className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {formData.sample_review_urls.length < 5 && (
                <Button
                  type="button"
                  onClick={handleAddReviewUrl}
                  variant="outline"
                  className="border-[#3A3A3A] text-[#E0E0E0] mt-3 w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Review URL
                </Button>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  onClick={onCancel}
                  variant="outline"
                  className="border-[#3A3A3A] text-[#E0E0E0] flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A] flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

