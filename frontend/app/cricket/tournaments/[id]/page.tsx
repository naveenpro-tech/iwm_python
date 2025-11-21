"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TournamentHero from "@/components/cricket/tournament/tournament-hero"
import OverviewSection from "@/components/cricket/tournament/overview-section"
import ScheduleSection from "@/components/cricket/tournament/schedule-section"
import StandingsTable from "@/components/cricket/tournament/standings-table"
import StatisticsLeaderboard from "@/components/cricket/tournament/statistics-leaderboard"
import TournamentPulseFeed from "@/components/cricket/tournament/tournament-pulse-feed"
import HistoricalDataSection from "@/components/cricket/tournament/historical-data-section"
import { getMockTournamentData } from "@/components/cricket/tournament/mock-data"

export default function TournamentPage() {
  const { id } = useParams()
  const tournamentData = getMockTournamentData(id as string)

  if (!tournamentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Tournament not found</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#1A1A1A]"
    >
      <TournamentHero tournament={tournamentData} />

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewSection tournament={tournamentData} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleSection tournament={tournamentData} />
          </TabsContent>

          <TabsContent value="standings">
            <StandingsTable tournament={tournamentData} />
          </TabsContent>

          <TabsContent value="stats">
            <StatisticsLeaderboard tournament={tournamentData} />
          </TabsContent>

          <TabsContent value="news">
            <TournamentPulseFeed tournament={tournamentData} />
          </TabsContent>

          <TabsContent value="history">
            <HistoricalDataSection tournament={tournamentData} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}
