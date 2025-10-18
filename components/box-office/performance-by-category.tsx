"use client"

import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PerformanceByCategoryProps {
  genreData: any[]
  studioData: any[]
  monthlyData: any[]
}

export function PerformanceByCategory({ genreData, studioData, monthlyData }: PerformanceByCategoryProps) {
  const genrePerformance = [
    { name: "Action", value: 35, color: "#00BFFF" },
    { name: "Drama", value: 22, color: "#FF6B6B" },
    { name: "Comedy", value: 18, color: "#4ECDC4" },
    { name: "Sci-Fi", value: 15, color: "#45B7D1" },
    { name: "Horror", value: 10, color: "#96CEB4" },
  ]

  const studioPerformance = [
    { studio: "Disney", gross: 1240 },
    { studio: "Warner Bros", gross: 980 },
    { studio: "Universal", gross: 850 },
    { studio: "Sony", gross: 720 },
    { studio: "Paramount", gross: 650 },
    { studio: "20th Century", gross: 480 },
  ]

  const monthlyPerformance = [
    { month: "Jan", gross: 890 },
    { month: "Feb", gross: 750 },
    { month: "Mar", gross: 1200 },
    { month: "Apr", gross: 980 },
    { month: "May", gross: 1450 },
    { month: "Jun", gross: 1680 },
    { month: "Jul", gross: 1890 },
  ]

  return (
    <Card className="bg-[#282828] border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Performance by Category</CardTitle>
        <p className="text-gray-400 text-sm">Box office breakdown across different segments</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="genre" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A]">
            <TabsTrigger value="genre" className="data-[state=active]:bg-[#3A3A3A]">
              By Genre
            </TabsTrigger>
            <TabsTrigger value="studio" className="data-[state=active]:bg-[#3A3A3A]">
              By Studio
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-[#3A3A3A]">
              Monthly Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="genre" className="mt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genrePerformance}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {genrePerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E0E0E0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="studio" className="mt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studioPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                  <XAxis dataKey="studio" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E0E0E0",
                    }}
                  />
                  <Bar dataKey="gross" fill="#00BFFF" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                  <XAxis dataKey="month" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid #3A3A3A",
                      borderRadius: "8px",
                      color: "#E0E0E0",
                    }}
                  />
                  <Bar dataKey="gross" fill="#00BFFF" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
