"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Palette } from "lucide-react"

interface ColorPaletteAnalyzerProps {
  imageUrl: string
}

export function ColorPaletteAnalyzer({ imageUrl }: ColorPaletteAnalyzerProps) {
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    // In a real implementation, this would analyze the image
    // For now, we'll use mock colors
    setColors(["#1A1A1A", "#00BFFF", "#FFD700", "#FF6B6B", "#4ECDC4"])
  }, [imageUrl])

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Color Palette
      </h4>
      <div className="flex gap-2">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div
              className="w-10 h-10 rounded-md border border-gray-700 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {color}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
