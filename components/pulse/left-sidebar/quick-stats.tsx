'use client'

/**
 * Quick Stats Component
 * Daily activity stats
 */

import { UserDailyStats } from '@/types/pulse'
import { TrendingUp } from 'lucide-react'

interface QuickStatsProps {
  stats: UserDailyStats
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-[#00BFFF]" />
        <h3 className="font-bold text-[#E0E0E0] font-['Inter']">Your Activity Today</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#A0A0A0]">Pulses posted:</span>
          <span className="font-bold text-[#E0E0E0]">{stats.pulses_posted}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#A0A0A0]">Likes received:</span>
          <span className="font-bold text-[#E0E0E0]">{stats.likes_received}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#A0A0A0]">New followers:</span>
          <span className="font-bold text-[#E0E0E0]">{stats.new_followers}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#A0A0A0]">Comments received:</span>
          <span className="font-bold text-[#E0E0E0]">{stats.comments_received}</span>
        </div>
      </div>
    </div>
  )
}

