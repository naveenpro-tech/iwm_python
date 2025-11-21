import { getMatchById } from "@/components/cricket/mock-data"
import { MatchDetailsPage } from "@/components/cricket/match-details/match-details-page"
import { notFound } from "next/navigation"

interface MatchPageProps {
  params: {
    id: string
  }
}

export default function MatchPage({ params }: MatchPageProps) {
  const match = getMatchById(params.id)

  if (!match) {
    notFound()
  }

  return <MatchDetailsPage match={match} />
}
