export function HelpSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="bg-[#282828] py-12">
        <div className="container mx-auto px-4">
          <div className="h-10 bg-[#333] rounded w-1/3 mx-auto mb-8"></div>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="h-12 bg-[#333] rounded w-full"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-10 bg-[#333] rounded-full w-24"></div>
              ))}
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-[#333] rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-xl p-6 h-48">
                <div className="flex items-center mb-4">
                  <div className="bg-[#252525] p-3 rounded-lg h-12 w-12 mr-3"></div>
                  <div className="h-6 bg-[#252525] rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-[#252525] rounded w-full mb-2"></div>
                <div className="h-4 bg-[#252525] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[#252525] rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-[#252525] rounded w-1/4"></div>
              </div>
            ))}
        </div>

        {/* FAQ skeleton */}
        <div className="h-8 bg-[#333] rounded w-1/4 mb-6"></div>
        <div className="bg-[#1A1A1A] rounded-xl p-6 mb-8">
          <div className="h-8 bg-[#252525] rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-16 bg-[#252525] rounded"></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
