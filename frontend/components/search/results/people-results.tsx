"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Check } from "lucide-react"

interface PeopleResultsProps {
  query: string
  limit: number
}

// Mock people search results
const MOCK_PEOPLE_RESULTS = [
  {
    id: "p1",
    name: "Christopher Nolan",
    role: "Director",
    avatarUrl: "/christopher-nolan.png",
    isVerified: true,
  },
  {
    id: "p2",
    name: "Leonardo DiCaprio",
    role: "Actor",
    avatarUrl: "/leonardo-dicaprio.png",
    isVerified: true,
  },
  {
    id: "p3",
    name: "Cillian Murphy",
    role: "Actor",
    avatarUrl: "/cillian-murphy-portrait.png",
    isVerified: false,
  },
  {
    id: "p4",
    name: "Margot Robbie",
    role: "Actor",
    avatarUrl: "/placeholder.svg?height=80&width=80&query=margot robbie",
    isVerified: true,
  },
  {
    id: "p5",
    name: "Robert Oppenheimer",
    role: "Historical Figure",
    avatarUrl: "/placeholder.svg?height=80&width=80&query=robert oppenheimer",
    isVerified: false,
  },
]

export function PeopleResults({ query, limit }: PeopleResultsProps) {
  // Filter people based on query (in a real app, this would come from API)
  const filteredPeople = MOCK_PEOPLE_RESULTS.slice(0, limit)

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
        <h3 className="text-[#E0E0E0] font-inter font-medium text-base">People</h3>
        {limit < MOCK_PEOPLE_RESULTS.length && (
          <Link
            href={`/search?q=${encodeURIComponent(query)}&type=people`}
            className="text-[#00BFFF] font-dmsans text-sm flex items-center hover:underline"
          >
            View all
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        )}
      </div>

      {filteredPeople.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPeople.map((person) => (
            <motion.div
              key={person.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(58, 58, 58, 0.5)" }}
              className="rounded-lg p-2 transition-colors"
            >
              <Link href={`/person/${person.id}`} className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#3A3A3A] flex-shrink-0">
                  <Image
                    src={person.avatarUrl || "/placeholder.svg"}
                    alt={person.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center">
                    <h4 className="font-dmsans text-[#E0E0E0] truncate">{person.name}</h4>
                    {person.isVerified && <Check className="w-4 h-4 ml-1 text-[#00BFFF] flex-shrink-0" />}
                  </div>
                  <p className="text-[#A0A0A0] text-xs">{person.role}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-[#A0A0A0] font-dmsans text-sm">No people results found</p>
      )}
    </div>
  )
}
