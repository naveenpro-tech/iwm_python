"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Check } from "lucide-react"

interface PulseResultsProps {
  query: string
  limit: number
}

// Mock pulse search results
const MOCK_PULSE_RESULTS = [
  {
    id: "pulse1",
    userId: "u1",
    username: "CinematicDreamer",
    isVerified: true,
    avatarUrl: "/user-avatar-1.png",
    timestamp: "2 hours ago",
    content:
      "Just watched Oppenheimer in IMAX 70mm and I'm absolutely blown away! The sound design during the Trinity test sequence literally shook the theater. Nolan has outdone himself with this one.",
  },
  {
    id: "pulse2",
    userId: "u2",
    username: "BollywoodBuff",
    isVerified: false,
    avatarUrl: "/user-avatar-2.png",
    timestamp: "4 hours ago",
    content:
      "The way Jawan combines mass entertainment with social commentary is brilliant. Shah Rukh Khan's dual role performance is career-defining! That train sequence is pure cinema magic.",
  },
  {
    id: "pulse3",
    userId: "u3",
    username: "FilmTheoryGuru",
    isVerified: true,
    avatarUrl: "/user-avatar-4.png",
    timestamp: "6 hours ago",
    content:
      "Rewatching Barbie for the 5th time and discovering new layers. The Kendom sequence is a brilliant satire on patriarchy wrapped in pink aesthetics. Greta Gerwig is a genius!",
  },
  {
    id: "pulse4",
    userId: "u4",
    username: "SciFiEnthusiast",
    isVerified: false,
    avatarUrl: "/user-avatar-5.png",
    timestamp: "8 hours ago",
    content:
      "The visual effects in Dune: Part Two are absolutely mind-blowing! The sandworm riding sequence gave me goosebumps. Denis Villeneuve has created a sci-fi masterpiece.",
  },
]

export function PulseResults({ query, limit }: PulseResultsProps) {
  // Filter pulses based on query (in a real app, this would come from API)
  const filteredPulses = MOCK_PULSE_RESULTS.slice(0, limit)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#E0E0E0] font-inter font-medium text-base">Pulses</h3>
        {limit < MOCK_PULSE_RESULTS.length && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=pulses`}
            className="text-[#00BFFF] font-dmsans text-sm flex items-center hover:underline"
          >
            View all
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        )}
      </div>

      {filteredPulses.length > 0 ? (
        <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
          {filteredPulses.map((pulse) => (
            <motion.div
              key={pulse.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(58, 58, 58, 0.5)" }}
              className="rounded-lg p-3 transition-colors border-b border-[#3A3A3A] last:border-b-0"
            >
              <Link href={`/pulse/${pulse.id}`}>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#3A3A3A] flex-shrink-0">
                    <Image
                      src={pulse.avatarUrl || "/placeholder.svg"}
                      alt={pulse.username}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center">
                      <h4 className="font-dmsans text-sm text-[#E0E0E0] truncate">{pulse.username}</h4>
                      {pulse.isVerified && <Check className="w-3 h-3 ml-1 text-[#00BFFF] flex-shrink-0" />}
                      <span className="ml-2 text-[#A0A0A0] text-xs">{pulse.timestamp}</span>
                    </div>
                    <p className="text-[#A0A0A0] text-sm line-clamp-2 mt-1">{pulse.content}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-[#A0A0A0] font-dmsans text-sm">No pulse results found</p>
      )}
    </div>
  )
}
