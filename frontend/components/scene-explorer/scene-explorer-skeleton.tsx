"use client"
import SceneCardSkeleton from "./scene-card-skeleton"

export default function SceneExplorerSkeleton() {
  return (
    <div className="container mx-auto px-4 pb-16">
      {/* Header Skeleton */}
      <div className="py-12 md:py-16 text-center">
        <div className="h-10 bg-gray-800 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-800 rounded w-96 max-w-full mx-auto animate-pulse"></div>
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="h-11 bg-gray-800 rounded w-full animate-pulse"></div>
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <div className="h-10 bg-gray-800 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded w-24 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* View Controls Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="h-9 bg-gray-800 rounded w-20 animate-pulse"></div>
          <div className="h-9 bg-gray-800 rounded w-20 animate-pulse"></div>
        </div>
        <div className="h-9 bg-gray-800 rounded w-40 animate-pulse"></div>
      </div>

      {/* Scene Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SceneCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
