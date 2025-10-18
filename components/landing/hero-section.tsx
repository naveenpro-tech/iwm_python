"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { LogoIcon } from "./logo-icon"

interface HeroSectionProps {
  onContinue: () => void
}

export function HeroSection({ onContinue }: HeroSectionProps) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1A1A] z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="object-cover w-full h-full opacity-40"
          poster="/cinematic-collage-movies-cricket.png"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6"
        >
          <LogoIcon size={80} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-4 font-inter"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#FFD700]">SIDDU</span>
          <span className="text-[#E0E0E0]"> Global Entertainment Hub</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl md:text-2xl text-[#A0A0A0] mb-8 font-dmsans"
        >
          The definitive digital destination celebrating cinematic masterpieces and cricket passion from across the
          globe
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <button
            onClick={onContinue}
            className="px-8 py-3 text-lg font-medium rounded-full bg-gradient-to-r from-[#00BFFF] to-[#00BFFF]/80 text-[#1A1A1A] hover:shadow-glow-blue transition-all duration-300 font-inter"
          >
            Discover Siddu
          </button>
        </motion.div>
      </div>

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
