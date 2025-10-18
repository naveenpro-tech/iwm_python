"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { TeamProfile } from "./types"

interface TeamHeroProps {
  team: TeamProfile
}

export default function TeamHero({ team }: TeamHeroProps) {
  return (
    <div className="relative w-full h-[40vh] min-h-[300px] overflow-hidden">
      {/* Background with team color gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${team.teamColors.primary}33, #1A1A1A)`,
        }}
      />

      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="flex flex-col md:flex-row items-end md:items-center h-full pb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border-4 shadow-lg"
            style={{ borderColor: team.teamColors.primary }}
          >
            <Image
              src={team.logoUrl || "/placeholder.svg"}
              alt={team.name}
              fill
              className="object-contain bg-[#282828] p-4"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:ml-8 mt-4 md:mt-0"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white">{team.name}</h1>
            <p className="text-[#E0E0E0] mt-2">
              Established: <span className="text-white">{team.established}</span>
            </p>
            <div className="flex flex-wrap mt-4">
              {team.formats.map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 rounded-full text-sm mr-2 mb-2"
                  style={{ backgroundColor: team.teamColors.primary, color: "#FFFFFF" }}
                >
                  {format}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
