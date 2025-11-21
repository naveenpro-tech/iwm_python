"use client"

import { Card, CardContent } from "@/components/ui/card"
import { UserCheck, Users, FileText, Award, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const stats = [
  {
    title: "Total Talent Profiles",
    value: "1,842",
    change: "+14%",
    trend: "up",
    icon: Users,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Active Casting Calls",
    value: "76",
    change: "+8%",
    trend: "up",
    icon: FileText,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Verified Profiles",
    value: "624",
    change: "+22%",
    trend: "up",
    icon: UserCheck,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Pending Verifications",
    value: "38",
    change: "-5%",
    trend: "down",
    icon: Award,
    color: "bg-amber-500/10 text-amber-500",
  },
]

export function TalentHubStats() {
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
                  className={`text-sm font-medium flex items-center ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.change}
                  <TrendingUp size={16} className={`ml-1 ${stat.trend === "down" && "rotate-180"}`} />
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
