"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import TeamHero from "@/components/cricket/team/team-hero"
import TeamInfoBar from "@/components/cricket/team/team-info-bar"
import CurrentSquadSection from "@/components/cricket/team/current-squad-section"
import TeamStatisticsSection from "@/components/cricket/team/team-statistics-section"
import RecentResultsCarousel from "@/components/cricket/team/recent-results-carousel"
import UpcomingFixtures from "@/components/cricket/team/upcoming-fixtures"
import TrophyCabinet from "@/components/cricket/team/trophy-cabinet"
import TeamPulseFeed from "@/components/cricket/team/team-pulse-feed"
import { getMockTeamData } from "@/components/cricket/team/mock-data"

export default function TeamProfilePage() {
  const { id } = useParams()
  const teamData = getMockTeamData(id as string)

  if (!teamData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Team not found</p>
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
      <TeamHero team={teamData} />
      <TeamInfoBar team={teamData} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CurrentSquadSection team={teamData} />
            <RecentResultsCarousel team={teamData} />
            <UpcomingFixtures team={teamData} />
          </div>
          <div className="space-y-6">
            <TeamStatisticsSection team={teamData} />
            <TrophyCabinet team={teamData} />
            <TeamPulseFeed team={teamData} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
