"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Calendar, Globe } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BoxOfficeRecordsProps {
  records: any[]
}

export function BoxOfficeRecords({ records }: BoxOfficeRecordsProps) {
  const recordsData = [
    {
      category: "Highest Grossing All-Time",
      title: "Avatar",
      value: "$2.92B",
      year: "2009",
      icon: Trophy,
      poster: "/avatar-poster.png",
    },
    {
      category: "Biggest Opening Weekend",
      title: "Avengers: Endgame",
      value: "$357.1M",
      year: "2019",
      icon: Star,
      poster: "/action-movie-poster.png",
    },
    {
      category: "Fastest to $1 Billion",
      title: "Spider-Man: No Way Home",
      value: "12 days",
      year: "2021",
      icon: Calendar,
      poster: "/animated-movie-poster.png",
    },
    {
      category: "Highest International Gross",
      title: "Avatar: The Way of Water",
      value: "$1.73B",
      year: "2022",
      icon: Globe,
      poster: "/avatar-poster.png",
    },
  ]

  return (
    <Card className="bg-[#282828] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[#00BFFF]" />
          Box Office Records
        </CardTitle>
        <p className="text-gray-400 text-sm">All-time box office achievements</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recordsData.map((record, index) => (
            <motion.div
              key={record.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1A1A1A] rounded-lg p-4 hover:bg-[#3A3A3A] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-12 rounded overflow-hidden">
                  <Image src={record.poster || "/placeholder.svg"} alt={record.title} fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <record.icon className="h-4 w-4 text-[#00BFFF]" />
                    <span className="text-xs text-gray-400 uppercase tracking-wide">{record.category}</span>
                  </div>

                  <h3 className="text-white font-semibold mb-1">{record.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#00BFFF] font-bold text-lg">{record.value}</span>
                    <span className="text-gray-400 text-sm">{record.year}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
