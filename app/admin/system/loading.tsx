import { Skeleton } from "@/components/ui/skeleton"

export default function SystemLoading() {
  return (
    <div className="space-y-8 p-8">
      <Skeleton className="h-10 w-64" />

      <div className="grid grid-cols-1 gap-8">
        <Skeleton className="h-[500px] w-full rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[600px] w-full rounded-lg" />
          <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>

        <Skeleton className="h-[500px] w-full rounded-lg" />

        <Skeleton className="h-[500px] w-full rounded-lg" />

        <Skeleton className="h-[500px] w-full rounded-lg" />

        <Skeleton className="h-[500px] w-full rounded-lg" />

        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  )
}
