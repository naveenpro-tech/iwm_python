"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Activity, Calendar, CheckCircle, Clock } from "lucide-react"

export function CricketOverview() {
  // In a real implementation, this would fetch data from an API
  const stats = {
    liveMatches: 3,
    upcomingMatches: 12,
    completedMatches: 87,
    totalTeams: 24,
    totalPlayers: 432,
  }

  const statCards = [
    {
      title: "Live Matches",
      value: stats.liveMatches,
      icon: Activity,
      color: "text-red-500",
      link: "/admin/cricket/matches?status=live",
    },
    {
      title: "Upcoming Matches",
      value: stats.upcomingMatches,
      icon: Calendar,
      color: "text-blue-500",
      link: "/admin/cricket/matches?status=upcoming",
    },
    {
      title: "Completed Matches",
      value: stats.completedMatches,
      icon: CheckCircle,
      color: "text-green-500",
      link: "/admin/cricket/matches?status=completed",
    },
    {
      title: "Teams & Players",
      value: `${stats.totalTeams} / ${stats.totalPlayers}`,
      icon: Clock,
      color: "text-purple-500",
      link: "/admin/cricket/teams",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cricket Overview</CardTitle>
        <CardDescription>Summary of cricket content across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.a
              key={stat.title}
              href={stat.link}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <stat.icon className={`h-8 w-8 mb-2 ${stat.color}`} />
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.title}</span>
            </motion.a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
