'use client'

/**
 * Comment Section Component
 * Expandable comment section with list and input
 */

import { motion } from 'framer-motion'
import { PulseComment } from '@/types/pulse'
import CommentList from './comment-list'
import CommentInput from './comment-input'

interface CommentSectionProps {
  postId: string
  comments: PulseComment[]
  onCommentSubmit: (content: string) => void
  onCommentLike: (commentId: string) => void
}

export default function CommentSection({
  postId,
  comments,
  onCommentSubmit,
  onCommentLike,
}: CommentSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-4 pt-4 border-t border-[#3A3A3A]"
    >
      {/* Comment List */}
      {comments.length > 0 && (
        <CommentList comments={comments} onCommentLike={onCommentLike} />
      )}

      {/* Comment Input */}
      <div className="mt-4">
        <CommentInput onSubmit={onCommentSubmit} />
      </div>
    </motion.div>
  )
}

