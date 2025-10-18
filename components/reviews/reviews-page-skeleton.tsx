"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ReviewsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-9">
          {/* Page Header Skeleton */}
          <div className="mb-8 pt-6">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Navigation Tabs Skeleton */}
          <div className="mb-6 border-b border-siddu-border-subtle">
            <div className="flex">
              <Skeleton className="h-10 w-32 mr-4" />
              <Skeleton className="h-10 w-32 mr-4" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Filter Bar Skeleton */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Review Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-96 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton - Only visible on desktop */}
        <div className="hidden lg:block lg:col-span-3">
          <Skeleton className="h-[500px] rounded-lg" />
        </div>
      </div>
    </div>
  )
}
