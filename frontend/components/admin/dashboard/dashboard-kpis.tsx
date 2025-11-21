"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Film, MessageSquare, Flag, TrendingUp, Briefcase, HelpCircleIcon, UserCheck } from "lucide-react"
import { motion } from "framer-motion"

const kpis = [
  {
    title: "Total Users",
    value: "24,521",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Movies",
    value: "8,942",
    change: "+8%",
    trend: "up",
    icon: Film,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Reviews",
    value: "32,674",
    change: "+24%",
    trend: "up",
    icon: MessageSquare,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Pending Moderation",
    value: "43",
    change: "-5%",
    trend: "down",
    icon: Flag,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Active Sessions",
    value: "1,284",
    change: "+18%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-cyan-500/10 text-cyan-500",
  },
  {
    title: "Talent Profiles",
    value: "1,578",
    change: "+15%",
    trend: "up",
    icon: UserCheck, // Lucide icon for talent/verified users
    color: "bg-teal-500/10 text-teal-500",
  },
  {
    title: "Industry Professionals",
    value: "632",
    change: "+9%",
    trend: "up",
    icon: Briefcase, // Lucide icon for professionals/briefcase
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    title: "Active Quizzes",
    value: "58",
    change: "+5",
    trend: "up",
    icon: HelpCircleIcon, // Lucide icon for quizzes
    color: "bg-rose-500/10 text-rose-500",
  },
]

export function DashboardKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-full ${kpi.color}`}>
                  <kpi.icon size={20} />
                </div>
                <div
                  className={`text-xs md:text-sm font-medium flex items-center ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {kpi.change}
                  <TrendingUp size={14} className={`ml-1 ${kpi.trend === "down" && "rotate-180"}`} />
                </div>
              </div>
              <div className="mt-2 md:mt-3">
                <h3 className="text-xl md:text-2xl font-bold">{kpi.value}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
