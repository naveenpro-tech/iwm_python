"use client"

import { motion } from "framer-motion"
import SceneListItem from "./scene-list-item"
import SceneListItemSkeleton from "./scene-list-item-skeleton"
import type { Scene } from "./types"

interface SceneListProps {
  scenes: Scene[]
  onSceneSelect: (scene: Scene) => void
  isLoading: boolean
}

export default function SceneList({ scenes, onSceneSelect, isLoading }: SceneListProps) {
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
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <SceneListItemSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {scenes.map((scene) => (
        <SceneListItem key={scene.id} scene={scene} onSelect={onSceneSelect} />
      ))}
    </motion.div>
  )
}
