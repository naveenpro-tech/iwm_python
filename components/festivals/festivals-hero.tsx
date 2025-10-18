"use client"

import { motion } from "framer-motion"
import { Globe, Calendar, Award } from "lucide-react"
import Image from "next/image"

export function FestivalsHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-[60vh] min-h-[500px] overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image src="/film-festival-red-carpet.png" alt="Film Festival" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1A1A1A]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">Film Festivals</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-8">
            Discover the world's most prestigious film festivals, from Cannes to Sundance
          </p>

          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#00BFFF]" />
              <span>50+ Festivals Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#00BFFF]" />
              <span>Year-round Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#00BFFF]" />
              <span>Exclusive Insights</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
