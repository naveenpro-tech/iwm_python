"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FollowButtonProps {
  criticUsername: string
  initialFollowing?: boolean
  initialFollowerCount?: number
}

export default function FollowButton({
  criticUsername,
  initialFollowing = false,
  initialFollowerCount = 0,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [followerCount, setFollowerCount] = useState(initialFollowerCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollowToggle = async () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL
    const useBackend = process.env.NEXT_PUBLIC_ENABLE_BACKEND === "true" && !!apiBase

    if (!useBackend || !apiBase) {
      // Optimistic update for demo
      setIsFollowing(!isFollowing)
      setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1)
      return
    }

    setIsLoading(true)

    // Optimistic UI update
    const previousFollowing = isFollowing
    const previousCount = followerCount
    setIsFollowing(!isFollowing)
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1)

    try {
      const endpoint = isFollowing
        ? `${apiBase}/api/v1/critics/${criticUsername}/follow`
        : `${apiBase}/api/v1/critics/${criticUsername}/follow`

      const response = await fetch(endpoint, {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          // Add auth token here when available
        },
      })

      if (!response.ok) {
        throw new Error("Failed to update follow status")
      }
    } catch (error) {
      console.error("Error toggling follow:", error)
      // Revert optimistic update on error
      setIsFollowing(previousFollowing)
      setFollowerCount(previousCount)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {/* Follower Count */}
      <motion.div
        key={followerCount}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
        className="text-[#E0E0E0] font-dmsans"
      >
        <span className="text-2xl font-bold">{followerCount.toLocaleString()}</span>
        <span className="text-sm text-[#A0A0A0] ml-2">Followers</span>
      </motion.div>

      {/* Follow Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={handleFollowToggle}
          disabled={isLoading}
          className={`
            relative overflow-hidden px-6 py-3 rounded-full font-inter font-medium transition-all duration-300
            ${
              isFollowing
                ? "bg-[#282828] text-[#E0E0E0] border-2 border-[#3A3A3A] hover:bg-[#3A3A3A]"
                : "bg-gradient-to-r from-[#00BFFF] to-[#00A8E8] text-[#1A1A1A] hover:shadow-glow"
            }
          `}
        >
          {/* Ripple effect on click */}
          <motion.span
            className="absolute inset-0 bg-white opacity-0"
            initial={false}
            animate={isLoading ? { scale: [0, 2], opacity: [0.5, 0] } : {}}
            transition={{ duration: 0.6 }}
          />

          <span className="relative flex items-center gap-2">
            {isFollowing ? (
              <>
                <UserCheck className="w-5 h-5" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Follow
              </>
            )}
          </span>
        </Button>
      </motion.div>
    </div>
  )
}

