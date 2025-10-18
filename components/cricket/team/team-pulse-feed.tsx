"use client"

import { motion } from "framer-motion"
import { MessageCircle, Heart, Share2 } from "lucide-react"
import Image from "next/image"

interface PulsePost {
  id: string
  author: {
    name: string
    avatarUrl: string
    verified: boolean
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  imageUrl?: string
}

interface TeamPulseFeedProps {
  posts: PulsePost[]
}

export default function TeamPulseFeed({ posts }: TeamPulseFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Team Pulse</h2>
        <p className="text-gray-400">No recent posts found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Team Pulse</h2>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-[#252525] rounded-lg p-4"
          >
            <div className="flex items-center mb-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={post.author.avatarUrl || "/placeholder.svg"}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center">
                  <span className="text-white font-medium mr-1">{post.author.name}</span>
                  {post.author.verified && (
                    <span className="bg-[#00BFFF] text-[#1A1A1A] text-xs p-0.5 rounded-full">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{post.timestamp}</div>
              </div>
            </div>

            <p className="text-gray-300 mb-4">{post.content}</p>

            {post.imageUrl && (
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                <Image src={post.imageUrl || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
              </div>
            )}

            <div className="flex justify-between text-gray-400 text-sm">
              <button className="flex items-center hover:text-[#00BFFF]">
                <Heart size={16} className="mr-1" />
                <span>{post.likes}</span>
              </button>

              <button className="flex items-center hover:text-[#00BFFF]">
                <MessageCircle size={16} className="mr-1" />
                <span>{post.comments}</span>
              </button>

              <button className="flex items-center hover:text-[#00BFFF]">
                <Share2 size={16} className="mr-1" />
                <span>{post.shares}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg transition-colors">
          View More
        </button>
      </div>
    </motion.div>
  )
}
