"use client"

import { motion } from "framer-motion"
import { Heart, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FavoritesHeaderProps {
  totalCount: number
}

export function FavoritesHeader({ totalCount }: FavoritesHeaderProps) {
  return (
    <div className="border-b border-gray-700 bg-[#1A1A1A]/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Favorites</h1>
              <p className="text-gray-400">
                {totalCount} {totalCount === 1 ? "movie" : "movies"} in your favorites collection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-gray-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share Collection
            </Button>
            <Button variant="outline" className="border-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
