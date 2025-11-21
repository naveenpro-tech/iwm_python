export function GenreSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Hero section skeleton */}
      <div className="w-full h-[65vh] min-h-[480px] bg-gray-800/50 mb-8"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters skeleton */}
        <div className="w-full h-12 bg-gray-800/50 rounded-lg mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mt-8">
          <div className="lg:col-span-5">
            {/* Movie grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={`movie-skel-${i}`} className="bg-gray-800/50 rounded-lg">
                    <div className="aspect-[2/3] bg-gray-700/60 rounded-t-lg"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-700/60 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-700/60 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-8">
            {/* Statistics skeleton */}
            <div className="w-full bg-gray-800/50 rounded-xl p-4">
              <div className="h-6 bg-gray-700/60 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-16 bg-gray-700/60 rounded-lg"></div>
                <div className="h-16 bg-gray-700/60 rounded-lg"></div>
                <div className="h-16 bg-gray-700/60 rounded-lg"></div>
                <div className="h-16 bg-gray-700/60 rounded-lg"></div>
              </div>
              <div className="h-36 bg-gray-700/60 rounded-lg mb-3"></div>
              <div className="h-36 bg-gray-700/60 rounded-lg"></div>
            </div>

            {/* Related content skeleton */}
            <div className="w-full bg-gray-800/50 rounded-xl p-4 space-y-4">
              <div>
                <div className="h-5 bg-gray-700/60 rounded w-1/3 mb-3"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-gray-700/60 rounded-full w-1/4"></div>
                  <div className="h-6 bg-gray-700/60 rounded-full w-1/3"></div>
                  <div className="h-6 bg-gray-700/60 rounded-full w-1/5"></div>
                </div>
              </div>
              <div>
                <div className="h-5 bg-gray-700/60 rounded w-2/5 mb-3"></div>
                <div className="h-12 bg-gray-700/60 rounded-lg mb-2"></div>
                <div className="h-12 bg-gray-700/60 rounded-lg"></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
