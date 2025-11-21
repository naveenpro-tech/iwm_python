"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PulseCard } from "./pulse-card"
import type { PulseType } from "./types"
import { PulseSkeleton } from "./pulse-skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface PulseFeedProps {
  pulses: PulseType[]
  isLoading: boolean
  hasMore: boolean
  onReaction: (pulseId: string, reactionType: string) => void
  onLoadMore: () => void
}

export function PulseFeed({ pulses, isLoading, hasMore, onReaction, onLoadMore }: PulseFeedProps) {
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, isLoading, onLoadMore])

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

  if (pulses.length === 0 && !isLoading) {
    return (
      <motion.div
        className="bg-[#282828] rounded-lg p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-2">No pulses found</h3>
        <p className="text-[#A0A0A0] mb-4">
          Be the first to create a pulse or adjust your filters to see more content.
        </p>
        <Button
          variant="outline"
          className="border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/10"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </motion.div>
    )
  }

  return (
    <div>
      <AnimatePresence mode="popLayout">
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {pulses.map((pulse) => (
            <motion.div
              key={pulse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <PulseCard pulse={pulse} onReaction={onReaction} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-6 mt-6">
          {[1, 2, 3].map((i) => (
            <PulseSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Infinite scroll observer */}
      {hasMore && <div ref={observerTarget} className="h-10" />}

      {/* Load more button (fallback for when intersection observer doesn't work) */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={onLoadMore} className="border-[#3A3A3A] text-[#A0A0A0] hover:bg-[#282828]">
            Load more
          </Button>
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && pulses.length > 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">
          <p>You've reached the end of your feed</p>
        </div>
      )}
    </div>
  )
}
