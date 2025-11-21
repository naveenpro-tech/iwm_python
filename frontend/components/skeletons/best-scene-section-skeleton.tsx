import type React from "react"
import { ImageIcon } from "lucide-react"

const SceneCardSkeleton = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="relative aspect-video bg-slate-700 flex items-center justify-center">
      <ImageIcon className="w-12 h-12 text-slate-600" />
    </div>
    <div className="p-5">
      <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2 mb-3"></div>
      <div className="h-3 bg-slate-700 rounded w-full mb-1"></div>
      <div className="h-3 bg-slate-700 rounded w-5/6"></div>
    </div>
  </div>
)

const BestSceneSectionSkeleton: React.FC = () => {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-black via-red-900/10 to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <div className="h-8 bg-slate-700 rounded w-1/2 md:w-1/3 animate-pulse"></div>
          <div className="h-6 bg-slate-700 rounded w-1/4 md:w-1/6 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <SceneCardSkeleton />
          <SceneCardSkeleton />
          <SceneCardSkeleton />
        </div>
      </div>
    </section>
  )
}

export default BestSceneSectionSkeleton
