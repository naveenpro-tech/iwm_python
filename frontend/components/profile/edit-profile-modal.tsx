"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Loader2, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { resolveImageUrl } from "@/lib/utils"

interface EditProfileModalProps {
  currentData: {
    name: string
    bio: string
    location?: string
    website?: string
    avatarUrl?: string
    bannerUrl?: string
  }
  onClose: () => void
  onSave: (data: {
    name: string
    bio: string
    location?: string
    website?: string
    avatarUrl?: string
    bannerUrl?: string
  }) => Promise<void>
}

export function EditProfileModal({ currentData, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(currentData.name)
  const [bio, setBio] = useState(currentData.bio)
  const [location, setLocation] = useState(currentData.location || "")
  const [website, setWebsite] = useState(currentData.website || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentData.avatarUrl || null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(currentData.bannerUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a JPEG, PNG, WebP, or GIF image",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Set file and create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === "avatar") {
        setAvatarFile(file)
        setAvatarPreview(reader.result as string)
      } else {
        setBannerFile(file)
        setBannerPreview(reader.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

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
      let avatarUrl = currentData.avatarUrl
      let bannerUrl = currentData.bannerUrl

      // Upload avatar if a new file was selected
      if (avatarFile) {
        setIsUploading(true)
        try {
          const { uploadAvatar } = await import("@/lib/api/profile")
          avatarUrl = await uploadAvatar(avatarFile)
        } catch (uploadError) {
          console.error("Error uploading avatar:", uploadError)
          toast({
            title: "Avatar Upload Failed",
            description: "Failed to upload profile photo. Please try again.",
            variant: "destructive",
          })
          setIsUploading(false)
          setIsSaving(false)
          return
        }
      }

      // Upload banner if a new file was selected
      if (bannerFile) {
        setIsUploading(true)
        try {
          const { uploadBanner } = await import("@/lib/api/profile")
          bannerUrl = await uploadBanner(bannerFile)
        } catch (uploadError) {
          console.error("Error uploading banner:", uploadError)
          toast({
            title: "Banner Upload Failed",
            description: "Failed to upload banner image. Please try again.",
            variant: "destructive",
          })
          setIsUploading(false)
          setIsSaving(false)
          return
        }
      }

      setIsUploading(false)

      await onSave({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim() || undefined,
        website: website.trim() || undefined,
        avatarUrl: avatarUrl || undefined,
        bannerUrl: bannerUrl || undefined,
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
      {/* Overlay Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#1A1A1A] rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#3A3A3A] px-6 py-4 flex items-center justify-between z-10">
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
            {/* Banner Photo */}
            <div className="space-y-4">
              <Label className="text-[#E0E0E0] font-inter block">Banner Image</Label>
              <div className="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden bg-[#282828] border-2 border-[#3A3A3A] group">
                {bannerPreview ? (
                  <Image
                    src={resolveImageUrl(bannerPreview, "banner")}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#666666]">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8" />
                      <span className="text-sm">Upload Banner</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("banner-upload")?.click()}
                    className="border-white text-white hover:bg-white/20"
                  >
                    Change Banner
                  </Button>
                </div>
              </div>
              <input
                type="file"
                id="banner-upload"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => handleFileChange(e, "banner")}
                className="hidden"
              />
              <p className="text-xs text-[#A0A0A0]">
                Recommended size: 1500x500px. Max size 5MB.
              </p>
            </div>

            {/* Profile Photo */}
            <div className="space-y-4">
              <Label className="text-[#E0E0E0] font-inter block text-center sm:text-left w-full">Profile Photo</Label>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-start sm:justify-start">
                <div className="relative w-28 h-28 rounded-full overflow-hidden bg-[#282828] border-2 border-[#3A3A3A] flex-shrink-0 shadow-lg">
                  {avatarPreview ? (
                    <Image
                      src={resolveImageUrl(avatarPreview, "avatar")}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#666666]">
                      <Camera className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handleFileChange(e, "avatar")}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center sm:items-start gap-3 w-full max-w-xs sm:max-w-none">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("avatar-upload")?.click()}
                      className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A] w-full sm:w-auto px-6"
                      disabled={isUploading || isSaving}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {avatarFile ? "Change Photo" : "Upload Photo"}
                    </Button>
                    <p className="text-xs text-[#A0A0A0] px-2 sm:px-0">
                      JPEG, PNG, WebP, or GIF. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                disabled={isSaving || isUploading}
                className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || isUploading}
                className="bg-[#00BFFF] hover:bg-[#00BFFF]/90 text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : isSaving ? (
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
      </div>
    </AnimatePresence>
  )
}
