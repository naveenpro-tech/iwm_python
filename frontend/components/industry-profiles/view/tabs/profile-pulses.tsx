"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { CheckCircle, Clock, ThumbsUp, MessageCircle, Eye, Share, ImageIcon, Send, X } from "lucide-react"
import type { IndustryProfessionalProfile } from "../../types"

interface ProfilePulsesProps {
  profile: IndustryProfessionalProfile
  isOwnProfile?: boolean
}

export function ProfilePulses({ profile, isOwnProfile = false }: ProfilePulsesProps) {
  const [newPulseContent, setNewPulseContent] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const handleSubmitPulse = () => {
    // In a real app, this would submit the pulse to the backend
    console.log("Submitting pulse:", { content: newPulseContent, image: selectedImage })
    setNewPulseContent("")
    setSelectedImage(null)
    setIsComposing(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload the image to a storage service
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
    }
  }

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Pulse Composer (for own profile) */}
      {isOwnProfile && (
        <motion.div variants={itemVariants}>
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              {!isComposing ? (
                <div
                  className="flex items-center p-3 rounded-lg bg-[#2A2A2A] cursor-pointer hover:bg-[#3A3A3A] transition-colors"
                  onClick={() => setIsComposing(true)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={profile.profilePhoto || "/placeholder.svg?height=100&width=100&query=portrait"}
                      alt={profile.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-[#A0A0A0]">Share an update with your followers...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image
                        src={profile.profilePhoto || "/placeholder.svg?height=100&width=100&query=portrait"}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-[#E0E0E0]">{profile.name}</h4>
                        {profile.verificationStatus === "verified" && (
                          <CheckCircle className="h-3 w-3 ml-1 text-[#00BFFF]" />
                        )}
                      </div>
                      <div className="text-xs text-[#A0A0A0]">Posting to all followers</div>
                    </div>
                  </div>

                  <Textarea
                    value={newPulseContent}
                    onChange={(e) => setNewPulseContent(e.target.value)}
                    placeholder="Share an update, announcement, or thought..."
                    className="min-h-[120px] bg-[#1A1A1A] border-[#3A3A3A] focus:border-[#00BFFF] resize-none"
                  />

                  {selectedImage && (
                    <div className="relative">
                      <div className="rounded-lg overflow-hidden">
                        <Image
                          src={selectedImage || "/placeholder.svg"}
                          alt="Selected image"
                          width={600}
                          height={400}
                          className="w-full object-cover max-h-[300px]"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 hover:bg-black/90 border border-white/20"
                        onClick={() => setSelectedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <label
                        htmlFor="image-upload"
                        className="flex items-center p-2 rounded-md hover:bg-[#3A3A3A] cursor-pointer transition-colors"
                      >
                        <ImageIcon className="h-5 w-5 text-[#A0A0A0]" />
                        <span className="ml-2 text-sm text-[#A0A0A0]">Add Image</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="text-[#A0A0A0] hover:text-[#E0E0E0] hover:bg-[#3A3A3A]"
                        onClick={() => {
                          setIsComposing(false)
                          setNewPulseContent("")
                          setSelectedImage(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                        disabled={!newPulseContent.trim()}
                        onClick={handleSubmitPulse}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pulses List */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[#282828] border-[#3A3A3A]">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-[#E0E0E0] mb-4">
              {isOwnProfile ? "Your Pulses" : `${profile.name}'s Pulses`}
            </h3>

            <div className="space-y-6">
              {profile.pulses && profile.pulses.length > 0 ? (
                profile.pulses.map((pulse, index) => (
                  <motion.div
                    key={pulse.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="p-4 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={profile.profilePhoto || "/placeholder.svg?height=100&width=100&query=portrait"}
                            alt={profile.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-[#E0E0E0]">{profile.name}</h4>
                            {profile.verificationStatus === "verified" && (
                              <CheckCircle className="h-3 w-3 ml-1 text-[#00BFFF]" />
                            )}
                          </div>
                          <div className="flex items-center text-xs text-[#A0A0A0]">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(pulse.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <p className="text-[#E0E0E0] mb-3">{pulse.content}</p>

                      {pulse.image && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <Image
                            src={pulse.image || "/placeholder.svg"}
                            alt="Pulse image"
                            width={600}
                            height={400}
                            className="w-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-[#A0A0A0]">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A] px-2"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {pulse.likes.toLocaleString()}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A] px-2"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {pulse.comments.toLocaleString()}
                          </Button>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {pulse.views.toLocaleString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#A0A0A0] hover:text-[#00BFFF] hover:bg-[#3A3A3A]"
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageCircle className="h-12 w-12 text-[#3A3A3A] mb-3" />
                  <h4 className="text-lg font-medium text-[#E0E0E0]">No Pulses Yet</h4>
                  <p className="text-[#A0A0A0] mt-1 max-w-md">
                    {isOwnProfile
                      ? "Share updates, thoughts, and announcements with your followers."
                      : "This professional hasn't posted any pulses yet."}
                  </p>
                  {isOwnProfile && (
                    <Button
                      className="mt-4 bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                      onClick={() => setIsComposing(true)}
                    >
                      Create Your First Pulse
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
