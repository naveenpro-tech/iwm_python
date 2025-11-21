"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Film } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FestivalWinnersProps {
  festivalId: string
  year: number
}

export function FestivalWinners({ festivalId, year }: FestivalWinnersProps) {
  const winners = MOCK_WINNERS[festivalId] || []

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#00BFFF]" />
          Award Winners {year}
        </h2>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {winners.map((category) => (
          <motion.div key={category.id} variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold text-[#00BFFF]">{category.categoryName}</h3>

            <div className="grid gap-4">
              {category.winners.map((winner, index) => (
                <Card key={winner.id} className="bg-[#282828] border-gray-800 p-4 hover:bg-[#3A3A3A] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-28 rounded-md overflow-hidden">
                      <Image
                        src={winner.moviePoster || "/placeholder.svg"}
                        alt={winner.movieTitle}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/movies/${winner.movieId}`}
                            className="text-lg font-semibold hover:text-[#00BFFF] transition-colors"
                          >
                            {winner.movieTitle}
                          </Link>
                          {winner.recipient && <p className="text-sm text-gray-400 mt-1">{winner.recipient}</p>}
                        </div>
                        <Badge
                          variant={index === 0 ? "default" : "secondary"}
                          className={index === 0 ? "bg-[#FFD700]" : ""}
                        >
                          {index === 0 ? (
                            <>
                              <Trophy className="h-3 w-3 mr-1" />
                              Winner
                            </>
                          ) : (
                            "Nominee"
                          )}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">{winner.citation}</p>

                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Film className="h-3 w-3" />
                          {winner.director}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {winner.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// Mock data
const MOCK_WINNERS = {
  cannes: [
    {
      id: "palme-dor",
      categoryName: "Palme d'Or",
      winners: [
        {
          id: "1",
          movieId: "anatomy-of-a-fall",
          movieTitle: "Anatomy of a Fall",
          moviePoster: "/placeholder.svg?height=400&width=300",
          recipient: "Justine Triet",
          director: "Justine Triet",
          citation: "For its masterful exploration of truth and perception in relationships",
          rating: 8.2,
        },
      ],
    },
    {
      id: "grand-prix",
      categoryName: "Grand Prix",
      winners: [
        {
          id: "2",
          movieId: "zone-of-interest",
          movieTitle: "The Zone of Interest",
          moviePoster: "/placeholder.svg?height=400&width=300",
          recipient: "Jonathan Glazer",
          director: "Jonathan Glazer",
          citation: "For its haunting portrayal of the banality of evil",
          rating: 8.1,
        },
      ],
    },
  ],
}
