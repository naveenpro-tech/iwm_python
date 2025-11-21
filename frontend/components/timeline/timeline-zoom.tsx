"use client"

import { ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimelineZoomProps {
  zoomLevel: number
  setZoomLevel: (level: number) => void
}

export function TimelineZoom({ zoomLevel, setZoomLevel }: TimelineZoomProps) {
  const handleZoomIn = () => {
    if (zoomLevel < 5) setZoomLevel(zoomLevel + 1)
  }

  const handleZoomOut = () => {
    if (zoomLevel > 1) setZoomLevel(zoomLevel - 1)
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomOut}
        disabled={zoomLevel <= 1}
        className="border-[#3A3A3A] text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white disabled:opacity-50 w-8 h-8"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <span className="text-sm text-[#A0A0A0] min-w-[20px] text-center tabular-nums">{zoomLevel}</span>

      <Button
        variant="outline"
        size="icon"
        onClick={handleZoomIn}
        disabled={zoomLevel >= 5}
        className="border-[#3A3A3A] text-[#A0A0A0] hover:bg-[#2A2A2A] hover:text-white disabled:opacity-50 w-8 h-8"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  )
}
