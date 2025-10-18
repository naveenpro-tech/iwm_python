"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Edit,
  MapPin,
  Calendar,
  Check,
  Share2,
  MessageCircle,
  Heart,
  Download,
  MoreHorizontal,
  Film,
  Briefcase,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import type { TalentProfile } from "../types"

interface ProfileHeaderProps {
  profile: TalentProfile
  isOwnProfile?: boolean
  isVerifiedIndustry?: boolean
}

export function ProfileHeader({ profile, isOwnProfile = false, isVerifiedIndustry = false }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)
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

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <motion.div className="relative w-full" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Cover Photo */}
      <div className="relative w-full h-40 md:h-64 lg:h-80 overflow-hidden">
        <Image
          src={profile.coverPhoto || "/placeholder.svg?height=400&width=1200&query=cinematic+background"}
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
                src={profile.profilePhoto || "/placeholder.svg?height=160&width=160&query=person+silhouette"}
                alt={profile.fullName}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            {profile.isVerified && (
              <div className="absolute bottom-1 right-1 bg-[#00BFFF] text-[#1A1A1A] rounded-full p-1">
                <Check className="w-4 h-4" />
              </div>
            )}
          </motion.div>

          {/* User Info */}
          <motion.div className="mt-4 md:mt-0 md:ml-6 md:mb-2 flex-1" variants={itemVariants}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]">
                    {profile.professionalName || profile.fullName}
                  </h1>
                  {profile.isVerified && (
                    <div className="text-[#00BFFF]">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <Badge className="bg-[#3A3A3A] text-white">
                    {profile.primaryRole === "actor" ? (
                      <>
                        <Film className="w-3 h-3 mr-1" /> Actor
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-3 h-3 mr-1" /> Crew
                      </>
                    )}
                  </Badge>
                  {profile.verificationLevel && (
                    <Badge className="bg-[#00BFFF] text-black">
                      {profile.verificationLevel.charAt(0).toUpperCase() + profile.verificationLevel.slice(1)} Verified
                    </Badge>
                  )}
                </div>
                {profile.professionalName && <p className="text-[#A0A0A0] font-dmsans">{profile.fullName}</p>}
              </div>

              {/* Action Buttons */}
              <div className="flex mt-4 md:mt-0 space-x-2">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    {isVerifiedIndustry && (
                      <Button
                        variant="default"
                        size={isMobile ? "sm" : "default"}
                        className="bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    )}
                    <Button
                      variant={isFollowing ? "default" : "outline"}
                      size={isMobile ? "sm" : "default"}
                      onClick={toggleFollow}
                      className={
                        isFollowing
                          ? "bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                          : "border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                      }
                    >
                      <Heart
                        className={`w-4 h-4 ${!isFollowing && "mr-2"}`}
                        fill={isFollowing ? "currentColor" : "none"}
                      />
                      {!isFollowing && <span>Follow</span>}
                    </Button>
                  </>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#3A3A3A]"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#282828] border-[#3A3A3A] text-white">
                    <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Profile
                    </DropdownMenuItem>
                    {isVerifiedIndustry && (
                      <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-4 text-[#E0E0E0] font-dmsans max-w-3xl line-clamp-2">
              {profile.biography?.substring(0, 150)}
              {profile.biography && profile.biography.length > 150 && "..."}
            </p>

            {/* Additional Info */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {profile.location && (
                <div className="flex items-center text-[#A0A0A0] font-dmsans text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.location.city}, {profile.location.country}
                </div>
              )}
              <div className="flex items-center text-[#A0A0A0] font-dmsans text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {profile.yearsOfExperience} years experience
              </div>
              {profile.unionStatus && (
                <Badge variant="outline" className="border-[#3A3A3A] text-[#A0A0A0]">
                  {profile.unionStatus === "sag-aftra"
                    ? "SAG-AFTRA"
                    : profile.unionStatus === "non-union"
                      ? "Non-Union"
                      : profile.unionStatus}
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
