"use client"

import { motion } from "framer-motion"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  change: number
  trend: "up" | "down"
}

export default function MetricCard({ title, value, change, trend }: MetricCardProps) {
  const isPositive = trend === "up"
  const isChangePositive = change > 0

  // Determine if the trend is good or bad based on the metric
  const isGood = (isPositive && isChangePositive) || (!isPositive && !isChangePositive)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center">
              <div className={`flex items-center text-sm ${isGood ? "text-green-500" : "text-red-500"}`}>
                {isChangePositive ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                <span>{Math.abs(change)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
