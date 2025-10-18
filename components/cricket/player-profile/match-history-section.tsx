"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

interface MatchHistorySectionProps {
  matchHistory: {
    test: {
      id: string
      date: string
      venue: string
      opposition: string
      oppositionFlag: string
      result: string
      playerPerformance: {
        batting?: {
          runs: number
          balls: number
          fours: number
          sixes: number
          notOut: boolean
        }
        bowling?: {
          overs: number
          maidens: number
          runs: number
          wickets: number
          economy: number
        }
      }
    }[]
    odi: {
      id: string
      date: string
      venue: string
      opposition: string
      oppositionFlag: string
      result: string
      playerPerformance: {
        batting?: {
          runs: number
          balls: number
          fours: number
          sixes: number
          notOut: boolean
        }
        bowling?: {
          overs: number
          maidens: number
          runs: number
          wickets: number
          economy: number
        }
      }
    }[]
    t20i: {
      id: string
      date: string
      venue: string
      opposition: string
      oppositionFlag: string
      result: string
      playerPerformance: {
        batting?: {
          runs: number
          balls: number
          fours: number
          sixes: number
          notOut: boolean
        }
        bowling?: {
          overs: number
          maidens: number
          runs: number
          wickets: number
          economy: number
        }
      }
    }[]
  }
}

export function MatchHistorySection({ matchHistory }: MatchHistorySectionProps) {
  const [formatTab, setFormatTab] = useState("test")
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)
  const [visibleMatches, setVisibleMatches] = useState(5)

  const toggleMatchExpansion = (matchId: string) => {
    if (expandedMatch === matchId) {
      setExpandedMatch(null)
    } else {
      setExpandedMatch(matchId)
    }
  }

  const loadMoreMatches = () => {
    setVisibleMatches((prev) => prev + 5)
  }

  const getMatchesByFormat = () => {
    switch (formatTab) {
      case "test":
        return matchHistory.test
      case "odi":
        return matchHistory.odi
      case "t20i":
        return matchHistory.t20i
      default:
        return matchHistory.test
    }
  }

  const matches = getMatchesByFormat().slice(0, visibleMatches)

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Match History</h2>

        <Tabs defaultValue="test" onValueChange={setFormatTab}>
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
      </motion.div>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="bg-[#282828] border-gray-700 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#00BFFF]" />
                    <span className="text-sm text-gray-400">{match.date}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      match.result.toLowerCase().includes("won")
                        ? "bg-green-900/30 text-green-300 border-green-700"
                        : match.result.toLowerCase().includes("lost")
                          ? "bg-red-900/30 text-red-300 border-red-700"
                          : "bg-yellow-900/30 text-yellow-300 border-yellow-700"
                    }`}
                  >
                    {match.result}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden">
                      <Image
                        src={`/cricket/${match.oppositionFlag.toLowerCase()}-logo.png`}
                        alt={match.opposition}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-white font-medium">vs {match.opposition}</span>
                  </div>
                  <span className="text-sm text-gray-400">{match.venue}</span>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMatchExpansion(match.id)}
                  className="w-full justify-between text-gray-300 hover:text-white hover:bg-[#3A3A3A]"
                >
                  <span>Player Performance</span>
                  {expandedMatch === match.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {expandedMatch === match.id && (
                  <div className="mt-4 space-y-4">
                    {match.playerPerformance.batting && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Batting</h4>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Runs</div>
                            <div className="text-white font-medium">{match.playerPerformance.batting.runs}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Balls</div>
                            <div className="text-white font-medium">{match.playerPerformance.batting.balls}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">4s</div>
                            <div className="text-white font-medium">{match.playerPerformance.batting.fours}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">6s</div>
                            <div className="text-white font-medium">{match.playerPerformance.batting.sixes}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">SR</div>
                            <div className="text-white font-medium">
                              {(
                                (match.playerPerformance.batting.runs / match.playerPerformance.batting.balls) *
                                100
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {match.playerPerformance.bowling && (
                      <div>
                        <h4 className="text-sm font-medium text-white mb-2">Bowling</h4>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Overs</div>
                            <div className="text-white font-medium">{match.playerPerformance.bowling.overs}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Maidens</div>
                            <div className="text-white font-medium">{match.playerPerformance.bowling.maidens}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Runs</div>
                            <div className="text-white font-medium">{match.playerPerformance.bowling.runs}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Wickets</div>
                            <div className="text-white font-medium">{match.playerPerformance.bowling.wickets}</div>
                          </div>
                          <div className="bg-[#1A1A1A] p-2 rounded">
                            <div className="text-xs text-gray-400 mb-1">Economy</div>
                            <div className="text-white font-medium">
                              {match.playerPerformance.bowling.economy.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {visibleMatches < getMatchesByFormat().length && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={loadMoreMatches}
            className="border-gray-600 text-gray-300 hover:bg-[#3A3A3A] hover:text-white"
          >
            Load More Matches
          </Button>
        </div>
      )}
    </div>
  )
}
