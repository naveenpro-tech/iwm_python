export default function MatchDetailsLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back button skeleton */}
      <div className="mb-4">
        <div className="h-6 w-32 bg-[#333333] rounded-md animate-pulse"></div>
      </div>

      {/* Match header skeleton */}
      <div className="bg-[#282828] rounded-lg p-6 mb-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-40 bg-[#333333] rounded-md"></div>
          <div className="h-6 w-20 bg-[#333333] rounded-md"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#333333] rounded-full mb-2"></div>
              <div className="h-6 w-24 bg-[#333333] rounded-md"></div>
              <div className="h-6 w-16 bg-[#333333] rounded-md mt-1"></div>
            </div>

            <div className="text-center">
              <div className="h-6 w-6 bg-[#333333] rounded-md"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#333333] rounded-full mb-2"></div>
              <div className="h-6 w-24 bg-[#333333] rounded-md"></div>
              <div className="h-6 w-16 bg-[#333333] rounded-md mt-1"></div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="h-4 w-32 bg-[#333333] rounded-md mb-1"></div>
            <div className="h-4 w-24 bg-[#333333] rounded-md mb-1"></div>
            <div className="h-4 w-40 bg-[#333333] rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="bg-[#282828] mb-6 rounded-lg overflow-hidden">
        <div className="flex space-x-2 p-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-24 bg-[#333333] rounded-md"></div>
          ))}
        </div>
      </div>

      {/* Tab content skeleton */}
      <div className="space-y-6">
        <div className="bg-[#282828] rounded-lg p-4 animate-pulse">
          <div className="h-6 w-40 bg-[#333333] rounded-md mb-4"></div>
          <div className="h-20 bg-[#333333] rounded-md"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#282828] rounded-lg p-4 animate-pulse">
            <div className="h-6 w-32 bg-[#333333] rounded-md mb-4"></div>
            <div className="h-40 bg-[#333333] rounded-md"></div>
          </div>

          <div className="bg-[#282828] rounded-lg p-4 animate-pulse">
            <div className="h-6 w-32 bg-[#333333] rounded-md mb-4"></div>
            <div className="h-40 bg-[#333333] rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
