"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { TrendingUp, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TrendingTopic {
  id: number
  tag: string
  count: number
  category?: "movie" | "cricket" | "event" | "general"
}

export function TrendingTopicsBar() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll controls
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  useEffect(() => {
    // Simulate API fetch for trending topics
    const fetchTrendingTopics = () => {
      setIsLoading(true)

      // Mock data with categories
      const mockTopics: TrendingTopic[] = [
        { id: 1, tag: "#Oppenheimer", count: 12453, category: "movie" },
        { id: 2, tag: "#Dune2", count: 8976, category: "movie" },
        { id: 3, tag: "#OscarSeason", count: 7654, category: "event" },
        { id: 4, tag: "#IndiaVsAustralia", count: 6543, category: "cricket" },
        { id: 5, tag: "#PoorThings", count: 5432, category: "movie" },
        { id: 6, tag: "#Challengers", count: 4321, category: "movie" },
        { id: 7, tag: "#CivilWar", count: 3210, category: "movie" },
        { id: 8, tag: "#IPL2024", count: 2109, category: "cricket" },
        { id: 9, tag: "#FilmCritics", count: 1987, category: "general" },
        { id: 10, tag: "#Cannes2024", count: 1876, category: "event" },
        { id: 11, tag: "#VisualEffects", count: 1765, category: "general" },
        { id: 12, tag: "#Cinematography", count: 1654, category: "general" },
      ]

      setTimeout(() => {
        setTrendingTopics(mockTopics)
        setIsLoading(false)
      }, 800)
    }

    fetchTrendingTopics()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
  }

  // Get category color
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "movie":
        return "bg-gradient-to-r from-[#FF4D4D]/20 to-[#FF4D4D]/10 text-[#FF4D4D]"
      case "cricket":
        return "bg-gradient-to-r from-[#4DFF77]/20 to-[#4DFF77]/10 text-[#4DFF77]"
      case "event":
        return "bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 text-[#FFD700]"
      default:
        return "bg-gradient-to-r from-[#00BFFF]/20 to-[#00BFFF]/10 text-[#00BFFF]"
    }
  }

  return (
    <motion.div className="mb-6 relative" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="flex items-center mb-2">
        <TrendingUp className="w-4 h-4 text-[#00BFFF] mr-2" />
        <span className="text-sm text-[#A0A0A0]">Trending Topics</span>
      </div>

      <div className="relative group">
        {/* Left scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-[#282828]/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Scrollable container */}
        <div ref={scrollContainerRef} className="flex overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 scroll-smooth">
          {isLoading ? (
            // Loading skeletons
            <div className="flex gap-1.5 md:gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 w-24 sm:w-32 bg-[#282828] rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div className="flex gap-1.5 md:gap-2">
              {trendingTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  className={`px-3 py-1.5 rounded-full cursor-pointer whitespace-nowrap text-sm transition-all ${getCategoryColor(topic.category)}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{topic.tag}</span>
                  <span className="text-[#A0A0A0] text-xs ml-1">
                    {topic.count > 1000 ? `${(topic.count / 1000).toFixed(1)}K` : topic.count}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Right scroll button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-[#282828]/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
