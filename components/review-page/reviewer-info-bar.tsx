"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Check, MessageCircle, Star } from "lucide-react"

interface ReviewerInfoBarProps {
  reviewer: {
    id: string
    username: string
    avatarUrl: string
    isVerifiedReviewer: boolean
    totalReviews: number
    followerCount: number
  }
  createdAt: string
}

export function ReviewerInfoBar({ reviewer, createdAt }: ReviewerInfoBarProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <motion.div
      className="bg-[#151515] rounded-lg p-6 border border-[#3A3A3A]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: Reviewer Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Link href={`/profile/${reviewer.id}`} className="flex-shrink-0">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#00BFFF] hover:ring-4 transition-all">
              {reviewer.avatarUrl ? (
                <Image
                  src={reviewer.avatarUrl}
                  alt={reviewer.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#3A3A3A] flex items-center justify-center text-[#E0E0E0] text-2xl font-bold">
                  {reviewer.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </Link>

          {/* Username and Stats */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/profile/${reviewer.id}`}
                className="text-xl font-bold font-inter text-[#E0E0E0] hover:text-[#00BFFF] transition-colors"
              >
                {reviewer.username}
              </Link>
              {reviewer.isVerifiedReviewer && (
                <div className="bg-[#00BFFF]/10 text-[#00BFFF] px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                  <Check className="w-3 h-3" />
                  <span>Verified Reviewer</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-[#A0A0A0] font-dmsans">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{reviewer.totalReviews} reviews</span>
              </div>
              {reviewer.followerCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{reviewer.followerCount} followers</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Date */}
        <div className="text-[#A0A0A0] font-dmsans text-sm md:text-base">
          {formattedDate}
        </div>
      </div>
    </motion.div>
  )
}

