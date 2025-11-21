"use client"

export function BoxOfficeSkeleton() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] p-4 md:p-8">
      <div className="container mx-auto">
        <div className="animate-pulse">
          {/* Header */}
          <div className="mb-8">
            <div className="h-10 w-80 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-60 bg-gray-700 rounded"></div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="h-80 bg-gray-700 rounded-lg"></div>
            <div className="h-80 bg-gray-700 rounded-lg"></div>
          </div>

          {/* Table */}
          <div className="h-96 bg-gray-700 rounded-lg mb-12"></div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-gray-700 rounded-lg"></div>
            <div className="h-80 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
