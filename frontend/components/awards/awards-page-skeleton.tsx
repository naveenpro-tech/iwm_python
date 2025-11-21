export function AwardsPageSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Hero section skeleton */}
      <div className="w-full h-64 bg-[#1A1A1A] rounded-xl mb-8"></div>

      {/* Awards ceremonies grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-xl p-4 h-64">
              <div className="w-full h-32 bg-[#252525] rounded-lg mb-4"></div>
              <div className="h-6 bg-[#252525] rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-[#252525] rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-[#252525] rounded w-5/6"></div>
            </div>
          ))}
      </div>

      {/* Timeline skeleton */}
      <div className="w-full h-48 bg-[#1A1A1A] rounded-xl mb-8"></div>
    </div>
  )
}
