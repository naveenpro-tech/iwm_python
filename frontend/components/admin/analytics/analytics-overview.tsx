"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowDownIcon, ArrowUpIcon, Users, Film, Star, Activity } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  delay: number
}

function MetricCard({ title, value, change, icon, delay }: MetricCardProps) {
  const isPositive = change > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">{icon}</div>
          </div>

          <div className="mt-4 flex items-center">
            <div className={`flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
              <span>{Math.abs(change)}%</span>
            </div>
            <span className="text-sm text-muted-foreground ml-2">vs last period</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function AnalyticsOverview() {
  const metrics = [
    {
      title: "Total Users",
      value: "24,892",
      change: 12.5,
      icon: <Users className="h-6 w-6 text-primary" />,
      delay: 0,
    },
    {
      title: "Content Views",
      value: "1.2M",
      change: 18.2,
      icon: <Film className="h-6 w-6 text-primary" />,
      delay: 1,
    },
    {
      title: "Avg. Rating",
      value: "4.7",
      change: 2.3,
      icon: <Star className="h-6 w-6 text-primary" />,
      delay: 2,
    },
    {
      title: "System Health",
      value: "99.8%",
      change: -0.1,
      icon: <Activity className="h-6 w-6 text-primary" />,
      delay: 3,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}
