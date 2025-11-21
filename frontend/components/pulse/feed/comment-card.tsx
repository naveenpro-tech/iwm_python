'use client'

/**
 * Comment Card Component
 * Individual comment with like button
 */

import { PulseComment } from '@/types/pulse'
import { formatDistanceToNow } from 'date-fns'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface CommentCardProps {
  comment: PulseComment
  onLike: () => void
}

export default function CommentCard({ comment, onLike }: CommentCardProps) {
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })

  return (
    <div className="flex gap-3 p-3 bg-[#3A3A3A] rounded-lg">
      {/* Avatar */}
      <img
        src={comment.author.avatar_url}
        alt={comment.author.display_name}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#E0E0E0] text-sm">
            {comment.author.display_name}
          </span>
          <span className="text-xs text-[#A0A0A0]">@{comment.author.username}</span>
          <span className="text-xs text-[#A0A0A0]">•</span>
          <span className="text-xs text-[#A0A0A0]">{timeAgo}</span>
        </div>

        <p className="text-sm text-[#E0E0E0] mt-1">{comment.content}</p>

        {/* Like Button */}
        <motion.button
          onClick={onLike}
          whileTap={{ scale: 1.2 }}
          className="flex items-center gap-1 mt-2"
        >
          <Heart
            size={14}
            className={`transition-colors ${
              comment.is_liked ? 'text-[#EF4444] fill-[#EF4444]' : 'text-[#A0A0A0] hover:text-[#EF4444]'
            }`}
          />
          {comment.like_count > 0 && (
            <span className={`text-xs ${comment.is_liked ? 'text-[#EF4444]' : 'text-[#A0A0A0]'}`}>
              {comment.like_count}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  )
}

