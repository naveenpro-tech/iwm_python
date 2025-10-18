import { Skeleton } from "@/components/ui/skeleton"

export default function QuizTakeLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-8">
      <div className="container mx-auto py-6 px-4 max-w-5xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <Skeleton className="h-8 w-64 bg-gray-800" />
              <Skeleton className="h-4 w-48 bg-gray-800 mt-2" />
            </div>
            <Skeleton className="h-20 w-20 rounded-full bg-gray-800 mt-4 md:mt-0" />
          </div>

          <Skeleton className="h-24 w-full bg-gray-800 rounded-lg" />
        </div>

        {/* Question Card Skeleton */}
        <Skeleton className="h-[400px] w-full bg-gray-800 rounded-lg mb-8" />

        {/* Navigation Controls Skeleton */}
        <div className="flex justify-between mt-8">
          <Skeleton className="h-12 w-32 bg-gray-800 rounded-md" />
          <Skeleton className="h-12 w-32 bg-gray-800 rounded-md" />
        </div>
      </div>
    </main>
  )
}
