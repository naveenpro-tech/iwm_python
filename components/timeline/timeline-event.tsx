"use client"

import { motion } from "framer-motion"
import { Calendar, Film, Info } from "lucide-react"
import Image from "next/image"
import type { TimelineEventData } from "./types"
import { Badge } from "@/components/ui/badge"

interface TimelineEventProps {
  event: TimelineEventData
  position: "left" | "right"
  onClick: () => void
  zoomLevel: number
  searchTerm?: string
}

// Helper to highlight search term (basic implementation)
const Highlight = ({ text, highlight }: { text: string; highlight?: string }) => {
  if (!highlight || !text) {
    return <>{text}</>
  }
  const parts = text.split(new RegExp(`(${highlight})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-500/50 text-yellow-100 px-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function TimelineEvent({ event, position, onClick, zoomLevel, searchTerm }: TimelineEventProps) {
  const cardWidthClasses = ["w-56 sm:w-64", "w-60 sm:w-72", "w-64 sm:w-80", "w-72 sm:w-96", "w-80 sm:w-[28rem]"]
  const paddingClasses = ["p-2 sm:p-3", "p-3 sm:p-4", "p-3 sm:p-4", "p-4 sm:p-5", "p-4 sm:p-6"]

  const cardWidth = cardWidthClasses[zoomLevel - 1] || cardWidthClasses[2]
  const padding = paddingClasses[zoomLevel - 1] || paddingClasses[2]

  const categoryStyles: Record<TimelineEventData["category"], string> = {
    development: "border-purple-500 bg-purple-500/10 text-purple-300 dot-purple-500",
    production: "border-blue-500 bg-blue-500/10 text-blue-300 dot-blue-500",
    "post-production": "border-indigo-500 bg-indigo-500/10 text-indigo-300 dot-indigo-500",
    marketing: "border-pink-500 bg-pink-500/10 text-pink-300 dot-pink-500",
    release: "border-green-500 bg-green-500/10 text-green-300 dot-green-500",
    reception: "border-teal-500 bg-teal-500/10 text-teal-300 dot-teal-500",
    award: "border-yellow-500 bg-yellow-500/10 text-yellow-300 dot-yellow-500",
  }
  const style = categoryStyles[event.category] || "border-gray-500 bg-gray-500/10 text-gray-300 dot-gray-500"
  const dotColor =
    style
      .split(" ")
      .find((s) => s.startsWith("dot-"))
      ?.split("-")[1] || "gray-500"

  const isLeft = position === "left"
  const cardMargin = isLeft ? "md:mr-10" : "md:ml-10"
  const cardAlignment = isLeft ? "md:text-right" : "md:text-left" // For date on opposite side
  const cardFlexDirection = isLeft ? "flex-row-reverse" : "flex-row"

  return (
    <motion.div
      id={`event-${event.id}`}
      className={`relative flex ${isLeft ? "justify-start" : "justify-end"} w-full`}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Central Timeline Dot - always in the middle for larger screens */}
      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 z-10 hidden md:block`}>
        <div
          className={`w-full h-full rounded-full bg-${dotColor} border-4 border-[#101010] ring-1 ring-${dotColor}/50 shadow-lg`}
        ></div>
      </div>
      {/* Mobile Timeline Dot - aligned to the left */}
      <div className={`absolute left-4 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 z-10 md:hidden`}>
        <div
          className={`w-full h-full rounded-full bg-${dotColor} border-2 border-[#101010] ring-1 ring-${dotColor}/50`}
        ></div>
      </div>

      {/* Event Card Container - full width on mobile, half on desktop */}
      <div className={`w-full md:w-[calc(50%-2.5rem)] flex ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
        <motion.div
          className={`${cardWidth} ${padding} bg-[#1C1C1C] rounded-xl border ${style.split(" ")[0]} shadow-lg cursor-pointer hover:shadow-2xl hover:border-${dotColor} transition-all duration-300 ml-10 md:ml-0 ${cardMargin} relative`}
          onClick={onClick}
          whileHover={{ y: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Significance Badge */}
          {event.significance && event.significance !== "minor" && (
            <Badge
              variant="default"
              className={`absolute -top-2 ${isLeft ? "-right-2" : "-left-2"} text-xs px-1.5 py-0.5 capitalize bg-${dotColor} text-black shadow-md`}
            >
              {event.significance.replace("-", " ")}
            </Badge>
          )}

          {event.image && zoomLevel > 1 && (
            <div className="relative h-32 sm:h-40 w-full rounded-lg overflow-hidden mb-3 shadow-inner">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          {event.videoEmbed && !event.image && zoomLevel > 1 && (
            <div className="relative h-32 sm:h-40 w-full rounded-lg overflow-hidden mb-3 bg-black flex items-center justify-center">
              <Film className="w-12 h-12 text-gray-500" />
            </div>
          )}

          <div className={`flex items-center gap-2 mb-1 ${zoomLevel < 3 ? "text-xs" : "text-sm"}`}>
            <Calendar className={`h-3.5 w-3.5 text-${dotColor}`} />
            <span className={`font-medium text-${dotColor}`}>{event.formattedDate}</span>
          </div>

          <h3
            className={`text-white font-semibold mb-1.5 ${zoomLevel < 2 ? "text-sm" : zoomLevel < 4 ? "text-base" : "text-lg"}`}
          >
            <Highlight text={event.title} highlight={searchTerm} />
          </h3>

          {zoomLevel > 1 && (
            <p className={`text-[#B0B0B0] ${zoomLevel < 3 ? "text-xs line-clamp-2" : "text-sm line-clamp-3"}`}>
              <Highlight text={event.description} highlight={searchTerm} />
            </p>
          )}

          {event.tags && zoomLevel > 2 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {event.tags.slice(0, zoomLevel + 1).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`text-xs bg-[#2A2A2A] text-[#A0A0A0] border-[#3A3A3A] ${searchTerm && tag.toLowerCase().includes(searchTerm.toLowerCase()) ? "ring-2 ring-yellow-500" : ""}`}
                >
                  <Highlight text={tag} highlight={searchTerm} />
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-[#2A2A2A]/50 flex justify-between items-center">
            <span
              className={`capitalize px-2 py-0.5 text-xs rounded-full font-medium ${style.split(" ")[1]} ${style.split(" ")[2]}`}
            >
              {event.category.replace("-", " ")}
            </span>
            <Info className="w-4 h-4 text-gray-500 hover:text-[#00BFFF]" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
