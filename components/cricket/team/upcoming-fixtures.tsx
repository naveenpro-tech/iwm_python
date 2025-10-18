"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Fixture {
  id: string
  date: string
  time: string
  opponent: {
    name: string
    logoUrl: string
  }
  venue: string
  competition: string
  ticketsAvailable: boolean
}

interface UpcomingFixturesProps {
  fixtures: Fixture[]
}

export default function UpcomingFixtures({ fixtures }: UpcomingFixturesProps) {
  if (fixtures.length === 0) {
    return (
      <div className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Upcoming Fixtures</h2>
        <p className="text-gray-400">No upcoming fixtures scheduled.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#1A1A1A] rounded-xl p-6 mb-8"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Upcoming Fixtures</h2>

      <div className="space-y-4">
        {fixtures.map((fixture, index) => (
          <motion.div
            key={fixture.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="bg-[#252525] rounded-lg p-4 hover:bg-[#333] transition-colors"
          >
            <Link href={`/cricket/matches/${fixture.id}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-3 md:mb-0">
                  <div className="relative w-12 h-12 mr-3">
                    <Image
                      src={fixture.opponent.logoUrl || "/placeholder.svg"}
                      alt={fixture.opponent.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-white font-medium">vs {fixture.opponent.name}</div>
                    <div className="text-sm text-gray-400">{fixture.competition}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Calendar size={14} className="mr-1 text-[#00BFFF]" />
                    {fixture.date}
                  </div>

                  <div className="flex items-center text-gray-300">
                    <Clock size={14} className="mr-1 text-[#00BFFF]" />
                    {fixture.time}
                  </div>

                  <div className="flex items-center text-gray-300">
                    <MapPin size={14} className="mr-1 text-[#00BFFF]" />
                    {fixture.venue}
                  </div>
                </div>

                {fixture.ticketsAvailable && (
                  <div className="mt-3 md:mt-0">
                    <span className="bg-[#00BFFF] text-black text-xs font-bold px-3 py-1 rounded-full">
                      Tickets Available
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
