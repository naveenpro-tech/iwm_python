'use client'

/**
 * Who to Follow Component
 * Suggested users with follow button
 */

import { useState } from 'react'
import { SuggestedUser } from '@/types/pulse'
import { UserPlus, CheckCircle2 } from 'lucide-react'

interface WhoToFollowProps {
  users: SuggestedUser[]
  onFollow: (userId: string) => void
}

export default function WhoToFollow({ users, onFollow }: WhoToFollowProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
    onFollow(userId)
  }

  return (
    <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus size={18} className="text-[#00BFFF]" />
        <h3 className="font-bold text-[#E0E0E0] font-['Inter']">Who to Follow</h3>
      </div>

      <div className="space-y-4">
        {users.map((suggestedUser) => {
          const isFollowing = followedUsers.has(suggestedUser.user.id)

          return (
            <div key={suggestedUser.user.id} className="flex items-start gap-3">
              <img
                src={suggestedUser.user.avatar_url}
                alt={suggestedUser.user.display_name}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="font-semibold text-[#E0E0E0] truncate">
                    {suggestedUser.user.display_name}
                  </h4>
                  {suggestedUser.user.is_verified && (
                    <CheckCircle2 size={14} className="text-[#00BFFF] flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-[#A0A0A0] truncate">
                  @{suggestedUser.user.username}
                </p>
                <p className="text-xs text-[#A0A0A0] mt-1">{suggestedUser.reason}</p>

                <button
                  onClick={() => handleFollow(suggestedUser.user.id)}
                  className={`mt-2 px-4 py-1.5 rounded-lg font-semibold text-sm transition-colors ${
                    isFollowing
                      ? 'bg-[#3A3A3A] text-[#E0E0E0] hover:bg-[#4A4A4A]'
                      : 'bg-gradient-to-r from-[#00BFFF] to-[#0080FF] text-white hover:shadow-lg hover:shadow-[#00BFFF]/20'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

