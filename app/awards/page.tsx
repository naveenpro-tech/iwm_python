import { Suspense } from "react"
import { AwardsHero } from "@/components/awards/awards-hero"
import { AwardsYearSelector } from "@/components/awards/awards-year-selector"
import { AwardsCeremonySection } from "@/components/awards/awards-ceremony-section"
import { HistoricalAwardsTimeline } from "@/components/awards/historical-awards-timeline"
import { getAwardsCeremonies } from "@/lib/api"
import { AwardsPageSkeleton } from "@/components/awards/awards-page-skeleton"

export default function AwardsHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<AwardsPageSkeleton />}>
        <AwardsContent />
      </Suspense>
    </div>
  )
}

async function AwardsContent() {
  // In a real app, this would be an API call
  const { majorCeremonies, regionalCeremonies } = await getAwardsCeremonies()

  return (
    <>
      <AwardsHero />

      <div className="container mx-auto px-4 py-8">
        <AwardsYearSelector />

        <div className="space-y-12">
          <AwardsCeremonySection title="Major Awards" ceremonies={majorCeremonies} />

          <AwardsCeremonySection title="Regional Awards" ceremonies={regionalCeremonies} />

          <HistoricalAwardsTimeline />
        </div>
      </div>
    </>
  )
}
