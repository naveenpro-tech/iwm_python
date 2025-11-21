export default function CricketLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-40 bg-[#333333] rounded-md animate-pulse mb-6"></div>

      {/* Live matches skeleton */}
      <div className="mb-8">
        <div className="h-6 w-32 bg-[#333333] rounded-md animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#282828] rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Upcoming matches skeleton */}
      <div className="mb-8">
        <div className="h-6 w-40 bg-[#333333] rounded-md animate-pulse mb-4"></div>
        <div className="h-16 bg-[#333333] rounded-md animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#282828] rounded-lg h-48 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Recent results skeleton */}
      <div>
        <div className="h-6 w-36 bg-[#333333] rounded-md animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#282828] rounded-lg h-48 animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
