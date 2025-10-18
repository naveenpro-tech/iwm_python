"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface DualPassionShowcaseProps {
  onContinue: () => void
}

export function DualPassionShowcase({ onContinue }: DualPassionShowcaseProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8 } },
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-12 text-center font-inter"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#FFD700]">
          Two Passions. One Platform.
        </span>
      </motion.h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full"
      >
        <motion.div variants={item} className="relative overflow-hidden rounded-xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent z-10" />
          <Image
            src="/cinematic-film-reel.png"
            alt="Cinematic Masterpieces"
            width={800}
            height={600}
            className="w-full h-[300px] md:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <h3 className="text-2xl font-bold mb-2 text-[#E0E0E0] font-inter">Cinematic Masterpieces</h3>
            <p className="text-[#A0A0A0] font-dmsans">
              Discover and celebrate visual storytelling from around the world with verified insights and immersive
              experiences.
            </p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#00BFFF]/30 rounded-xl transition-all duration-300 z-10" />
        </motion.div>

        <motion.div variants={item} className="relative overflow-hidden rounded-xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent z-10" />
          <Image
            src="/cricket-stadium-cheering.png"
            alt="Cricket Passion"
            width={800}
            height={600}
            className="w-full h-[300px] md:h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <h3 className="text-2xl font-bold mb-2 text-[#E0E0E0] font-inter">Cricket Passion</h3>
            <p className="text-[#A0A0A0] font-dmsans">
              Experience the pulse of cricket with real-time updates, comprehensive statistics, and vibrant community
              discussions.
            </p>
          </div>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FFD700]/30 rounded-xl transition-all duration-300 z-10" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="absolute bottom-8 cursor-pointer"
        onClick={onContinue}
      >
        <ChevronDown size={32} className="text-[#E0E0E0]" />
      </motion.div>
    </div>
  )
}
