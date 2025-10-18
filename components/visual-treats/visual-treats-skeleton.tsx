export function VisualTreatsSkeleton() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] p-4 md:p-8 text-white">
      <div className="container mx-auto">
        <div className="animate-pulse">
          {/* Header */}
          <div className="mb-12">
            <div className="h-12 w-3/4 bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-700 rounded-lg"></div>
          </div>

          {/* Search and Controls Skeleton */}
          <div className="mb-8 p-4 bg-[#222222]/50 rounded-xl border border-gray-700">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="h-11 w-full md:max-w-md bg-gray-700 rounded-md"></div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="h-11 w-12 bg-gray-700 rounded-md"></div>
                <div className="h-11 w-32 bg-gray-700 rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Results Count Skeleton */}
          <div className="h-4 w-48 bg-gray-700 rounded mb-6"></div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-700 rounded-lg"></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
