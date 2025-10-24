"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, ThumbsUp, Reply, Send } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { CriticReviewComment } from "@/lib/critic/mock-critic-review"

interface CriticReviewCommentsProps {
  reviewId: string
  comments: CriticReviewComment[]
  commentCount: number
}

export function CriticReviewComments({ reviewId, comments, commentCount }: CriticReviewCommentsProps) {
  const [sortBy, setSortBy] = useState<"latest" | "top" | "oldest">("latest")
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    // API call would go here
    setNewComment("")
  }

  const handleSubmitReply = (commentId: string) => {
    if (!replyText.trim()) return
    // API call would go here
    setReplyText("")
    setReplyingTo(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6, duration: 0.6 }}
      id="comments-section"
      className="bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-[#00BFFF]" />
          <h3 className="text-xl font-bold font-inter text-[#E0E0E0]">
            Comments ({commentCount})
          </h3>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          {(["latest", "top", "oldest"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                sortBy === option
                  ? "bg-[#00BFFF] text-[#1A1A1A]"
                  : "bg-[#282828] text-[#A0A0A0] hover:bg-[#3A3A3A]"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Composer */}
      <div className="mb-8 bg-[#0A0A0A] border border-[#3A3A3A] rounded-lg p-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="bg-transparent border-none resize-none focus:ring-0 text-[#E0E0E0] placeholder:text-[#A0A0A0] mb-3"
          rows={3}
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#A0A0A0]">{newComment.length}/500</span>
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A] gap-2"
          >
            <Send className="w-4 h-4" />
            Post Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8 + index * 0.1, duration: 0.4 }}
              className="space-y-4"
            >
              {/* Main Comment */}
              <div className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${comment.avatar})` }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-[#E0E0E0]">{comment.username}</span>
                    <span className="text-xs text-[#A0A0A0]">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-[#E0E0E0] mb-3">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <button
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        comment.userHasLiked ? "text-[#00BFFF]" : "text-[#A0A0A0] hover:text-[#00BFFF]"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="flex items-center gap-1 text-sm text-[#A0A0A0] hover:text-[#00BFFF] transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-[#0A0A0A] border border-[#3A3A3A] rounded-lg p-3"
                    >
                      <Textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="bg-transparent border-none resize-none focus:ring-0 text-[#E0E0E0] placeholder:text-[#A0A0A0] mb-2"
                        rows={2}
                        maxLength={500}
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          onClick={() => setReplyingTo(null)}
                          variant="ghost"
                          size="sm"
                          className="text-[#A0A0A0]"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={!replyText.trim()}
                          size="sm"
                          className="bg-[#00BFFF] hover:bg-[#00A3DD] text-[#1A1A1A]"
                        >
                          Reply
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-14 space-y-4 border-l-2 border-[#3A3A3A] pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-4">
                      <div
                        className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${reply.avatar})` }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-[#E0E0E0]">{reply.username}</span>
                          <span className="text-xs text-[#A0A0A0]">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-[#E0E0E0] mb-2">{reply.content}</p>
                        <button
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            reply.userHasLiked ? "text-[#00BFFF]" : "text-[#A0A0A0] hover:text-[#00BFFF]"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {comments.length < commentCount && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="border-[#3A3A3A] text-[#E0E0E0] hover:bg-[#282828]">
            Load More Comments
          </Button>
        </div>
      )}
    </motion.div>
  )
}

