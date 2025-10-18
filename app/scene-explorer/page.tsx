import { Suspense } from "react"
import SceneExplorerContent from "@/components/scene-explorer/scene-explorer-content"
import SceneExplorerSkeleton from "@/components/scene-explorer/scene-explorer-skeleton"

export const metadata = {
  title: "Scene Explorer | Siddu Global Entertainment Hub",
  description: "Discover unforgettable moments from cinema's greatest stories",
}

export default function SceneExplorerPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Suspense fallback={<SceneExplorerSkeleton />}>
        <SceneExplorerContent />
      </Suspense>
    </main>
  )
}
