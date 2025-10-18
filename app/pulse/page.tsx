import { PulseFeedContainer } from "@/components/pulse/pulse-feed-container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Siddu Pulse | Global Entertainment Hub",
  description: "Connect with the global entertainment community through Siddu Pulse",
}

export default function PulsePage() {
  return <PulseFeedContainer />
}
