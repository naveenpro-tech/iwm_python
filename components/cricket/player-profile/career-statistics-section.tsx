"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface CareerStatisticsSectionProps {
  playerStats: {
    batting: {
      test: {
        matches: number
        innings: number
        runs: number
        average: number
        strikeRate: number
        hundreds: number
        fifties: number
        highestScore: string
        notOuts: number
        fours: number
        sixes: number
      }
      odi: {
        matches: number
        innings: number
        runs: number
        average: number
        strikeRate: number
        hundreds: number
        fifties: number
        highestScore: string
        notOuts: number
        fours: number
        sixes: number
      }
      t20i: {
        matches: number
        innings: number
        runs: number
        average: number
        strikeRate: number
        hundreds: number
        fifties: number
        highestScore: string
        notOuts: number
        fours: number
        sixes: number
      }
    }
    bowling?: {
      test: {
        matches: number
        innings: number
        wickets: number
        average: number
        economy: number
        bestFigures: string
        fiveWickets: number
      }
      odi: {
        matches: number
        innings: number
        wickets: number
        average: number
        economy: number
        bestFigures: string
        fiveWickets: number
      }
      t20i: {
        matches: number
        innings: number
        wickets: number
        average: number
        economy: number
        bestFigures: string
        fiveWickets: number
      }
    }
    performanceByYear: {
      year: number
      testRuns?: number
      odiRuns?: number
      t20iRuns?: number
      testWickets?: number
      odiWickets?: number
      t20iWickets?: number
    }[]
    performanceByOpposition: {
      opposition: string
      testRuns?: number
      odiRuns?: number
      t20iRuns?: number
      testWickets?: number
      odiWickets?: number
      t20iWickets?: number
    }[]
  }
}

export function CareerStatisticsSection({ playerStats }: CareerStatisticsSectionProps) {
  const [formatTab, setFormatTab] = useState("test")
  const [statTab, setStatTab] = useState("batting")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const getBattingStats = () => {
    switch (formatTab) {
      case "test":
        return playerStats.batting.test
      case "odi":
        return playerStats.batting.odi
      case "t20i":
        return playerStats.batting.t20i
      default:
        return playerStats.batting.test
    }
  }

  const getBowlingStats = () => {
    if (!playerStats.bowling) return null
    switch (formatTab) {
      case "test":
        return playerStats.bowling.test
      case "odi":
        return playerStats.bowling.odi
      case "t20i":
        return playerStats.bowling.t20i
      default:
        return playerStats.bowling.test
    }
  }

  const getPerformanceByYearData = () => {
    const key = statTab === "batting" ? `${formatTab}Runs` : `${formatTab}Wickets`
    return playerStats.performanceByYear
      .filter((item) => item[key as keyof typeof item] !== undefined)
      .map((item) => ({
        year: item.year,
        value: item[key as keyof typeof item],
      }))
  }

  const getPerformanceByOppositionData = () => {
    const key = statTab === "batting" ? `${formatTab}Runs` : `${formatTab}Wickets`
    return playerStats.performanceByOpposition
      .filter((item) => item[key as keyof typeof item] !== undefined)
      .map((item) => ({
        opposition: item.opposition,
        value: item[key as keyof typeof item],
      }))
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container mx-auto px-4 py-8">
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white mb-6">
        Career Statistics
      </motion.h2>

      <Tabs defaultValue="batting" onValueChange={setStatTab} className="mb-6">
        <TabsList className="bg-[#282828] border border-gray-700">
          <TabsTrigger value="batting" className="data-[state=active]:bg-[#3A3A3A]">
            Batting
          </TabsTrigger>
          {playerStats.bowling && (
            <TabsTrigger value="bowling" className="data-[state=active]:bg-[#3A3A3A]">
              Bowling
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      <Tabs defaultValue="test" onValueChange={setFormatTab} className="mb-6">
        <TabsList className="bg-[#282828] border border-gray-700">
          <TabsTrigger value="test" className="data-[state=active]:bg-[#3A3A3A]">
            Test
          </TabsTrigger>
          <TabsTrigger value="odi" className="data-[state=active]:bg-[#3A3A3A]">
            ODI
          </TabsTrigger>
          <TabsTrigger value="t20i" className="data-[state=active]:bg-[#3A3A3A]">
            T20I
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="batting" className="mt-0">
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">{getBattingStats().matches}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">{getBattingStats().runs.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Average</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">{getBattingStats().average.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Strike Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">{getBattingStats().strikeRate.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Highest Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">{getBattingStats().highestScore}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">100s</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">{getBattingStats().hundreds}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">50s</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">{getBattingStats().fifties}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#282828] border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">4s / 6s</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#00BFFF]">
                {getBattingStats().fours} / {getBattingStats().sixes}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>

      <TabsContent value="bowling" className="mt-0">
        {getBowlingStats() ? (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-[#282828] border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#00BFFF]">{getBowlingStats()?.matches}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#282828] border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Wickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#00BFFF]">{getBowlingStats()?.wickets}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#282828] border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#00BFFF]">{getBowlingStats()?.average.toFixed(2)}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#282828] border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Economy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#00BFFF]">{getBowlingStats()?.economy.toFixed(2)}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-[#282828] border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Best Figures</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#00BFFF]">{getBowlingStats()?.bestFigures}</p>
                </CardContent>
              </Card>

              <Card className="bg-[#282828] border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">5 Wicket Hauls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-[#00BFFF]">{getBowlingStats()?.fiveWickets}</p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div variants={itemVariants} className="bg-[#282828] rounded-lg p-6 text-center">
            <p className="text-gray-400">No bowling statistics available for this player.</p>
          </motion.div>
        )}
      </TabsContent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="bg-[#282828] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Performance by Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getPerformanceByYearData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                    <XAxis dataKey="year" stroke="#A0A0A0" />
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
                      dataKey="value"
                      stroke="#00BFFF"
                      strokeWidth={2}
                      dot={{ fill: "#00BFFF", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#00BFFF", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-[#282828] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Performance by Opposition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getPerformanceByOppositionData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3A" />
                    <XAxis dataKey="opposition" stroke="#A0A0A0" />
                    <YAxis stroke="#A0A0A0" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1A1A1A",
                        border: "1px solid #3A3A3A",
                        borderRadius: "8px",
                        color: "#E0E0E0",
                      }}
                    />
                    <Bar dataKey="value" fill="#00BFFF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
