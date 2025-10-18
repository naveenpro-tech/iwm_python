"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, BadgeCheck, MessageCircle, Share2, MoreHorizontal, Eye, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import type { IndustryProfessionalProfile } from "../types"

interface ProfileHeaderProps {
  profile: IndustryProfessionalProfile
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

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <motion.div className="relative w-full" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Cover Photo */}
      <div className="relative w-full h-48 md:h-72 lg:h-96 overflow-hidden">
        <Image
          src={profile.coverPhoto || "/placeholder.svg?height=400&width=1200&query=cinematic+background"}
          alt="Profile cover"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="relative -mt-24 md:-mt-32 flex flex-col md:flex-row md:items-end">
          {/* Avatar */}
          <motion.div className="relative z-10" variants={itemVariants}>
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-[#1A1A1A] bg-[#282828]">
              <Image
                src={profile.profilePhoto || "/placeholder.svg?height=192&width=192&query=person+silhouette"}
                alt={profile.name}
                width={192}
                height={192}
                className="object-cover w-full h-full"
              />
            </div>
            {profile.isOfficial && (
              <div className="absolute bottom-1 right-1 bg-[#FFD700] text-[#1A1A1A] rounded-full p-1.5">
                <BadgeCheck className="w-5 h-5" />
              </div>
            )}
          </motion.div>

          {/* User Info */}
          <motion.div className="mt-4 md:mt-0 md:ml-6 md:mb-2 flex-1" variants={itemVariants}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-2xl md:text-3xl font-bold font-inter text-[#E0E0E0]">{profile.name}</h1>
                  {profile.isOfficial && (
                    <Badge className="bg-[#FFD700] text-black">
                      <BadgeCheck className="w-3 h-3 mr-1" /> Official
                    </Badge>
                  )}
                  {profile.verificationStatus === "verified" && (
                    <Badge className="bg-[#00BFFF] text-black">
                      <Check className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <p className="text-[#A0A0A0] font-dmsans">{profile.officialTitle}</p>

                {/* Company Affiliations */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {profile.companyAffiliation?.map((company, index) => (
                    <Badge key={index} variant="outline" className="border-[#3A3A3A] text-[#A0A0A0]">
                      {company}
                    </Badge>
                  ))}
                </div>

                {/* Analytics for Profile Owner */}
                {isOwnProfile && (
                  <motion.div
                    className="flex items-center gap-4 mt-3 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#00BFFF]" />
                      <span className="text-[#E0E0E0]">{formatCount(profile.viewCount)}</span>
                      <span className="text-[#A0A0A0]">profile views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#00BFFF]" />
                      <span className="text-[#E0E0E0]">{formatCount(profile.followerCount)}</span>
                      <span className="text-[#A0A0A0]">followers</span>
                    </div>
                    <div className="text-[#A0A0A0]">
                      <span className="text-[#E0E0E0]">{formatCount(profile.monthlyViews)}</span> views this month
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex mt-4 md:mt-0 space-x-2">
                {!isOwnProfile && (
                  <>
                    <Button
                      onClick={toggleFollow}
                      className={`${
                        isFollowing
                          ? "bg-[#282828] hover:bg-[#3A3A3A] text-white border border-[#3A3A3A]"
                          : "bg-[#00BFFF] hover:bg-[#0099CC] text-black"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        "Follow"
                      )}
                    </Button>
                    {(profile.privacySettings.allowMessages === "all" ||
                      (profile.privacySettings.allowMessages === "industry-only" && isVerifiedIndustry)) && (
                      <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#282828]">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    )}
                  </>
                )}
                <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#282828]">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {isOwnProfile && (
                  <Button variant="outline" className="border-[#3A3A3A] hover:bg-[#282828]">
                    Edit Profile
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="hover:bg-[#282828]">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Public Stats (visible to all) */}
        {!isOwnProfile && (
          <motion.div
            className="flex items-center gap-6 mt-6 text-sm border-t border-[#3A3A3A] pt-4"
            variants={itemVariants}
          >
            <div>
              <span className="text-[#E0E0E0] font-semibold">{formatCount(profile.followerCount)}</span>
              <span className="text-[#A0A0A0] ml-1">Followers</span>
            </div>
            <div>
              <span className="text-[#E0E0E0] font-semibold">{profile.filmography?.length || 0}</span>
              <span className="text-[#A0A0A0] ml-1">Projects</span>
            </div>
            <div>
              <span className="text-[#E0E0E0] font-semibold">{profile.awards?.length || 0}</span>
              <span className="text-[#A0A0A0] ml-1">Awards</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
