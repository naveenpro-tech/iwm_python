import { Skeleton } from "@/components/ui/skeleton"

interface ContentSkeletonProps {
  viewMode: "grid" | "list"
}

export function ContentSkeleton({ viewMode }: ContentSkeletonProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-[#282828] rounded-lg overflow-hidden">
            <Skeleton className="w-full aspect-[2/3]" />
            <div className="p-3">
              <Skeleton className="h-5 w-full mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-[#282828] rounded-lg overflow-hidden flex">
          <Skeleton className="w-24 sm:w-32 h-36" />
          <div className="p-4 flex-1">
            <div className="flex justify-between items-start mb-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-3 w-40 mb-3" />
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
