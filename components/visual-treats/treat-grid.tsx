"use client"

import { motion } from "framer-motion"
import { TreatCard } from "./treat-card"
import type { VisualTreat } from "./types"

interface TreatGridProps {
  treats: VisualTreat[]
  viewMode: "grid" | "list"
  onTreatClick: (treat: VisualTreat) => void
}

export function TreatGrid({ treats, viewMode, onTreatClick }: TreatGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
    >
      {treats.map((treat) => (
        <motion.div key={treat.id} variants={itemVariants}>
          <TreatCard treat={treat} viewMode={viewMode} onClick={() => onTreatClick(treat)} />
        </motion.div>
      ))}
    </motion.div>
  )
}
