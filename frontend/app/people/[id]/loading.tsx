import { Skeleton } from "@/components/ui/skeleton"

export default function PersonDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-16">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00BFFF]/10 to-[#1A1A1A] z-0"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Image Skeleton */}
            <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded-full" />

            {/* Profile Info Skeletons */}
            <div className="text-center md:text-left w-full max-w-md">
              <Skeleton className="h-10 w-64 mx-auto md:mx-0 mb-2" />
              <Skeleton className="h-6 w-40 mx-auto md:mx-0 mb-4" />

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>

              <div className="flex gap-2 mt-6 justify-center md:justify-start">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section Skeleton */}
      <div className="container mx-auto px-4">
        <Skeleton className="h-14 w-full mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />

            <Skeleton className="h-8 w-40 mt-8 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="aspect-[2/3] rounded-lg" />
              <Skeleton className="aspect-[2/3] rounded-lg" />
            </div>

            <Skeleton className="h-8 w-40 mt-8 mb-4" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>

          <div>
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-60 w-full rounded-lg mb-8" />

            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
