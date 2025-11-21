"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"
import { generateMockAnalytics } from "@/lib/critic/mock-analytics"

interface CriticAnalyticsSectionProps {
  username: string
  totalReviews: number
}

export default function CriticAnalyticsSection({ username, totalReviews }: CriticAnalyticsSectionProps) {
  const analyticsData = useMemo(() => generateMockAnalytics(username, totalReviews), [username, totalReviews])

  return (
    <Card className="bg-[#282828] border-[#3A3A3A]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#E0E0E0] font-inter">Critic's Voice Analytics</CardTitle>
        <p className="text-sm text-[#A0A0A0] font-dmsans mt-2">
          Deep insights into reviewing patterns, preferences, and trends
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genre Affinity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#E0E0E0] font-inter">Genre Affinity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analyticsData.genreAffinity}>
                    <PolarGrid stroke="#3A3A3A" />
                    <PolarAngleAxis dataKey="genre" tick={{ fill: "#A0A0A0", fontSize: 12 }} />
                    <PolarRadiusAxis tick={{ fill: "#A0A0A0" }} />
                    <Radar
                      name="Reviews"
                      dataKey="count"
                      stroke="#00BFFF"
                      fill="#00BFFF"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#282828",
                        borderColor: "#3A3A3A",
                        color: "#E0E0E0",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rating Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#E0E0E0] font-inter">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                    <XAxis dataKey="rating" tick={{ fill: "#A0A0A0" }} />
                    <YAxis tick={{ fill: "#A0A0A0" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#282828",
                        borderColor: "#3A3A3A",
                        color: "#E0E0E0",
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === "count") return [value, "Reviews"]
                        return [value, name]
                      }}
                    />
                    <Bar dataKey="count" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#00BFFF" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Keyword Cloud */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#E0E0E0] font-inter">Keyword Cloud</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex flex-wrap items-center justify-center gap-2 p-4">
                  {analyticsData.keywords.map((keyword, index) => {
                    const colors = ["#00BFFF", "#FFD700", "#8B5CF6", "#EC4899", "#10B981"]
                    const color = colors[index % colors.length]
                    const rotation = (Math.random() - 0.5) * 30 // -15 to +15 degrees

                    return (
                      <motion.span
                        key={keyword.word}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          fontSize: `${keyword.size}px`,
                          color,
                          transform: `rotate(${rotation}deg)`,
                          fontWeight: 600,
                          fontFamily: "Inter, sans-serif",
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {keyword.word}
                      </motion.span>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sentiment Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="bg-[#1A1A1A] border-[#3A3A3A]">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-[#E0E0E0] font-inter">Sentiment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.sentimentTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                    <XAxis dataKey="month" tick={{ fill: "#A0A0A0" }} />
                    <YAxis domain={[0, 10]} tick={{ fill: "#A0A0A0" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#282828",
                        borderColor: "#3A3A3A",
                        color: "#E0E0E0",
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === "avgRating") return [value, "Avg Rating"]
                        if (name === "reviewCount") return [value, "Reviews"]
                        return [value, name]
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgRating"
                      stroke="#00BFFF"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#00BFFF" }}
                      activeDot={{ r: 6 }}
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00BFFF" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#00BFFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

