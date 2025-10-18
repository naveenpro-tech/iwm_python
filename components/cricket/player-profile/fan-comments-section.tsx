"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, ThumbsUp, Flag, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface FanCommentsSectionProps {
  comments: {
    id: string
    user: {
      name: string
      avatar?: string
    }
    date: string
    content: string
    likes: number
    userLiked?: boolean
  }[]
}

export function FanCommentsSection({ comments: initialComments }: FanCommentsSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          if (comment.userLiked) {
            return { ...comment, likes: comment.likes - 1, userLiked: false }
          } else {
            return { ...comment, likes: comment.likes + 1, userLiked: true }
          }
        }
        return comment
      }),
    )
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const newCommentObj = {
      id: `new-${Date.now()}`,
      user: {
        name: "You",
        avatar: "/user-avatar-1.png",
      },
      date: "Just now",
      content: newComment,
      likes: 0,
      userLiked: false,
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")

    toast({
      title: "Comment posted!",
      description: "Your comment has been added to the discussion.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white mb-6"
      >
        Fan Comments
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-[#282828] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#00BFFF]" />
              Join the Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts about this player..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-[#1A1A1A] border-gray-700 text-white resize-none min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button onClick={handleSubmitComment} className="bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
          >
            <Card className="bg-[#282828] border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium text-white">{comment.user.name}</span>
                        <span className="text-sm text-gray-400 ml-2">{comment.date}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-300 mb-3">{comment.content}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLikeComment(comment.id)}
                      className={`text-sm ${
                        comment.userLiked ? "text-[#00BFFF]" : "text-gray-400 hover:text-[#00BFFF]"
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {comment.likes}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
