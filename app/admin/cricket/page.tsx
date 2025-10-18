import type { Metadata } from "next"
import { CricketOverview } from "@/components/admin/cricket/cricket-overview"
import { CricketInsights } from "@/components/admin/cricket/cricket-insights"
import { CricketQuickActions } from "@/components/admin/cricket/cricket-quick-actions"
import { RecentOverrides } from "@/components/admin/cricket/recent-overrides"
import { UpcomingMatches } from "@/components/admin/cricket/upcoming-matches"

export const metadata: Metadata = {
  title: "Cricket Management | Siddu Admin",
  description: "Manage cricket content, matches, teams, and players",
}

export default function CricketManagementPage() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold tracking-tight">Cricket Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CricketOverview />
          <UpcomingMatches />
          <RecentOverrides />
        </div>
        <div className="space-y-6">
          <CricketInsights />
          <CricketQuickActions />
        </div>
      </div>
    </div>
  )
}
