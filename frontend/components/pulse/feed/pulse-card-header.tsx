'use client'

/**
 * Pulse Card Header Component
 * Avatar, name, username, verified badge, timestamp, more menu
 */

import { PulsePost } from '@/types/pulse'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2 } from 'lucide-react'
import MoreMenu from './more-menu'

interface PulseCardHeaderProps {
  post: PulsePost
}

export default function PulseCardHeader({ post }: PulseCardHeaderProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <img
          src={post.author.avatar_url}
          alt={post.author.display_name}
          className="w-12 h-12 rounded-full flex-shrink-0"
        />

        {/* Name, Username, Time */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#E0E0E0] font-['Inter']">
              {post.author.display_name}
            </span>
            {post.author.is_verified && (
              <CheckCircle2 size={16} className="text-[#00BFFF]" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
            <span>@{post.author.username}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* More Menu */}
      <MoreMenu postId={post.id} authorId={post.author.id} />
    </div>
  )
}

