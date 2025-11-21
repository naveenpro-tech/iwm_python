"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
  fullName?: string
  username?: string
  className?: string
}

/**
 * Profile header displaying user's name and username
 */
export const ProfileHeader = React.forwardRef<HTMLDivElement, ProfileHeaderProps>(
  ({ fullName, username, className }, ref) => {
    return (
      <div ref={ref} className={cn("", className)}>
        <h3 className="text-xl font-semibold">{fullName || username}</h3>
        {username && <p className="text-sm text-gray-400">@{username}</p>}
      </div>
    )
  }
)

ProfileHeader.displayName = "ProfileHeader"

