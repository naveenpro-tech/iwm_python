"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function FestivalsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Hero Skeleton */}
      <div className="relative h-[60vh] min-h-[500px]">
        <Skeleton className="absolute inset-0 bg-gray-800" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-full bg-gray-800" />
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-96 bg-gray-800" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full bg-gray-800" />
              <Skeleton className="h-4 w-3/4 bg-gray-800" />
              <Skeleton className="h-4 w-1/2 bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
