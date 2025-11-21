import { Skeleton } from "@/components/ui/skeleton"

export default function BulkImportLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-1/2 mb-2" />
        <Skeleton className="h-5 w-2/3" />
      </div>

      <Skeleton className="h-10 w-80" />

      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-6 w-40 mb-4" />

        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  )
}
