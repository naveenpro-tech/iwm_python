"use client"
import { NavigationContainer } from "@/components/navigation/navigation-container"

export function RecentPageSkeleton() {
  return (
    <NavigationContainer onScroll={() => {}}>
      <div className="min-h-screen bg-[#0A0A0A] pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-lg animate-pulse" />
              <div>
                <div className="h-8 w-48 bg-[#1A1A1A] rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-[#1A1A1A] rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="mb-8 flex gap-3">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-10 w-24 bg-[#1A1A1A] rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="space-y-8">
            {["Today", "Yesterday"].map((group) => (
              <div key={group}>
                <div className="h-6 w-24 bg-[#1A1A1A] rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-[#1A1A1A] rounded-lg p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-[#282828] rounded-lg animate-pulse" />
                        <div className="flex-1">
                          <div className="h-5 w-48 bg-[#282828] rounded animate-pulse mb-2" />
                          <div className="h-4 w-32 bg-[#282828] rounded animate-pulse mb-2" />
                          <div className="h-3 w-full bg-[#282828] rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NavigationContainer>
  )
}
