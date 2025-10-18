"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, UserX, FileX, TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  {
    title: "Total Reports",
    value: "42",
    change: "+8%",
    trend: "up",
    icon: AlertTriangle,
    color: "bg-red-500/10 text-red-500",
  },
  {
    title: "Profile Reports",
    value: "28",
    change: "+12%",
    trend: "up",
    icon: UserX,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Casting Call Reports",
    value: "14",
    change: "-5%",
    trend: "down",
    icon: FileX,
    color: "bg-purple-500/10 text-purple-500",
  },
]

export function ReportsSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div
                  className={`text-sm font-medium flex items-center ${
                    stat.trend === "up" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <TrendingUp size={16} className="ml-1" />
                  ) : (
                    <TrendingDown size={16} className="ml-1" />
                  )}
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
