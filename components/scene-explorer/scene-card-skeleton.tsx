"use client"

import { motion } from "framer-motion"

export default function SceneCardSkeleton() {
  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video bg-gray-800 animate-pulse"></div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-8 h-12 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-800 rounded w-full animate-pulse"></div>
          </div>
        </div>

        <div className="h-4 bg-gray-800 rounded w-full mb-1 animate-pulse"></div>
        <div className="h-4 bg-gray-800 rounded w-5/6 mb-3 animate-pulse"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-800 rounded w-12 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-12 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-800 rounded w-6 animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  )
}
