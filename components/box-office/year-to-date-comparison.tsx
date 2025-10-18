"use client"

import { motion } from "framer-motion"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function YearToDateComparison() {
  const ytdData = {
    current: {
      year: 2023,
      total: "$4.87B",
      change: "+12.4%",
      isPositive: true,
    },
    previous: {
      year: 2022,
      total: "$4.33B",
    },
    topMovies: [
      { title: "Guardians of the Galaxy Vol. 3", gross: "$358.9M" },
      { title: "Spider-Man: Across the Spider-Verse", gross: "$381.4M" },
      { title: "The Little Mermaid", gross: "$298.2M" },
      { title: "Fast X", gross: "$146.1M" },
    ],
  }

  return (
    <Card className="bg-[#282828] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#00BFFF]" />
          Year-to-Date Performance
        </CardTitle>
        <p className="text-gray-400 text-sm">Compared to same period last year</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{ytdData.current.total}</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400">
              vs {ytdData.previous.total} in {ytdData.previous.year}
            </span>
            <div
              className={`flex items-center gap-1 ${ytdData.current.isPositive ? "text-green-400" : "text-red-400"}`}
            >
              {ytdData.current.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-medium">{ytdData.current.change}</span>
            </div>
          </div>
        </motion.div>

        <div>
          <h4 className="text-white font-medium mb-3">Top YTD Performers</h4>
          <div className="space-y-2">
            {ytdData.topMovies.map((movie, index) => (
              <motion.div
                key={movie.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex justify-between items-center p-2 rounded bg-[#1A1A1A]"
              >
                <span className="text-gray-300 text-sm">{movie.title}</span>
                <span className="text-[#00BFFF] font-medium text-sm">{movie.gross}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
