"use client"

export default function TimelineLoading() {
  return (
    <div className="min-h-screen bg-[#101010] p-4 md:p-8 font-dmsans">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Breadcrumbs Skeleton */}
        <div className="h-5 w-1/2 bg-[#2A2A2A] rounded mb-4"></div>

        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 w-3/4 bg-[#2A2A2A] rounded mb-3"></div>
          <div className="h-6 w-full sm:w-5/6 bg-[#2A2A2A] rounded"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area Skeleton */}
          <div className="w-full lg:w-3/4">
            {/* Controls Bar Skeleton */}
            <div className="bg-[#1C1C1C] rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="h-10 bg-[#2A2A2A] rounded"></div> {/* Search */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                  <div className="h-10 w-24 bg-[#2A2A2A] rounded"></div> {/* Zoom */}
                  <div className="h-10 w-32 bg-[#2A2A2A] rounded"></div> {/* View Toggle */}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {" "}
                {/* Filters */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-[#2A2A2A] rounded"></div>
                ))}
              </div>
              <div className="h-8 bg-[#2A2A2A] rounded"></div> {/* Jump to Year */}
            </div>

            {/* Timeline Events Skeleton */}
            <div className="space-y-10">
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"} w-full`}>
                  <div className="w-full md:w-[calc(50%-2.5rem)]">
                    <div className="h-48 sm:h-56 w-full max-w-sm bg-[#1C1C1C] rounded-xl p-4">
                      <div className="h-6 w-3/4 bg-[#2A2A2A] rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-[#2A2A2A] rounded mb-3"></div>
                      <div className="h-4 w-full bg-[#2A2A2A] rounded mb-1"></div>
                      <div className="h-4 w-5/6 bg-[#2A2A2A] rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-[#1C1C1C] rounded-xl p-6">
              <div className="h-8 w-3/4 bg-[#2A2A2A] rounded mb-6"></div> {/* Highlights Title */}
              <div className="space-y-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-5 w-full bg-[#2A2A2A] rounded mb-1"></div>
                    <div className="h-3 w-1/2 bg-[#2A2A2A] rounded"></div>
                  </div>
                ))}
              </div>
              <div className="h-8 w-1/2 bg-[#2A2A2A] rounded mb-6"></div> {/* Categories Title */}
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-5 w-2/5 bg-[#2A2A2A] rounded"></div>
                    <div className="h-5 w-1/5 bg-[#2A2A2A] rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
