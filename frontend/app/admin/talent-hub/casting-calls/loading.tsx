import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function CastingCallsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 lg:w-72">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-[120px] mb-4" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[100px]" />
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-10 w-[100px]" />
                </div>
                <Skeleton className="h-10 w-[200px]" />
              </div>

              <div className="rounded-md border">
                <div className="h-12 px-4 border-b flex items-center">
                  <div className="grid grid-cols-12 w-full">
                    <div className="col-span-5">
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
                    <div className="col-span-1">
                      <Skeleton className="h-4 w-[40px]" />
                    </div>
                  </div>
                </div>

                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-16 px-4 border-b flex items-center">
                      <div className="grid grid-cols-12 w-full">
                        <div className="col-span-5 flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-md" />
                          <div>
                            <Skeleton className="h-4 w-[120px] mb-1" />
                            <Skeleton className="h-3 w-[80px]" />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <div className="col-span-2">
                          <Skeleton className="h-6 w-[60px] rounded-full" />
                        </div>
                        <div className="col-span-2">
                          <Skeleton className="h-4 w-[80px]" />
                        </div>
                        <div className="col-span-1">
                          <Skeleton className="h-8 w-8 rounded-md" />
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
      </div>
    </div>
  )
}
