import { ExploreContainer } from "@/components/explore/explore-container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Explore | Movie Madders",
  description: "Discover new movies, shows, and content from around the world",
}

export default function ExplorePage() {
  return <ExploreContainer />
}
