'use client'

/**
 * Trending Cricket Component
 * Live and upcoming cricket matches
 */

import { TrendingCricketMatch } from '@/types/pulse'
import { Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

interface TrendingCricketProps {
  matches: TrendingCricketMatch[]
}

export default function TrendingCricket({ matches }: TrendingCricketProps) {
  return (
    <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={18} className="text-[#10B981]" />
        <h3 className="font-bold text-[#E0E0E0] font-['Inter']">Live Cricket</h3>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="p-3 rounded-lg bg-[#3A3A3A] hover:bg-[#4A4A4A] transition-colors cursor-pointer"
          >
            {/* Live Indicator */}
            {match.is_live && (
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span className="text-xs font-bold text-red-500">LIVE</span>
              </div>
            )}

            {/* Teams */}
            <div className="font-semibold text-[#E0E0E0] mb-1">
              {match.team1_flag} {match.team1} vs {match.team2} {match.team2_flag}
            </div>

            {/* Score */}
            {match.score && (
              <p className="text-sm text-[#A0A0A0] mb-2">{match.score}</p>
            )}

            {/* Venue */}
            <p className="text-xs text-[#A0A0A0]">{match.venue}</p>

            {/* Action Button */}
            {match.status === 'live' ? (
              <button className="mt-2 w-full py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors">
                Watch Live
              </button>
            ) : match.status === 'upcoming' ? (
              <button className="mt-2 w-full py-1.5 bg-[#00BFFF] hover:bg-[#0080FF] text-white rounded text-sm font-semibold transition-colors">
                Set Reminder
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

