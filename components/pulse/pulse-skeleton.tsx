import { Skeleton } from "@/components/ui/skeleton"

export function PulseSkeleton() {
  return (
    <div className="bg-[#282828] rounded-lg p-4 border border-[#3A3A3A]">
      <div className="flex gap-3">
        {/* Avatar skeleton */}
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />

        <div className="flex-1">
          {/* User info skeleton */}
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Media skeleton (random) */}
          {Math.random() > 0.5 && (
            <div className="mb-4">
              <Skeleton className="h-40 w-full rounded-md" />
            </div>
          )}

          {/* Engagement bar skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}
