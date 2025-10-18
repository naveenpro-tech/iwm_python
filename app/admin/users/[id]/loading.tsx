import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
      </div>

      <Skeleton className="h-8 w-[150px]" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[300px] w-full" />
        <div className="md:col-span-2">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </div>
  )
}
