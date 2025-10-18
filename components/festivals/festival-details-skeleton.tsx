// For the plural import: components/festivals/festival-details-skeleton.tsx
"use client"
import { Skeleton } from "@/components/ui/skeleton"

export function FestivalDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 text-white animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-12">
        <Skeleton className="h-64 w-full rounded-lg bg-gray-700" />
        <div className="mt-[-80px] px-8 flex items-end space-x-6 relative z-10">
          <Skeleton className="h-40 w-40 rounded-lg border-4 border-gray-800 bg-gray-600" />
          <div>
            <Skeleton className="h-10 w-72 mb-2 bg-gray-600" />
            <Skeleton className="h-6 w-48 bg-gray-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="mb-8 flex space-x-4 border-b border-gray-700">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 bg-gray-700 rounded-t-md" />
        ))}
      </div>

      {/* Content Section Skeleton (generic) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          {[...Array(2)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <Skeleton className="h-8 w-1/3 bg-gray-700" />
              {[...Array(3)].map((_, itemIndex) => (
                <div key={itemIndex} className="flex space-x-4 p-4 bg-gray-800 rounded-lg">
                  <Skeleton className="h-24 w-16 bg-gray-600 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-gray-600" />
                    <Skeleton className="h-4 w-1/2 bg-gray-600" />
                    <Skeleton className="h-4 w-full bg-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {[...Array(2)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="p-4 bg-gray-800 rounded-lg space-y-3">
              <Skeleton className="h-6 w-1/2 bg-gray-700 mb-3" />
              {[...Array(4)].map((_, itemIndex) => (
                <Skeleton key={itemIndex} className="h-4 w-full bg-gray-700" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
