export function AwardDetailsSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="w-full h-64 md:h-80 bg-[#1A1A1A] rounded-xl mb-8"></div>

      {/* Previous years navigation skeleton */}
      <div className="w-full h-16 bg-[#1A1A1A] rounded-xl mb-8"></div>

      {/* Highlights skeleton */}
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="h-8 bg-[#252525] rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-6 bg-[#252525] rounded w-full"></div>
            ))}
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="h-8 bg-[#252525] rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-16 bg-[#252525] rounded"></div>
            ))}
        </div>
      </div>
    </div>
  )
}
