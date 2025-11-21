"use client"

import { motion } from "framer-motion"
import { ActivityFeed } from "@/components/profile/activity-feed"
import { RecentReviewsSection } from "@/components/profile/sections/overview/recent-reviews-section"
import { WatchlistPreviewSection } from "@/components/profile/sections/overview/watchlist-preview-section"

interface ProfileOverviewProps {
  userId: string
}

export function ProfileOverview({ userId }: ProfileOverviewProps) {
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
        <ActivityFeed userId={userId} />
      </motion.div>

      {/* Right Column: Recent Reviews & Watchlist Preview */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <RecentReviewsSection userId={userId} />
        <WatchlistPreviewSection userId={userId} />
      </motion.div>
    </motion.div>
  )
}
