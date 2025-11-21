"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WeekendSummary() {
  const weekendData = [
    {
      rank: 1,
      title: "Oppenheimer",
      weekend: "$82.4M",
      total: "$174.2M",
      change: "+15.2%",
      isPositive: true,
      poster: "/oppenheimer-inspired-poster.png",
    },
    {
      rank: 2,
      title: "Barbie",
      weekend: "$70.5M",
      total: "$155.8M",
      change: "+8.7%",
      isPositive: true,
      poster: "/barbie-movie-poster.png",
    },
    {
      rank: 3,
      title: "Mission: Impossible",
      weekend: "$54.2M",
      total: "$126.3M",
      change: "-12.4%",
      isPositive: false,
      poster: "/top-gun-maverick-inspired-poster.png",
    },
    {
      rank: 4,
      title: "Indiana Jones 5",
      weekend: "$31.7M",
      total: "$98.1M",
      change: "-18.9%",
      isPositive: false,
      poster: "/action-movie-poster.png",
    },
    {
      rank: 5,
      title: "Spider-Man: Across",
      weekend: "$19.3M",
      total: "$381.4M",
      change: "-5.2%",
      isPositive: false,
      poster: "/animated-movie-poster.png",
    },
  ]

  return (
    <Card className="bg-[#282828] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-[#00BFFF]" />
          Weekend Box Office Leaders
        </CardTitle>
        <p className="text-gray-400 text-sm">July 21-23, 2023 • North America</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weekendData.map((movie, index) => (
            <motion.div
              key={movie.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-[#1A1A1A] hover:bg-[#3A3A3A] transition-colors"
            >
              <div className="text-2xl font-bold text-[#00BFFF] w-8">{movie.rank}</div>

              <div className="relative h-16 w-12 rounded overflow-hidden">
                <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white">{movie.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Weekend: {movie.weekend}</span>
                  <span>Total: {movie.total}</span>
                </div>
              </div>

              <div className="text-right">
                <div className={`flex items-center gap-1 ${movie.isPositive ? "text-green-400" : "text-red-400"}`}>
                  {movie.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-medium">{movie.change}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
