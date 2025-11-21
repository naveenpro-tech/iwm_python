"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Upload, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ApplyCriticPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    profilePicture: null as File | null,
    youtubeUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    portfolioLinks: "",
    whyApply: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.username || !formData.bio || !formData.whyApply) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast({ title: "Success", description: "Application submitted successfully!" })
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-[#00BFFF]/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-[#00BFFF]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-inter text-[#E0E0E0] mb-4">Application Submitted!</h1>
          <p className="text-xl text-[#A0A0A0] mb-8">
            Thank you for applying to become a verified critic. We'll review your application within 5-7 business days and get back to you via email.
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]"
          >
            Return to Home
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold font-inter mb-4 bg-gradient-to-r from-[#00BFFF] to-[#FFD700] bg-clip-text text-transparent">
            Apply to Become a Verified Critic
          </h1>
          <p className="text-xl text-[#A0A0A0]">
            Join our community of professional film critics and share your expertise with millions of movie lovers
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Personal Information</CardTitle>
                <CardDescription className="text-[#A0A0A0]">Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Full Name *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[#E0E0E0]">Username *</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="johndoe_critic"
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                    required
                  />
                  <p className="text-xs text-[#A0A0A0] mt-1">This will be your unique identifier on the platform</p>
                </div>

                <div>
                  <Label className="text-[#E0E0E0]">Bio * (500 characters max)</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about your background in film criticism..."
                    maxLength={500}
                    rows={4}
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                    required
                  />
                  <p className="text-xs text-[#A0A0A0] mt-1">{formData.bio.length}/500 characters</p>
                </div>

                <div>
                  <Label className="text-[#E0E0E0]">Profile Picture</Label>
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#3A3A3A] text-[#E0E0E0] w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Social Media Links</CardTitle>
                <CardDescription className="text-[#A0A0A0]">Connect your social profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">YouTube Channel URL</Label>
                  <Input
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@yourchanne"
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>

                <div>
                  <Label className="text-[#E0E0E0]">Twitter/X Profile URL</Label>
                  <Input
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/yourhandle"
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>

                <div>
                  <Label className="text-[#E0E0E0]">Instagram Profile URL</Label>
                  <Input
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/yourhandle"
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Portfolio */}
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Portfolio</CardTitle>
                <CardDescription className="text-[#A0A0A0]">Showcase your work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[#E0E0E0]">Portfolio Links</Label>
                  <Textarea
                    value={formData.portfolioLinks}
                    onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                    placeholder="Paste links to your published reviews, articles, or videos (one per line)"
                    rows={5}
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                  />
                </div>

                <div>
                  <Label className="text-[#E0E0E0]">Why do you want to be a verified critic? * (1000 characters max)</Label>
                  <Textarea
                    value={formData.whyApply}
                    onChange={(e) => setFormData({ ...formData, whyApply: e.target.value })}
                    placeholder="Share your passion for film criticism and what you hope to contribute to our community..."
                    maxLength={1000}
                    rows={6}
                    className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0]"
                    required
                  />
                  <p className="text-xs text-[#A0A0A0] mt-1">{formData.whyApply.length}/1000 characters</p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A] px-8 py-6 text-lg"
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

