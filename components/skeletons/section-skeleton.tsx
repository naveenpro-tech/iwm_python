import type React from "react"
import { Loader2 } from "lucide-react"

interface SectionSkeletonProps {
  message?: string
  heightClass?: string // e.g., "h-96" or "h-auto"
  showIcon?: boolean
}

const SectionSkeleton: React.FC<SectionSkeletonProps> = ({
  message = "Loading content...",
  heightClass = "h-96",
  showIcon = true,
}) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-900/30 text-gray-500 p-8 ${heightClass} w-full`}>
      {showIcon && <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />}
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm text-gray-600">Please wait while we fetch the details.</p>
    </div>
  )
}

export default SectionSkeleton
