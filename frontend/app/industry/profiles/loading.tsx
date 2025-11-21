import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function IndustryProfilesLoading() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Skeleton className="h-8 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-10" />
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden h-full">
            <div className="relative h-32 bg-muted animate-pulse"></div>
            <CardContent className="pt-0">
              <div className="relative -mt-12 flex flex-col items-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-muted animate-pulse"></div>
                <div className="mt-2 text-center">
                  <div className="h-5 bg-muted animate-pulse rounded w-32 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-24 mx-auto"></div>
                  <div className="flex flex-wrap justify-center gap-1 mt-2">
                    <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
                    <div className="h-6 bg-muted animate-pulse rounded w-20"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-12"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
