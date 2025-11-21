import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ReportsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="mt-3">
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Reports Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
            <Skeleton className="h-10 w-[200px]" />
          </div>

          <div className="rounded-md border">
            <div className="h-12 px-4 border-b flex items-center">
              <div className="grid grid-cols-12 w-full">
                <div className="col-span-4">
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-[80px]" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </div>
            </div>

            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-16 px-4 border-b flex items-center">
                  <div className="grid grid-cols-12 w-full">
                    <div className="col-span-4 flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-[120px] mb-1" />
                        <Skeleton className="h-3 w-[80px]" />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-6 w-[60px] rounded-full" />
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Skeleton className="h-8 w-[100px]" />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-8 w-[100px]" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
