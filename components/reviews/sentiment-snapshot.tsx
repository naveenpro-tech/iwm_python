"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SentimentSnapshot() {
  // Mock data for sentiment distribution
  const sentimentData = [
    { name: "Positive", value: 65, color: "#4CAF50" },
    { name: "Neutral", value: 20, color: "#FFC107" },
    { name: "Negative", value: 15, color: "#F44336" },
  ]

  // Mock data for trending keywords
  const trendingKeywords = [
    { keyword: "cinematography", count: 128 },
    { keyword: "performance", count: 97 },
    { keyword: "screenplay", count: 85 },
    { keyword: "direction", count: 76 },
    { keyword: "soundtrack", count: 62 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-siddu-bg-card-dark border-siddu-border-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Sentiment Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Sentiment Distribution */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Overall Sentiment</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-2">
              {sentimentData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-siddu-text-subtle">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Keywords */}
          <div>
            <h4 className="text-sm font-medium mb-2">Trending Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {trendingKeywords.map((item) => (
                <Badge
                  key={item.keyword}
                  variant="outline"
                  className="bg-siddu-bg-card border-siddu-border-subtle cursor-pointer hover:border-siddu-electric-blue transition-colors"
                >
                  {item.keyword} ({item.count})
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
