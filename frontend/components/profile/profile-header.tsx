"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Edit, MapPin, Calendar, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { EditProfileModal } from "./edit-profile-modal"
import { useToast } from "@/hooks/use-toast"
import { cn, formatDate, resolveImageUrl } from "@/lib/utils"

interface ProfileHeaderProps {
  name: string
  username: string
  bio: string
  avatarUrl: string
  bannerUrl: string
  joinedDate: string
  location?: string
  website?: string
  stats: {
    reviews: number
    watchlist: number
    favorites: number
    collections: number
    following: number
    followers: number
  }
  isVerified?: boolean
  isOwnProfile?: boolean
  onProfileUpdate?: (data: { name: string; bio: string; location?: string; website?: string; avatarUrl?: string; bannerUrl?: string }) => Promise<void>
}

export function ProfileHeader({
  name,
  username,
  bio,
  avatarUrl,
  bannerUrl,
  joinedDate,
  location,
  website,
  stats,
  isVerified = false,
  isOwnProfile = false,
  onProfileUpdate
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${username}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name}'s Profile`,
          text: `Check out ${name}'s profile on Siddu Global Entertainment Hub`,
          url: profileUrl,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(profileUrl)
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // If share fails, try clipboard as fallback
      try {
        await navigator.clipboard.writeText(profileUrl)
        toast({
          title: "Link Copied",
          description: "Profile link copied to clipboard",
        })
      } catch (clipboardError) {
        toast({
          title: "Error",
          description: "Failed to share profile",
          variant: "destructive",
        })
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div className="relative w-full" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Cover Photo */}
      <div className="relative w-full h-40 md:h-64 lg:h-80 overflow-hidden">
        <Image
          src={resolveImageUrl(bannerUrl, "banner")}
          alt="Profile cover"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative -mt-16 md:-mt-24 flex flex-col md:flex-row md:items-end">
          {/* Avatar */}
          <motion.div className="relative z-10" variants={itemVariants}>
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#1A1A1A] bg-[#282828]">
              <Image
                src={resolveImageUrl(avatarUrl, "avatar")}
                alt={name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            {isVerified && (
              <div className="absolute bottom-1 right-1 bg-[#00BFFF] text-[#1A1A1A] rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
          </motion.div>

          {/* User Info */}
          <motion.div className="mt-4 md:mt-0 md:ml-6 md:mb-2 flex-1" variants={itemVariants}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h1 className="text-xl md:text-3xl font-bold font-inter text-[#E0E0E0] leading-tight">{name}</h1>
                  {isVerified && (
                    <div className="ml-2 text-[#00BFFF]">
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  )}
                </div>
                <p className="text-sm md:text-base text-[#A0A0A0] font-dmsans mt-1">@{username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex mt-4 md:mt-0 space-x-2">
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="sr-only md:not-sr-only md:ml-2">Share</span>
                </Button>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-3 md:mt-4 text-sm md:text-base text-[#E0E0E0] font-dmsans max-w-3xl leading-relaxed">{bio}</p>

            {/* Additional Info */}
            <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-3 md:gap-4">
              {location && (
                <div className="flex items-center text-[#A0A0A0] font-dmsans text-xs md:text-sm">
                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
                  {location}
                </div>
              )}
              <div className="flex items-center text-[#A0A0A0] font-dmsans text-xs md:text-sm">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
                Joined {joinedDate}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && onProfileUpdate && (
        <EditProfileModal
          currentData={{ name, bio, location, website, avatarUrl, bannerUrl }}
          onClose={() => setIsEditing(false)}
          onSave={onProfileUpdate}
        />
      )}
    </motion.div>
  )
}
