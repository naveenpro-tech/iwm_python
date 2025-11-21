"use client"

import { motion } from "framer-motion"
import { MessageCircle, Heart, Repeat, Share2 } from "lucide-react"
import Image from "next/image"

interface PulsePost {
  id: string
  author: {
    name: string
    username: string
    avatarUrl: string
    verified?: boolean
  }
  content: string
  timestamp: string
  likes: number
  repulses: number
  comments: number
  isLiked?: boolean
  isRepulsed?: boolean
}

export interface MatchPulseFeedProps {
  pulses: PulsePost[]
  matchTitle: string
}

export function MatchPulseFeed({ pulses, matchTitle }: MatchPulseFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Pulses about this match</h2>
        <button className="text-[#00BFFF] hover:underline text-sm">View All</button>
      </div>

      <div className="space-y-4">
        {pulses.map((pulse, index) => (
          <motion.div
            key={pulse.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className="bg-[#252525] p-4 rounded-lg"
          >
            <div className="flex mb-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={pulse.author.avatarUrl || "/placeholder.svg"}
                  alt={pulse.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium text-white">{pulse.author.name}</span>
                  {pulse.author.verified && (
                    <span className="ml-1 text-[#00BFFF]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="text-gray-400 text-sm">@{pulse.author.username}</div>
              </div>
              <div className="ml-auto text-gray-400 text-xs">{pulse.timestamp}</div>
            </div>

            <p className="text-white mb-4">{pulse.content}</p>

            <div className="flex justify-between text-gray-400">
              <button className="flex items-center hover:text-[#00BFFF] transition-colors">
                <MessageCircle size={18} className="mr-1" />
                <span>{pulse.comments}</span>
              </button>
              <button
                className={`flex items-center hover:text-green-500 transition-colors ${
                  pulse.isRepulsed ? "text-green-500" : ""
                }`}
              >
                <Repeat size={18} className="mr-1" />
                <span>{pulse.repulses}</span>
              </button>
              <button
                className={`flex items-center hover:text-red-500 transition-colors ${
                  pulse.isLiked ? "text-red-500" : ""
                }`}
              >
                <Heart size={18} className="mr-1" />
                <span>{pulse.likes}</span>
              </button>
              <button className="flex items-center hover:text-[#00BFFF] transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <button className="w-full bg-[#252525] hover:bg-[#333] text-white py-3 rounded-lg transition-colors">
          Post a Pulse about {matchTitle}
        </button>
      </div>
    </motion.div>
  )
}
