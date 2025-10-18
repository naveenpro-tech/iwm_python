"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Edit, MapPin, Calendar, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

interface UserData {
  id: string
  username: string
  displayName: string
  bio: string
  avatarUrl: string
  coverUrl: string
  location: string
  memberSince: string
  isVerified: boolean
  stats: {
    reviews: number
    watchlist: number
    favorites: number
    following: number
    followers: number
  }
}

interface ProfileHeaderProps {
  userData: UserData
}

export function ProfileHeader({ userData }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const isMobile = useMobile()

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
          src={userData.coverUrl || "/placeholder.svg?height=400&width=1200&query=cinematic+background"}
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
                src={userData.avatarUrl || "/placeholder.svg?height=160&width=160&query=person+silhouette"}
                alt={userData.displayName}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            {userData.isVerified && (
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
                  <h1 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]">{userData.displayName}</h1>
                  {userData.isVerified && (
                    <div className="ml-2 text-[#00BFFF]">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-[#A0A0A0] font-dmsans">@{userData.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex mt-4 md:mt-0 space-x-2">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="sr-only md:not-sr-only md:ml-2">Share</span>
                </Button>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-4 text-[#E0E0E0] font-dmsans max-w-3xl">{userData.bio}</p>

            {/* Additional Info */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {userData.location && (
                <div className="flex items-center text-[#A0A0A0] font-dmsans text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {userData.location}
                </div>
              )}
              <div className="flex items-center text-[#A0A0A0] font-dmsans text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {userData.memberSince}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
