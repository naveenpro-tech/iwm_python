"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { TeamProfile } from "./types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamStatisticsSectionProps {
  team: TeamProfile
}

export default function TeamStatisticsSection({ team }: TeamStatisticsSectionProps) {
  const [format, setFormat] = useState("all")

  // Get stats based on selected format
  const getStats = () => {
    if (format === "all") return team.statistics.overall
    return team.statistics.formats[format]
  }

  const stats = getStats()

  // Prepare data for win/loss chart
  const resultData = [
    { name: "Wins", value: stats.wins, color: "#4CAF50" },
    { name: "Losses", value: stats.losses, color: "#F44336" },
    { name: "Draws", value: stats.draws, color: "#FFC107" },
  ]

  // Prepare data for venue performance
  const venueData = Object.entries(stats.venuePerformance).map(([venue, winPercentage]) => ({
    venue,
    winPercentage,
  }))

  return (
    <div className="bg-[#282828] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Team Statistics</h2>

      <div className="flex mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFormat("all")}
          className={`px-4 py-2 mr-2 rounded-md ${format === "all" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
        >
          All Formats
        </button>
        <button
          onClick={() => setFormat("test")}
          className={`px-4 py-2 mr-2 rounded-md ${format === "test" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
        >
          Test
        </button>
        <button
          onClick={() => setFormat("odi")}
          className={`px-4 py-2 mr-2 rounded-md ${format === "odi" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
        >
          ODI
        </button>
        <button
          onClick={() => setFormat("t20")}
          className={`px-4 py-2 mr-2 rounded-md ${format === "t20" ? "bg-[#00BFFF] text-white" : "bg-[#333] text-[#E0E0E0]"}`}
        >
          T20
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={format}
        className="space-y-6"
      >
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-[#333] border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#E0E0E0] text-lg">Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.matches}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#333] border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#E0E0E0] text-lg">Win %</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.winPercentage}%</p>
            </CardContent>
          </Card>

          <Card className="bg-[#333] border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#E0E0E0] text-lg">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.highestScore}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="results">
          <TabsList>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="rivals">Rivals</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resultData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {resultData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", borderColor: "#444" }}
                    itemStyle={{ color: "#E0E0E0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-[#4CAF50] rounded-full mr-2"></div>
                <span className="text-[#E0E0E0]">Wins: {stats.wins}</span>
              </div>
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-[#F44336] rounded-full mr-2"></div>
                <span className="text-[#E0E0E0]">Losses: {stats.losses}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#FFC107] rounded-full mr-2"></div>
                <span className="text-[#E0E0E0]">Draws: {stats.draws}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="venues" className="pt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={venueData}>
                  <XAxis dataKey="venue" tick={{ fill: "#E0E0E0" }} />
                  <YAxis tick={{ fill: "#E0E0E0" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#333", borderColor: "#444" }}
                    itemStyle={{ color: "#E0E0E0" }}
                  />
                  <Bar dataKey="winPercentage" fill="#00BFFF" name="Win %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="rivals" className="pt-4">
            <div className="space-y-3">
              {Object.entries(stats.rivalRecords).map(([rival, record]) => (
                <div key={rival} className="flex items-center justify-between p-3 bg-[#333] rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#444] rounded-full mr-3"></div>
                    <span className="text-white">{rival}</span>
                  </div>
                  <div className="text-[#E0E0E0]">
                    {record.wins}W - {record.losses}L - {record.draws}D
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
