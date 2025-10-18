"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Award, Calendar, Film } from "lucide-react"

interface CareerHighlightsProps {
  personId: string | number
}

export function CareerHighlights({ personId }: CareerHighlightsProps) {
  // Mock career highlights data
  const highlights = [
    {
      id: 1,
      year: 1998,
      title: "Directorial Debut",
      description: "Released first feature film 'Following'",
      image: "/classic-film-camera.png",
      type: "career",
    },
    {
      id: 2,
      year: 2000,
      title: "Critical Breakthrough",
      description: "Released 'Memento' to critical acclaim",
      image: "/memento-poster.png",
      type: "film",
    },
    {
      id: 3,
      year: 2008,
      title: "Box Office Success",
      description: "'The Dark Knight' becomes one of the highest-grossing films",
      image: "/dark-knight-poster.png",
      type: "film",
    },
    {
      id: 4,
      year: 2010,
      title: "Innovation in Filmmaking",
      description: "'Inception' praised for originality and visual effects",
      image: "/inception-movie-poster.png",
      type: "film",
    },
    {
      id: 5,
      year: 2018,
      title: "First Oscar Nomination for Directing",
      description: "Nominated for Best Director for 'Dunkirk'",
      image: "/oscar-trophy.png",
      type: "award",
    },
    {
      id: 6,
      year: 2023,
      title: "Academy Award Win",
      description: "Won Best Director and Best Picture for 'Oppenheimer'",
      image: "/oscar-trophy.png",
      type: "award",
    },
  ]

  // Sort highlights chronologically
  const sortedHighlights = [...highlights].sort((a, b) => a.year - b.year)

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Career Highlights</h2>

      <motion.div
        className="relative border-l-2 border-gray-700 pl-6 ml-2 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedHighlights.map((highlight) => (
          <motion.div key={highlight.id} className="relative" variants={itemVariants}>
            {/* Timeline dot */}
            <div className="absolute -left-[30px] w-4 h-4 rounded-full bg-[#00BFFF] border-4 border-[#1A1A1A]"></div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#282828]">
                <Image
                  src={highlight.image || "/placeholder.svg"}
                  alt={highlight.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <Calendar size={16} className="text-[#00BFFF] mr-2" />
                  <span className="text-gray-400">{highlight.year}</span>
                </div>

                <h3 className="text-lg font-semibold">{highlight.title}</h3>
                <p className="text-gray-300">{highlight.description}</p>

                <div className="mt-2">
                  {highlight.type === "film" && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#282828] text-xs">
                      <Film size={12} className="mr-1 text-[#00BFFF]" />
                      Film Release
                    </div>
                  )}
                  {highlight.type === "award" && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#282828] text-xs">
                      <Award size={12} className="mr-1 text-[#FFD700]" />
                      Award
                    </div>
                  )}
                  {highlight.type === "career" && (
                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-[#282828] text-xs">
                      <Calendar size={12} className="mr-1 text-[#00BFFF]" />
                      Career Milestone
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
