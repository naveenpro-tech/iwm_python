"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface EditProfileModalProps {
  currentData: {
    name: string
    bio: string
    location?: string
    website?: string
    avatarUrl?: string
  }
  onClose: () => void
  onSave: (data: {
    name: string
    bio: string
    location?: string
    website?: string
  }) => Promise<void>
}

export function EditProfileModal({ currentData, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(currentData.name)
  const [bio, setBio] = useState(currentData.bio)
  const [location, setLocation] = useState(currentData.location || "")
  const [website, setWebsite] = useState(currentData.website || "")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim() || undefined,
        website: website.trim() || undefined,
      })
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      
      onClose()
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#1A1A1A] rounded-lg shadow-2xl z-50 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#3A3A3A] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#E0E0E0] font-inter">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#E0E0E0] font-inter">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#666666]"
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-[#E0E0E0] font-inter">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#666666] resize-none"
            />
            <p className="text-xs text-[#A0A0A0]">{bio.length}/500 characters</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#E0E0E0] font-inter">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#666666]"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-[#E0E0E0] font-inter">
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#666666]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#3A3A3A]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white"
            >
              {isSaving ? (
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
      </motion.div>
    </AnimatePresence>
  )
}

