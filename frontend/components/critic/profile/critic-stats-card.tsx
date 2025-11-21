"use client"

import { motion } from "framer-motion"
import { FileText, Users, Star, Heart, Eye, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { CriticProfile } from "@/types/critic"

interface CriticStatsCardProps {
  profile: CriticProfile
}

export default function CriticStatsCard({ profile }: CriticStatsCardProps) {
  const stats = [
    {
      icon: FileText,
      label: "Total Reviews",
      value: (profile?.total_reviews ?? 0).toLocaleString(),
      color: "#FFD700",
    },
    {
      icon: Users,
      label: "Followers",
      value: (profile?.total_followers ?? 0).toLocaleString(),
      color: "#00BFFF",
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: (profile?.avg_rating ?? 0).toFixed(1),
      color: "#8B5CF6",
    },
    {
      icon: Heart,
      label: "Total Likes",
      value: (profile?.total_likes ?? 0).toLocaleString(),
      color: "#EC4899",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: (profile?.total_views ?? 0).toLocaleString(),
      color: "#10B981",
    },
    {
      icon: TrendingUp,
      label: "Following",
      value: (profile?.total_following ?? 0).toLocaleString(),
      color: "#F59E0B",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-[#282828] border-[#3A3A3A] hover:border-[#00BFFF] transition-all hover:shadow-glow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="mb-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </motion.div>
                <div className="text-3xl font-bold font-inter" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-[#A0A0A0] font-dmsans mt-1">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

