'use client'

/**
 * Pulse Card Component
 * Main card component for pulse posts
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PulsePost, PulseComment } from '@/types/pulse'
import PulseCardHeader from './pulse-card-header'
import PulseCardContent from './pulse-card-content'
import MediaGrid from './media-grid'
import TaggedItemCard from './tagged-item-card'
import PulseCardActions from './pulse-card-actions'
import CommentSection from './comment-section'
import { me } from '@/lib/auth'
import { deletePulse } from '@/lib/api/pulses'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'

interface PulseCardProps {
  post: PulsePost
  comments: PulseComment[]
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void
  onEcho: (postId: string, type: 'echo' | 'quote_echo', quoteContent?: string) => void
  onBookmark: (postId: string) => void
  onPulseDeleted?: () => void
}

export default function PulseCard({
  post,
  comments,
  onLike,
  onComment,
  onEcho,
  onBookmark,
  onPulseDeleted,
}: PulseCardProps) {
  const [isCommentSectionExpanded, setIsCommentSectionExpanded] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await me()
        setCurrentUser(user)
      } catch (error) {
        console.debug("User not authenticated")
      }
    }
    fetchUser()
  }, [])

  const handleCommentClick = () => {
    setIsCommentSectionExpanded(!isCommentSectionExpanded)
  }

  const handleCommentSubmit = (content: string) => {
    onComment(post.id, content)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pulse? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      await deletePulse(post.id)
      toast({
        title: "Success",
        description: "Pulse deleted successfully",
      })
      if (onPulseDeleted) {
        onPulseDeleted()
      } else {
        window.location.reload()
      }
    } catch (error: any) {
      console.error("Error deleting pulse:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete pulse",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle echo/repost display
  if (post.type === 'echo' && post.original_post) {
    return (
      <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-6">
        {/* Echoed By Header */}
        <div className="flex items-center gap-2 mb-4 text-[#A0A0A0] text-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          <span>
            {post.echoed_by?.display_name} echoed
          </span>
        </div>

        {/* Original Post */}
        <PulseCard
          post={post.original_post}
          comments={comments}
          onLike={onLike}
          onComment={onComment}
          onEcho={onEcho}
          onBookmark={onBookmark}
        />
      </div>
    )
  }

  return (
    <div className="bg-[#282828] border border-[#3A3A3A] rounded-xl p-6 hover:border-[#00BFFF]/30 transition-colors">
      {/* Header with Delete Button */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <PulseCardHeader post={post} />
        </div>
        {currentUser?.id === post.author.id && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[#A0A0A0] hover:text-red-500 hover:bg-red-500/10"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </>
            )}
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <PulseCardContent content={post.content} />
      </div>

      {/* Media Grid */}
      {post.media.length > 0 && (
        <div className="mt-4">
          <MediaGrid media={post.media} />
        </div>
      )}

      {/* Tagged Items */}
      {post.tagged_items.length > 0 && (
        <div className="mt-4 space-y-2">
          {post.tagged_items.map((tag) => (
            <TaggedItemCard key={tag.id} tag={tag} />
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-[#3A3A3A] my-4" />

      {/* Actions */}
      <PulseCardActions
        post={post}
        onLike={() => onLike(post.id)}
        onComment={handleCommentClick}
        onEcho={onEcho}
        onBookmark={() => onBookmark(post.id)}
        isCommentSectionExpanded={isCommentSectionExpanded}
      />

      {/* Comment Section */}
      <AnimatePresence>
        {isCommentSectionExpanded && (
          <CommentSection
            postId={post.id}
            comments={comments}
            onCommentSubmit={handleCommentSubmit}
            onCommentLike={(commentId) => {
              // Handle comment like (optimistic UI)
              console.log('Like comment:', commentId)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

