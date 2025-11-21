"use client"

import { motion } from "framer-motion"
import { AwardCeremonyCard } from "./award-ceremony-card"

interface AwardsCeremonySectionProps {
  title: string
  ceremonies: Array<{
    id: string
    name: string
    shortName: string
    year: number
    date: string
    location: string
    imageUrl: string
    description: string
    categories: number
    highlights: string[]
  }>
}

export function AwardsCeremonySection({ title, ceremonies = [] }: AwardsCeremonySectionProps) {
  if (!ceremonies || ceremonies.length === 0) {
    return null
  }

  return (
    <section className="mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-8"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ceremonies.map((ceremony, index) => (
          <motion.div
            key={ceremony.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <AwardCeremonyCard ceremony={ceremony} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
