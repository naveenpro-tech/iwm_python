"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingStateProps {
  viewMode: "grid" | "list"
}

export function LoadingState({ viewMode }: LoadingStateProps) {
  const itemCount = 12

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: itemCount }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="space-y-2">
              <Skeleton className="aspect-[2/3] rounded-lg bg-[#3A3A3A]" />
              <Skeleton className="h-4 w-3/4 bg-[#3A3A3A]" />
              <Skeleton className="h-3 w-1/2 bg-[#3A3A3A]" />
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: itemCount }).map((_, index) => (
        <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
          <div className="bg-[#282828] rounded-lg p-4">
            <div className="flex gap-4">
              <Skeleton className="w-32 h-48 rounded-lg bg-[#3A3A3A] flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4 bg-[#3A3A3A]" />
                    <Skeleton className="h-4 w-1/2 bg-[#3A3A3A]" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-full bg-[#3A3A3A]" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full bg-[#3A3A3A]" />
                  <Skeleton className="h-6 w-20 rounded-full bg-[#3A3A3A]" />
                  <Skeleton className="h-6 w-20 rounded-full bg-[#3A3A3A]" />
                </div>
                <Skeleton className="h-4 w-full bg-[#3A3A3A]" />
                <Skeleton className="h-4 w-5/6 bg-[#3A3A3A]" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-9 w-32 rounded-md bg-[#3A3A3A]" />
                  <Skeleton className="h-9 w-32 rounded-md bg-[#3A3A3A]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
