export function MatchSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Match header skeleton */}
      <div className="w-full bg-[#1A1A1A] rounded-xl overflow-hidden mb-8">
        <div className="bg-[#252525] p-4">
          <div className="flex justify-between">
            <div className="h-6 bg-[#333] rounded w-1/3"></div>
            <div className="h-6 bg-[#333] rounded w-24"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between mb-8">
            <div className="h-16 bg-[#252525] rounded w-1/3"></div>
            <div className="h-8 bg-[#252525] rounded w-1/4"></div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-[#252525] rounded-full mb-3"></div>
              <div className="h-6 bg-[#252525] rounded w-32 mb-1"></div>
              <div className="h-4 bg-[#252525] rounded w-16"></div>
            </div>
            <div className="h-16 w-16 bg-[#252525] rounded-full"></div>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 bg-[#252525] rounded-full mb-3"></div>
              <div className="h-6 bg-[#252525] rounded w-32 mb-1"></div>
              <div className="h-4 bg-[#252525] rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard skeleton */}
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="h-8 bg-[#252525] rounded w-1/4 mb-6"></div>
        <div className="flex mb-6">
          <div className="h-10 bg-[#252525] rounded w-1/4 mr-4"></div>
          <div className="h-10 bg-[#252525] rounded w-1/4"></div>
        </div>
        <div className="space-y-4 mb-6">
          <div className="h-6 bg-[#252525] rounded w-full"></div>
          <div className="h-6 bg-[#252525] rounded w-full"></div>
          <div className="h-6 bg-[#252525] rounded w-full"></div>
        </div>
        <div className="h-8 bg-[#252525] rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-12 bg-[#252525] rounded w-full"></div>
          <div className="h-12 bg-[#252525] rounded w-full"></div>
          <div className="h-12 bg-[#252525] rounded w-full"></div>
        </div>
      </div>

      {/* Commentary skeleton */}
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="h-8 bg-[#252525] rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-24 bg-[#252525] rounded w-full"></div>
            ))}
        </div>
      </div>

      {/* Statistics skeleton */}
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="h-8 bg-[#252525] rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="h-48 bg-[#252525] rounded w-full"></div>
            <div className="h-48 bg-[#252525] rounded w-full"></div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 bg-[#252525] rounded w-full"></div>
              <div className="h-40 bg-[#252525] rounded w-full"></div>
            </div>
            <div className="h-48 bg-[#252525] rounded w-full"></div>
          </div>
        </div>
      </div>

      {/* Pulse feed skeleton */}
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <div className="flex justify-between mb-6">
          <div className="h-8 bg-[#252525] rounded w-1/3"></div>
          <div className="h-6 bg-[#252525] rounded w-20"></div>
        </div>
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-[#252525] p-4 rounded-lg">
                <div className="flex mb-3">
                  <div className="h-10 w-10 bg-[#333] rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-[#333] rounded w-1/3 mb-1"></div>
                    <div className="h-4 bg-[#333] rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-16 bg-[#333] rounded w-full mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-[#333] rounded w-16"></div>
                  <div className="h-6 bg-[#333] rounded w-16"></div>
                  <div className="h-6 bg-[#333] rounded w-16"></div>
                  <div className="h-6 bg-[#333] rounded w-16"></div>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-6">
          <div className="h-12 bg-[#252525] rounded w-full"></div>
        </div>
      </div>
    </div>
  )
}
