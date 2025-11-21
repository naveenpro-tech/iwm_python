import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-[180px]" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      {/* Overview metrics skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
      </div>

      {/* Dashboard container skeleton */}
      <Skeleton className="h-[500px] rounded-lg" />

      {/* Reports section skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[180px] rounded-lg" />
            ))}
        </div>
      </div>

      {/* Integration info skeleton */}
      <Skeleton className="h-[120px] rounded-lg" />
    </div>
  )
}
