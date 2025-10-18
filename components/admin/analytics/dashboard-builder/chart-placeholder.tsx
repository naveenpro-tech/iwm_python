"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { BarChart, LineChart, PieChart, Activity, Download, RefreshCw, MoreHorizontal } from "lucide-react"
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

interface ChartPlaceholderProps {
  title: string
  type: "line" | "bar" | "pie" | "area"
  height?: number
}

export default function ChartPlaceholder({ title, type, height = 300 }: ChartPlaceholderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (canvasRef.current) {
        drawPlaceholderChart(canvasRef.current, type)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [type])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      if (canvasRef.current) {
        drawPlaceholderChart(canvasRef.current, type)
      }
    }, 1000)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
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
                <DropdownMenuLabel>Chart Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LineChart className="h-4 w-4 mr-2" />
                  Line Chart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart className="h-4 w-4 mr-2" />
                  Bar Chart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PieChart className="h-4 w-4 mr-2" />
                  Pie Chart
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="h-4 w-4 mr-2" />
                  Area Chart
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit Data Source</DropdownMenuItem>
                <DropdownMenuItem>Configure Widget</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: `${height}px` }}>
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

function drawPlaceholderChart(canvas: HTMLCanvasElement, type: string) {
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

  // Set colors
  const primaryColor = "#0ea5e9"
  const secondaryColor = "#6366f1"
  const tertiaryColor = "#8b5cf6"
  const gridColor = "rgba(255, 255, 255, 0.1)"
  const textColor = "rgba(255, 255, 255, 0.7)"

  // Draw grid
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 0.5

  // Horizontal grid lines
  for (let i = 0; i < 5; i++) {
    const y = height * 0.2 * i + height * 0.1
    ctx.beginPath()
    ctx.moveTo(width * 0.05, y)
    ctx.lineTo(width * 0.95, y)
    ctx.stroke()

    // Y-axis labels
    ctx.fillStyle = textColor
    ctx.font = "10px sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(`${100 - i * 20}`, width * 0.04, y + 3)
  }

  // X-axis labels
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const xStep = (width * 0.9) / 11

  for (let i = 0; i < 12; i++) {
    const x = width * 0.05 + xStep * i

    // X-axis labels
    ctx.fillStyle = textColor
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(months[i], x, height * 0.95)
  }

  if (type === "line" || type === "area") {
    // Generate random data
    const data1 = Array.from({ length: 12 }, () => Math.random() * 0.5 + 0.2)
    const data2 = Array.from({ length: 12 }, () => Math.random() * 0.4 + 0.3)

    // Draw area if area chart
    if (type === "area") {
      // First dataset area
      ctx.beginPath()
      ctx.moveTo(width * 0.05, height * 0.9)

      for (let i = 0; i < 12; i++) {
        const x = width * 0.05 + xStep * i
        const y = height * 0.9 - data1[i] * height * 0.8
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width * 0.05 + xStep * 11, height * 0.9)
      ctx.closePath()
      ctx.fillStyle = `${primaryColor}20`
      ctx.fill()

      // Second dataset area
      ctx.beginPath()
      ctx.moveTo(width * 0.05, height * 0.9)

      for (let i = 0; i < 12; i++) {
        const x = width * 0.05 + xStep * i
        const y = height * 0.9 - data2[i] * height * 0.8
        ctx.lineTo(x, y)
      }

      ctx.lineTo(width * 0.05 + xStep * 11, height * 0.9)
      ctx.closePath()
      ctx.fillStyle = `${secondaryColor}20`
      ctx.fill()
    }

    // Draw line for first dataset
    ctx.beginPath()
    ctx.moveTo(width * 0.05, height * 0.9 - data1[0] * height * 0.8)

    for (let i = 1; i < 12; i++) {
      const x = width * 0.05 + xStep * i
      const y = height * 0.9 - data1[i] * height * 0.8
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = primaryColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points for first dataset
    for (let i = 0; i < 12; i++) {
      const x = width * 0.05 + xStep * i
      const y = height * 0.9 - data1[i] * height * 0.8

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = primaryColor
      ctx.fill()
    }

    // Draw line for second dataset
    ctx.beginPath()
    ctx.moveTo(width * 0.05, height * 0.9 - data2[0] * height * 0.8)

    for (let i = 1; i < 12; i++) {
      const x = width * 0.05 + xStep * i
      const y = height * 0.9 - data2[i] * height * 0.8
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = secondaryColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points for second dataset
    for (let i = 0; i < 12; i++) {
      const x = width * 0.05 + xStep * i
      const y = height * 0.9 - data2[i] * height * 0.8

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = secondaryColor
      ctx.fill()
    }
  } else if (type === "bar") {
    // Generate random data
    const data1 = Array.from({ length: 12 }, () => Math.random() * 0.5 + 0.2)
    const data2 = Array.from({ length: 12 }, () => Math.random() * 0.4 + 0.3)

    const barWidth = xStep * 0.4

    // Draw bars
    for (let i = 0; i < 12; i++) {
      const x = width * 0.05 + xStep * i

      // First dataset bar
      const height1 = data1[i] * height * 0.8
      ctx.fillStyle = primaryColor
      ctx.fillRect(x - barWidth * 0.5 - 2, height * 0.9 - height1, barWidth, height1)

      // Second dataset bar
      const height2 = data2[i] * height * 0.8
      ctx.fillStyle = secondaryColor
      ctx.fillRect(x + barWidth * 0.5 - 2, height * 0.9 - height2, barWidth, height2)
    }
  } else if (type === "pie") {
    // Generate random data
    const data = [
      Math.random() * 0.3 + 0.1,
      Math.random() * 0.2 + 0.1,
      Math.random() * 0.15 + 0.05,
      Math.random() * 0.25 + 0.1,
    ]

    const total = data.reduce((sum, value) => sum + value, 0)
    const colors = [primaryColor, secondaryColor, tertiaryColor, "#ec4899"]

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4

    let startAngle = 0

    // Draw pie slices
    for (let i = 0; i < data.length; i++) {
      const sliceAngle = (data[i] / total) * Math.PI * 2
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = colors[i]
      ctx.fill()

      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 1.2
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius

      ctx.beginPath()
      ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
      ctx.lineTo(labelX, labelY)
      ctx.strokeStyle = colors[i]
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = textColor
      ctx.font = "10px sans-serif"
      ctx.textAlign = midAngle < Math.PI ? "left" : "right"
      ctx.fillText(`${Math.round((data[i] / total) * 100)}%`, labelX + (midAngle < Math.PI ? 5 : -5), labelY)

      startAngle = endAngle
    }

    // Draw center hole for donut chart
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
    ctx.fillStyle = "hsl(240 10% 3.9%)" // Example: background color for dark theme card
    ctx.fill()
  }
}
