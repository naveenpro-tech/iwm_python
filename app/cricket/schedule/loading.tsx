export default function ScheduleLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-40 bg-[#333333] rounded-md animate-pulse mb-6"></div>

      <div className="h-10 bg-[#333333] rounded-md animate-pulse mb-6"></div>

      <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-20 w-20 bg-[#333333] rounded-md flex-shrink-0 animate-pulse"></div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-16 bg-[#333333] rounded-full animate-pulse"></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#282828] rounded-lg h-48 animate-pulse"></div>
        ))}
      </div>
    </div>
  )
}
