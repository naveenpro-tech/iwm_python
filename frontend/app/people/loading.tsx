import { Skeleton } from "@/components/ui/skeleton"

export default function PeopleDirectoryLoading() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 max-w-md mb-2" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar Skeleton */}
          <div className="w-full md:w-64 shrink-0">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>

          <div className="flex-1">
            {/* Search and Controls Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Skeleton className="h-10 w-full sm:w-64" />
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-20 rounded-md" />
              </div>
            </div>

            {/* Quick Filters Skeleton */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-md" />
                ))}
              </div>
            </div>

            {/* Results Count Skeleton */}
            <Skeleton className="h-5 w-48 mb-4" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-square w-full rounded-lg mb-2" />
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-center">
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
