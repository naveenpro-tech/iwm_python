"use client"

export function CollectionsSkeleton() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-b from-[#20124d] to-[#121212] py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="h-10 bg-[#2A2A2A] rounded-lg animate-pulse" />
            <div className="h-6 bg-[#2A2A2A] rounded-lg animate-pulse max-w-lg mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-10 bg-[#2A2A2A] rounded-lg animate-pulse flex-1 max-w-md" />
              <div className="h-10 bg-[#2A2A2A] rounded-lg animate-pulse w-40" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Featured Collections Skeleton */}
        <section>
          <div className="h-8 bg-[#2A2A2A] rounded-lg animate-pulse w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CollectionCardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Popular Collections Skeleton */}
        <section>
          <div className="h-8 bg-[#2A2A2A] rounded-lg animate-pulse w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CollectionCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function CollectionCardSkeleton() {
  return (
    <div className="bg-[#1E1E1E] rounded-lg overflow-hidden border border-[#333333]">
      <div className="aspect-[4/3] bg-[#2A2A2A] animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#2A2A2A] rounded animate-pulse" />
        <div className="h-4 bg-[#2A2A2A] rounded animate-pulse w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-[#2A2A2A] rounded animate-pulse w-20" />
          <div className="h-3 bg-[#2A2A2A] rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  )
}
