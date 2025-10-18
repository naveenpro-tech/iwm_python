"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, XCircle, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  {
    title: "Pending Verifications",
    value: "38",
    change: "+12%",
    trend: "up",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Approved Today",
    value: "14",
    change: "+5%",
    trend: "up",
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Rejected Today",
    value: "6",
    change: "-10%",
    trend: "down",
    icon: XCircle,
    color: "bg-red-500/10 text-red-500",
  },
  {
    title: "Flagged for Review",
    value: "8",
    change: "+33%",
    trend: "up",
    icon: AlertTriangle,
    color: "bg-orange-500/10 text-orange-500",
  },
]

export function VerificationStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
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
