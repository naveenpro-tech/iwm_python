import { Skeleton } from "@/components/ui/skeleton"

export default function WhereToWatchLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      <Skeleton className="h-10 w-80" />

      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>

        <Skeleton className="h-10 w-full max-w-md" />

        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted p-3">
            <div className="grid grid-cols-6 gap-4">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          </div>

          <div className="p-3 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
                <Skeleton className="h-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
