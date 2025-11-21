"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Film,
  Users,
  Briefcase,
  Trophy,
  Activity,
  PowerIcon as Pulse,
  Clock,
  X,
  Star,
  MapPin,
  Calendar,
} from "lucide-react"
import type { RecentItem } from "./types"

interface RecentContentItemProps {
  item: RecentItem
  onRemove: () => void
  delay?: number
}

export function RecentContentItem({ item, onRemove, delay = 0 }: RecentContentItemProps) {
  const getIcon = () => {
    switch (item.type) {
      case "movie":
        return Film
      case "profile":
        return Users
      case "casting":
        return Briefcase
      case "industry":
        return Trophy
      case "cricket":
        return Activity
      case "pulse":
        return Pulse
      default:
        return Film
    }
  }

  const getTypeColor = () => {
    switch (item.type) {
      case "movie":
        return "text-[#FF4500]"
      case "profile":
        return "text-[#00BFFF]"
      case "casting":
        return "text-[#FFD700]"
      case "industry":
        return "text-[#9370DB]"
      case "cricket":
        return "text-[#32CD32]"
      case "pulse":
        return "text-[#FF69B4]"
      default:
        return "text-[#A0A0A0]"
    }
  }

  const Icon = getIcon()
  const typeColor = getTypeColor()

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, delay }}
      className="group"
    >
      <Link href={item.link}>
        <div className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-[#282828] transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            {/* Image */}
            {item.image && (
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-[#282828]">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${typeColor}`} />
                    <h3 className="text-[#E0E0E0] font-inter font-medium line-clamp-1">{item.title}</h3>
                  </div>
                  {item.subtitle && <p className="text-[#A0A0A0] text-sm font-dmsans mb-1">{item.subtitle}</p>}
                  {item.description && (
                    <p className="text-[#808080] text-sm font-dmsans line-clamp-2 mb-2">{item.description}</p>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#A0A0A0]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(item.timestamp)}
                    </span>

                    {item.metadata?.rating && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#FFD700]" />
                        {item.metadata.rating}
                      </span>
                    )}

                    {item.metadata?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.metadata.location}
                      </span>
                    )}

                    {item.metadata?.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Deadline: {new Date(item.metadata.deadline).toLocaleDateString()}
                      </span>
                    )}

                    {item.duration && <span>{item.duration}</span>}

                    {item.status && (
                      <span
                        className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${item.status === "Open" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}
                      `}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <motion.button
                  onClick={(e) => {
                    e.preventDefault()
                    onRemove()
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-[#3A3A3A] rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-[#A0A0A0]" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
