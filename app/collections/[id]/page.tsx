import { CollectionDetail } from "@/components/collections/collection-detail"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Collection | Siddu Global Entertainment Hub",
  description: "Explore curated movie collections",
}

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
  return <CollectionDetail id={params.id} />
}
