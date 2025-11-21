"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotateCw, ZoomIn, ZoomOut, Check, X } from "lucide-react"

interface ImageCropToolProps {
  image: string
  aspectRatio?: number
  onCrop: (croppedImage: string) => void
  onCancel: () => void
  open: boolean
}

export function ImageCropTool({ image, aspectRatio = 1, onCrop, onCancel, open }: ImageCropToolProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return

      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }))
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleCrop = () => {
    // In a real implementation, this would use canvas to crop the image
    // For now, we'll just pass back the original image
    onCrop(image)
  }

  const resetTransform = () => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl bg-[#1A1A1A] border-[#3A3A3A]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Crop Area */}
          <div className="relative bg-[#0A0A0A] rounded-lg overflow-hidden" style={{ aspectRatio }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative cursor-move"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                drag={false}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt="Crop preview"
                  className="max-w-none select-none"
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Crop overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-2 border-[#00BFFF] rounded-lg" />
              <div className="absolute inset-0 border-[40px] border-black/50" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Zoom Control */}
            <div className="flex items-center gap-4">
              <ZoomOut className="w-4 h-4 text-gray-400" />
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400 w-12 text-right">{Math.round(zoom * 100)}%</span>
            </div>

            {/* Rotation Control */}
            <div className="flex items-center gap-4">
              <RotateCw className="w-4 h-4 text-gray-400" />
              <Slider
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                min={-180}
                max={180}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-400 w-12 text-right">{rotation}°</span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((prev) => prev - 90)}
                className="border-[#3A3A3A]"
              >
                Rotate Left
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation((prev) => prev + 90)}
                className="border-[#3A3A3A]"
              >
                Rotate Right
              </Button>
              <Button variant="outline" size="sm" onClick={resetTransform} className="border-[#3A3A3A]">
                Reset
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="border-[#3A3A3A]">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleCrop} className="bg-[#00BFFF] hover:bg-[#0099CC] text-black">
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
