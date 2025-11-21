"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MilestoneIcon } from "lucide-react" // Changed to MilestoneIcon
import type { GenreEvolutionEvent } from "@/lib/api"

interface GenreEvolutionTimelineProps {
  timelineEvents: GenreEvolutionEvent[]
  genreName: string
}

export function GenreEvolutionTimeline({ timelineEvents, genreName }: GenreEvolutionTimelineProps) {
  if (!timelineEvents || timelineEvents.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="w-full"
    >
      <h3 className="text-base font-semibold text-gray-100 mb-3 flex items-center">
        <MilestoneIcon className="text-[#00BFFF] mr-1.5" size={18} />
        Key Moments
      </h3>
      <div className="space-y-3 relative pl-4">
        <div className="absolute left-[3px] top-1 bottom-1 w-0.5 bg-gray-600/70 rounded-full"></div>

        {timelineEvents.slice(0, 3).map((event, index) => (
          <motion.div
            key={event.movieId}
            className="relative group"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <div className="absolute -left-[10.5px] top-1.5 w-2.5 h-2.5 bg-[#00BFFF] rounded-full border-2 border-gray-800/50 group-hover:scale-125 transition-transform shadow-md"></div>

            <Link
              href={event.movieUrl}
              className="block bg-gray-700/40 p-2 rounded-md hover:bg-gray-600/60 transition-all shadow-sm hover:shadow-md"
              aria-label={`Learn about ${event.movieTitle}`}
            >
              <div className="flex items-start gap-2">
                <Image
                  src={event.moviePosterUrl || "/placeholder.svg?height=75&width=50&query=movie poster"}
                  alt={event.movieTitle}
                  width={40}
                  height={60}
                  className="rounded-sm object-cover flex-shrink-0 shadow-sm"
                />
                <div className="flex-grow">
                  <p className="text-[11px] font-semibold text-gray-200 group-hover:text-white line-clamp-1">
                    {event.movieTitle} <span className="text-[10px] text-gray-400">({event.year})</span>
                  </p>
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{event.influence}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
