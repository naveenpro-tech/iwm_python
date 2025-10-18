"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Film, User, Camera, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { SearchResult } from "./types"

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  totalCount: number
}

export function SearchResults({ results, isLoading, totalCount }: SearchResultsProps) {
  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "movie":
        return Film
      case "person":
        return User
      case "scene":
        return Camera
    }
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-[#333333]" />
          <Skeleton className="h-6 w-24 bg-[#333333]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-[#333333]" />
          ))}
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Camera className="mx-auto text-gray-600 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
        <p className="text-gray-400">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Search Results</h3>
        <span className="text-gray-400">{totalCount} results found</span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <AnimatePresence>
          {results.map((result) => {
            const Icon = getIcon(result.type)
            return (
              <motion.div key={result.id} variants={itemVariants}>
                <Card className="bg-[#282828] border-gray-700 hover:border-[#00BFFF] transition-all cursor-pointer">
                  <div className="flex gap-4 p-4">
                    {result.poster && (
                      <img
                        src={result.poster || "/placeholder.svg"}
                        alt={result.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{result.title}</h4>
                          {result.year && <p className="text-gray-400 text-sm">{result.year}</p>}
                        </div>
                        <Badge variant="secondary" className="bg-[#333333]">
                          <Icon size={14} className="mr-1" />
                          {result.type}
                        </Badge>
                      </div>

                      {result.rating && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-[#00BFFF] font-bold">{result.rating}</span>
                            <span className="text-gray-400 text-sm">/ 10</span>
                          </div>
                        </div>
                      )}

                      {result.matchScore && (
                        <div className="flex items-center gap-2">
                          <TrendingUp size={14} className="text-green-500" />
                          <span className="text-green-500 text-sm font-medium">{result.matchScore}% match</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
