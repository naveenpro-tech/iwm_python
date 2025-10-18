"use client"

import { useState, useEffect } from "react"
import type { CricketMatch, Commentary } from "../types"
import { motion } from "framer-motion"

interface MatchCommentaryProps {
  match: CricketMatch
}

export function MatchCommentary({ match }: MatchCommentaryProps) {
  const [commentary, setCommentary] = useState<Commentary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  // Mock commentary data
  useEffect(() => {
    const generateMockCommentary = () => {
      setIsLoading(true)

      // Generate mock commentary
      const mockCommentary: Commentary[] = []

      // Only generate commentary for matches that have started
      if (match.status !== "Upcoming") {
        const commentaryTypes = ["regular", "boundary", "six", "wicket", "milestone"]
        const commentaryTexts = {
          regular: [
            "Good length delivery, defended back to the bowler.",
            "Short of a length, pulled away to deep square leg for a single.",
            "Full and straight, driven down the ground for a couple.",
            "Pitched up outside off, left alone by the batsman.",
            "Back of a length, tucked away to fine leg for a single.",
            "Slower ball, well picked by the batsman who defends.",
            "Good yorker, dug out to cover for no run.",
            "Short ball, ducked under comfortably.",
            "Full toss, driven to mid-off for a quick single.",
            "Pitched on middle, defended with a straight bat.",
          ],
          boundary: [
            "FOUR! Beautiful cover drive, races away to the boundary!",
            "FOUR! Exquisite cut shot, finds the gap perfectly!",
            "FOUR! Flicked off the pads with elegant timing!",
            "FOUR! Slashed hard through point, no chance for the fielder!",
            "FOUR! Straight down the ground, pure timing!",
          ],
          six: [
            "SIX! Massive hit over long-on, that's huge!",
            "SIX! Picked the length early and deposited it over deep midwicket!",
            "SIX! Dancing down the track and lofted over long-off!",
            "SIX! Pulled with authority over deep square leg!",
            "SIX! Inside-out over extra cover, what a shot!",
          ],
          wicket: [
            "WICKET! Bowled him! The stumps are shattered!",
            "WICKET! Caught at slip! Excellent catch!",
            "WICKET! LBW! The finger goes up immediately!",
            "WICKET! Caught behind! Thin edge and the keeper makes no mistake!",
            "WICKET! Run out! Brilliant fielding and the batsman is well short!",
          ],
          milestone: [
            "FIFTY! Excellent innings, raises the bat to acknowledge the applause!",
            "CENTURY! What a magnificent innings, thoroughly deserved!",
            "FIVE WICKETS! Outstanding bowling performance!",
            "PARTNERSHIP 100! These two have built a solid foundation!",
            "200 UP for the team! Good batting display so far!",
          ],
        }

        // Generate 30 commentary entries
        for (let i = 0; i < 30; i++) {
          const over = Math.floor(i / 6) + 1
          const ball = (i % 6) + 1
          const type = commentaryTypes[Math.floor(Math.random() * commentaryTypes.length)] as
            | "regular"
            | "boundary"
            | "six"
            | "wicket"
            | "milestone"
          const text = commentaryTexts[type][Math.floor(Math.random() * commentaryTexts[type].length)]

          mockCommentary.push({
            id: `commentary-${i}`,
            matchId: match.id,
            timestamp: new Date(Date.now() - (30 - i) * 60000).toISOString(),
            over,
            ball,
            text,
            isKeyMoment: type !== "regular",
            type,
          })
        }
      }

      setCommentary(mockCommentary)
      setIsLoading(false)
    }

    generateMockCommentary()
  }, [match.id, match.status])

  // Filter commentary
  const filteredCommentary = filter ? commentary.filter((c) => c.type === filter) : commentary

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#282828] rounded-lg p-4 animate-pulse">
            <div className="h-4 w-24 bg-[#333333] rounded mb-2"></div>
            <div className="h-4 w-full bg-[#333333] rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (commentary.length === 0) {
    return (
      <div className="bg-[#282828] rounded-lg p-6 text-center">
        <p className="text-[#A0A0A0]">No commentary available for this match</p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === null ? "bg-[#00BFFF] text-[#1A1A1A]" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("boundary")}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === "boundary" ? "bg-[#4CAF50] text-[#1A1A1A]" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
          }`}
        >
          Boundaries
        </button>
        <button
          onClick={() => setFilter("six")}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === "six" ? "bg-[#9C27B0] text-white" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
          }`}
        >
          Sixes
        </button>
        <button
          onClick={() => setFilter("wicket")}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === "wicket" ? "bg-[#F44336] text-white" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
          }`}
        >
          Wickets
        </button>
        <button
          onClick={() => setFilter("milestone")}
          className={`px-3 py-1 rounded-full text-sm ${
            filter === "milestone" ? "bg-[#FFC107] text-[#1A1A1A]" : "bg-[#333333] text-[#E0E0E0] hover:bg-[#444444]"
          }`}
        >
          Milestones
        </button>
      </div>

      {/* Commentary list */}
      <div className="space-y-1">
        {filteredCommentary.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className={`p-3 rounded-lg ${
              comment.type === "regular"
                ? "bg-[#282828]"
                : comment.type === "boundary"
                  ? "bg-[#4CAF50]/20 border-l-4 border-[#4CAF50]"
                  : comment.type === "six"
                    ? "bg-[#9C27B0]/20 border-l-4 border-[#9C27B0]"
                    : comment.type === "wicket"
                      ? "bg-[#F44336]/20 border-l-4 border-[#F44336]"
                      : "bg-[#FFC107]/20 border-l-4 border-[#FFC107]"
            }`}
          >
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium bg-[#333333] px-2 py-0.5 rounded-full text-[#A0A0A0]">
                {comment.over}.{comment.ball}
              </span>
              <span className="text-xs text-[#A0A0A0] ml-2">
                {new Date(comment.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className={`${comment.type !== "regular" ? "font-medium text-[#E0E0E0]" : "text-[#A0A0A0]"}`}>
              {comment.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
