"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface LoadingStateProps {
  viewMode: string
}

export function LoadingState({ viewMode }: LoadingStateProps) {
  // Create an array of 6 items for the grid/list
  const items = Array.from({ length: 6 }, (_, i) => i)

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item}
            className="bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-lg overflow-hidden"
          >
            {/* Movie Context Bar */}
            <div className="flex items-center p-3 border-b border-siddu-border-subtle">
              <Skeleton className="w-10 h-15 mr-3 rounded" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>

            {/* Review Header */}
            <div className="p-4 pb-2">
              <div className="flex items-center mb-3">
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="w-12 h-8 rounded" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2" />
            </div>

            {/* Review Content */}
            <div className="px-4 pb-3">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Review Footer */}
            <div className="px-4 py-3 border-t border-siddu-border-subtle flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={item}
          className="bg-siddu-bg-card-dark border border-siddu-border-subtle rounded-lg overflow-hidden p-4 md:p-5"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Movie Poster */}
            <Skeleton className="w-full md:w-24 h-36 rounded" />

            {/* Review Content */}
            <div className="flex-1">
              {/* Movie Title and Year */}
              <Skeleton className="h-5 w-3/4 mb-2" />

              {/* Review Header */}
              <div className="flex items-center mb-3">
                <Skeleton className="w-8 h-8 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="w-12 h-8 rounded" />
              </div>

              {/* Review Title */}
              <Skeleton className="h-6 w-2/3 mb-2" />

              {/* Review Content */}
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />

              {/* Review Footer */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
