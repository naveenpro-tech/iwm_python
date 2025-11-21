import { Skeleton } from "@/components/ui/skeleton"

export function CollectionDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
      {/* Hero Section Skeleton */}
      <div className="relative bg-gradient-to-b from-[#20124d] to-[#121212]">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Skeleton className="h-4 w-32 mb-6 bg-[#2A2A2A]" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Poster Skeleton */}
            <div className="md:col-span-1">
              <Skeleton className="aspect-[2/3] w-full rounded-lg bg-[#2A2A2A]" />
            </div>

            {/* Collection Info Skeleton */}
            <div className="md:col-span-3">
              <Skeleton className="h-6 w-24 mb-2 bg-[#2A2A2A]" />
              <Skeleton className="h-10 w-3/4 mb-3 bg-[#2A2A2A]" />
              <Skeleton className="h-4 w-full mb-2 bg-[#2A2A2A]" />
              <Skeleton className="h-4 w-5/6 mb-6 bg-[#2A2A2A]" />

              <div className="flex flex-wrap gap-6 mb-6">
                <Skeleton className="h-6 w-24 bg-[#2A2A2A]" />
                <Skeleton className="h-6 w-24 bg-[#2A2A2A]" />
                <Skeleton className="h-6 w-36 bg-[#2A2A2A]" />
                <Skeleton className="h-6 w-36 bg-[#2A2A2A]" />
              </div>

              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-24 bg-[#2A2A2A]" />
                <Skeleton className="h-10 w-24 bg-[#2A2A2A]" />
                <Skeleton className="h-10 w-32 bg-[#2A2A2A]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-10 w-64 bg-[#2A2A2A]" />
          <Skeleton className="h-10 w-20 bg-[#2A2A2A]" />
        </div>

        {/* Movie Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="aspect-[2/3] w-full rounded-lg bg-[#2A2A2A]" />
                <Skeleton className="h-5 w-3/4 mt-3 bg-[#2A2A2A]" />
                <Skeleton className="h-4 w-1/2 mt-1 bg-[#2A2A2A]" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
