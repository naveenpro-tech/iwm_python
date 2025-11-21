import { Skeleton } from "@/components/ui/skeleton"

export function ExploreContentSkeleton() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-20">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-b from-[#282828] to-[#1A1A1A] py-6 px-4 mb-6">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-48 bg-[#282828] mb-6" />
          <Skeleton className="h-10 w-full md:w-2/3 lg:w-1/2 bg-[#282828]" />
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full bg-[#282828]" />
            ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row gap-6">
        {/* Filters Skeleton */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-[#282828] rounded-lg p-4">
            <Skeleton className="h-8 w-24 bg-[#3A3A3A] mb-4" />

            {Array(3)
              .fill(0)
              .map((_, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                  <Skeleton className="h-6 w-32 bg-[#3A3A3A] mb-3" />

                  <div className="space-y-2">
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-4 rounded bg-[#3A3A3A]" />
                          <Skeleton className="h-4 w-24 bg-[#3A3A3A]" />
                        </div>
                      ))}
                  </div>

                  {sectionIndex < 2 && <div className="h-px w-full bg-[#3A3A3A] my-4" />}
                </div>
              ))}
          </div>
        </aside>

        {/* Grid Skeleton */}
        <main className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg bg-[#282828]" />
                  <Skeleton className="h-5 w-3/4 mt-2 bg-[#282828]" />
                  <Skeleton className="h-4 w-1/2 mt-1 bg-[#282828]" />
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  )
}
