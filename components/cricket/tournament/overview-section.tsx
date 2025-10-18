"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { TournamentProfile } from "./types"
import { Card, CardContent } from "@/components/ui/card"

interface OverviewSectionProps {
  tournament: TournamentProfile
}

export default function OverviewSection({ tournament }: OverviewSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Tournament Format</h2>
          <Card className="bg-[#282828] border-none">
            <CardContent className="p-6">
              <p className="text-[#E0E0E0] whitespace-pre-line">{tournament.formatDescription}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Prize Money</h2>
          <Card className="bg-[#282828] border-none">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Winner</span>
                  <span className="text-[#00BFFF] font-bold">{tournament.prizeMoney.winner}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Runner-up</span>
                  <span className="text-[#00BFFF] font-bold">{tournament.prizeMoney.runnerUp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Semi-finalists</span>
                  <span className="text-[#00BFFF] font-bold">{tournament.prizeMoney.semifinalists}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white">Total Prize Pool</span>
                  <span className="text-[#00BFFF] font-bold">{tournament.prizeMoney.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Participating Teams</h2>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {tournament.teams.map((team) => (
            <motion.div key={team.id} variants={item}>
              <Link href={`/cricket/teams/${team.id}`}>
                <Card className="bg-[#282828] border-none hover:bg-[#333] transition-colors">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-3">
                      <Image src={team.logoUrl || "/placeholder.svg"} alt={team.name} fill className="object-contain" />
                    </div>
                    <h3 className="text-white font-medium text-center">{team.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Venues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournament.venues.map((venue) => (
            <Card key={venue.name} className="bg-[#282828] border-none overflow-hidden">
              <div className="relative h-40">
                <Image src={venue.imageUrl || "/placeholder.svg"} alt={venue.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-1">{venue.name}</h3>
                <p className="text-[#E0E0E0] text-sm">{venue.location}</p>
                <p className="text-[#A0A0A0] text-sm mt-2">Capacity: {venue.capacity}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {tournament.sponsors && tournament.sponsors.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Sponsors</h2>
          <Card className="bg-[#282828] border-none">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-center gap-8">
                {tournament.sponsors.map((sponsor) => (
                  <div key={sponsor.name} className="flex flex-col items-center">
                    <div className="relative w-24 h-24 bg-white rounded-lg p-2">
                      <Image
                        src={sponsor.logoUrl || "/placeholder.svg"}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[#E0E0E0] mt-2 text-sm">{sponsor.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
