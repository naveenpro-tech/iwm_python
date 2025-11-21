"use client"

import { motion } from "framer-motion"
import SceneCard from "./scene-card"
import SceneCardSkeleton from "./scene-card-skeleton"
import type { Scene } from "./types"

interface SceneGridProps {
  scenes: Scene[]
  onSceneSelect: (scene: Scene) => void
  isLoading: boolean
}

export default function SceneGrid({ scenes, onSceneSelect, isLoading }: SceneGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SceneCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {scenes.map((scene) => (
        <SceneCard key={scene.id} scene={scene} onSelect={onSceneSelect} />
      ))}
    </motion.div>
  )
}
