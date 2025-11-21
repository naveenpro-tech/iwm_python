"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Download, Globe, RefreshCw, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function GeoVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (canvasRef.current) {
        drawGeoVisualization(canvasRef.current)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (canvasRef.current) {
        drawGeoVisualization(canvasRef.current)
      }
    }, 1000)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Global User Distribution</CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Map Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Globe className="h-4 w-4 mr-2" />
                  World Map
                </DropdownMenuItem>
                <DropdownMenuItem>Heat Map</DropdownMenuItem>
                <DropdownMenuItem>Region Focus</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit Data Source</DropdownMenuItem>
                <DropdownMenuItem>Configure Widget</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: "300px" }}>
          {isLoading ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </motion.div>
          ) : (
            <motion.canvas
              ref={canvasRef}
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function drawGeoVisualization(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Set canvas dimensions
  canvas.width = canvas.offsetWidth * 2
  canvas.height = canvas.offsetHeight * 2
  ctx.scale(2, 2)

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const width = canvas.offsetWidth
  const height = canvas.offsetHeight

  // Draw simplified world map outline
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = 0.5

  // Draw a simplified world map (just for placeholder visualization)
  // This is a very simplified representation

  // North America
  drawContinent(ctx, width * 0.2, height * 0.3, width * 0.15, height * 0.2)

  // South America
  drawContinent(ctx, width * 0.25, height * 0.6, width * 0.1, height * 0.2)

  // Europe
  drawContinent(ctx, width * 0.45, height * 0.3, width * 0.08, height * 0.1)

  // Africa
  drawContinent(ctx, width * 0.45, height * 0.5, width * 0.12, height * 0.2)

  // Asia
  drawContinent(ctx, width * 0.6, height * 0.35, width * 0.2, height * 0.2)

  // Australia
  drawContinent(ctx, width * 0.75, height * 0.65, width * 0.1, height * 0.1)

  // Draw hotspots
  const hotspots = [
    { x: width * 0.22, y: height * 0.35, value: 0.8, label: "USA" },
    { x: width * 0.45, y: height * 0.28, value: 0.6, label: "UK" },
    { x: width * 0.48, y: height * 0.32, value: 0.5, label: "France" },
    { x: width * 0.65, y: height * 0.4, value: 0.9, label: "India" },
    { x: width * 0.75, y: height * 0.35, value: 0.7, label: "China" },
    { x: width * 0.25, y: height * 0.65, value: 0.4, label: "Brazil" },
    { x: width * 0.75, y: height * 0.65, value: 0.5, label: "Australia" },
  ]

  hotspots.forEach((spot) => {
    // Draw hotspot
    const radius = Math.max(spot.value * 15, 5)

    // Glow effect
    const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, radius * 2)
    gradient.addColorStop(0, `rgba(14, 165, 233, ${spot.value})`)
    gradient.addColorStop(0.5, `rgba(14, 165, 233, ${spot.value * 0.5})`)
    gradient.addColorStop(1, "rgba(14, 165, 233, 0)")

    ctx.beginPath()
    ctx.arc(spot.x, spot.y, radius * 2, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()

    // Core
    ctx.beginPath()
    ctx.arc(spot.x, spot.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = "#0ea5e9"
    ctx.fill()

    // Label
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(spot.label, spot.x, spot.y - radius - 5)

    // Value
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.font = "9px sans-serif"
    ctx.fillText(`${Math.round(spot.value * 100)}%`, spot.x, spot.y + radius + 12)
  })

  // Draw legend
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
  ctx.font = "10px sans-serif"
  ctx.textAlign = "left"
  ctx.fillText("User Concentration:", width * 0.05, height * 0.9)

  const legendColors = ["rgba(14, 165, 233, 0.2)", "rgba(14, 165, 233, 0.5)", "rgba(14, 165, 233, 0.8)"]
  const legendLabels = ["Low", "Medium", "High"]

  legendColors.forEach((color, i) => {
    const x = width * 0.05 + i * 60
    const y = height * 0.93

    ctx.beginPath()
    ctx.arc(x + 5, y, 5, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.textAlign = "left"
    ctx.fillText(legendLabels[i], x + 15, y + 3)
  })
}

function drawContinent(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  // Draw a simplified continent shape
  ctx.beginPath()

  // Create a slightly irregular shape for the continent
  const points = []
  const numPoints = 20

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2
    const radius = Math.random() * 0.2 + 0.8 // Random radius between 0.8 and 1.0
    const px = x + width / 2 + ((Math.cos(angle) * width) / 2) * radius
    const py = y + height / 2 + ((Math.sin(angle) * height) / 2) * radius
    points.push({ x: px, y: py })
  }

  // Draw the continent path
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }

  ctx.closePath()
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)"
  ctx.fill()
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.stroke()
}
