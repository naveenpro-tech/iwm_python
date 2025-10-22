"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { isAuthenticated } from "@/lib/auth"
import Image from "next/image"

interface CommentDTO {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    avatarUrl: string
  }
  likes: number
  userHasLiked: boolean
  replies?: CommentDTO[]
}

interface CommentsSectionProps {
  reviewId: string
  comments: CommentDTO[]
  commentsCount: number
}

export function CommentsSection({ reviewId, comments, commentsCount }: CommentsSectionProps) {
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localComments, setLocalComments] = useState<CommentDTO[]>(comments)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated()) {
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname)
      return
    }

    if (commentText.trim().length < 3) {
      return
    }

    setIsSubmitting(true)

    // TODO: Implement comment submission API
    // For now, just simulate success
    setTimeout(() => {
      setCommentText("")
      setIsSubmitting(false)
      // TODO: Refresh comments
    }, 1000)
  }

  return (
    <motion.div
      id="comments-section"
      className="bg-[#151515] rounded-lg border border-[#3A3A3A] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-6 h-6 text-[#00BFFF]" />
          <h3 className="text-2xl font-bold font-inter text-[#E0E0E0]">
            Comments ({commentsCount})
          </h3>
        </div>

        {/* Comment Composer */}
        {isAuthenticated() ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <Textarea
              placeholder="Share your thoughts on this review..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="bg-[#282828] border-[#3A3A3A] text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:border-[#00BFFF] focus:ring-[#00BFFF] resize-none mb-3"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A0A0A0] font-dmsans">
                {commentText.length < 3 ? "Minimum 3 characters" : `${commentText.length} characters`}
              </span>
              <Button
                type="submit"
                disabled={isSubmitting || commentText.trim().length < 3}
                className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mr-2" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="bg-[#282828] rounded-lg p-6 text-center mb-8">
            <p className="text-[#A0A0A0] font-dmsans mb-4">
              Sign in to join the conversation
            </p>
            <Button
              onClick={() => {
                window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname)
              }}
              className="bg-[#00BFFF] text-[#1A1A1A] hover:bg-[#00A3DD]"
            >
              Sign In
            </Button>
          </div>
        )}

        {/* Comments List */}
        {localComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-[#3A3A3A] mx-auto mb-4" />
            <p className="text-[#A0A0A0] font-dmsans text-lg">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {localComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CommentCard({ comment }: { comment: CommentDTO }) {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#3A3A3A]">
          {comment.author.avatarUrl ? (
            <Image
              src={comment.author.avatarUrl}
              alt={comment.author.username}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#E0E0E0] font-bold">
              {comment.author.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-[#E0E0E0] font-inter">
            {comment.author.username}
          </span>
          <span className="text-sm text-[#A0A0A0] font-dmsans">
            {formattedDate}
          </span>
        </div>
        <p className="text-[#E0E0E0] font-dmsans mb-2">
          {comment.content}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <button className="text-[#A0A0A0] hover:text-[#00BFFF] transition-colors font-dmsans">
            Like ({comment.likes})
          </button>
          <button className="text-[#A0A0A0] hover:text-[#00BFFF] transition-colors font-dmsans">
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

