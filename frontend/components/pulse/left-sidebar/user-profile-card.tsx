'use client'

/**
 * User Profile Card Component
 * Shows current user profile with stats
 */

import { CurrentUser } from '@/types/pulse'
import { CheckCircle2 } from 'lucide-react'

interface UserProfileCardProps {
  user: CurrentUser
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-4">
      {/* Avatar & Name */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={user.avatar_url}
          alt={user.display_name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#E0E0E0] font-['Inter']">
              {user.display_name}
            </h3>
            {user.is_verified && (
              <CheckCircle2 size={16} className="text-[#00BFFF]" />
            )}
          </div>
          <p className="text-sm text-[#A0A0A0]">@{user.username}</p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-sm text-[#E0E0E0] mb-4">{user.bio}</p>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between py-3 border-t border-[#3A3A3A]">
        <div className="text-center">
          <div className="font-bold text-[#E0E0E0]">
            {user.follower_count.toLocaleString()}
          </div>
          <div className="text-xs text-[#A0A0A0]">Followers</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-[#E0E0E0]">
            {user.following_count.toLocaleString()}
          </div>
          <div className="text-xs text-[#A0A0A0]">Following</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-[#E0E0E0]">
            {user.pulse_count.toLocaleString()}
          </div>
          <div className="text-xs text-[#A0A0A0]">Pulses</div>
        </div>
      </div>

      {/* View Profile Button */}
      <button className="w-full mt-4 py-2 bg-gradient-to-r from-[#00BFFF] to-[#0080FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00BFFF]/20 transition-shadow">
        View Profile
      </button>
    </div>
  )
}

