"use client"

import type { CricketMatch } from "../types"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts"
import Image from "next/image"

interface MatchStatisticsProps {
  match: CricketMatch
}

export function MatchStatistics({ match }: MatchStatisticsProps) {
  const homeTeam = match.teams.home
  const awayTeam = match.teams.away

  // Check if match has started
  const hasMatchStarted = match.status !== "Upcoming"

  if (!hasMatchStarted) {
    return (
      <div className="bg-[#282828] rounded-lg p-6 text-center">
        <p className="text-[#A0A0A0]">Match statistics will be available once the match begins</p>
      </div>
    )
  }

  // Generate mock run distribution data
  const generateRunDistribution = () => {
    const homeRuns = match.innings?.find((i) => i.team === homeTeam.id)?.runs || 0
    const awayRuns = match.innings?.find((i) => i.team === awayTeam.id)?.runs || 0

    return [
      {
        name: "1s",
        [homeTeam.shortName]: Math.floor(homeRuns * 0.4),
        [awayTeam.shortName]: Math.floor(awayRuns * 0.4),
      },
      {
        name: "2s",
        [homeTeam.shortName]: Math.floor(homeRuns * 0.15),
        [awayTeam.shortName]: Math.floor(awayRuns * 0.15),
      },
      {
        name: "3s",
        [homeTeam.shortName]: Math.floor(homeRuns * 0.05),
        [awayTeam.shortName]: Math.floor(awayRuns * 0.05),
      },
      {
        name: "4s",
        [homeTeam.shortName]: Math.floor(homeRuns * 0.25),
        [awayTeam.shortName]: Math.floor(awayRuns * 0.25),
      },
      {
        name: "6s",
        [homeTeam.shortName]: Math.floor(homeRuns * 0.15),
        [awayTeam.shortName]: Math.floor(awayRuns * 0.15),
      },
    ]
  }

  // Generate mock run rate data
  const generateRunRateData = () => {
    const data = []
    const totalOvers = 20

    for (let i = 1; i <= totalOvers; i++) {
      data.push({
        over: i,
        [homeTeam.shortName]: (Math.random() * 4 + 4).toFixed(1),
        [awayTeam.shortName]: (Math.random() * 4 + 4).toFixed(1),
      })
    }

    return data
  }

  // Generate mock scoring areas data
  const generateScoringAreas = () => {
    return [
      { name: "Fine Leg", value: 15 },
      { name: "Square Leg", value: 20 },
      { name: "Mid Wicket", value: 25 },
      { name: "Mid On", value: 10 },
      { name: "Cover", value: 15 },
      { name: "Point", value: 10 },
      { name: "Third Man", value: 5 },
    ]
  }

  const runDistribution = generateRunDistribution()
  const runRateData = generateRunRateData()
  const scoringAreas = generateScoringAreas()

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B"]

  return (
    <div className="space-y-6">
      {/* Team comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="bg-[#282828] border-[#444444]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#E0E0E0] flex items-center">
              <div className="relative w-6 h-6 mr-2">
                <Image src={homeTeam.logo || "/placeholder.svg"} alt={homeTeam.name} fill className="object-contain" />
              </div>
              {homeTeam.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Runs</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === homeTeam.id)?.runs || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Wickets</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === homeTeam.id)?.wickets || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Overs</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === homeTeam.id)?.overs.toFixed(1) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Run Rate</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === homeTeam.id)?.runRate.toFixed(2) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Extras</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === homeTeam.id)?.extras.total || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#282828] border-[#444444]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#E0E0E0] flex items-center">
              <div className="relative w-6 h-6 mr-2">
                <Image src={awayTeam.logo || "/placeholder.svg"} alt={awayTeam.name} fill className="object-contain" />
              </div>
              {awayTeam.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Runs</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === awayTeam.id)?.runs || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Wickets</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === awayTeam.id)?.wickets || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Overs</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === awayTeam.id)?.overs.toFixed(1) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Run Rate</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === awayTeam.id)?.runRate.toFixed(2) || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A0A0A0]">Extras</span>
                <span className="text-[#E0E0E0] font-medium">
                  {match.innings?.find((i) => i.team === awayTeam.id)?.extras.total || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Run distribution chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#282828] rounded-lg p-4"
      >
        <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Run Distribution</h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={runDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="name" stroke="#A0A0A0" />
              <YAxis stroke="#A0A0A0" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333333", borderColor: "#444444", color: "#E0E0E0" }}
                itemStyle={{ color: "#E0E0E0" }}
                labelStyle={{ color: "#E0E0E0" }}
              />
              <Legend wrapperStyle={{ color: "#E0E0E0" }} />
              <Bar dataKey={homeTeam.shortName} fill={homeTeam.primaryColor || "#00BFFF"} />
              <Bar dataKey={awayTeam.shortName} fill={awayTeam.primaryColor || "#FF4D4D"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Run rate chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#282828] rounded-lg p-4"
      >
        <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Run Rate by Over</h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={runRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
              <XAxis dataKey="over" stroke="#A0A0A0" />
              <YAxis stroke="#A0A0A0" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333333", borderColor: "#444444", color: "#E0E0E0" }}
                itemStyle={{ color: "#E0E0E0" }}
                labelStyle={{ color: "#E0E0E0" }}
              />
              <Legend wrapperStyle={{ color: "#E0E0E0" }} />
              <Bar dataKey={homeTeam.shortName} fill={homeTeam.primaryColor || "#00BFFF"} />
              <Bar dataKey={awayTeam.shortName} fill={awayTeam.primaryColor || "#FF4D4D"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Scoring areas chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#282828] rounded-lg p-4"
      >
        <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Scoring Areas</h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scoringAreas}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {scoringAreas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: "#E0E0E0" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#333333", borderColor: "#444444", color: "#E0E0E0" }}
                itemStyle={{ color: "#E0E0E0" }}
                labelStyle={{ color: "#E0E0E0" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Win probability */}
      {match.winProbability && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#282828] rounded-lg p-4"
        >
          <h3 className="text-lg font-bold text-[#E0E0E0] mb-4">Win Probability</h3>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="relative w-6 h-6 mr-2">
                <Image src={homeTeam.logo || "/placeholder.svg"} alt={homeTeam.name} fill className="object-contain" />
              </div>
              <span className="text-[#E0E0E0]">{homeTeam.name}</span>
            </div>
            <span className="text-[#E0E0E0] font-medium">{match.winProbability.home}%</span>
          </div>

          <div className="w-full h-4 bg-[#333333] rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full"
              style={{
                width: `${match.winProbability.home}%`,
                backgroundColor: homeTeam.primaryColor || "#00BFFF",
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="relative w-6 h-6 mr-2">
                <Image src={awayTeam.logo || "/placeholder.svg"} alt={awayTeam.name} fill className="object-contain" />
              </div>
              <span className="text-[#E0E0E0]">{awayTeam.name}</span>
            </div>
            <span className="text-[#E0E0E0] font-medium">{match.winProbability.away}%</span>
          </div>

          <div className="w-full h-4 bg-[#333333] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${match.winProbability.away}%`,
                backgroundColor: awayTeam.primaryColor || "#FF4D4D",
              }}
            ></div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
