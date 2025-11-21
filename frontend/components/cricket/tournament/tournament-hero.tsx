"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, MapPin, Trophy } from "lucide-react"
import type { TournamentProfile } from "./types"
import { Badge } from "@/components/ui/badge"

interface TournamentHeroProps {
  tournament: TournamentProfile
}

export default function TournamentHero({ tournament }: TournamentHeroProps) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-[#1A1A1A]">
        {tournament.coverImageUrl && (
          <Image
            src={tournament.coverImageUrl || "/placeholder.svg"}
            alt={tournament.name}
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1A1A]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-[#282828] p-4 border-4 border-[#00BFFF] shadow-lg mb-6 md:mb-0"
          >
            <Image
              src={tournament.logoUrl || "/placeholder.svg"}
              alt={tournament.name}
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:ml-8 text-center md:text-left"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tournament.name}</h1>
            <p className="text-[#E0E0E0] text-lg mb-4">{tournament.edition}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="text-[#00BFFF] mr-2" size={18} />
                <span className="text-white">
                  {tournament.startDate} - {tournament.endDate}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="text-[#00BFFF] mr-2" size={18} />
                <span className="text-white">{tournament.host}</span>
              </div>
              <div className="flex items-center">
                <Trophy className="text-[#00BFFF] mr-2" size={18} />
                <span className="text-white">
                  {tournament.currentChampion
                    ? `Defending Champion: ${tournament.currentChampion}`
                    : "Inaugural Edition"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge className="bg-[#00BFFF] text-white">{tournament.format}</Badge>
              <Badge className="bg-[#282828] text-white">{tournament.teams.length} Teams</Badge>
              <Badge className="bg-[#282828] text-white">{tournament.matches.length} Matches</Badge>
              {tournament.status === "Live" && <Badge className="bg-[#FF4D4F] text-white">Live</Badge>}
              {tournament.status === "Upcoming" && <Badge className="bg-[#52C41A] text-white">Upcoming</Badge>}
              {tournament.status === "Completed" && <Badge className="bg-[#722ED1] text-white">Completed</Badge>}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
