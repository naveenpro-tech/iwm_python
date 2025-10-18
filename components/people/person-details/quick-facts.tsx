"use client"

import { motion } from "framer-motion"
import { Award, Calendar, Flag, MapPin, School, User } from "lucide-react"

interface QuickFactsProps {
  person: {
    birthDate?: string
    birthPlace?: string
    nationality?: string
    primaryRole?: string
    roles?: string[]
    stats?: {
      yearsActive?: string
    }
  }
}

export function QuickFacts({ person }: QuickFactsProps) {
  // Mock additional facts
  const additionalFacts = [
    {
      id: 1,
      label: "Education",
      value: "University College London",
      icon: <School size={16} className="text-[#00BFFF]" />,
    },
    {
      id: 2,
      label: "Known For",
      value: "Nonlinear storytelling, practical effects, IMAX cinematography",
      icon: <Award size={16} className="text-[#00BFFF]" />,
    },
    {
      id: 3,
      label: "Production Company",
      value: "Syncopy Films",
      icon: <User size={16} className="text-[#00BFFF]" />,
    },
  ]

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
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="bg-[#282828] rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">Quick Facts</h3>

      <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
        {person.birthDate && (
          <motion.div className="flex items-start" variants={itemVariants}>
            <Calendar size={16} className="mr-3 mt-1 text-[#00BFFF]" />
            <div>
              <p className="text-sm text-gray-400">Born</p>
              <p>{person.birthDate}</p>
            </div>
          </motion.div>
        )}

        {person.birthPlace && (
          <motion.div className="flex items-start" variants={itemVariants}>
            <MapPin size={16} className="mr-3 mt-1 text-[#00BFFF]" />
            <div>
              <p className="text-sm text-gray-400">Birthplace</p>
              <p>{person.birthPlace}</p>
            </div>
          </motion.div>
        )}

        {person.nationality && (
          <motion.div className="flex items-start" variants={itemVariants}>
            <Flag size={16} className="mr-3 mt-1 text-[#00BFFF]" />
            <div>
              <p className="text-sm text-gray-400">Nationality</p>
              <p>{person.nationality}</p>
            </div>
          </motion.div>
        )}

        {person.stats?.yearsActive && (
          <motion.div className="flex items-start" variants={itemVariants}>
            <Calendar size={16} className="mr-3 mt-1 text-[#00BFFF]" />
            <div>
              <p className="text-sm text-gray-400">Active Years</p>
              <p>{person.stats.yearsActive}</p>
            </div>
          </motion.div>
        )}

        {person.roles && person.roles.length > 0 && (
          <motion.div className="flex items-start" variants={itemVariants}>
            <User size={16} className="mr-3 mt-1 text-[#00BFFF]" />
            <div>
              <p className="text-sm text-gray-400">Roles</p>
              <p>{person.roles.join(", ")}</p>
            </div>
          </motion.div>
        )}

        {additionalFacts.map((fact) => (
          <motion.div key={fact.id} className="flex items-start" variants={itemVariants}>
            <span className="mr-3 mt-1">{fact.icon}</span>
            <div>
              <p className="text-sm text-gray-400">{fact.label}</p>
              <p>{fact.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
