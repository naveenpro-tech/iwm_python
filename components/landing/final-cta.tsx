"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface FinalCtaProps {
  onExplore: () => void
}

export function FinalCta({ onExplore }: FinalCtaProps) {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-inter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00BFFF] to-[#FFD700]">
            Ready to Experience Siddu?
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-[#A0A0A0] mb-12 font-dmsans">
          Join our vibrant community of entertainment enthusiasts and discover a world of cinematic masterpieces and
          cricket passion.
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
          <button
            onClick={onExplore}
            className="px-8 py-4 text-xl font-medium rounded-full bg-gradient-to-r from-[#00BFFF] to-[#FFD700] text-[#1A1A1A] hover:shadow-glow transition-all duration-300 group flex items-center font-inter"
          >
            Explore Siddu
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 text-center text-[#A0A0A0] text-sm font-dmsans"
      >
        <p>© 2023 Siddu Global Entertainment Hub. All rights reserved.</p>
      </motion.div>
    </div>
  )
}
