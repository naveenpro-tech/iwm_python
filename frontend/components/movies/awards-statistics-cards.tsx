"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Award, Globe, Flag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AwardStatisticsProps {
  awards: Array<{
    id: string
    name: string
    year: number
    category: string
    status: "Winner" | "Nominee"
    country?: string
    language?: string
    prestige_level?: string
  }>
}

export function AwardsStatisticsCards({ awards }: AwardStatisticsProps) {
  // Calculate statistics
  const totalAwards = awards.length
  const wins = awards.filter((a) => a.status === "Winner").length
  const nominations = awards.filter((a) => a.status === "Nominee").length

  // Count Indian awards (awards with country = "India")
  const indianAwards = awards.filter((a) => a.country === "India").length
  const indianPercentage = totalAwards > 0 ? Math.round((indianAwards / totalAwards) * 100) : 0

  // Count International awards (awards with country != "India" or prestige_level = "international")
  const internationalAwards = awards.filter(
    (a) => a.country !== "India" || a.prestige_level === "international"
  ).length
  const internationalPercentage = totalAwards > 0 ? Math.round((internationalAwards / totalAwards) * 100) : 0

  // Win rate
  const winRate = totalAwards > 0 ? Math.round((wins / totalAwards) * 100) : 0

  const stats = [
    {
      title: "Total Awards",
      value: totalAwards,
      subtitle: `${wins} wins, ${nominations} nominations`,
      icon: Trophy,
      color: "text-[#FFD700]",
      bgColor: "bg-[#FFD700]/10",
      borderColor: "border-[#FFD700]/20",
    },
    {
      title: "Indian Awards",
      value: indianAwards,
      subtitle: `${indianPercentage}% of total awards`,
      icon: Flag,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      title: "International Awards",
      value: internationalAwards,
      subtitle: `${internationalPercentage}% of total awards`,
      icon: Globe,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Win Rate",
      value: `${winRate}%`,
      subtitle: `${wins} wins out of ${totalAwards} total`,
      icon: Star,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-[#1C1C1C] border-gray-700 hover:${stat.borderColor} transition-all duration-300`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

