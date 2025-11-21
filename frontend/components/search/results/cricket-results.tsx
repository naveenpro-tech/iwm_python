"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface CricketResultsProps {
  query: string
  limit: number
}

// Mock cricket search results
const MOCK_CRICKET_RESULTS = [
  {
    id: "match1",
    teams: "India vs Australia",
    tournament: "World Cup 2023",
    status: "Live",
    statusColor: "#FF4500",
  },
  {
    id: "match2",
    teams: "England vs South Africa",
    tournament: "T20 Series",
    status: "Upcoming",
    statusColor: "#00BFFF",
  },
  {
    id: "match3",
    teams: "New Zealand vs Pakistan",
    tournament: "Test Series",
    status: "Completed",
    statusColor: "#A0A0A0",
  },
  {
    id: "match4",
    teams: "India vs Sri Lanka",
    tournament: "ODI Series",
    status: "Upcoming",
    statusColor: "#00BFFF",
  },
]

export function CricketResults({ query, limit }: CricketResultsProps) {
  // Filter cricket matches based on query (in a real app, this would come from API)
  const filteredMatches = MOCK_CRICKET_RESULTS.slice(0, limit)

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
        <h3 className="text-[#E0E0E0] font-inter font-medium text-base">Cricket</h3>
        {limit < MOCK_CRICKET_RESULTS.length && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=cricket`}
            className="text-[#00BFFF] font-dmsans text-sm flex items-center hover:underline"
          >
            View all
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        )}
      </div>

      {filteredMatches.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredMatches.map((match) => (
            <motion.div
              key={match.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(58, 58, 58, 0.5)" }}
              className="rounded-lg p-3 transition-colors border border-[#3A3A3A]"
            >
              <Link href={`/cricket/${match.id}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-dmsans text-[#E0E0E0]">{match.teams}</h4>
                    <p className="text-[#A0A0A0] text-xs">{match.tournament}</p>
                  </div>
                  <div
                    className="px-2 py-1 rounded-full text-xs font-dmsans"
                    style={{ backgroundColor: `${match.statusColor}20`, color: match.statusColor }}
                  >
                    {match.status}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-[#A0A0A0] font-dmsans text-sm">No cricket match results found</p>
      )}
    </div>
  )
}
