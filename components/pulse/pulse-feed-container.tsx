"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PulseHeader } from "./pulse-header"
import { TrendingTopicsBar } from "./trending-topics-bar"
import { PulseComposer } from "./pulse-composer"
import { PulseFeed } from "./pulse-feed"
import { RightSidebar } from "./right-sidebar"
import { mockPulses } from "./mock-data"
import type { PulseType, FilterType } from "./types"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function PulseFeedContainer() {
  const [pulses, setPulses] = useState<PulseType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>("latest")
  const [showComposer, setShowComposer] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const isMobile = useMobile()

  const loadPulses = useCallback(
    (reset = false) => {
      setIsLoading(true)

      // Simulate API fetch with delay
      setTimeout(() => {
        let filteredPulses = [...mockPulses]

        // Apply filter logic
        if (activeFilter === "popular") {
          filteredPulses.sort((a, b) => {
            const aScore = a.engagement.reactions.total * 0.7 + a.engagement.comments * 0.2 + a.engagement.shares * 0.1
            const bScore = b.engagement.reactions.total * 0.7 + b.engagement.comments * 0.2 + b.engagement.shares * 0.1
            return bScore - aScore
          })
        } else if (activeFilter === "following") {
          filteredPulses = filteredPulses.filter((pulse) => pulse.userInfo.isFollowing)
        } else if (activeFilter === "trending") {
          // Sort by recency and engagement combined
          filteredPulses.sort((a, b) => {
            const aDate = new Date(a.timestamp).getTime()
            const bDate = new Date(b.timestamp).getTime()
            const aEngagement = a.engagement.reactions.total + a.engagement.comments * 2 + a.engagement.shares * 3
            const bEngagement = b.engagement.reactions.total + b.engagement.comments * 2 + b.engagement.shares * 3
            return bDate * 0.3 + bEngagement * 0.7 - (aDate * 0.3 + aEngagement * 0.7)
          })
        }

        // Pagination simulation
        const pageSize = 5
        const startIndex = reset ? 0 : (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const paginatedPulses = filteredPulses.slice(0, endIndex)

        // Check if there are more pulses to load
        setHasMore(endIndex < filteredPulses.length)

        if (reset) {
          setPulses(paginatedPulses)
          setPage(1)
        } else {
          setPulses((prev) => [...prev, ...paginatedPulses.slice(prev.length)])
        }

        setIsLoading(false)
      }, 1000)
    },
    [activeFilter, page, mockPulses],
  )

  useEffect(() => {
    loadPulses(true)
  }, [activeFilter, loadPulses])

  const handleFilterChange = (filter: FilterType) => {
    if (filter === activeFilter) return
    setActiveFilter(filter)
    setIsLoading(true)
  }

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return
    setPage((prev) => prev + 1)
  }

  const handlePostSubmit = (newPulse: PulseType) => {
    setPulses((prev) => [newPulse, ...prev])
    setShowComposer(false)
  }

  const handleReaction = (pulseId: string, reactionType: string) => {
    setPulses((prev) =>
      prev.map((pulse) => {
        if (pulse.id === pulseId) {
          const currentReaction = pulse.engagement.userReaction

          // Create a new reactions object
          const newReactions = { ...pulse.engagement.reactions }

          // If user already reacted, remove that reaction
          if (currentReaction) {
            newReactions[currentReaction] = Math.max(0, newReactions[currentReaction] - 1)
            newReactions.total = Math.max(0, newReactions.total - 1)
          }

          // If new reaction is different from current, add it
          if (!currentReaction || currentReaction !== reactionType) {
            newReactions[reactionType] = (newReactions[reactionType] || 0) + 1
            newReactions.total = (newReactions.total || 0) + 1

            return {
              ...pulse,
              engagement: {
                ...pulse.engagement,
                reactions: newReactions,
                userReaction: reactionType,
              },
            }
          } else {
            // User is removing their reaction
            return {
              ...pulse,
              engagement: {
                ...pulse.engagement,
                reactions: newReactions,
                userReaction: undefined,
              },
            }
          }
        }
        return pulse
      }),
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  // Mobile floating action button for creating new pulse
  const FloatingActionButton = () => (
    <motion.div
      className="fixed bottom-20 right-4 z-10 md:hidden"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Button
        onClick={() => setShowComposer(true)}
        className="w-14 h-14 rounded-full bg-[#00BFFF] hover:bg-[#00BFFF]/90 shadow-lg"
        aria-label="Create new pulse"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </motion.div>
  )

  return (
    <motion.div
      className="min-h-screen bg-[#1A1A1A] text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Main Content */}
          <motion.div className="flex-1 w-full max-w-3xl mx-auto md:mx-0" variants={itemVariants}>
            <PulseHeader
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              onComposeClick={() => setShowComposer(true)}
            />

            <TrendingTopicsBar />

            <AnimatePresence>
              {showComposer && <PulseComposer onClose={() => setShowComposer(false)} onSubmit={handlePostSubmit} />}
            </AnimatePresence>

            <PulseFeed
              pulses={pulses}
              isLoading={isLoading}
              onReaction={handleReaction}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </motion.div>

          {/* Right Sidebar - Only on desktop */}
          {!isMobile && (
            <motion.div className="hidden md:block w-80 lg:w-96" variants={itemVariants}>
              <RightSidebar />
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile floating action button */}
      {isMobile && !showComposer && <FloatingActionButton />}
    </motion.div>
  )
}
