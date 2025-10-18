"use client"

import { motion } from "framer-motion"

interface LoadingStateProps {
  type: string
}

export function LoadingState({ type }: LoadingStateProps) {
  // Determine the number of skeleton items based on type
  const getSkeletonCount = () => {
    switch (type) {
      case "movies":
        return 8
      case "people":
        return 10
      case "pulses":
        return 5
      case "cricket":
        return 4
      case "all":
        return 4
      default:
        return 6
    }
  }

  // Determine the skeleton layout based on type
  const getSkeletonLayout = () => {
    switch (type) {
      case "movies":
      case "people":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: getSkeletonCount() }).map((_, index) => (
              <MoviePersonSkeleton key={index} />
            ))}
          </div>
        )
      case "pulses":
      case "cricket":
        return (
          <div className="space-y-4">
            {Array.from({ length: getSkeletonCount() }).map((_, index) => (
              <ListItemSkeleton key={index} />
            ))}
          </div>
        )
      case "all":
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Movies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <MoviePersonSkeleton key={`movie-${index}`} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">People</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <MoviePersonSkeleton key={`person-${index}`} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Pulses</h2>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ListItemSkeleton key={`pulse-${index}`} />
                ))}
              </div>
            </section>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {getSkeletonLayout()}
    </motion.div>
  )
}

// Skeleton for movie or person cards
function MoviePersonSkeleton() {
  return (
    <div className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 animate-pulse">
      <div className="aspect-[2/3] bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  )
}

// Skeleton for list items (pulses, cricket)
function ListItemSkeleton() {
  return (
    <div className="bg-[#282828] rounded-lg overflow-hidden border border-gray-700 p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    </div>
  )
}
