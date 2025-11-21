import { Skeleton } from "@/components/ui/skeleton"

export function WatchlistSkeleton() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#E0E0E0] pb-20">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-b from-[#282828] to-[#1A1A1A] py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-10 w-48 bg-[#282828]" />
            <Skeleton className="h-10 w-40 bg-[#282828]" />
          </div>

          <div className="mt-6">
            <Skeleton className="h-10 w-full max-w-md bg-[#282828]" />
          </div>
        </div>
      </div>

      {/* Statistics Skeleton */}
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="h-64 w-full mb-6 bg-[#282828]" />

        {/* Toolbar Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-5 w-20 bg-[#282828]" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32 bg-[#282828]" />
            <Skeleton className="h-9 w-32 bg-[#282828]" />
            <Skeleton className="h-9 w-20 bg-[#282828]" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="aspect-[2/3] w-full rounded-lg bg-[#282828]" />
                <Skeleton className="h-5 w-3/4 mt-3 bg-[#282828]" />
                <Skeleton className="h-4 w-1/2 mt-1 bg-[#282828]" />
                <Skeleton className="h-4 w-3/4 mt-1 bg-[#282828]" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
