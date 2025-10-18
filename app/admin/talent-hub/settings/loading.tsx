import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-5 w-[150px]" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-4 w-[250px]" />
                    </div>
                  ))}
                <Skeleton className="h-10 w-[100px] mt-4" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
