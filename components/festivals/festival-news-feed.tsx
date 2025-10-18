"use client"

import { motion } from "framer-motion"
import { Clock, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const newsItems = [
  {
    id: 1,
    title: "Cannes 2024 Lineup Announced",
    excerpt: "Festival reveals competition films including latest from acclaimed directors",
    image: "/cannes-announcement.png",
    category: "Breaking",
    time: "2 hours ago",
    festival: "Cannes",
  },
  {
    id: 2,
    title: "Venice Introduces New VR Category",
    excerpt: "The festival embraces immersive storytelling with dedicated VR competition",
    image: "/venice-vr.png",
    category: "Innovation",
    time: "5 hours ago",
    festival: "Venice",
  },
  {
    id: 3,
    title: "Sundance Box Office Success Stories",
    excerpt: "Films that premiered at Sundance dominate indie box office",
    image: "/sundance-success.png",
    category: "Industry",
    time: "1 day ago",
    festival: "Sundance",
  },
  {
    id: 4,
    title: "TIFF People's Choice Award Impact",
    excerpt: "Historical analysis shows strong Oscar correlation with TIFF winners",
    image: "/tiff-awards.png",
    category: "Analysis",
    time: "2 days ago",
    festival: "TIFF",
  },
]

export function FestivalNewsFeed() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Latest Festival News</h2>
        <Badge className="bg-[#00BFFF]/10 text-[#00BFFF] border-[#00BFFF]/20">
          <TrendingUp className="h-3 w-3 mr-1" />
          Trending
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-[#282828] border-gray-800 overflow-hidden hover:bg-[#333] transition-colors cursor-pointer">
              <div className="relative h-48">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm">{item.festival}</Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.excerpt}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
