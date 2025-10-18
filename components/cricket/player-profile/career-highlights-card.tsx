"use client"

import { motion } from "framer-motion"
import { Trophy, Calendar, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface CareerHighlightsCardProps {
  highlights: {
    id: string
    title: string
    date: string
    description: string
    imageUrl?: string
    achievement: string
    venue?: string
    opposition?: string
  }[]
}

export function CareerHighlightsCard({ highlights }: CareerHighlightsCardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-white mb-6"
      >
        Career Highlights
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-[#282828] border-gray-700 h-full">
              <div className="relative h-48 w-full">
                <Image
                  src={highlight.imageUrl || "/cricket/wankhede-stadium.png"}
                  alt={highlight.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#282828]"></div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-[#00BFFF]" />
                  <span className="text-sm text-gray-400">{highlight.date}</span>
                </div>
                <CardTitle className="text-white">{highlight.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 mb-4">{highlight.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#00BFFF]" />
                    <span className="text-white font-medium">{highlight.achievement}</span>
                  </div>

                  {highlight.opposition && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#00BFFF]" />
                      <span className="text-gray-300">vs {highlight.opposition}</span>
                    </div>
                  )}

                  {highlight.venue && (
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#00BFFF]" />
                      <span className="text-gray-300">at {highlight.venue}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
