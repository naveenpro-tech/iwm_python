import { CollectionDetail } from "@/components/collections/collection-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Collection | Movie Madders",
  description: "Explore curated movie collections",
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CollectionDetail id={id} />
}
