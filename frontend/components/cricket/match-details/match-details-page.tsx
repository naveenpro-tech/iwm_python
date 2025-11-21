"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { CricketMatch } from "../types"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatchSummary } from "./match-summary"
import { MatchScorecard } from "./match-scorecard"
import { MatchCommentary } from "./match-commentary"
import { MatchStatistics } from "./match-statistics"
import { MatchPlayingXI } from "./match-playing-xi"
import { MatchVenueInfo } from "./match-venue-info"
import { ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"

interface MatchDetailsPageProps {
  match: CricketMatch
}

export function MatchDetailsPage({ match }: MatchDetailsPageProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const homeTeam = match.teams.home
  const awayTeam = match.teams.away

  // Format match date
  const formatMatchDate = () => {
    const date = new Date(match.startTime)
    return format(date, "EEEE, MMMM d, yyyy")
  }

  // Format match time
  const formatMatchTime = () => {
    const date = new Date(match.startTime)
    return format(date, "h:mm a")
  }

  // Get match status display
  const getStatusDisplay = () => {
    switch (match.status) {
      case "Live":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-500">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
            LIVE
          </span>
        )
      case "Innings Break":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-600/20 text-amber-500">
            Innings Break
          </span>
        )
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-500">
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/20 text-blue-500">
            {match.status}
          </span>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/cricket"
          className="inline-flex items-center text-sm text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Cricket
        </Link>
      </div>

      {/* Match header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#282828] rounded-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {match.series.logo && (
              <Image
                src={match.series.logo || "/placeholder.svg"}
                alt={match.series.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-[#E0E0E0] font-medium">{match.series.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#333333] text-[#A0A0A0]">{match.matchType}</span>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusDisplay()}
            <button className="p-2 rounded-full hover:bg-[#333333] transition-colors" aria-label="Share match">
              <Share2 size={16} className="text-[#A0A0A0]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="text-center">
              <div className="relative w-16 h-16 mb-2">
                <Image src={homeTeam.logo || "/placeholder.svg"} alt={homeTeam.name} fill className="object-contain" />
              </div>
              <h3 className="font-bold text-[#E0E0E0]">{homeTeam.name}</h3>
              {match.currentInnings && match.currentInnings.team === homeTeam.id && (
                <div className="text-xl font-bold text-[#E0E0E0] mt-1">
                  {match.currentInnings.runs}/{match.currentInnings.wickets}
                  <span className="text-sm font-normal text-[#A0A0A0] ml-1">
                    ({Math.floor(match.currentInnings.overs)}.{(match.currentInnings.overs % 1) * 10})
                  </span>
                </div>
              )}
              {match.innings && match.innings.find((i) => i.team === homeTeam.id) && (
                <div className="text-xl font-bold text-[#E0E0E0] mt-1">
                  {match.innings.find((i) => i.team === homeTeam.id)?.runs}/
                  {match.innings.find((i) => i.team === homeTeam.id)?.wickets}
                </div>
              )}
            </div>

            <div className="text-center">
              <span className="text-[#A0A0A0] text-lg">vs</span>
            </div>

            <div className="text-center">
              <div className="relative w-16 h-16 mb-2">
                <Image src={awayTeam.logo || "/placeholder.svg"} alt={awayTeam.name} fill className="object-contain" />
              </div>
              <h3 className="font-bold text-[#E0E0E0]">{awayTeam.name}</h3>
              {match.currentInnings && match.currentInnings.team === awayTeam.id && (
                <div className="text-xl font-bold text-[#E0E0E0] mt-1">
                  {match.currentInnings.runs}/{match.currentInnings.wickets}
                  <span className="text-sm font-normal text-[#A0A0A0] ml-1">
                    ({Math.floor(match.currentInnings.overs)}.{(match.currentInnings.overs % 1) * 10})
                  </span>
                </div>
              )}
              {match.innings && match.innings.find((i) => i.team === awayTeam.id) && (
                <div className="text-xl font-bold text-[#E0E0E0] mt-1">
                  {match.innings.find((i) => i.team === awayTeam.id)?.runs}/
                  {match.innings.find((i) => i.team === awayTeam.id)?.wickets}
                </div>
              )}
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-sm text-[#A0A0A0] mb-1">{formatMatchDate()}</div>
            <div className="text-sm text-[#A0A0A0] mb-1">{formatMatchTime()}</div>
            <div className="text-sm text-[#A0A0A0]">
              {match.venue.name}, {match.venue.city}
            </div>
            {match.toss && (
              <div className="text-sm text-[#A0A0A0] mt-2">
                Toss: {match.teams[match.toss.winner].name}, elected to {match.toss.decision}
              </div>
            )}
            {match.result && <div className="mt-2 text-[#E0E0E0] font-medium">{match.result.description}</div>}
          </div>
        </div>
      </motion.div>

      {/* Match content tabs */}
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#282828] mb-6 overflow-x-auto flex-nowrap w-full justify-start">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          <TabsTrigger value="commentary">Commentary</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="playing-xi">Playing XI</TabsTrigger>
          <TabsTrigger value="venue">Venue</TabsTrigger>
        </TabsList>

        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <TabsContent value="summary">
            <MatchSummary match={match} />
          </TabsContent>

          <TabsContent value="scorecard">
            <MatchScorecard match={match} />
          </TabsContent>

          <TabsContent value="commentary">
            <MatchCommentary match={match} />
          </TabsContent>

          <TabsContent value="statistics">
            <MatchStatistics match={match} />
          </TabsContent>

          <TabsContent value="playing-xi">
            <MatchPlayingXI match={match} />
          </TabsContent>

          <TabsContent value="venue">
            <MatchVenueInfo match={match} />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}
