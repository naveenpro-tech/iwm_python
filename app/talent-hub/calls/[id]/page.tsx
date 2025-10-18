import CastingCallDetailPage from "@/components/talent-hub/casting-call-detail/casting-call-detail-page"

interface PageProps {
  params: {
    id: string
  }
}

export default function CastingCallDetailPageWrapper({ params }: PageProps) {
  return <CastingCallDetailPage callId={params.id} />
}
