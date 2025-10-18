import { Suspense } from "react"
import { AwardPageHeader } from "@/components/awards/award-page-header"
import { AwardHighlights } from "@/components/awards/award-highlights"
import { AwardCategories } from "@/components/awards/award-categories"
import { PreviousYearsNavigation } from "@/components/awards/previous-years-navigation"
import { getAwardDetails } from "@/lib/api"
import { AwardDetailsSkeleton } from "@/components/awards/award-details-skeleton"

interface AwardDetailsPageProps {
  params: {
    id: string
  }
}

export default function AwardDetailsPage({ params }: AwardDetailsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<AwardDetailsSkeleton />}>
        <AwardContent id={params.id} />
      </Suspense>
    </div>
  )
}

async function AwardContent({ id }: { id: string }) {
  // In a real app, this would be an API call
  const awardDetails = await getAwardDetails(id)

  return (
    <>
      <AwardPageHeader
        logo={awardDetails.logo}
        title={awardDetails.title}
        year={awardDetails.year}
        host={awardDetails.host}
        venue={awardDetails.venue}
        date={awardDetails.date}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="space-y-12">
              <AwardHighlights highlights={awardDetails.highlights} />
              <AwardCategories categories={awardDetails.categories} />
            </div>
          </div>

          <div>
            <PreviousYearsNavigation
              currentYear={awardDetails.year}
              availableYears={awardDetails.availableYears}
              ceremonySlug={awardDetails.slug}
            />
          </div>
        </div>
      </div>
    </>
  )
}
