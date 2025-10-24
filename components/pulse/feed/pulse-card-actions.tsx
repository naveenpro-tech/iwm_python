'use client'

/**
 * Pulse Card Actions Component
 * Like, Comment, Echo, Bookmark buttons
 */

import { PulsePost } from '@/types/pulse'
import LikeButton from './actions/like-button'
import CommentButton from './actions/comment-button'
import EchoButton from './actions/echo-button'
import BookmarkButton from './actions/bookmark-button'

interface PulseCardActionsProps {
  post: PulsePost
  onLike: () => void
  onComment: () => void
  onEcho: (postId: string, type: 'echo' | 'quote_echo', quoteContent?: string) => void
  onBookmark: () => void
  isCommentSectionExpanded: boolean
}

export default function PulseCardActions({
  post,
  onLike,
  onComment,
  onEcho,
  onBookmark,
  isCommentSectionExpanded,
}: PulseCardActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <LikeButton
          isLiked={post.is_liked}
          likeCount={post.like_count}
          onClick={onLike}
        />
        <CommentButton
          commentCount={post.comment_count}
          onClick={onComment}
          isExpanded={isCommentSectionExpanded}
        />
        <EchoButton
          isEchoed={post.is_echoed}
          echoCount={post.echo_count}
          onEcho={(type, quoteContent) => onEcho(post.id, type, quoteContent)}
        />
        <BookmarkButton
          isBookmarked={post.is_bookmarked}
          onClick={onBookmark}
        />
      </div>

      {/* View Count */}
      <div className="text-sm text-[#A0A0A0]">
        {post.view_count.toLocaleString()} views
      </div>
    </div>
  )
}

