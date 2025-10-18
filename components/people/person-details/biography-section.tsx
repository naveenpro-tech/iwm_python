"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

interface BiographySectionProps {
  person: {
    name: string
    birthDate?: string
    birthPlace?: string
    biography: {
      full: string
    }
  }
}

export function BiographySection({ person }: BiographySectionProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  // Split biography into paragraphs
  const bioParagraphs = person.biography.full.split("\n\n")

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
      {/* Personal Info */}
      {(person.birthDate || person.birthPlace) && (
        <motion.div variants={itemVariants} className="bg-[#282828] rounded-lg p-4 mb-6 flex flex-wrap gap-4">
          {person.birthDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 text-[#00BFFF]" size={18} />
              <span>Born: {person.birthDate}</span>
            </div>
          )}
          {person.birthPlace && (
            <div className="flex items-center">
              <MapPin className="mr-2 text-[#00BFFF]" size={18} />
              <span>Birthplace: {person.birthPlace}</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Biography */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-4">Biography</h2>

        <div className="space-y-4 text-gray-300">
          {bioParagraphs.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Last updated: May 2023</p>
          <p>Source: Siddu Editorial Team</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
