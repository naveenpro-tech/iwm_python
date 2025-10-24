'use client'

/**
 * Comment List Component
 * Scrollable list of comments
 */

import { PulseComment } from '@/types/pulse'
import CommentCard from './comment-card'

interface CommentListProps {
  comments: PulseComment[]
  onCommentLike: (commentId: string) => void
}

export default function CommentList({ comments, onCommentLike }: CommentListProps) {
  const displayComments = comments.slice(0, 3)
  const hasMore = comments.length > 3

  return (
    <div className="space-y-3">
      {displayComments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          onLike={() => onCommentLike(comment.id)}
        />
      ))}

      {hasMore && (
        <button className="text-sm text-[#00BFFF] hover:underline font-medium">
          View all {comments.length} comments
        </button>
      )}
    </div>
  )
}

