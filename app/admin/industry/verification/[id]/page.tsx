import VerificationReviewInterface from "@/components/industry-profiles/admin/verification-review-interface"

interface VerificationReviewPageProps {
  params: {
    id: string
  }
}

export default function VerificationReviewPage({ params }: VerificationReviewPageProps) {
  return (
    <div className="container py-8">
      <VerificationReviewInterface profileId={params.id} />
    </div>
  )
}
