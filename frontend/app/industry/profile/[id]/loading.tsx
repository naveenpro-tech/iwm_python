import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function IndustryProfileLoading() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Cover Photo Skeleton */}
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-[#282828]" />

        {/* Profile Header Skeleton */}
        <div className="relative px-4 sm:px-6 -mt-24">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="z-10 relative">
              <Skeleton className="w-32 h-32 rounded-xl" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardContent>
          </Card>
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardContent>
          </Card>
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-6">
          <Skeleton className="h-12 w-full" />
        </div>

        {/* Content Skeleton */}
        <div className="mt-6 space-y-6">
          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-[#3A3A3A]">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
