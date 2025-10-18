import type { Metadata } from "next"
import { MatchesHeader } from "@/components/admin/cricket/matches/matches-header"
import { MatchesTable } from "@/components/admin/cricket/matches/matches-table"
import { MatchesFilters } from "@/components/admin/cricket/matches/matches-filters"

export const metadata: Metadata = {
  title: "Cricket Matches | Siddu Admin",
  description: "Manage cricket matches, scores, and details",
}

export default function CricketMatchesPage() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
      <MatchesHeader />
      <MatchesFilters />
      <MatchesTable />
    </div>
  )
}
