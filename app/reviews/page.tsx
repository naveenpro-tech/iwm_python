import { Suspense } from "react"
import { ReviewsPageContent } from "@/components/reviews/reviews-page-content"
import { ReviewsPageSkeleton } from "@/components/reviews/reviews-page-skeleton"

export const metadata = {
  title: "Voice of Siddu Verse | Explore Reviews",
  description: "Discover authentic community and critic insights on movies from around the world",
}

export default function ReviewsPage() {
  return (
    <main className="min-h-screen bg-siddu-bg-dark text-siddu-text-light">
      <Suspense fallback={<ReviewsPageSkeleton />}>
        <ReviewsPageContent />
      </Suspense>
    </main>
  )
}
