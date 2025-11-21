"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function TrendChart() {
  const trendData = [
    { date: "Jul 1", gross: 145.2 },
    { date: "Jul 8", gross: 167.8 },
    { date: "Jul 15", gross: 189.4 },
    { date: "Jul 22", gross: 234.7 },
    { date: "Jul 29", gross: 198.3 },
    { date: "Aug 5", gross: 176.9 },
    { date: "Aug 12", gross: 203.1 },
  ]

  return (
    <Card className="bg-[#282828] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#00BFFF]" />
          Weekly Box Office Trends
        </CardTitle>
        <p className="text-gray-400 text-sm">Total gross in millions (USD)</p>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
              <XAxis dataKey="date" stroke="#A0A0A0" />
              <YAxis stroke="#A0A0A0" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #3A3A3A",
                  borderRadius: "8px",
                  color: "#E0E0E0",
                }}
              />
              <Line
                type="monotone"
                dataKey="gross"
                stroke="#00BFFF"
                strokeWidth={3}
                dot={{ fill: "#00BFFF", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#00BFFF", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  )
}
