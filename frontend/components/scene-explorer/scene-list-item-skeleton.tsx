"use client"

import { motion } from "framer-motion"

export default function SceneListItemSkeleton() {
  return (
    <motion.div
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video md:w-2/5 lg:w-1/3 bg-gray-800 animate-pulse"></div>

      {/* Content Skeleton */}
      <div className="p-4 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-14 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-800 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-800 rounded w-full animate-pulse"></div>
          </div>
        </div>

        <div className="h-4 bg-gray-800 rounded w-full mb-1 animate-pulse"></div>
        <div className="h-4 bg-gray-800 rounded w-5/6 mb-1 animate-pulse"></div>
        <div className="h-4 bg-gray-800 rounded w-4/6 mb-3 animate-pulse"></div>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="h-6 bg-gray-800 rounded w-24 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded w-16 animate-pulse"></div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-800 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-16 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-800 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded w-6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
