"use client"

import type React from "react"
import { PickMovieCard } from "./pick-movie-card"
import type { SiddusPickMovie } from "./types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface SiddusPicksSectionProps {
  picks: SiddusPickMovie[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100,
    },
  },
}

export const SiddusPicksSection: React.FC<SiddusPicksSectionProps> = ({ picks }) => {
  if (!picks || picks.length === 0) {
    return (
      <section className="py-8 md:py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Siddu's Picks</h2>
          <p className="text-slate-400">No picks available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-black via-purple-900/30 to-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 flex items-center">
            <Sparkles className="w-7 h-7 mr-2.5 text-purple-400" />
            Siddu's Personal Picks
          </h2>
          <Link href="/explore?category=siddus-picks" passHref>
            <Button variant="link" className="text-purple-400 hover:text-purple-300 px-0 group">
              Explore All Picks
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {picks.map((pick) => (
            <motion.div key={pick.id} variants={itemVariants}>
              <PickMovieCard movie={pick} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
