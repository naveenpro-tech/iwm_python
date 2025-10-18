"use client"

import { motion } from "framer-motion"
import { ActivityFeed } from "@/components/profile/activity-feed"
import { RecentReviewsSection } from "@/components/profile/sections/overview/recent-reviews-section"
import { WatchlistPreviewSection } from "@/components/profile/sections/overview/watchlist-preview-section"

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

interface ProfileOverviewProps {
  userData: UserData
}

export function ProfileOverview({ userData }: ProfileOverviewProps) {
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
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Column: Activity Feed */}
      <motion.div className="lg:col-span-2" variants={itemVariants}>
        <ActivityFeed userId={userData.id} />
      </motion.div>

      {/* Right Column: Recent Reviews & Watchlist Preview */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <RecentReviewsSection userId={userData.id} />
        <WatchlistPreviewSection userId={userData.id} />
      </motion.div>
    </motion.div>
  )
}
