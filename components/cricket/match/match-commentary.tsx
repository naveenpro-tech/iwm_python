"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react"

interface CommentaryEntry {
  id: string
  over: number
  ball: number
  commentary: string
  runs?: number
  isWicket?: boolean
  isBoundary?: boolean
  timestamp: string
}

export interface MatchCommentaryProps {
  commentary: CommentaryEntry[]
}

export function MatchCommentary({ commentary }: MatchCommentaryProps) {
  const [visibleCommentary, setVisibleCommentary] = useState(10)
  const sortedCommentary = [...commentary].sort((a, b) => {
    // Sort by over and ball in descending order (latest first)
    if (a.over !== b.over) return b.over - a.over
    return b.ball - a.ball
  })

  const loadMore = () => {
    setVisibleCommentary((prev) => Math.min(prev + 10, commentary.length))
  }

  const loadLess = () => {
    setVisibleCommentary((prev) => Math.max(prev - 10, 10))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <div className="flex items-center mb-6">
        <MessageSquare className="text-[#00BFFF] mr-2" size={24} />
        <h2 className="text-2xl font-bold text-white">Commentary</h2>
      </div>

      <div className="space-y-4">
        {sortedCommentary.slice(0, visibleCommentary).map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * index }}
            className={`p-4 rounded-lg ${
              entry.isWicket
                ? "bg-red-900/30 border border-red-700"
                : entry.isBoundary
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-[#252525]"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${
                    entry.isWicket
                      ? "bg-red-700 text-white"
                      : entry.isBoundary
                        ? "bg-green-700 text-white"
                        : "bg-[#333] text-white"
                  }`}
                >
                  {entry.runs !== undefined ? entry.runs : "W"}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {entry.over}.{entry.ball} Over
                  </div>
                  <div className="text-gray-400 text-xs">{entry.timestamp}</div>
                </div>
              </div>
              {entry.isWicket && <div className="text-red-500 font-bold text-sm">WICKET!</div>}
              {entry.isBoundary && (
                <div className="text-green-500 font-bold text-sm">{entry.runs === 4 ? "FOUR!" : "SIX!"}</div>
              )}
            </div>
            <p className="text-gray-300 ml-13">{entry.commentary}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        {visibleCommentary < commentary.length && (
          <button
            onClick={loadMore}
            className="flex items-center bg-[#252525] hover:bg-[#333] text-white px-4 py-2 rounded-md transition-colors"
          >
            <ChevronDown size={16} className="mr-1" />
            Load More
          </button>
        )}
        {visibleCommentary > 10 && (
          <button
            onClick={loadLess}
            className="flex items-center bg-[#252525] hover:bg-[#333] text-white px-4 py-2 rounded-md transition-colors"
          >
            <ChevronUp size={16} className="mr-1" />
            Show Less
          </button>
        )}
      </div>
    </motion.div>
  )
}
